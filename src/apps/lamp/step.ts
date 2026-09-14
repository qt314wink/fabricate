import { ChannelTable, defaultFollow, defaultSpring } from "@/engine/table";
import type { FrameClock } from "@/engine/clock";
import { prefersReducedMotion } from "@/engine/clock";
import { syncReducedMotion } from "@/engine/reducedMotion";
import { LAMP_DEFAULTS, useLampStore } from "./store";

export const lampTable = new ChannelTable([
  defaultFollow("height", LAMP_DEFAULTS.height),
  defaultFollow("shadeRadius", LAMP_DEFAULTS.shadeRadius),
  defaultSpring("neckBend", LAMP_DEFAULTS.neckBend),
  defaultFollow("temperature", LAMP_DEFAULTS.temperature),
]);

export function stepLamp(clock: FrameClock) {
  syncReducedMotion(lampTable, prefersReducedMotion());
  lampTable.setTargets(useLampStore.getState().targets);
  lampTable.step(clock.dt);
  const sampled = lampTable.publish(performance.now(), 10);
  if (sampled) {
    useLampStore.getState().setDisplay({
      height: sampled.height,
      shadeRadius: sampled.shadeRadius,
      neckBend: sampled.neckBend,
      temperature: sampled.temperature,
    });
  }
}
