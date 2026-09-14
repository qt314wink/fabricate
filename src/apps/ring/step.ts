import { ChannelTable, defaultFollow, defaultSpring } from "@/engine/table";
import { spring } from "@/engine/tokens";
import type { FrameClock } from "@/engine/clock";
import { prefersReducedMotion } from "@/engine/clock";
import { syncReducedMotion } from "@/engine/reducedMotion";
import { RING_DEFAULTS } from "@/geometry/ring";
import { useRingStore } from "./store";

export const ringTable = new ChannelTable([
  defaultFollow("innerRadius", RING_DEFAULTS.innerRadius),
  defaultFollow("shankWidth", RING_DEFAULTS.shankWidth),
  defaultFollow("shankThickness", RING_DEFAULTS.shankThickness),
  defaultSpring("twist", RING_DEFAULTS.twist, spring.snap),
  defaultFollow("metalHue", RING_DEFAULTS.metalHue),
  defaultFollow("polish", RING_DEFAULTS.polish),
]);

export function stepRing(clock: FrameClock) {
  syncReducedMotion(ringTable, prefersReducedMotion());
  ringTable.setTargets(useRingStore.getState().targets);
  ringTable.step(clock.dt);
  const sampled = ringTable.publish(performance.now(), 10);
  if (sampled) {
    useRingStore.getState().setDisplay({
      innerRadius: sampled.innerRadius,
      shankWidth: sampled.shankWidth,
      shankThickness: sampled.shankThickness,
      twist: sampled.twist,
      metalHue: sampled.metalHue,
      polish: sampled.polish,
    });
  }
}
