import { GRAPH_SEED, HUB_LAYOUT, HUB_LINKS, type Orientation } from '../data/graph';
import { hubs, projects, skills, type HubId } from '../data/portfolio';

export type NodeKind = 'hub' | 'project' | 'concept' | 'story' | 'skill' | 'decor';

export interface GraphNode {
  /** `hub:<id>`, `project:<slug>`, `skill:<id>` or `decor:<n>` */
  id: string;
  kind: NodeKind;
  label: string;
  x: number;
  y: number;
  r: number;
  /** idle drift */
  phase: number;
  amp: number;
  speed: number;
  accent?: string;
  thumbnail?: boolean;
  /** Draw the label to the left of the node (it sits left of its hub). */
  labelLeft?: boolean;
  /** Decorative satellites are visual density only — never a client, product or entity. */
  decorative: boolean;
}

export interface GraphEdge {
  a: number;
  b: number;
  /** 0 faint · 1 mid · 2 strong · 3 cool cross-link */
  tone: 0 | 1 | 2 | 3;
  delay: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  world: { w: number; h: number };
  index: Map<string, number>;
  /** neighbour node indices per node */
  adj: number[][];
  /** incident edge indices per node */
  adjEdges: number[][];
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hubNodeId = (id: HubId) => `hub:${id}`;
export const projectNodeId = (slug: string) => `project:${slug}`;
export const skillNodeId = (id: string) => `skill:${id}`;

export function buildGraph(orientation: Orientation): Graph {
  const rng = mulberry32(GRAPH_SEED);
  const layout = HUB_LAYOUT[orientation];
  const world = { w: layout.w, h: layout.h };
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const index = new Map<string, number>();
  const anchors: { x: number; y: number }[] = [];

  const add = (n: Omit<GraphNode, 'phase' | 'amp' | 'speed'> & { amp?: number }) => {
    const i = nodes.length;
    nodes.push({
      ...n,
      phase: rng() * Math.PI * 2,
      amp: n.amp ?? 2 + rng() * 2.5,
      speed: 0.25 + rng() * 0.35,
    });
    index.set(n.id, i);
    anchors.push({ x: n.x, y: n.y });
    return i;
  };
  const link = (a: number, b: number, tone: GraphEdge['tone']) => {
    edges.push({ a, b, tone, delay: rng() * 0.55 });
  };
  const hubPos = (id: HubId) => layout.hubs[id];

  // 1 — hubs
  for (const h of hubs) {
    const p = hubPos(h.id);
    add({ id: hubNodeId(h.id), kind: 'hub', label: h.label, x: p.x, y: p.y, r: p.r, amp: 0.8, decorative: false });
  }
  const hubCount = nodes.length;
  for (const [a, b] of HUB_LINKS) link(index.get(hubNodeId(a))!, index.get(hubNodeId(b))!, 2);

  // 2 — brands & concepts around their primary hub, leaning toward secondary hubs
  const entities = projects.filter((p) => p.kind !== 'story');
  for (const p of entities) {
    const primary = hubPos(p.hubs[0]);
    const others = p.hubs.slice(1).map(hubPos);
    let angle = rng() * Math.PI * 2;
    if (others.length) {
      const cx = others.reduce((s, o) => s + o.x, 0) / others.length;
      const cy = others.reduce((s, o) => s + o.y, 0) / others.length;
      angle = Math.atan2(cy - primary.y, cx - primary.x) + (rng() - 0.5) * 2.2;
    }
    const rad = 125 + rng() * 75;
    const i = add({
      id: projectNodeId(p.slug),
      kind: p.kind === 'concept' ? 'concept' : 'project',
      label: p.name,
      x: primary.x + Math.cos(angle) * rad,
      y: primary.y + Math.sin(angle) * rad,
      r: 3.8,
      accent: p.accent,
      decorative: false,
    });
    p.hubs.forEach((h, n) => link(i, index.get(hubNodeId(h))!, n === 0 ? 2 : 3));
  }

  // 3 — capabilities between the hubs they belong to
  for (const s of skills) {
    const ps = s.hubs.map(hubPos);
    let x: number;
    let y: number;
    if (ps.length === 1) {
      const a = rng() * Math.PI * 2;
      const rad = 85 + rng() * 45;
      x = ps[0].x + Math.cos(a) * rad;
      y = ps[0].y + Math.sin(a) * rad;
    } else {
      const t = 0.35 + rng() * 0.3;
      x = ps[0].x + (ps[1].x - ps[0].x) * t + (rng() - 0.5) * 90;
      y = ps[0].y + (ps[1].y - ps[0].y) * t + (rng() - 0.5) * 90;
    }
    const i = add({ id: skillNodeId(s.id), kind: 'skill', label: s.label, x, y, r: 2.4, decorative: false });
    for (const h of s.hubs) link(i, index.get(hubNodeId(h))!, 1);
  }
  for (const p of entities) {
    const i = index.get(projectNodeId(p.slug))!;
    for (const s of p.skills) {
      const j = index.get(skillNodeId(s));
      if (j !== undefined) link(i, j, 3);
    }
  }

  // 4 — featured case studies sit between the work they describe
  for (const p of projects.filter((q) => q.kind === 'story')) {
    const rel = (p.related ?? []).map((s) => index.get(projectNodeId(s))).filter((v): v is number => v !== undefined);
    const hub = hubPos(p.hubs[0]);
    const cx = rel.length ? rel.reduce((s, r) => s + nodes[r].x, 0) / rel.length : hub.x;
    const cy = rel.length ? rel.reduce((s, r) => s + nodes[r].y, 0) / rel.length : hub.y;
    const a = rng() * Math.PI * 2;
    const i = add({
      id: projectNodeId(p.slug),
      kind: 'story',
      label: p.name,
      x: cx + Math.cos(a) * 60,
      y: cy + Math.sin(a) * 60,
      r: 5,
      accent: p.accent,
      decorative: false,
    });
    for (const r of rel) link(i, r, 1);
    if (!rel.length) link(i, index.get(hubNodeId(p.hubs[0]))!, 1);
  }
  const namedCount = nodes.length;

  // 5 — relax named nodes so labels do not stack (hubs stay fixed).
  // Distance is measured on an ellipse: labels are wide, so nodes need more room sideways.
  const MIN_D = 74;
  const HUB_D = 104;
  const MX = 110;
  const MY = 60;
  for (let it = 0; it < 220; it++) {
    for (let i = hubCount; i < namedCount; i++) {
      const n = nodes[i];
      for (let j = 0; j < namedCount; j++) {
        if (i === j) continue;
        const o = nodes[j];
        const isHub = j < hubCount;
        const min = isHub ? HUB_D : MIN_D;
        let dx = (n.x - o.x) * 0.5;
        // hub labels sit under the hub, so keep that area clear too
        let dy = n.y - (isHub ? o.y + 14 : o.y);
        let d = Math.hypot(dx, dy);
        if (d < 0.01) {
          dx = rng() - 0.5;
          dy = rng() - 0.5;
          d = Math.hypot(dx, dy);
        }
        if (d < min) {
          const push = ((min - d) / d) * (isHub ? 0.5 : 0.25);
          n.x += dx * 2 * push;
          n.y += dy * push;
        }
      }
      n.x += (anchors[i].x - n.x) * 0.012;
      n.y += (anchors[i].y - n.y) * 0.012;
      n.x = Math.min(world.w - MX, Math.max(MX, n.x));
      n.y = Math.min(world.h - MY, Math.max(MY, n.y));
    }
  }
  // labels point away from the node's primary hub
  const primaryHub = new Map<number, number>();
  for (const e of edges) {
    const [n, h] = e.a < hubCount ? [e.b, e.a] : [e.a, e.b];
    if (h < hubCount && n >= hubCount && !primaryHub.has(n)) primaryHub.set(n, h);
  }
  for (let i = hubCount; i < namedCount; i++) {
    const h = primaryHub.get(i);
    if (h === undefined) continue;
    const n = nodes[i];
    const width = n.label.length * 9 + 30; // rough label width in world units
    n.labelLeft = n.x < nodes[h].x;
    if (n.labelLeft && n.x - width < 0) n.labelLeft = false;
    if (!n.labelLeft && n.x + width > world.w) n.labelLeft = true;
  }

  // 6 — decorative satellites: visual density only
  let d = 0;
  const satellite = (parent: number, minR: number, maxR: number, tone: GraphEdge['tone'], angle?: number) => {
    const p = nodes[parent];
    const a = angle ?? rng() * Math.PI * 2;
    const rad = minR + Math.pow(rng(), 1.4) * (maxR - minR);
    const x = Math.min(world.w - 12, Math.max(12, p.x + Math.cos(a) * rad));
    const y = Math.min(world.h - 12, Math.max(12, p.y + Math.sin(a) * rad));
    const i = add({ id: `decor:${d++}`, kind: 'decor', label: '', x, y, r: 0.9 + rng() * 1.1, decorative: true });
    link(parent, i, tone);
    return { i, a };
  };
  for (let h = 0; h < hubCount; h++) {
    const count = 12 + Math.floor(rng() * 5);
    for (let s = 0; s < count; s++) {
      const { i, a } = satellite(h, 45, 275, rng() < 0.5 ? 0 : 1);
      if (rng() < 0.2) satellite(i, 22, 70, 0, a + (rng() - 0.5) * 1.3);
    }
  }
  for (let i = hubCount; i < namedCount; i++) {
    const kind = nodes[i].kind;
    if (kind === 'story') continue;
    const count = kind === 'skill' ? (rng() < 0.7 ? 1 : 0) : 2 + Math.floor(rng() * 2);
    for (let s = 0; s < count; s++) satellite(i, 20, kind === 'skill' ? 42 : 62, 0);
  }

  const adj: number[][] = nodes.map(() => []);
  const adjEdges: number[][] = nodes.map(() => []);
  edges.forEach((e, i) => {
    adj[e.a].push(e.b);
    adj[e.b].push(e.a);
    adjEdges[e.a].push(i);
    adjEdges[e.b].push(i);
  });

  return { nodes, edges, world, index, adj, adjEdges };
}
