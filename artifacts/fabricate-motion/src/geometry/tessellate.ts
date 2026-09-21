/**
 * 2.5D tessellator: rounded rectangle plate with circular holes.
 * Grid-stamp method — coarse but valid manifold-ish watertight mesh
 * (top + bottom + walls + hole barrels). Not a BREP kernel.
 */
export type PlateSpec = {
  width: number;
  height: number;
  thickness: number;
  fillet: number;
  holes: { x: number; y: number; r: number }[];
  pitch?: number;
};

export type TriMesh = { positions: Float32Array; indices: Uint32Array };

function insideRoundRect(x: number, y: number, w: number, h: number, f: number) {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const hw = w / 2;
  const hh = h / 2;
  const fil = Math.max(0, Math.min(f, hw - 0.1, hh - 0.1));
  if (ax > hw || ay > hh) return false;
  if (ax <= hw - fil || ay <= hh - fil) return true;
  const dx = ax - (hw - fil);
  const dy = ay - (hh - fil);
  return dx * dx + dy * dy <= fil * fil;
}

function inHole(x: number, y: number, holes: PlateSpec["holes"]) {
  for (const h of holes) {
    if (h.r < 0.05) continue;
    const dx = x - h.x;
    const dy = y - h.y;
    if (dx * dx + dy * dy <= h.r * h.r) return true;
  }
  return false;
}

export function tessellatePlate(spec: PlateSpec): TriMesh {
  const pitch = spec.pitch ?? Math.max(1.2, Math.min(spec.width, spec.height) / 48);
  const nx = Math.max(8, Math.ceil(spec.width / pitch));
  const ny = Math.max(8, Math.ceil(spec.height / pitch));
  const solid: boolean[][] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= nx; i++) xs.push(-spec.width / 2 + (i / nx) * spec.width);
  for (let j = 0; j <= ny; j++) ys.push(-spec.height / 2 + (j / ny) * spec.height);

  for (let i = 0; i <= nx; i++) {
    solid[i] = [];
    for (let j = 0; j <= ny; j++) {
      solid[i][j] = insideRoundRect(xs[i], ys[j], spec.width, spec.height, spec.fillet) && !inHole(xs[i], ys[j], spec.holes);
    }
  }

  const pos: number[] = [];
  const idx: number[] = [];
  const z0 = 0;
  const z1 = spec.thickness;

  const pushQuad = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number, dx: number, dy: number, dz: number) => {
    const b = pos.length / 3;
    pos.push(ax, az, ay, bx, bz, by, cx, cz, cy, dx, dz, dy);
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  };

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const a = solid[i][j];
      const b = solid[i + 1][j];
      const c = solid[i + 1][j + 1];
      const d = solid[i][j + 1];
      if (a && b && c && d) {
        pushQuad(xs[i], ys[j], z1, xs[i + 1], ys[j], z1, xs[i + 1], ys[j + 1], z1, xs[i], ys[j + 1], z1);
        pushQuad(xs[i], ys[j], z0, xs[i], ys[j + 1], z0, xs[i + 1], ys[j + 1], z0, xs[i + 1], ys[j], z0);
      }
      // +X wall
      if (a && d && !(b && c)) {
        pushQuad(xs[i + 1], ys[j], z0, xs[i + 1], ys[j + 1], z0, xs[i + 1], ys[j + 1], z1, xs[i + 1], ys[j], z1);
      }
      if (b && c && !(a && d)) {
        pushQuad(xs[i], ys[j], z0, xs[i], ys[j], z1, xs[i], ys[j + 1], z1, xs[i], ys[j + 1], z0);
      }
      // +Y wall
      if (a && b && !(d && c)) {
        pushQuad(xs[i], ys[j + 1], z0, xs[i], ys[j + 1], z1, xs[i + 1], ys[j + 1], z1, xs[i + 1], ys[j + 1], z0);
      }
      if (d && c && !(a && b)) {
        pushQuad(xs[i], ys[j], z0, xs[i + 1], ys[j], z0, xs[i + 1], ys[j], z1, xs[i], ys[j], z1);
      }
    }
  }

  return { positions: new Float32Array(pos), indices: new Uint32Array(idx) };
}

export function meshToAsciiStl(mesh: TriMesh, name = "part"): string {
  const { positions: p, indices: ix } = mesh;
  const lines = [`solid ${name}`];
  for (let t = 0; t < ix.length; t += 3) {
    const ia = ix[t] * 3;
    const ib = ix[t + 1] * 3;
    const ic = ix[t + 2] * 3;
    const ax = p[ia], ay = p[ia + 1], az = p[ia + 2];
    const bx = p[ib], by = p[ib + 1], bz = p[ib + 2];
    const cx = p[ic], cy = p[ic + 1], cz = p[ic + 2];
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    lines.push(`  facet normal ${nx} ${ny} ${nz}`);
    lines.push("    outer loop");
    lines.push(`      vertex ${ax} ${ay} ${az}`);
    lines.push(`      vertex ${bx} ${by} ${bz}`);
    lines.push(`      vertex ${cx} ${cy} ${cz}`);
    lines.push("    endloop");
    lines.push("  endfacet");
  }
  lines.push(`endsolid ${name}`);
  return lines.join("\n");
}
