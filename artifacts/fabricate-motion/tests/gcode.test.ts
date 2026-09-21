import { describe, expect, it } from "vitest";
import { BRACKET_DEFAULTS } from "../src/geometry/bracket";
import { parseGcode, postBracketGcode } from "../src/geometry/gcode";

describe("gcode post/parse", () => {
  it("roundtrips contour + holes into points", () => {
    const nc = postBracketGcode(BRACKET_DEFAULTS);
    expect(nc).toMatch(/G21 G90 G17/);
    expect(nc).toMatch(/M2/);
    const pts = parseGcode(nc);
    expect(pts.length).toBeGreaterThan(20);
    expect(pts.some((p) => p.z > BRACKET_DEFAULTS.thickness)).toBe(true);
  });
});
