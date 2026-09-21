/**
 * Completes the spec state machine with events, interrupts, and duration caps.
 */
export type UIState = "idle" | "editing" | "manipulating" | "simulating" | "exporting";

export type UIEvent =
  | { type: "ENTER_WORKSPACE" }
  | { type: "POINTER_DOWN_MESH" }
  | { type: "POINTER_UP" }
  | { type: "PARAM_CHANGE" }
  | { type: "RUN_SIM" }
  | { type: "EXIT_SIM" }
  | { type: "OPEN_EXPORT" }
  | { type: "CLOSE_EXPORT" }
  | { type: "CANCEL" };

type Edge = { to: UIState; motion: "landing" | "none" | "mode" | "sheet" | "kill" };

const TABLE: Record<UIState, Partial<Record<UIEvent["type"], Edge>>> = {
  idle: {
    ENTER_WORKSPACE: { to: "editing", motion: "landing" },
  },
  editing: {
    POINTER_DOWN_MESH: { to: "manipulating", motion: "none" },
    PARAM_CHANGE: { to: "editing", motion: "none" },
    RUN_SIM: { to: "simulating", motion: "mode" },
    OPEN_EXPORT: { to: "exporting", motion: "sheet" },
  },
  manipulating: {
    POINTER_UP: { to: "editing", motion: "none" },
    CANCEL: { to: "editing", motion: "kill" },
  },
  simulating: {
    EXIT_SIM: { to: "editing", motion: "mode" },
    CANCEL: { to: "editing", motion: "kill" },
  },
  exporting: {
    CLOSE_EXPORT: { to: "editing", motion: "sheet" },
    CANCEL: { to: "editing", motion: "kill" },
  },
};

export type Transition = { from: UIState; to: UIState; event: UIEvent["type"]; motion: Edge["motion"] };

export function reduceState(state: UIState, event: UIEvent): Transition | null {
  const edge = TABLE[state][event.type];
  if (!edge) return null;
  return { from: state, to: edge.to, event: event.type, motion: edge.motion };
}
