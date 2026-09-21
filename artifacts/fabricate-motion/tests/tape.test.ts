import { describe, expect, it } from "vitest";
import { createTape } from "../src/engine/tape";
import { ChannelTable, defaultFollow } from "../src/engine/table";

describe("tape", () => {
  it("replays to a nearby pose at 60fps", () => {
    const tape = createTape();
    tape.push(1 / 60, { a: 10 });
    tape.push(1 / 60, { a: 10 });
    const table = new ChannelTable([defaultFollow("a", 0)]);
    for (const s of tape.samples()) {
      table.setTargets(s.targets);
      table.step(s.dt);
    }
    expect(table.get("a").value).toBeGreaterThan(0);
    const raw = tape.toJSON();
    const t2 = createTape();
    t2.fromJSON(raw);
    expect(t2.samples()).toHaveLength(2);
  });
});
