import type { HubId } from './portfolio';

export type Orientation = 'landscape' | 'portrait';

export interface HubPlacement {
  x: number;
  y: number;
  r: number;
}

/** Hand-placed hub anchors per orientation (world units). Everything else is laid out from these. */
export const HUB_LAYOUT: Record<Orientation, { w: number; h: number; hubs: Record<HubId, HubPlacement> }> = {
  landscape: {
    w: 1400,
    h: 1020,
    hubs: {
      ecommerce: { x: 320, y: 300, r: 10 },
      performance: { x: 830, y: 215, r: 7.5 },
      about: { x: 650, y: 520, r: 5.5 },
      healthcare: { x: 1150, y: 430, r: 6.5 },
      systems: { x: 235, y: 760, r: 6.5 },
      creative: { x: 600, y: 850, r: 6.5 },
      retail: { x: 1040, y: 810, r: 6.5 },
    },
  },
  portrait: {
    w: 1000,
    h: 1560,
    hubs: {
      ecommerce: { x: 290, y: 270, r: 10 },
      performance: { x: 730, y: 350, r: 7.5 },
      about: { x: 500, y: 660, r: 5.5 },
      creative: { x: 240, y: 900, r: 6.5 },
      healthcare: { x: 770, y: 860, r: 6.5 },
      systems: { x: 300, y: 1300, r: 6.5 },
      retail: { x: 740, y: 1260, r: 6.5 },
    },
  },
};

/** Real relationships between practice areas. */
export const HUB_LINKS: [HubId, HubId][] = [
  ['about', 'ecommerce'],
  ['about', 'performance'],
  ['about', 'creative'],
  ['about', 'healthcare'],
  ['about', 'retail'],
  ['about', 'systems'],
  ['ecommerce', 'performance'],
  ['performance', 'creative'],
  ['creative', 'ecommerce'],
  ['performance', 'healthcare'],
  ['performance', 'retail'],
  ['systems', 'ecommerce'],
];

/** Fixed seed → identical composition on every load. */
export const GRAPH_SEED = 20261111;
