import { describe, expect, it } from "vitest";
import { tessellatePlate, meshToAsciiStl } from "../src/geometry/tessellate";

describe("tessellatePlate", () => {
  it("emits triangles and a closed ASCII STL", () => {
    const mesh = tessellatePlate({
      width: 80,
      height: 50,
      thickness: 6,
      fillet: 4,
      holes: [
        { x: -28, y: 13, r: 3.5 },
        { x: 28, y: 13, r: 3.5 },
        { x: 0, y: 0, r: 0 },
      ],
      pitch: 4,
    });
    expect(mesh.indices.length).toBeGreaterThan(100);
    expect(mesh.indices.length % 3).toBe(0);
    const stl = meshToAsciiStl(mesh, "bracket");
    expect(stl.startsWith("solid bracket")).toBe(true);
    expect(stl.trim().endsWith("endsolid bracket")).toBe(true);
  });
});
