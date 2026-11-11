/** Camera maps world → screen as: screen = world * k + (x, y). */
export interface Camera {
  x: number;
  y: number;
  k: number;
}
export interface Size {
  w: number;
  h: number;
}
export interface Padding {
  t: number;
  r: number;
  b: number;
  l: number;
}

export const MIN_ZOOM = 0.6;
export const MAX_ZOOM = 2.5;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function fitCamera(vp: Size, world: Size, pad: Padding): Camera {
  const aw = Math.max(50, vp.w - pad.l - pad.r);
  const ah = Math.max(50, vp.h - pad.t - pad.b);
  const k = Math.min(aw / world.w, ah / world.h);
  return {
    k,
    x: pad.l + (aw - world.w * k) / 2,
    y: pad.t + (ah - world.h * k) / 2,
  };
}

export function screenToWorld(c: Camera, sx: number, sy: number) {
  return { x: (sx - c.x) / c.k, y: (sy - c.y) / c.k };
}

/** Keep the world point under the viewport centre inside the world rectangle. */
export function clampPan(c: Camera, vp: Size, world: Size): Camera {
  const cx = clamp((vp.w / 2 - c.x) / c.k, 0, world.w);
  const cy = clamp((vp.h / 2 - c.y) / c.k, 0, world.h);
  return { k: c.k, x: vp.w / 2 - cx * c.k, y: vp.h / 2 - cy * c.k };
}

/** Zoom range. Small screens fit at a tiny scale, so they may zoom further in to reach readable labels. */
export function zoomLimits(baseK: number) {
  return { min: baseK * MIN_ZOOM, max: Math.max(baseK * MAX_ZOOM, 1.25) };
}

/** Zoom by `factor` keeping the world point under (sx, sy) fixed. `baseK` is the fit scale. */
export function zoomAt(c: Camera, sx: number, sy: number, factor: number, baseK: number): Camera {
  const { min, max } = zoomLimits(baseK);
  const k = clamp(c.k * factor, min, max);
  const f = k / c.k;
  return { k, x: sx - (sx - c.x) * f, y: sy - (sy - c.y) * f };
}

/** Camera that places world point (wx, wy) at the centre of the viewport, shifted by (offX, offY) px. */
export function centerOn(wx: number, wy: number, k: number, vp: Size, offX = 0, offY = 0): Camera {
  return { k, x: vp.w / 2 + offX - wx * k, y: vp.h / 2 + offY - wy * k };
}
