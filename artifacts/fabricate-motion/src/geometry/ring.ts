export type RingParams = {
  innerRadius: number; // mm, finger bore
  shankWidth: number; // mm along finger
  shankThickness: number; // mm radial wall
  twist: number; // degrees decorative
  metalHue: number; // 0..1
  polish: number; // 0..1 roughness invert
};

export const RING_DEFAULTS: RingParams = {
  innerRadius: 8.2,
  shankWidth: 3.2,
  shankThickness: 1.8,
  twist: 8,
  metalHue: 0.12,
  polish: 0.75,
};

export const RING_LIMITS: Record<keyof RingParams, { min: number; max: number }> = {
  innerRadius: { min: 6.5, max: 11.5 },
  shankWidth: { min: 1.6, max: 8 },
  shankThickness: { min: 1.0, max: 3.2 },
  twist: { min: 0, max: 35 },
  metalHue: { min: 0, max: 1 },
  polish: { min: 0.15, max: 1 },
};

/** US ring size approximation from inner radius mm. */
export function usSizeFromRadius(r: number) {
  const circ = 2 * Math.PI * r;
  return (circ - 36.5) / 2.55;
}
