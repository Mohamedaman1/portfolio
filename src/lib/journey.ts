import { hubs, journeyStops } from '../data/portfolio';

/**
 * Shared, mutable journey position read by the canvas every frame and written by the
 * GSAP master timeline:  0 = overview · 1…N = hub stops · N+1 = exit into the page.
 */
export const journey = { pos: 0 };

export const STOPS = journeyStops.length;
export const EXIT = STOPS + 1;

/** Hub index (in `hubs` order, which is also the hub node order in the graph) for each stop. */
export const stopHubIndex = journeyStops.map((s) => hubs.findIndex((h) => h.id === s.hub));

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Split a position into its segment and an eased fraction that rests briefly at every stop. */
export function journeyPhase(pos: number) {
  const p = Math.min(EXIT, Math.max(0, pos));
  const seg = Math.min(STOPS, Math.floor(p));
  const raw = p - seg;
  const f = smooth(Math.min(1, Math.max(0, (raw - 0.14) / 0.72)));
  return { seg, f, eased: seg + f };
}

/** How far the network has spread apart: 0 at the overview, 1 at a stop, more while travelling and on exit. */
export function expansion(pos: number) {
  const { seg, f } = journeyPhase(pos);
  if (seg === 0) return f;
  if (seg >= STOPS) return 1 + 1.7 * f;
  return 1 + 0.2 * Math.sin(Math.PI * f);
}
