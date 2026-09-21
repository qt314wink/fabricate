import { reducedMotion } from "./tokens";
import type { ChannelTable } from "./table";
import type { ChannelKind } from "./channels";

type Snapshot = { kind: ChannelKind; tau: number };

const originals = new WeakMap<ChannelTable, Map<string, Snapshot>>();

export function applyReducedMotion(table: ChannelTable) {
  if (table.reducedApplied) return;
  const snap = new Map<string, Snapshot>();
  const tau = reducedMotion.maxDurationMs / 1000;
  for (const [id, ch] of table.channels) {
    snap.set(id, { kind: ch.kind, tau: ch.tau });
    ch.tau = Math.min(ch.tau, tau);
    if (reducedMotion.disableInertia && ch.kind === "inertia") {
      ch.kind = "follow";
      ch.velocity = 0;
    }
    if (reducedMotion.disableElasticOvershoot && ch.kind === "spring") {
      ch.kind = "follow";
      ch.velocity = 0;
      ch.tau = Math.min(ch.tau, tau);
    }
  }
  originals.set(table, snap);
  table.reducedApplied = true;
}

export function restoreMotion(table: ChannelTable) {
  const snap = originals.get(table);
  if (!snap || !table.reducedApplied) return;
  for (const [id, s] of snap) {
    const ch = table.channels.get(id);
    if (!ch) continue;
    ch.kind = s.kind;
    ch.tau = s.tau;
  }
  table.reducedApplied = false;
}

export function syncReducedMotion(table: ChannelTable, reduced: boolean) {
  if (reduced) applyReducedMotion(table);
  else restoreMotion(table);
}

export function channelTaus(table: ChannelTable): number[] {
  return [...table.channels.values()].map((c) => c.tau);
}
