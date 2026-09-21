import { create } from "zustand";
import { BRACKET_DEFAULTS, BRACKET_LIMITS, type BracketParams } from "../../geometry/bracket";
import { reduceState, type UIEvent, type UIState } from "../../engine/machine";
import { clamp } from "../../engine/solver";

export type BracketTargets = BracketParams & {
  emissive: number;
  pathProgress: number;
  orbitImpulse: number;
};

type Store = {
  ui: UIState;
  targets: BracketTargets;
  display: Record<string, number>;
  dispatch: (e: UIEvent) => void;
  setParam: <K extends keyof BracketParams>(key: K, value: number) => void;
  setDisplay: (patch: Record<string, number>) => void;
};

export const useBracketStore = create<Store>((set, get) => ({
  ui: "idle",
  targets: { ...BRACKET_DEFAULTS, emissive: 0, pathProgress: 0, orbitImpulse: 0 },
  display: { ...BRACKET_DEFAULTS, orbit: 0, emissive: 0, pathProgress: 0 },
  dispatch(e) {
    const t = reduceState(get().ui, e);
    if (!t) return;
    set((s) => {
      const targets = { ...s.targets };
      if (t.to === "simulating") targets.pathProgress = 1;
      if (t.from === "simulating" && t.to === "editing") targets.pathProgress = 0;
      if (t.to === "editing" && t.event === "ENTER_WORKSPACE") targets.emissive = 1;
      return { ui: t.to, targets };
    });
  },
  setParam(key, value) {
    const lim = BRACKET_LIMITS[key];
    set((s) => ({ targets: { ...s.targets, [key]: clamp(value, lim.min, lim.max), emissive: 1 } }));
    get().dispatch({ type: "PARAM_CHANGE" });
  },
  setDisplay(patch) {
    set({ display: patch });
  },
}));
