import { ChannelTable, defaultFollow, defaultSpring } from "../../engine/table";
import { follow, spring } from "../../engine/tokens";
import type { FrameClock } from "../../engine/clock";
import { prefersReducedMotion } from "../../engine/clock";
import { syncReducedMotion } from "../../engine/reducedMotion";
import { RING_DEFAULTS } from "../../geometry/ring";
import { useRingStore } from "./store";

/** Identical ChannelTable primitive — only the id set changes. */
export const ringTable = new ChannelTable([
  defaultFollow("innerRadius", RING_DEFAULTS.innerRadius),
  defaultFollow("shankWidth", RING_DEFAULTS.shankWidth),
  defaultFollow("shankThickness", RING_DEFAULTS.shankThickness),
  defaultSpring("twist", RING_DEFAULTS.twist, spring.snap),
  { id: "metalHue", kind: "follow", tau: follow.fadeTau, initial: RING_DEFAULTS.metalHue },
  { id: "polish", kind: "follow", tau: follow.fadeTau, initial: RING_DEFAULTS.polish },
]);

export function stepRing(clock: FrameClock) {
  syncReducedMotion(ringTable, prefersReducedMotion());
  ringTable.setTargets(useRingStore.getState().targets);
  ringTable.step(clock.dt);
  const sampled = ringTable.publish(performance.now(), 10);
  if (sampled) useRingStore.getState().setDisplay(sampled as never);
}
