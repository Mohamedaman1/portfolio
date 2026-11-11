import { describe, expect, it } from 'vitest';
import { hubs, projects, skills } from '../data/portfolio';
import { centerOn, clampPan, fitCamera, screenToWorld, zoomAt, zoomLimits } from './networkCamera';
import { hitTest } from './networkHitTest';
import { buildGraph, hubNodeId, projectNodeId } from './networkLayout';

describe('graph', () => {
  for (const orientation of ['landscape', 'portrait'] as const) {
    const g = buildGraph(orientation);
    it(`${orientation}: has 7 hubs and every project, skill and story as a named node`, () => {
      expect(g.nodes.filter((n) => n.kind === 'hub')).toHaveLength(7);
      for (const h of hubs) expect(g.index.has(hubNodeId(h.id))).toBe(true);
      for (const p of projects) expect(g.index.has(projectNodeId(p.slug))).toBe(true);
      const named = g.nodes.filter((n) => !n.decorative);
      expect(named).toHaveLength(hubs.length + projects.length + skills.length);
    });
    it(`${orientation}: density is within the brief and decoration is flagged`, () => {
      expect(g.nodes.length).toBeGreaterThanOrEqual(140);
      expect(g.nodes.length).toBeLessThanOrEqual(240);
      expect(g.edges.length).toBeGreaterThanOrEqual(160);
      expect(g.edges.length).toBeLessThanOrEqual(300);
      for (const n of g.nodes) {
        expect(n.decorative).toBe(n.kind === 'decor');
        if (n.decorative) expect(n.label).toBe('');
      }
    });
    it(`${orientation}: edges are valid and nodes stay inside the world`, () => {
      for (const e of g.edges) {
        expect(e.a).not.toBe(e.b);
        expect(g.nodes[e.a]).toBeDefined();
        expect(g.nodes[e.b]).toBeDefined();
      }
      for (const n of g.nodes) {
        expect(n.x).toBeGreaterThanOrEqual(0);
        expect(n.x).toBeLessThanOrEqual(g.world.w);
        expect(n.y).toBeGreaterThanOrEqual(0);
        expect(n.y).toBeLessThanOrEqual(g.world.h);
      }
    });
  }
  it('is deterministic', () => {
    const a = buildGraph('landscape');
    const b = buildGraph('landscape');
    expect(a.nodes.map((n) => [n.x, n.y])).toEqual(b.nodes.map((n) => [n.x, n.y]));
  });
  it('connects projects to their real hubs only', () => {
    const g = buildGraph('landscape');
    for (const p of projects.filter((q) => q.kind !== 'story')) {
      const i = g.index.get(projectNodeId(p.slug))!;
      const hubNeighbours = g.adj[i].filter((j) => g.nodes[j].kind === 'hub').map((j) => g.nodes[j].id).sort();
      expect(hubNeighbours).toEqual(p.hubs.map(hubNodeId).sort());
    }
  });
});

describe('camera', () => {
  const vp = { w: 1000, h: 800 };
  const world = { w: 1400, h: 1020 };
  const fit = fitCamera(vp, world, { t: 0, r: 0, b: 0, l: 0 });
  it('fits the world inside the viewport', () => {
    expect(world.w * fit.k).toBeLessThanOrEqual(vp.w + 1e-6);
    expect(world.h * fit.k).toBeLessThanOrEqual(vp.h + 1e-6);
  });
  it('zooms around the pointer', () => {
    const before = screenToWorld(fit, 300, 200);
    const z = zoomAt(fit, 300, 200, 1.5, fit.k);
    const after = screenToWorld(z, 300, 200);
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });
  it('clamps zoom', () => {
    const { min, max } = zoomLimits(fit.k);
    expect(zoomAt(fit, 0, 0, 100, fit.k).k).toBeCloseTo(max);
    expect(zoomAt(fit, 0, 0, 0.001, fit.k).k).toBeCloseTo(min);
  });
  it('keeps the view centre inside the world when panning', () => {
    const c = clampPan({ k: fit.k, x: 99999, y: -99999 }, vp, world);
    const centre = screenToWorld(c, vp.w / 2, vp.h / 2);
    expect(centre.x).toBeCloseTo(0);
    expect(centre.y).toBeCloseTo(world.h);
  });
  it('centres on a world point', () => {
    const c = centerOn(500, 400, 1.2, vp);
    expect(screenToWorld(c, 500, 400)).toEqual({ x: 500, y: 400 });
  });
});

describe('hit test', () => {
  const g = buildGraph('landscape');
  const sx = g.nodes.map((n) => n.x);
  const sy = g.nodes.map((n) => n.y);
  it('finds a named node under the pointer', () => {
    const i = g.index.get(projectNodeId('dahsha'))!;
    expect(hitTest(g.nodes, sx, sy, g.nodes[i].x + 3, g.nodes[i].y - 2)).toBe(i);
  });
  it('ignores decorative satellites and empty space', () => {
    const d = g.nodes.findIndex((n) => n.decorative);
    const hit = hitTest(g.nodes, sx, sy, g.nodes[d].x, g.nodes[d].y, 1, 0.5);
    expect(hit === -1 || !g.nodes[hit].decorative).toBe(true);
    expect(hitTest(g.nodes, sx, sy, -500, -500)).toBe(-1);
  });
});
