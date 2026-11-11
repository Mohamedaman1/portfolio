import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
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
import type { Graph, GraphNode } from '../../lib/networkLayout';

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
  /** Screen area covered by the inspector while something is selected. */
  insetRight: number;
  insetBottom: number;
}

const PEARL = '244,241,235';
const GOLD = '184,161,122';
const COOL = '160,172,184';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const KIND_LABEL: Record<GraphNode['kind'], string> = {
  hub: 'Hub',
  project: 'Project',
  concept: 'Concept',
  story: 'Case study',
  skill: 'Capability',
  decor: '',
};

const NetworkCanvas = forwardRef<NetworkHandle, Props>(function NetworkCanvas(
  { graph, selectedId, onSelect, reducedMotion, insetRight, insetBottom },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const api = useRef<NetworkHandle | null>(null);
  const live = useRef({ selectedId, onSelect, reducedMotion, insetRight, insetBottom });

  useEffect(() => {
    live.current = { selectedId, onSelect, reducedMotion, insetRight, insetBottom };
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
    const edgesByTone: number[][] = [[], [], [], []];
    edges.forEach((e, i) => edgesByTone[e.tone].push(i));
    const named: number[] = [];
    const decor: number[] = [];
    nodes.forEach((n, i) => (n.decorative ? decor : named).push(i));

    let vp = { w: 0, h: 0 };
    let dpr = 1;
    let baseK = 1;
    let cam: Camera = { x: 0, y: 0, k: 1 };
    let target: Camera | null = null;
    let fitted = false;
    let hover = -1;
    let raf = 0;
    let onScreen = true;
    const start = performance.now();
    const pointers = new Map<number, { x: number; y: number }>();
    let drag: { x: number; y: number; cx: number; cy: number; moved: boolean } | null = null;
    let pinch: { d: number; mx: number; my: number; cam: Camera } | null = null;

    const pad = (): Padding =>
      vp.w < 720 ? { t: 56, r: 6, b: 50, l: 6 } : { t: 64, r: 24, b: 52, l: 24 };
    const rs = () => clamp(Math.sqrt(cam.k / 0.72), 0.72, 1.5);
    const setCam = (c: Camera) => {
      cam = clampPan(c, vp, world);
    };
    const tween = (c: Camera) => {
      const next = clampPan(c, vp, world);
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

    /* ───────────── drawing ───────────── */
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!fitted) return;
      const reduced = live.current.reducedMotion;
      const t = (now - start) / 1000;
      const reveal = reduced ? 2 : t / 1.5;

      if (target) {
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

      const { k, x: cx, y: cy } = cam;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        let wx = n.x;
        let wy = n.y;
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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vp.w, vp.h);
      ctx.lineCap = 'round';

      // edges, batched per tone
      const toneStyle = [
        `rgba(${PEARL},0.13)`,
        `rgba(${PEARL},0.2)`,
        `rgba(${PEARL},0.3)`,
        `rgba(${COOL},0.19)`,
      ];
      const tracePath = (list: Iterable<number>, skipHot: boolean) => {
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
      ctx.globalAlpha = active >= 0 ? 0.5 : 1;
      for (let tone = 0; tone < 4; tone++) {
        tracePath(edgesByTone[tone], true);
        ctx.strokeStyle = toneStyle[tone];
        ctx.lineWidth = tone === 2 ? 0.9 : 0.7;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (hot.size) {
        tracePath(hot, false);
        ctx.strokeStyle = `rgba(${GOLD},0.85)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // decorative satellites
      const nodeAlpha = reduced ? 1 : clamp((reveal - 0.25) / 0.7, 0, 1);
      ctx.globalAlpha = nodeAlpha * (active >= 0 ? 0.45 : 0.8);
      ctx.fillStyle = `rgb(${PEARL})`;
      ctx.beginPath();
      for (const i of decor) {
        if (near.has(i)) continue;
        const r = nodes[i].r * scale;
        ctx.moveTo(sx[i] + r, sy[i]);
        ctx.arc(sx[i], sy[i], r, 0, 6.2832);
      }
      ctx.fill();
      if (active >= 0) {
        ctx.globalAlpha = nodeAlpha;
        ctx.fillStyle = `rgb(${GOLD})`;
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
        if (x < -160 || y < -40 || x > vp.w + 60 || y > vp.h + 40) continue;
        const isActive = i === active || i === selected;
        const lit = isActive || near.has(i);
        const dim = active >= 0 && !lit;
        const r = n.r * scale;
        ctx.globalAlpha = nodeAlpha * (dim ? 0.3 : 1);
        const fill = isActive ? `rgb(${GOLD})` : `rgb(${PEARL})`;

        if (n.kind === 'hub') {
          const breathe = reduced ? 0 : Math.sin(t * 0.9 + n.phase) * 1.2;
          ctx.beginPath();
          ctx.arc(x, y, r + 7 + breathe, 0, 6.2832);
          ctx.strokeStyle = `rgba(${isActive ? GOLD : PEARL},${isActive ? 0.7 : 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
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
          ctx.globalAlpha *= 0.75;
          ctx.fillRect(x - w / 2, y + h / 2 - 3 * scale, w, 3 * scale);
          ctx.globalAlpha = nodeAlpha * (dim ? 0.3 : 1);
          ctx.strokeStyle = isActive ? `rgb(${GOLD})` : `rgba(${PEARL},0.6)`;
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
          ctx.fillStyle = isActive ? fill : `rgb(${COOL})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fillStyle = fill;
          ctx.fill();
          if (isActive) {
            ctx.beginPath();
            ctx.arc(x, y, r + 5, 0, 6.2832);
            ctx.strokeStyle = `rgba(${GOLD},0.7)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (n.thumbnail) {
            // tiny editorial preview card pinned to a real brand node
            const w = 34 * scale;
            const h = 22 * scale;
            const tx = n.labelLeft ? x - 10 * scale - w : x + 10 * scale;
            const ty = y - h - 8 * scale;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(n.labelLeft ? tx + w : tx, ty + h);
            ctx.strokeStyle = `rgba(${PEARL},0.3)`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(tx, ty, w, h);
            const g = ctx.createLinearGradient(tx, ty + h, tx + w, ty);
            g.addColorStop(0, 'rgba(0,0,0,0)');
            g.addColorStop(1, n.accent ?? '#888');
            ctx.fillStyle = g;
            ctx.globalAlpha *= 0.8;
            ctx.fillRect(tx, ty, w, h);
            ctx.globalAlpha = nodeAlpha * (dim ? 0.3 : 1);
            ctx.strokeStyle = isActive ? `rgb(${GOLD})` : `rgba(${PEARL},0.45)`;
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + 0.5, ty + 0.5, w - 1, h - 1);
          }
        }

        // labels: hubs always; projects from baseline; details as you zoom in or highlight
        const show =
          n.kind === 'hub' ||
          lit ||
          ((n.kind === 'project' || n.kind === 'concept') && k >= 0.55) ||
          k >= 0.98;
        if (!show) continue;
        ctx.strokeStyle = 'rgba(2,2,2,0.85)';
        ctx.lineWidth = 3.5;
        ctx.lineJoin = 'round';
        if (n.kind === 'hub') {
          ctx.font = `600 ${vp.w < 720 ? 10 : 11}px ${MONO}`;
          if (hasSpacing) ctx.letterSpacing = '1.4px';
          ctx.textAlign = 'center';
          ctx.fillStyle = isActive ? `rgb(${GOLD})` : `rgb(${PEARL})`;
          const text = n.label.toUpperCase();
          ctx.strokeText(text, x, y + r + 24);
          ctx.fillText(text, x, y + r + 24);
        } else {
          ctx.font = `${n.kind === 'skill' ? 400 : 500} ${n.kind === 'skill' ? 9.5 : 10.5}px ${MONO}`;
          if (hasSpacing) ctx.letterSpacing = '0.3px';
          ctx.textAlign = n.labelLeft ? 'right' : 'left';
          ctx.fillStyle = isActive
            ? `rgb(${GOLD})`
            : n.kind === 'skill'
              ? `rgba(${COOL},0.9)`
              : `rgba(${PEARL},0.82)`;
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
      canvas.setPointerCapture(e.pointerId);
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
      // Once the page has scrolled past the exhibition, the wheel belongs to the page.
      if (window.scrollY > 8) return;
      const kNow = (target ?? cam).k;
      const lim = zoomLimits(baseK);
      // Fully zoomed out + scrolling down → hand the wheel back so the page can continue.
      if (e.deltaY > 0 && kNow <= lim.min * 1.005) return;
      if (e.deltaY < 0 && kNow >= lim.max * 0.995) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const p = local(e);
      const unit = e.deltaMode === 1 ? 16 : 1;
      const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.0016));
      target = null;
      setCam(zoomAt(cam, p.x, p.y, factor, baseK));
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

    const handle: NetworkHandle = {
      focus(id) {
        const i = index.get(id);
        if (i === undefined) return;
        const n = nodes[i];
        const lim = zoomLimits(baseK);
        const want = n.kind === 'hub' ? Math.max(baseK * 1.35, 0.6) : Math.max(baseK * 1.7, 1);
        const k = clamp(Math.max((target ?? cam).k, want), lim.min, lim.max);
        const { insetRight: ir, insetBottom: ib } = live.current;
        tween(centerOn(n.x, n.y, k, vp, -ir / 2, -ib / 2));
      },
      reveal(id) {
        const i = index.get(id);
        if (i === undefined) return;
        const { insetRight: ir, insetBottom: ib } = live.current;
        const x = sx[i];
        const y = sy[i];
        if (x < 60 || y < 60 || x > vp.w - ir - 60 || y > vp.h - ib - 50) {
          const n = nodes[i];
          tween(centerOn(n.x, n.y, (target ?? cam).k, vp, -ir / 2, -ib / 2));
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
        tween(fitCamera(vp, world, pad()));
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
