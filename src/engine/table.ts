import { follow, spring } from "./tokens";
import { makeChannel, setTarget, stepChannel, impulse as impulseCh, type Channel, type ChannelKind } from "./channels";
import type { SpringCfg } from "./solver";

export type ChannelDef = {
  id: string;
  kind?: ChannelKind;
  tau?: number;
  spring?: SpringCfg;
  initial?: number;
  restEps?: number;
};

export class ChannelTable {
  readonly channels: Map<string, Channel> = new Map();
  reducedApplied = false;

  constructor(defs: ChannelDef[]) {
    for (const d of defs) {
      const ch = makeChannel(d.id, d.initial ?? 0, d.kind ?? "follow");
      if (d.tau != null) ch.tau = d.tau;
      if (d.spring) ch.spring = d.spring;
      if (d.restEps != null) ch.restEps = d.restEps;
      this.channels.set(d.id, ch);
    }
  }

  get(id: string) {
    const ch = this.channels.get(id);
    if (!ch) throw new Error(`unknown channel ${id}`);
    return ch;
  }

  setTargets(targets: Record<string, number>) {
    for (const [k, v] of Object.entries(targets)) {
      const ch = this.channels.get(k);
      if (ch) setTarget(ch, v);
    }
  }

  impulse(id: string, dv: number) {
    impulseCh(this.get(id), dv);
  }

  step(dt: number): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [id, ch] of this.channels) {
      stepChannel(ch, dt);
      out[id] = ch.value;
    }
    return out;
  }

  lastPublish = 0;
  publish(nowMs: number, hz = 10): Record<string, number> | null {
    const min = 1000 / hz;
    if (nowMs - this.lastPublish < min) return null;
    this.lastPublish = nowMs;
    return this.values();
  }

  values(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [id, ch] of this.channels) out[id] = ch.value;
    return out;
  }
}

export const defaultFollow = (id: string, initial: number, tau: number = follow.morphTau): ChannelDef => ({
  id,
  kind: "follow",
  tau,
  initial,
});

export const defaultSpring = (id: string, initial: number, cfg: SpringCfg = spring.standard): ChannelDef => ({
  id,
  kind: "spring",
  spring: cfg,
  initial,
});

export const defaultInertia = (id: string, initial = 0): ChannelDef => ({
  id,
  kind: "inertia",
  initial,
});
