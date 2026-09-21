/// <reference lib="webworker" />
import { tessellatePlate, meshToAsciiStl, type PlateSpec } from "./tessellate";

export type TessRequest = { id: number; spec: PlateSpec; name?: string; want?: "stl" | "mesh" | "both" };
export type TessResponse = {
  id: number;
  stl?: string;
  triangles: number;
  ms: number;
  positions?: Float32Array;
  indices?: Uint32Array;
};

self.onmessage = (e: MessageEvent<TessRequest>) => {
  const t0 = performance.now();
  const mesh = tessellatePlate(e.data.spec);
  const want = e.data.want ?? "stl";
  const res: TessResponse = {
    id: e.data.id,
    triangles: mesh.indices.length / 3,
    ms: performance.now() - t0,
  };
  if (want !== "mesh") res.stl = meshToAsciiStl(mesh, e.data.name ?? "part");
  if (want !== "stl") {
    res.positions = mesh.positions;
    res.indices = mesh.indices;
  }
  const xfer: Transferable[] = [];
  if (res.positions) xfer.push(res.positions.buffer);
  if (res.indices) xfer.push(res.indices.buffer);
  (self as DedicatedWorkerGlobalScope).postMessage(res, xfer);
};
