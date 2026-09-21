import { describe, expect, it } from "vitest";
import { ChannelTable, defaultFollow, defaultInertia, defaultSpring } from "../src/engine/table";
import { applyReducedMotion, channelTaus } from "../src/engine/reducedMotion";
import { reducedMotion } from "../src/engine/tokens";

describe("applyReducedMotion", () => {
  it("caps tau and demotes inertia/spring", () => {
    const table = new ChannelTable([
      defaultFollow("a", 0, 0.158),
      defaultInertia("b", 0),
      defaultSpring("c", 0),
    ]);
    applyReducedMotion(table);
    const max = reducedMotion.maxDurationMs / 1000;
    expect(Math.max(...channelTaus(table))).toBeLessThanOrEqual(max + 1e-9);
    expect(table.get("b").kind).toBe("follow");
    expect(table.get("c").kind).toBe("follow");
  });
});

describe("ChannelTable.publish", () => {
  it("returns values at most at hz", () => {
    const table = new ChannelTable([defaultFollow("a", 1)]);
    const a = table.publish(0, 10);
    const b = table.publish(20, 10);
    const c = table.publish(120, 10);
    expect(a).not.toBeNull();
    expect(b).toBeNull();
    expect(c).not.toBeNull();
  });
});
