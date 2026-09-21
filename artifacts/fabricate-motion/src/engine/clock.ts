/** Single time source. All solvers consume this. No setTimeout animation. */
export type FrameClock = {
  time: number;
  dt: number;
  paused: boolean;
};

const MAX_DT = 1 / 20; // clamp hitch so springs don't explode

export function createClock(): { tick: (nowMs: number) => FrameClock; pause: (p: boolean) => void } {
  let last = 0;
  let paused = false;
  let time = 0;

  return {
    pause(p) {
      paused = p;
      if (!p) last = 0;
    },
    tick(nowMs) {
      if (paused) return { time, dt: 0, paused: true };
      const now = nowMs / 1000;
      const raw = last === 0 ? 1 / 60 : now - last;
      last = now;
      const dt = Math.min(Math.max(raw, 0), MAX_DT);
      time += dt;
      return { time, dt, paused: false };
    },
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
