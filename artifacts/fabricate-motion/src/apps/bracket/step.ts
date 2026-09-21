import { ChannelTable, defaultFollow, defaultInertia } from "../../engine/table";
import type { FrameClock } from "../../engine/clock";
import { prefersReducedMotion } from "../../engine/clock";
import { syncReducedMotion } from "../../engine/reducedMotion";
import { BRACKET_DEFAULTS } from "../../geometry/bracket";
import { useBracketStore } from "./store";

export const bracketTable = new ChannelTable([
  defaultFollow("width", BRACKET_DEFAULTS.width),
  defaultFollow("height", BRACKET_DEFAULTS.height),
  defaultFollow("thickness", BRACKET_DEFAULTS.thickness),
  defaultFollow("fillet", BRACKET_DEFAULTS.fillet),
  defaultFollow("holeCount", BRACKET_DEFAULTS.holeCount),
  defaultFollow("holeRadius", BRACKET_DEFAULTS.holeRadius),
  defaultInertia("orbit", 0),
  { id: "emissive", kind: "follow", tau: 0.08, initial: 0 },
  { id: "pathProgress", kind: "follow", tau: 1.8, initial: 0 },
]);

export function stepBracket(clock: FrameClock) {
  const { targets } = useBracketStore.getState();
  syncReducedMotion(bracketTable, prefersReducedMotion());
  bracketTable.setTargets({
    width: targets.width,
    height: targets.height,
    thickness: targets.thickness,
    fillet: targets.fillet,
    holeCount: targets.holeCount,
    holeRadius: targets.holeRadius,
    emissive: targets.emissive,
    pathProgress: targets.pathProgress,
  });
  if (targets.orbitImpulse) {
    bracketTable.impulse("orbit", targets.orbitImpulse);
    useBracketStore.setState((s) => ({ targets: { ...s.targets, orbitImpulse: 0 } }));
  }
  const display = bracketTable.step(clock.dt);
  if (targets.emissive > 0.01 && display.emissive > 0.6) {
    useBracketStore.setState((s) => ({ targets: { ...s.targets, emissive: 0 } }));
  }
  const sampled = bracketTable.publish(performance.now(), 10);
  if (sampled) useBracketStore.getState().setDisplay(sampled as never);
}
