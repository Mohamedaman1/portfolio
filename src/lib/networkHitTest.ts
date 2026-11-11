import type { GraphNode } from './networkLayout';

/**
 * Proximity hit test in screen space. `sx`/`sy` are node screen positions for this frame.
 * Decorative satellites are never interactive. Returns a node index or -1.
 */
export function hitTest(
  nodes: GraphNode[],
  sx: ArrayLike<number>,
  sy: ArrayLike<number>,
  px: number,
  py: number,
  radiusScale = 1,
  slop = 11,
): number {
  let best = -1;
  let bestScore = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.decorative) continue;
    const d = Math.hypot(sx[i] - px, sy[i] - py);
    const reach = n.r * radiusScale + slop;
    if (d > reach) continue;
    // Prefer the closest node; hubs win ties slightly.
    const score = d - (n.kind === 'hub' ? 3 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}
