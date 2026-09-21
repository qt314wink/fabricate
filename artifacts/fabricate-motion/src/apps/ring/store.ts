import { create } from "zustand";
import { RING_DEFAULTS, RING_LIMITS, type RingParams } from "../../geometry/ring";
import { clamp } from "../../engine/solver";

type Store = {
  targets: RingParams;
  display: RingParams;
  setParam: <K extends keyof RingParams>(k: K, v: number) => void;
  setDisplay: (p: RingParams) => void;
};

export const useRingStore = create<Store>((set) => ({
  targets: { ...RING_DEFAULTS },
  display: { ...RING_DEFAULTS },
  setParam(k, v) {
    const lim = RING_LIMITS[k];
    set((s) => ({ targets: { ...s.targets, [k]: clamp(v, lim.min, lim.max) } }));
  },
  setDisplay(p) {
    set({ display: p });
  },
}));
