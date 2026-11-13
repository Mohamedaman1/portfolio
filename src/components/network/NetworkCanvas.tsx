import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EXIT, expansion, journey, journeyPhase, stopHubIndex, STOPS } from '../../lib/journey';
import {
  centerOn,
  clamp,
  clampPan,
  fitCamera,
  zoomAt,
  zoomLimits,
  type Camera,
  type Padding,
} from '../../lib/networkCamera';
import { hitTest } from '../../lib/networkHitTest';
import { mulberry32, type Graph, type GraphNode } from '../../lib/networkLayout';

export interface NetworkHandle {
  /** Animate the camera to a node. */
  focus(id: string): void;
  /** Focus only if the node is hidden behind an overlay or off-screen. */
  reveal(id: string): void;
  zoom(factor: number): void;
  panBy(dx: number, dy: number): void;
  reset(): void;
}

interface Props {
  graph: Graph;
  selectedId: string | null;
  onSelect(id: string | null): void;
  reducedMotion: boolean;
  /** The reveal animation waits until this is true (e.g. while the opening intro plays). */
  active: boolean;
  /** Screen area covered by the inspector while something is selected. */
  insetRight: number;
  insetBottom: number;
  /** Screen area covered by the journey panel while travelling between hubs. */
  journeyRight: number;
  journeyBottom: number;
}

const PEARL = [244, 241, 235];
const GOLD = [184, 161, 122];
const COOL = [160, 172, 184];
const rgb = (c: number[]) => `${c[0]},${c[1]},${c[2]}`;
const mix = (a: number[], b: number[], t: number) =>
  `${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)}`;
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const KIND_LABEL: Record<GraphNode['kind'], string> = {
  hub: 'Hub',
  project: 'Client',
  concept: 'Concept',
  story: 'Case study',
  skill: 'Capability',
  decor: '',
};
const TONE_ALPHA = [0.13, 0.2, 0.3, 0.19];
/** How far nodes spread from the world centre / from their own hub at full expansion. */
const SPREAD_WORLD = 0.28;
const SPREAD_HUB = 0.42;

