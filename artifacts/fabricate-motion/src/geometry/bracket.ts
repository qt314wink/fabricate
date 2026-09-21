/**
 * Fixed-topology parametric bracket.
 * Volume continuity: hole count never remeshes. Unused holes collapse radius → 0.
 */
export type BracketParams = {
  width: number; // mm
  height: number;
  thickness: number;
  fillet: number;
  holeCount: number; // 1..4 visual; slots always exist
  holeRadius: number;
};

export const BRACKET_DEFAULTS: BracketParams = {
  width: 80,
  height: 50,
  thickness: 6,
  fillet: 4,
  holeCount: 2,
  holeRadius: 3.5,
};

export const BRACKET_LIMITS: Record<keyof BracketParams, { min: number; max: number }> = {
  width: { min: 40, max: 160 },
  height: { min: 30, max: 90 },
  thickness: { min: 3, max: 16 },
  fillet: { min: 0, max: 12 },
  holeCount: { min: 1, max: 4 },
  holeRadius: { min: 1.5, max: 6 },
};

export const MAX_HOLES = 4;

export function holeRadiusAt(params: BracketParams, index: number) {
  return index < Math.round(params.holeCount) ? params.holeRadius : 0;
}

export function holeCenters(params: BracketParams): [number, number][] {
  const inset = 12;
  const w = params.width;
  const h = params.height;
  return [
    [-w / 2 + inset, h / 2 - inset],
    [w / 2 - inset, h / 2 - inset],
    [-w / 2 + inset, -h / 2 + inset],
    [w / 2 - inset, -h / 2 + inset],
  ];
}

/** Rough volume used as a continuity check, not a CAD kernel. */
export function estimateVolumeMm3(p: BracketParams) {
  const plate = p.width * p.height * p.thickness;
  let holes = 0;
  for (let i = 0; i < MAX_HOLES; i++) {
    const r = holeRadiusAt(p, i);
    holes += Math.PI * r * r * p.thickness;
  }
  return Math.max(0, plate - holes);
}
