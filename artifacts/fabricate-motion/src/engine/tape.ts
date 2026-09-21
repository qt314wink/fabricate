/**
 * B4 — record target snapshots with dt so QA can replay the same input tape.
 * Display after replay should match within eps at a given fps.
 */
export type TapeSample = { t: number; dt: number; targets: Record<string, number> };

export function createTape() {
  const samples: TapeSample[] = [];
  let t = 0;
  return {
    push(dt: number, targets: Record<string, number>) {
      t += dt;
      samples.push({ t, dt, targets: { ...targets } });
    },
    clear() {
      samples.length = 0;
      t = 0;
    },
    toJSON() {
      return JSON.stringify(samples);
    },
    fromJSON(raw: string) {
      samples.length = 0;
      t = 0;
      const parsed = JSON.parse(raw) as TapeSample[];
      for (const s of parsed) samples.push(s);
      if (samples.length) t = samples[samples.length - 1].t;
    },
    samples() {
      return samples;
    },
  };
}

export type MotionTape = ReturnType<typeof createTape>;
