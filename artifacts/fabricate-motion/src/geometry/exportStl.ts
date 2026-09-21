import type { PlateSpec } from "./tessellate";
import { tessellatePlate, meshToAsciiStl } from "./tessellate";

let worker: Worker | null = null;
let seq = 1;

function getWorker() {
  if (typeof Worker === "undefined") return null;
  if (!worker) {
    try {
      worker = new Worker(new URL("./tessellate.worker.ts", import.meta.url), { type: "module" });
    } catch {
      worker = null;
    }
  }
  return worker;
}

export async function exportPlateStl(spec: PlateSpec, name = "part"): Promise<{ stl: string; triangles: number; ms: number; via: "worker" | "main" }> {
  const w = getWorker();
  if (!w) {
    const t0 = performance.now();
    const mesh = tessellatePlate(spec);
    return { stl: meshToAsciiStl(mesh, name), triangles: mesh.indices.length / 3, ms: performance.now() - t0, via: "main" };
  }
  const id = seq++;
  return new Promise((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      w.removeEventListener("message", onMsg);
      resolve({ stl: e.data.stl, triangles: e.data.triangles, ms: e.data.ms, via: "worker" });
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ id, spec, name });
    setTimeout(() => {
      w.removeEventListener("message", onMsg);
      reject(new Error("tessellation timeout"));
    }, 8000);
  });
}

export function downloadText(filename: string, text: string) {
  const mime = filename.endsWith(".nc") || filename.endsWith(".gcode") ? "text/plain" : "model/stl";
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function tessellateMesh(spec: PlateSpec): Promise<{ positions: Float32Array; indices: Uint32Array; triangles: number; via: "worker" | "main" }> {
  const w = getWorker();
  if (!w) {
    const mesh = tessellatePlate(spec);
    return { positions: mesh.positions, indices: mesh.indices, triangles: mesh.indices.length / 3, via: "main" };
  }
  const id = seq++;
  return new Promise((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      w.removeEventListener("message", onMsg);
      resolve({
        positions: e.data.positions,
        indices: e.data.indices,
        triangles: e.data.triangles,
        via: "worker",
      });
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ id, spec, want: "mesh" });
    setTimeout(() => {
      w.removeEventListener("message", onMsg);
      reject(new Error("tessellation timeout"));
    }, 8000);
  });
}