const NetworkCanvas = forwardRef<NetworkHandle, Props>(function NetworkCanvas(props, ref) {
  const { graph } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const api = useRef<NetworkHandle | null>(null);
  const live = useRef(props);

  useEffect(() => {
    live.current = props;
  });

  useImperativeHandle(
    ref,
    () => ({
      focus: (id) => api.current?.focus(id),
      reveal: (id) => api.current?.reveal(id),
      zoom: (f) => api.current?.zoom(f),
      panBy: (dx, dy) => api.current?.panBy(dx, dy),
      reset: () => api.current?.reset(),
    }),
    [],
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const tip = tipRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !tip || !ctx) return;

    const { nodes, edges, world, adj, adjEdges, index } = graph;
    const N = nodes.length;
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const HUBS = nodes.filter((n) => n.kind === 'hub').length;
    const named: number[] = [];
    const decorByCluster: number[][] = Array.from({ length: HUBS }, () => []);
    nodes.forEach((n, i) => (n.decorative ? decorByCluster[n.cluster].push(i) : named.push(i)));

    // Edges are batched so each cluster can brighten or fade as one stroke.
    interface EdgeGroup {
      list: number[];
      tone: number;
      ca: number;
      cb: number;
    }
    const groups = new Map<string, EdgeGroup>();
    const edgeGroup: EdgeGroup[] = [];
    edges.forEach((e, i) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      const hubLink = a.kind === 'hub' && b.kind === 'hub';
      const ca = hubLink ? a.cluster : (a.kind === 'hub' ? b : a).cluster;
      const cb = hubLink ? b.cluster : ca;
      const key = `${ca}:${cb}:${e.tone}`;
      let g = groups.get(key);
      if (!g) groups.set(key, (g = { list: [], tone: e.tone, ca, cb }));
      g.list.push(i);
      edgeGroup[i] = g;
    });
    const groupList = [...groups.values()];

    // Signals travelling along real connections keep the network visibly alive.
    const prng = mulberry32(99);
    const wired = edges.map((_, i) => i).filter((i) => !nodes[edges[i].a].decorative && !nodes[edges[i].b].decorative);
    const pulses = Array.from({ length: 34 }, () => ({
      edge: wired[Math.floor(prng() * wired.length)],
      offset: prng(),
      speed: 0.07 + prng() * 0.11,
      back: prng() < 0.5,
    }));

    // Which journey stop (1-based) each cluster belongs to.
    const stopOf = new Array<number>(HUBS).fill(-99);
    stopHubIndex.forEach((h, s) => (stopOf[h] = s + 1));
    const dim = new Float32Array(HUBS).fill(1);
    const glow = new Float32Array(HUBS);

    let vp = { w: 0, h: 0 };
    let dpr = 1;
    let baseK = 1;
    let cam: Camera = { x: 0, y: 0, k: 1 };
    let freeCam: Camera = cam;
    let target: Camera | null = null;
    let fitted = false;
    let hover = -1;
    let raf = 0;
    let onScreen = true;
    let start = performance.now();
    // Journey ↔ free-camera hand-off
    let travelling = false;
    let override: number | null = null;
    let blendFrom: Camera | null = null;
    let blendStart = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let drag: { x: number; y: number; cx: number; cy: number; moved: boolean } | null = null;
    let pinch: { d: number; mx: number; my: number; cam: Camera } | null = null;

    const cx0 = world.w / 2;
    const cy0 = world.h / 2;
    const pad = (): Padding =>
      vp.w < 720 ? { t: 138, r: 6, b: 50, l: 6 } : { t: 64, r: 24, b: 52, l: 24 };
    const rs = () => clamp(Math.sqrt(cam.k / 0.72), 0.72, 1.5);
    const setCam = (c: Camera) => {
      cam = travelling ? c : clampPan(c, vp, world);
      if (travelling) override = journey.pos;
    };
    const tween = (c: Camera) => {
      const next = travelling ? c : clampPan(c, vp, world);
      if (travelling) override = journey.pos;
      if (live.current.reducedMotion) {
        cam = next;
        target = null;
      } else target = next;
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const prev = vp;
      vp = { w: r.width, h: r.height };
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(vp.w * dpr);
      canvas.height = Math.round(vp.h * dpr);
      const fit = fitCamera(vp, world, pad());
      if (!fitted) {
        cam = fit;
        fitted = true;
      } else {
        // keep the same world point at the centre and the same relative zoom
        const rel = cam.k / baseK;
        const wx = (prev.w / 2 - cam.x) / cam.k;
        const wy = (prev.h / 2 - cam.y) / cam.k;
        cam = clampPan(centerOn(wx, wy, fit.k * rel, vp), vp, world);
        target = null;
      }
      baseK = fit.k;
    };

    /* ───────────── journey: scroll-driven camera, expansion and focus ───────────── */
    const stopK = () => {
      const lim = zoomLimits(baseK);
      return clamp(vp.w < 720 ? Math.max(baseK * 2, 0.6) : baseK * 1.5, lim.min, lim.max);
    };
    const hubAt = (stop: number, E: number) => {
      const h = nodes[stopHubIndex[stop - 1]];
      return { x: h.x + (h.x - cx0) * SPREAD_WORLD * E, y: h.y + (h.y - cy0) * SPREAD_WORLD * E };
    };
    const journeyCam = (pos: number, E: number): Camera => {
      const { seg, f } = journeyPhase(pos);
      const { journeyRight, journeyBottom } = live.current;
      const ox = -journeyRight / 2;
      const oy = -journeyBottom / 2;
      const k = stopK();
      if (seg === 0) {
        const a = fitCamera(vp, world, pad());
        const h = hubAt(1, 1);
        const b = centerOn(h.x, h.y, k, vp, ox, oy);
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, k: a.k + (b.k - a.k) * f };
      }
      if (seg >= STOPS) {
        const h = hubAt(STOPS, E);
        return centerOn(h.x, h.y, k * (1 + 1.5 * f * f), vp, ox * (1 - f), oy * (1 - f));
      }
      // fly from one hub to the next, pulling back slightly mid-flight
      const a = hubAt(seg, E);
      const b = hubAt(seg + 1, E);
      const kk = k * (1 - 0.24 * Math.sin(Math.PI * f));
      return centerOn(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, kk, vp, ox, oy);
    };

    /* ───────────── drawing ───────────── */
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!fitted) return;
      const reduced = live.current.reducedMotion;
      if (!live.current.active) start = now;
      const t = (now - start) / 1000;
      const reveal = reduced ? 2 : t / 1.5;

      // journey state
      const pos = clamp(journey.pos, 0, EXIT);
      const { seg, f, eased } = journeyPhase(pos);
      const E = expansion(pos);
      const engaged = clamp(eased, 0, 1);
      const exit = seg >= STOPS ? f : 0;
      const flight = seg > 0 && seg < STOPS ? Math.sin(Math.PI * f) : 0;
      for (let c = 0; c < HUBS; c++) {
        const w = clamp(1 - Math.abs(Math.min(eased, STOPS) - stopOf[c]) / 0.85, 0, 1);
        glow[c] = w * w * engaged;
        // unrelated clusters fade at a stop and come back up a little in flight
        // …and the whole network lights back up as it bursts open on exit
        dim[c] = 1 - engaged * (1 - w) * (0.82 - 0.4 * flight) * (1 - exit);
        glow[c] *= 1 - exit;
      }

      // camera: free at the overview, scroll-driven while travelling
      const nowTravelling = pos > 0.002;
      if (nowTravelling !== travelling) {
        if (nowTravelling) freeCam = target ?? cam;
        travelling = nowTravelling;
        target = null;
        override = null;
        blendFrom = cam;
        blendStart = now;
        if (!nowTravelling) target = clampPan(freeCam, vp, world);
      }
      if (travelling && override !== null && Math.abs(pos - override) > 0.03) {
        override = null;
        target = null;
        blendFrom = cam;
        blendStart = now;
      }
      if (travelling && override === null) {
        const jc = journeyCam(pos, E);
        const b = blendFrom ? clamp((now - blendStart) / 520, 0, 1) : 1;
        if (b < 1 && blendFrom && !reduced) {
          const e = ease(b);
          cam = {
            x: blendFrom.x + (jc.x - blendFrom.x) * e,
            y: blendFrom.y + (jc.y - blendFrom.y) * e,
            k: blendFrom.k + (jc.k - blendFrom.k) * e,
          };
        } else {
          cam = jc;
          blendFrom = null;
        }
      } else if (target) {
        cam = {
          x: cam.x + (target.x - cam.x) * 0.14,
          y: cam.y + (target.y - cam.y) * 0.14,
          k: cam.k + (target.k - cam.k) * 0.14,
        };
        if (Math.abs(target.x - cam.x) + Math.abs(target.y - cam.y) < 0.4 && Math.abs(target.k - cam.k) < 0.0005) {
          cam = target;
          target = null;
        }
      }

      // node positions: base layout → spread apart by the journey → idle drift → screen
      const { k, x: cx, y: cy } = cam;
      const sw = SPREAD_WORLD * E;
      const sh = SPREAD_HUB * E;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const h = nodes[n.cluster];
        let wx = n.x + (n.x - cx0) * sw + (n.x - h.x) * sh;
        let wy = n.y + (n.y - cy0) * sw + (n.y - h.y) * sh;
        if (!reduced) {
          wx += Math.sin(t * n.speed + n.phase) * n.amp;
          wy += Math.cos(t * n.speed * 0.8 + n.phase * 1.3) * n.amp;
        }
        sx[i] = wx * k + cx;
        sy[i] = wy * k + cy;
      }

      const selected = live.current.selectedId ? (index.get(live.current.selectedId) ?? -1) : -1;
      const active = hover >= 0 ? hover : selected;
      const near = new Set<number>(active >= 0 ? adj[active] : []);
      const hot = new Set<number>(active >= 0 ? adjEdges[active] : []);
      const scale = rs();
      const master = 1 - exit * exit * 0.78;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vp.w, vp.h);
      ctx.lineCap = 'round';

      // edges
      const trace = (list: Iterable<number>, skipHot: boolean) => {
        ctx.beginPath();
        for (const i of list) {
          if (skipHot && hot.has(i)) continue;
          const e = edges[i];
          const p = reveal >= 1.6 ? 1 : ease(clamp((reveal - e.delay) / 0.6, 0, 1));
          if (p <= 0) continue;
          const ax = sx[e.a];
          const ay = sy[e.a];
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + (sx[e.b] - ax) * p, ay + (sy[e.b] - ay) * p);
        }
      };
      const quiet = active >= 0 ? 0.5 : 1;
      for (const g of groupList) {
        const d = Math.max(dim[g.ca], dim[g.cb]);
        const gl = Math.max(glow[g.ca], glow[g.cb]);
        trace(g.list, true);
        ctx.globalAlpha = master * quiet;
        const base = g.tone === 3 ? COOL : PEARL;
        ctx.strokeStyle = `rgba(${mix(base, GOLD, gl * 0.75)},${(TONE_ALPHA[g.tone] * d * (1 + gl * 0.9)).toFixed(3)})`;
        ctx.lineWidth = g.tone === 2 ? 0.9 : 0.7;
        ctx.stroke();
      }
      if (hot.size) {
        trace(hot, false);
        ctx.globalAlpha = master;
        ctx.strokeStyle = `rgba(${rgb(GOLD)},0.85)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // signals
      if (!reduced && reveal > 1.4) {
        ctx.fillStyle = `rgb(${rgb(GOLD)})`;
        for (const pu of pulses) {
          const e = edges[pu.edge];
          const d = Math.max(dim[edgeGroup[pu.edge].ca], dim[edgeGroup[pu.edge].cb]);
          let u = (t * pu.speed + pu.offset) % 1;
          const fade = Math.sin(u * Math.PI);
          if (pu.back) u = 1 - u;
          const x = sx[e.a] + (sx[e.b] - sx[e.a]) * u;
          const y = sy[e.a] + (sy[e.b] - sy[e.a]) * u;
          ctx.globalAlpha = master * fade * d * 0.9;
          ctx.beginPath();
          ctx.arc(x, y, 1.7 * scale, 0, 6.2832);
          ctx.fill();
        }
      }

      // decorative satellites, one path per cluster
      const nodeAlpha = (reduced ? 1 : clamp((reveal - 0.25) / 0.7, 0, 1)) * master;
      for (let c = 0; c < HUBS; c++) {
        ctx.globalAlpha = nodeAlpha * (active >= 0 ? 0.45 : 0.8) * dim[c];
        ctx.fillStyle = `rgb(${mix(PEARL, GOLD, glow[c] * 0.55)})`;
        ctx.beginPath();
        for (const i of decorByCluster[c]) {
          if (near.has(i)) continue;
          const r = nodes[i].r * scale;
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, 6.2832);
        }
        ctx.fill();
      }
      if (active >= 0) {
        ctx.globalAlpha = nodeAlpha;
        ctx.fillStyle = `rgb(${rgb(GOLD)})`;
        ctx.beginPath();
        for (const i of adj[active]) {
          if (!nodes[i].decorative) continue;
          const r = nodes[i].r * scale + 0.3;
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, 6.2832);
        }
        ctx.fill();
      }

      // named nodes + labels
      const hasSpacing = 'letterSpacing' in ctx;
      for (const i of named) {
        const n = nodes[i];
        const x = sx[i];
        const y = sy[i];
        if (x < -220 || y < -40 || x > vp.w + 220 || y > vp.h + 40) continue;
        const isActive = i === active || i === selected;
        const lit = isActive || near.has(i);
        const dimmed = active >= 0 && !lit;
        const cd = dim[n.cluster];
        const cg = glow[n.cluster];
        const r = n.r * scale;
        const a = nodeAlpha * (dimmed ? 0.3 : 1) * cd;
        ctx.globalAlpha = a;
        const stopHub = n.kind === 'hub' && cg > 0.5;
        const fill = isActive || stopHub ? `rgb(${rgb(GOLD)})` : `rgb(${rgb(PEARL)})`;

        if (n.kind === 'hub') {
          const breathe = reduced ? 0 : Math.sin(t * 0.9 + n.phase) * 1.4;
          ctx.beginPath();
          ctx.arc(x, y, r + 7 + breathe + cg * 5, 0, 6.2832);
          ctx.strokeStyle = `rgba(${rgb(isActive || stopHub ? GOLD : PEARL)},${isActive || stopHub ? 0.7 : 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          if (cg > 0.05 && !reduced) {
            // a slow ring radiating from the hub the camera is visiting
            const ring = (t * 0.35 + n.phase) % 1;
            ctx.globalAlpha = a * cg * (1 - ring) * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, r + 10 + ring * 46, 0, 6.2832);
            ctx.stroke();
            ctx.globalAlpha = a;
          }
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fillStyle = fill;
          ctx.fill();
        } else if (n.kind === 'story') {
          const w = 22 * scale;
          const h = 14 * scale;
          ctx.fillStyle = '#0d0d0d';
          ctx.fillRect(x - w / 2, y - h / 2, w, h);
          ctx.fillStyle = n.accent ?? fill;
          ctx.globalAlpha = a * 0.75;
          ctx.fillRect(x - w / 2, y + h / 2 - 3 * scale, w, 3 * scale);
          ctx.globalAlpha = a;
          ctx.strokeStyle = isActive ? `rgb(${rgb(GOLD)})` : `rgba(${rgb(PEARL)},0.6)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x - w / 2 + 0.5, y - h / 2 + 0.5, w - 1, h - 1);
        } else if (n.kind === 'concept') {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fillStyle = '#020202';
          ctx.fill();
          ctx.strokeStyle = fill;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        } else if (n.kind === 'skill') {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fillStyle = isActive ? fill : `rgb(${rgb(COOL)})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fillStyle = fill;
          ctx.fill();
          if (isActive) {
            ctx.beginPath();
            ctx.arc(x, y, r + 5, 0, 6.2832);
            ctx.strokeStyle = `rgba(${rgb(GOLD)},0.7)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // labels: hubs always; the visited cluster in full; the rest as you zoom in or highlight
        const visiting = cg > 0.45;
        const hushed = engaged > 0.5 && cg < 0.3 && n.kind !== 'hub' && !lit;
        const show =
          !hushed &&
          (n.kind === 'hub' ||
            lit ||
            (visiting && n.kind !== 'story') ||
            ((n.kind === 'project' || n.kind === 'concept') && k >= 0.55) ||
            k >= 0.98);
        if (!show) continue;
        if (visiting && n.kind !== 'hub' && !lit) ctx.globalAlpha = a * clamp((cg - 0.45) / 0.3, 0, 1);
        ctx.strokeStyle = 'rgba(2,2,2,0.85)';
        ctx.lineWidth = 3.5;
        ctx.lineJoin = 'round';
        if (n.kind === 'hub') {
          ctx.font = `600 ${vp.w < 720 ? 10 : 11}px ${MONO}`;
          if (hasSpacing) ctx.letterSpacing = '1.4px';
          ctx.textAlign = 'center';
          ctx.fillStyle = fill;
          const text = n.label.toUpperCase();
          ctx.strokeText(text, x, y + r + 24 + cg * 5);
          ctx.fillText(text, x, y + r + 24 + cg * 5);
        } else {
          ctx.font = `${n.kind === 'skill' ? 400 : 500} ${n.kind === 'skill' ? 9.5 : 10.5}px ${MONO}`;
          if (hasSpacing) ctx.letterSpacing = '0.3px';
          ctx.textAlign = n.labelLeft ? 'right' : 'left';
          ctx.fillStyle = isActive
            ? `rgb(${rgb(GOLD)})`
            : n.kind === 'skill'
              ? `rgba(${rgb(COOL)},0.9)`
              : `rgba(${rgb(PEARL)},0.82)`;
          const off = n.kind === 'story' ? 15 * scale : r + 6;
          const lx = n.labelLeft ? x - off : x + off;
          ctx.strokeText(n.label, lx, y + 3.5);
          ctx.fillText(n.label, lx, y + 3.5);
        }
      }
      ctx.globalAlpha = 1;

      // tooltip follows the hovered node
      if (hover >= 0) {
        tip.style.transform = `translate(${Math.round(sx[hover] + 14)}px, ${Math.round(sy[hover] - 44)}px)`;
      }
    };

    const loop = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && onScreen) raf = requestAnimationFrame(frame);
    };

    /* ───────────── interaction ───────────── */
    const local = (e: { clientX: number; clientY: number }) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const setHover = (i: number) => {
      if (i === hover) return;
      hover = i;
      canvas.style.cursor = i >= 0 ? 'pointer' : drag?.moved ? 'grabbing' : 'grab';
      if (i >= 0) {
        const n = nodes[i];
        (tip.firstElementChild as HTMLElement).textContent = n.label;
        (tip.lastElementChild as HTMLElement).textContent = KIND_LABEL[n.kind];
        tip.hidden = false;
      } else tip.hidden = true;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = local(e);
      pointers.set(e.pointerId, p);
      target = null;
      if (pointers.size === 1) {
        drag = { x: p.x, y: p.y, cx: cam.x, cy: cam.y, moved: false };
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, cam };
        if (drag) drag.moved = true;
      }
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, p);
        if (pinch && pointers.size >= 2) {
          const [a, b] = [...pointers.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const z = zoomAt(pinch.cam, pinch.mx, pinch.my, d / pinch.d, baseK);
          setCam({ k: z.k, x: z.x + (mx - pinch.mx), y: z.y + (my - pinch.my) });
        } else if (drag) {
          const dx = p.x - drag.x;
          const dy = p.y - drag.y;
          if (!drag.moved && Math.hypot(dx, dy) > 5) {
            drag.moved = true;
            setHover(-1);
            canvas.style.cursor = 'grabbing';
          }
          if (drag.moved) setCam({ k: cam.k, x: drag.cx + dx, y: drag.cy + dy });
        }
        return;
      }
      if (e.pointerType === 'mouse') setHover(hitTest(nodes, sx, sy, p.x, p.y, rs()));
    };
    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const p = local(e);
      const wasClick = drag && !drag.moved && pointers.size === 1 && e.type === 'pointerup';
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 1) {
        // one finger left after a pinch: continue as a pan, never as a click
        const [rest] = [...pointers.values()];
        drag = { x: rest.x, y: rest.y, cx: cam.x, cy: cam.y, moved: true };
      } else if (pointers.size === 0) {
        drag = null;
        canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab';
      }
      if (wasClick) {
        const slop = e.pointerType === 'mouse' ? 11 : 20;
        const i = hitTest(nodes, sx, sy, p.x, p.y, rs(), slop);
        live.current.onSelect(i >= 0 ? nodes[i].id : null);
      }
    };
    const onLeave = () => {
      if (!pointers.size) setHover(-1);
    };
    const onWheel = (e: WheelEvent) => {
      // Plain scrolling belongs to the page (it drives the journey).
      // Zoom is pinch on a trackpad, or Ctrl / ⌘ + wheel.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const p = local(e);
      const unit = e.deltaMode === 1 ? 16 : 1;
      target = null;
      setCam(zoomAt(cam, p.x, p.y, Math.exp(-e.deltaY * unit * 0.01), baseK));
    };
    const onDbl = (e: MouseEvent) => {
      const p = local(e);
      if (hitTest(nodes, sx, sy, p.x, p.y, rs()) < 0) handle.reset();
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 70;
      switch (e.key) {
        case 'ArrowLeft':
          handle.panBy(step, 0);
          break;
        case 'ArrowRight':
          handle.panBy(-step, 0);
          break;
        case 'ArrowUp':
          handle.panBy(0, step);
          break;
        case 'ArrowDown':
          handle.panBy(0, -step);
          break;
        case '+':
        case '=':
          handle.zoom(1.3);
          break;
        case '-':
        case '_':
          handle.zoom(1 / 1.3);
          break;
        case '0':
          handle.reset();
          break;
        case 'Escape':
          live.current.onSelect(null);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    /** Current (expanded) world position of a node, without idle drift. */
    const worldOf = (i: number) => ({ x: (sx[i] - cam.x) / cam.k, y: (sy[i] - cam.y) / cam.k });

    const handle: NetworkHandle = {
      focus(id) {
        const i = index.get(id);
        if (i === undefined) return;
        const n = nodes[i];
        const lim = zoomLimits(baseK);
        const want = n.kind === 'hub' ? Math.max(baseK * 1.35, 0.6) : Math.max(baseK * 1.7, 1);
        const k = clamp(Math.max((target ?? cam).k, want), lim.min, lim.max);
        const { insetRight: ir, insetBottom: ib } = live.current;
        const w = worldOf(i);
        tween(centerOn(w.x, w.y, k, vp, -ir / 2, -ib / 2));
      },
      reveal(id) {
        const i = index.get(id);
        if (i === undefined) return;
        const { insetRight: ir, insetBottom: ib } = live.current;
        const x = sx[i];
        const y = sy[i];
        if (x < 60 || y < 60 || x > vp.w - ir - 60 || y > vp.h - ib - 50) {
          const w = worldOf(i);
          tween(centerOn(w.x, w.y, (target ?? cam).k, vp, -ir / 2, -ib / 2));
        }
      },
      zoom(f) {
        tween(zoomAt(target ?? cam, vp.w / 2, vp.h / 2, f, baseK));
      },
      panBy(dx, dy) {
        const c = target ?? cam;
        tween({ k: c.k, x: c.x + dx, y: c.y + dy });
      },
      reset() {
        if (travelling) {
          // hand the camera back to the journey
          override = null;
          target = null;
          blendFrom = cam;
          blendStart = performance.now();
        } else tween(fitCamera(vp, world, pad()));
      },
    };
    api.current = handle;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      loop();
    });
    io.observe(wrap);
    document.addEventListener('visibilitychange', loop);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('dblclick', onDbl);
    wrap.addEventListener('keydown', onKey);
    loop();

    // Dev-only hook so interaction tests can find nodes on the canvas.
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__network = {
        pos: (id: string) => {
          const i = index.get(id);
          const r = canvas.getBoundingClientRect();
          return i === undefined ? null : { x: sx[i] + r.left, y: sy[i] + r.top };
        },
        zoom: () => cam.k / baseK,
        counts: () => ({ nodes: N, edges: edges.length }),
        journey: () => journey.pos,
        label: (id: string) => nodes[index.get(id) ?? 0].label,
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', loop);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDbl);
      wrap.removeEventListener('keydown', onKey);
      api.current = null;
    };
  }, [graph]);

  return (
    <div
      ref={wrapRef}
      className="net-canvas"
      tabIndex={0}
      role="application"
      aria-label="Interactive network of Mohamed Aman's work. Arrow keys pan, plus and minus zoom, zero resets, Escape clears the selection. A full list of nodes is available from the List button."
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div ref={tipRef} className="net-tip" role="tooltip" hidden>
        <strong />
        <span />
      </div>
    </div>
  );
});

export default NetworkCanvas;
