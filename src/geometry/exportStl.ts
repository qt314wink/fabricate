import type { PlateSpec } from "./tessellate";
import { tessellatePlate, meshToAsciiStl } from "./tessellate";

export async function exportPlateStl(spec: PlateSpec, name = "part") {
  const t0 = performance.now();
  const mesh = tessellatePlate(spec);
  return {
    stl: meshToAsciiStl(mesh, name),
    triangles: mesh.indices.length / 3,
    ms: performance.now() - t0,
    via: "main" as const,
  };
}

export async function tessellateMesh(spec: PlateSpec) {
  const mesh = tessellatePlate(spec);
  return {
    positions: mesh.positions,
    indices: mesh.indices,
    triangles: mesh.indices.length / 3,
    via: "main" as const,
  };
}

export function downloadText(filename: string, text: string) {
  const mime =
    filename.endsWith(".nc") || filename.endsWith(".gcode") ? "text/plain" : "model/stl";
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
