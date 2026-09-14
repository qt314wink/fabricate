import { create } from "zustand";
import { clamp } from "@/engine/solver";

export const LAMP_DEFAULTS = {
  height: 420,
  shadeRadius: 160,
  neckBend: 12,
  temperature: 2700,
};

export const LAMP_LIMITS = {
  height: { min: 280, max: 620 },
  shadeRadius: { min: 90, max: 240 },
  neckBend: { min: -28, max: 36 },
  temperature: { min: 2200, max: 5000 },
};

type Lamp = typeof LAMP_DEFAULTS;

type Store = {
  targets: Lamp;
  display: Lamp;
  setParam: (k: keyof Lamp, n: number) => void;
  setDisplay: (d: Lamp) => void;
};

export const useLampStore = create<Store>((set) => ({
  targets: { ...LAMP_DEFAULTS },
  display: { ...LAMP_DEFAULTS },
  setParam(k, n) {
    const lim = LAMP_LIMITS[k];
    set((s) => ({ targets: { ...s.targets, [k]: clamp(n, lim.min, lim.max) } }));
  },
  setDisplay(d) {
    set({ display: d });
  },
}));
