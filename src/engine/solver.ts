import { follow, inertia, spring } from "./tokens";

export type SpringCfg = { tension: number; friction: number; mass: number };

/** Exponential follow. Replaces spec `x += (t-x)*0.1`. Interruptible: only target changes. */
export function follow1(current: number, target: number, dt: number, tau: number = follow.morphTau): number {
  if (tau <= 0) return target;
  const a = 1 - Math.exp(-dt / tau);
  return current + (target - current) * a;
}

export function follow3(
  current: [number, number, number],
  target: [number, number, number],
  dt: number,
  tau?: number,
): [number, number, number] {
  return [
    follow1(current[0], target[0], dt, tau),
    follow1(current[1], target[1], dt, tau),
    follow1(current[2], target[2], dt, tau),
  ];
}

/** Semi-implicit Euler spring. Spec spring token. */
export function stepSpring(
  x: number,
  v: number,
  target: number,
  dt: number,
  cfg: SpringCfg = spring.standard,
): { x: number; v: number } {
  const acc = (cfg.tension * (target - x) - cfg.friction * v) / cfg.mass;
  const nv = v + acc * dt;
  const nx = x + nv * dt;
  return { x: nx, v: nv };
}

/** Spec inertia with real time: v *= exp(-k dt). */
export function stepInertia(position: number, velocity: number, dt: number, k = inertia.dampingPerSecond) {
  const v = velocity * Math.exp(-k * dt);
  return { position: position + v * dt, velocity: Math.abs(v) < 1e-5 ? 0 : v };
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function almostEqual(a: number, b: number, eps = 1e-3) {
  return Math.abs(a - b) < eps;
}
