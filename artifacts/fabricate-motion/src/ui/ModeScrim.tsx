import { motionMs } from "../engine/tokens";

export function ModeScrim({ simulating }: { simulating: boolean }) {
  return (
    <div
      aria-hidden
      className="fm-scrim"
      style={{
        opacity: simulating ? 0.45 : 0,
        transition: `opacity ${motionMs.medium}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        pointerEvents: "none",
      }}
    />
  );
}
