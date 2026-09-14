import { holeCenters, holeRadiusAt, MAX_HOLES, type BracketParams } from "./bracket";

export type Toolpoint = { x: number; y: number; z: number };

export function buildToolpath(params: BracketParams, spacing = 2): Toolpoint[] {
  const pts: Toolpoint[] = [];
  const w = params.width;
  const h = params.height;
  const z = params.thickness;
  const ring: [number, number][] = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
    [-w / 2, -h / 2],
  ];
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i];
    const [bx, by] = ring[i + 1];
    const steps = Math.max(1, Math.hypot(bx - ax, by - ay) / spacing);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, z });
    }
  }
  for (let i = 0; i < MAX_HOLES; i++) {
    const r = holeRadiusAt(params, i);
    if (r <= 0.1) continue;
    const [cx, cy] = holeCenters(params)[i];
    for (let a = 0; a <= 32; a++) {
      const th = (a / 32) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r, z });
    }
  }
  return pts;
}

export function visibleCount(points: Toolpoint[], progress01: number) {
  const p = Math.min(1, Math.max(0, progress01));
  return Math.floor(p * points.length);
}
