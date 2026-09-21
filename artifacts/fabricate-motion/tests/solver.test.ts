import { describe, expect, it } from "vitest";
import { follow1, stepInertia, stepSpring } from "../src/engine/solver";
import { inertia } from "../src/engine/tokens";

function integrate(seconds: number, fps: number, step: (dt: number) => void) {
  const dt = 1 / fps;
  const n = Math.round(seconds * fps);
  for (let i = 0; i < n; i++) step(dt);
}

describe("dt invariance", () => {
  it("follow reaches the same value at 30 and 60fps", () => {
    let a = 0;
    let b = 0;
    integrate(1, 60, (dt) => {
      a = follow1(a, 10, dt);
    });
    integrate(1, 30, (dt) => {
      b = follow1(b, 10, dt);
    });
    expect(Math.abs(a - b)).toBeLessThan(0.05);
    expect(a).toBeGreaterThan(9);
  });

  it("inertia decay matches spec 0.92@60fps half-life class", () => {
    let p = 0;
    let v = 10;
    integrate(1, 60, (dt) => {
      const s = stepInertia(p, v, dt, inertia.dampingPerSecond);
      p = s.position;
      v = s.velocity;
    });
    // e^{-5} ≈ 0.0067 remaining velocity
    expect(v).toBeLessThan(0.1);
  });

  it("spring settles near target", () => {
    let x = 0;
    let v = 0;
    integrate(2, 60, (dt) => {
      const s = stepSpring(x, v, 1, dt);
      x = s.x;
      v = s.v;
    });
    expect(Math.abs(x - 1)).toBeLessThan(0.05);
  });
});
