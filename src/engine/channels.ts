import { follow, spring } from "./tokens";
import { follow1, stepInertia, stepSpring, type SpringCfg } from "./solver";

export type ChannelKind = "follow" | "spring" | "inertia" | "hold";

export type Channel = {
  id: string;
  kind: ChannelKind;
  value: number;
  target: number;
  velocity: number;
  tau: number;
  spring: SpringCfg;
  restEps: number;
};

export function makeChannel(id: string, value = 0, kind: ChannelKind = "follow"): Channel {
  return {
    id,
    kind,
    value,
    target: value,
    velocity: 0,
    tau: follow.morphTau,
    spring: spring.standard,
    restEps: 1e-3,
  };
}

export function setTarget(ch: Channel, target: number) {
  ch.target = target;
}

export function impulse(ch: Channel, dv: number) {
  ch.kind = "inertia";
  ch.velocity += dv;
}

export function stepChannel(ch: Channel, dt: number): Channel {
  if (dt <= 0) return ch;
  switch (ch.kind) {
    case "hold":
      ch.value = ch.target;
      ch.velocity = 0;
      break;
    case "follow":
      ch.value = follow1(ch.value, ch.target, dt, ch.tau);
      ch.velocity = 0;
      break;
    case "spring": {
      const s = stepSpring(ch.value, ch.velocity, ch.target, dt, ch.spring);
      ch.value = s.x;
      ch.velocity = s.v;
      break;
    }
    case "inertia": {
      const s = stepInertia(ch.value, ch.velocity, dt);
      ch.value = s.position;
      ch.velocity = s.velocity;
      if (s.velocity === 0) ch.kind = "follow";
      break;
    }
  }
  return ch;
}

export function atRest(ch: Channel) {
  return Math.abs(ch.value - ch.target) < ch.restEps && Math.abs(ch.velocity) < ch.restEps;
}
