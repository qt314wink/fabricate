import { describe, expect, it } from "vitest";
import { ChannelTable, defaultFollow } from "../src/engine/table";

describe("ChannelTable", () => {
  it("steps every declared channel", () => {
    const table = new ChannelTable([defaultFollow("a", 0), defaultFollow("b", 5)]);
    table.setTargets({ a: 10, b: 5 });
    const out = table.step(1 / 60);
    expect(out.a).toBeGreaterThan(0);
    expect(out.a).toBeLessThan(10);
    expect(Math.abs(out.b - 5)).toBeLessThan(1e-6);
  });
});
