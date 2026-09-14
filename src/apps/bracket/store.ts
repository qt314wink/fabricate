import { create } from "zustand";
import { reduceState, type UIEvent, type UIState } from "@/engine/machine";
import { BRACKET_DEFAULTS, BRACKET_LIMITS, type BracketParams } from "@/geometry/bracket";
import { clamp } from "@/engine/solver";

export type BracketTargets = BracketParams & {
  emissive: number;
  pathProgress: number;
  orbitImpulse: number;
};

type Store = {
  ui: UIState;
  targets: BracketTargets;
  display: BracketParams & { emissive: number; pathProgress: number; orbit: number };
  setParam: (k: keyof BracketParams, n: number) => void;
  dispatch: (e: UIEvent) => void;
  setDisplay: (d: Store["display"]) => void;
};

export const useBracketStore = create<Store>((set, get) => ({
  ui: "editing",
  targets: { ...BRACKET_DEFAULTS, emissive: 0, pathProgress: 0, orbitImpulse: 0 },
  display: { ...BRACKET_DEFAULTS, emissive: 0, pathProgress: 0, orbit: 0 },
  setParam(k, n) {
    const lim = BRACKET_LIMITS[k];
    const v = clamp(n, lim.min, lim.max);
    set((s) => ({ targets: { ...s.targets, [k]: v, emissive: 1 } }));
    get().dispatch({ type: "PARAM_CHANGE" });
  },
  dispatch(e) {
    const t = reduceState(get().ui, e);
    if (!t) return;
    set((s) => {
      const next = { ...s, ui: t.to };
      if (e.type === "RUN_SIM") next.targets = { ...s.targets, pathProgress: 1 };
      if (e.type === "EXIT_SIM" || e.type === "CANCEL") next.targets = { ...s.targets, pathProgress: 0 };
      return next;
    });
  },
  setDisplay(d) {
    set({ display: d });
  },
}));
