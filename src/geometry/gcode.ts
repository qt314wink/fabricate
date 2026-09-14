import { holeCenters, holeRadiusAt, MAX_HOLES, type BracketParams } from "./bracket";
import type { Toolpoint } from "./toolpath";

export type GcodeOptions = {
  safeZ?: number;
  feedCut?: number;
  feedPlunge?: number;
  spindle?: number;
};

function fmt(n: number) {
  return n.toFixed(3);
}

export function postBracketGcode(params: BracketParams, opt: GcodeOptions = {}): string {
  const safeZ = opt.safeZ ?? params.thickness + 5;
  const zCut = 0;
  const feedCut = opt.feedCut ?? 400;
  const feedPlunge = opt.feedPlunge ?? 120;
  const lines: string[] = [
    "; fabricate-motion bracket post",
    "; GRBL-ish / G21 mm / G90 abs / G17 XY — preview, not a mill warranty",
    "G21 G90 G17",
    "G0 Z" + fmt(safeZ),
    `M3 S${opt.spindle ?? 8000}`,
  ];

  const w = params.width;
  const h = params.height;
  const ring: [number, number][] = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
    [-w / 2, -h / 2],
  ];
  lines.push(`G0 X${fmt(ring[0][0])} Y${fmt(ring[0][1])}`);
  lines.push(`G1 Z${fmt(zCut)} F${feedPlunge}`);
  for (let i = 1; i < ring.length; i++) {
    lines.push(`G1 X${fmt(ring[i][0])} Y${fmt(ring[i][1])} F${feedCut}`);
  }
  lines.push(`G0 Z${fmt(safeZ)}`);

  for (let i = 0; i < MAX_HOLES; i++) {
    const r = holeRadiusAt(params, i);
    if (r <= 0.1) continue;
    const [cx, cy] = holeCenters(params)[i];
    lines.push(`G0 X${fmt(cx + r)} Y${fmt(cy)}`);
    lines.push(`G1 Z${fmt(zCut)} F${feedPlunge}`);
    lines.push(`G2 X${fmt(cx + r)} Y${fmt(cy)} I${fmt(-r)} J0 F${feedCut}`);
    lines.push(`G0 Z${fmt(safeZ)}`);
  }

  lines.push("M5", "M2");
  return lines.join("\n") + "\n";
}

export function parseGcode(src: string, sample = 2): Toolpoint[] {
  const pts: Toolpoint[] = [];
  let x = 0,
    y = 0,
    z = 0;
  let last: Toolpoint | null = null;
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.replace(/;.*$/, "").trim();
    if (!line || line.startsWith("(")) continue;
    const words = line.toUpperCase().split(/\s+/);
    const isArc = words.some((w) => w === "G2" || w === "G02" || w === "G3" || w === "G03");
    const isMove = isArc || words.some((w) => w === "G0" || w === "G00" || w === "G1" || w === "G01");
    if (!isMove && !words.some((w) => /^[XYZ]/.test(w))) continue;
    let nx = x,
      ny = y,
      nz = z;
    let iOff = 0,
      jOff = 0;
    for (const w of words) {
      if (w.startsWith("X")) nx = parseFloat(w.slice(1));
      if (w.startsWith("Y")) ny = parseFloat(w.slice(1));
      if (w.startsWith("Z")) nz = parseFloat(w.slice(1));
      if (w.startsWith("I")) iOff = parseFloat(w.slice(1));
      if (w.startsWith("J")) jOff = parseFloat(w.slice(1));
    }
    if (Number.isNaN(nx) || Number.isNaN(ny) || Number.isNaN(nz)) continue;
    if (isArc && last) {
      const ccx = last.x + iOff;
      const ccy = last.y + jOff;
      const a0 = Math.atan2(last.y - ccy, last.x - ccx);
      let a1 = Math.atan2(ny - ccy, nx - ccx);
      const cw = words.some((w) => w === "G2" || w === "G02");
      if (cw && a1 >= a0) a1 -= Math.PI * 2;
      if (!cw && a1 <= a0) a1 += Math.PI * 2;
      const rad = Math.hypot(iOff, jOff) || Math.hypot(last.x - ccx, last.y - ccy);
      const arcLen = Math.abs(a1 - a0) * rad;
      const steps = Math.max(8, Math.ceil(arcLen / sample));
      for (let s = 1; s <= steps; s++) {
        const a = a0 + (a1 - a0) * (s / steps);
        pts.push({ x: ccx + Math.cos(a) * rad, y: ccy + Math.sin(a) * rad, z: nz });
      }
      x = nx;
      y = ny;
      z = nz;
      last = { x, y, z };
      continue;
    }
    if (last) {
      const dist = Math.hypot(nx - last.x, ny - last.y, nz - last.z);
      const steps = Math.max(1, Math.ceil(dist / sample));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        pts.push({
          x: last.x + (nx - last.x) * t,
          y: last.y + (ny - last.y) * t,
          z: last.z + (nz - last.z) * t,
        });
      }
    } else {
      pts.push({ x: nx, y: ny, z: nz });
    }
    x = nx;
    y = ny;
    z = nz;
    last = { x, y, z };
  }
  return pts;
}

export function gcodeToolpath(params: BracketParams) {
  return parseGcode(postBracketGcode(params));
}
