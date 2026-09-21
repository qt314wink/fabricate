import { create } from "zustand";
import { clamp } from "../../engine/solver";

export type LampParams = {
  height: number;
  shadeRadius: number;
  neckBend: number;
  temperature: number; // Kelvin-ish 2200..5000 mapped to color
};

export const LAMP_DEFAULTS: LampParams = { height: 420, shadeRadius: 140, neckBend: 18, temperature: 2700 };
export const LAMP_LIMITS: Record<keyof LampParams, { min: number; max: number }> = {
  height: { min: 280, max: 620 },
  shadeRadius: { min: 80, max: 220 },
  neckBend: { min: 0, max: 45 },
  temperature: { min: 2200, max: 5000 },
};

type Store = {
  targets: LampParams;
  display: LampParams;
  setParam: <K extends keyof LampParams>(k: K, v: number) => void;
  setDisplay: (p: LampParams) => void;
};

export const useLampStore = create<Store>((set) => ({
  targets: { ...LAMP_DEFAULTS },
  display: { ...LAMP_DEFAULTS },
  setParam(k, v) {
    const lim = LAMP_LIMITS[k];
    set((s) => ({ targets: { ...s.targets, [k]: clamp(v, lim.min, lim.max) } }));
  },
  setDisplay(p) {
    set({ display: p });
  },
}));
