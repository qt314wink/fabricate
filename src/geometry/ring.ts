export type RingParams = {
  innerRadius: number;
  shankWidth: number;
  shankThickness: number;
  twist: number;
  metalHue: number;
  polish: number;
};

export const RING_DEFAULTS: RingParams = {
  innerRadius: 8.1,
  shankWidth: 4,
  shankThickness: 1.8,
  twist: 0,
  metalHue: 0.12,
  polish: 0.72,
};

export const RING_LIMITS: Record<keyof RingParams, { min: number; max: number }> = {
  innerRadius: { min: 7.2, max: 10.2 },
  shankWidth: { min: 2, max: 8 },
  shankThickness: { min: 1, max: 3.2 },
  twist: { min: -35, max: 35 },
  metalHue: { min: 0.05, max: 0.18 },
  polish: { min: 0.15, max: 1 },
};

/** Circumference estimate — not a mandrel table. */
export function usSizeFromBore(innerRadiusMm: number) {
  const circ = 2 * Math.PI * innerRadiusMm;
  return (circ - 36.5) / 2.547;
}
