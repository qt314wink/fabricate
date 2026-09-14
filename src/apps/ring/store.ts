import { create } from "zustand";
import { RING_DEFAULTS, RING_LIMITS, type RingParams } from "@/geometry/ring";
import { clamp } from "@/engine/solver";

type Store = {
  targets: RingParams;
  display: RingParams;
  setParam: (k: keyof RingParams, n: number) => void;
  setDisplay: (d: RingParams) => void;
};

export const useRingStore = create<Store>((set) => ({
  targets: { ...RING_DEFAULTS },
  display: { ...RING_DEFAULTS },
  setParam(k, n) {
    const lim = RING_LIMITS[k];
    set((s) => ({ targets: { ...s.targets, [k]: clamp(n, lim.min, lim.max) } }));
  },
  setDisplay(d) {
    set({ display: d });
  },
}));
