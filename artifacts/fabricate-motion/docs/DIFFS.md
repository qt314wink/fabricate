# Diffs from this chat

**Author:** Jennipher Troup (`melodicbloom`)  
**Window:** 2026-09-14 (EDT), conversation on *Motion System Spec — Fabricate UI*.

This is not a git log. The kit was authored in-session. Each row is a
devised / created / corrected artifact.

## Spec (Word) — read, not rewritten in §§1–10

| Action | What |
|---|---|
| Read | Full outline + body of Fabricate UI motion spec |
| Critique | Production-readiness: determinism vs `+= 0.01`, two frictions, no dt, incomplete state machine, setTimeout highlight |
| Distill | Principles P1–P4 → interrupt-by-target, chrome/matter split |
| Append | §11 IMPLEMENTATION DELTA (2026-09-14) as the in-doc twin of CHANGELOG |
| Not done | Original snippets in §§1–10 left historical on purpose |

## Created — first kit

| Path | Devised as |
|---|---|
| `src/engine/tokens.ts` | Spec tokens with units (τ, k, named springs) |
| `src/engine/clock.ts` | Single clock, MAX_DT 50 ms, pause on hidden |
| `src/engine/solver.ts` | Δt follow / spring / inertia replacing `* 0.1` and `v *= 0.92` |
| `src/engine/channels.ts` | Interruptible property objects |
| `src/engine/machine.ts` | Missing edges: manipulating exit, export close, CANCEL |
| `src/geometry/bracket.ts` | Fixed-topology 4-hole plate |
| `src/geometry/toolpath.ts` | Time-based reveal instead of `progress += 0.01` |
| `src/interact/gestures.ts` | Spec touch map + drag gain |
| `src/ui/*` | Canvas, slider, sheet, scrim |
| `src/apps/bracket/*` | High-value fabricate cell |
| `src/apps/lamp/*` | Out-of-the-box storefront |
| `tests/solver.test.ts` | 30/60 fps invariance |

## Corrected — audit pass

| Defect | Correction | Files |
|---|---|---|
| Orbit used target as position then subtracted into velocity | `orbitImpulse` consumed once via `table.impulse` | `bracket/store.ts`, `bracket/step.ts` |
| Holes received stale React `display` and rebuilt cylinderGeometry | Hole meshes are refs; scale/position in useFrame | `BracketMesh.tsx` |
| `buildToolpath` + new Float32Array every frame | Dirty key; rebuild only on param change or reveal | `BracketMesh.tsx` |
| `new THREE.Color()` every frame | Module-level Color | `BracketMesh.tsx`, `RingMesh.tsx` |
| Per-app `seeded` channel dicts | `ChannelTable` | `src/engine/table.ts`, all `step.ts` |
| `ExportSheet` used `React.ReactNode` without import | `ReactNode` import | `ExportSheet.tsx` |
| README said worker tessellation was *not* included after it shipped | README rewritten; CHANGELOG added | `README.md`, `CHANGELOG.md` |
| Highlight decay implicit (`value > 0.6` then retarget 0) | Left as known policy; documented, not redesigned | `bracket/step.ts` |
| Volume continuity overclaimed on a scaled box | Documented as estimate / canary | FILE_INDEX, kits |

## Created — second slice

| Path | Devised as |
|---|---|
| `src/engine/table.ts` | Shared table for all verticals |
| `src/geometry/tessellate.ts` | Grid 2.5D plate + ASCII STL |
| `src/geometry/tessellate.worker.ts` | Off-thread tessellate |
| `src/geometry/exportStl.ts` | Worker fallback + download |
| `src/geometry/ring.ts` | Shank params + US size estimate |
| `src/apps/ring/*` | Third app on identical table |
| `tests/table.test.ts` | Table contract |
| `tests/tessellate.test.ts` | STL header/footer + triangles |
| `src/main.tsx` | Three-app switcher |

## Created — this documentation pass

| Path | Devised as |
|---|---|
| `LICENSE` | Copyright Jennipher Troup / melodicbloom |
| `docs/FILE_INDEX.md` | Every file + tandem gaps |
| `docs/DIFFS.md` | This file |
| `docs/ARCHITECTURE.md` | Pipeline + ownership |
| `docs/kits/*.md` | Sale-bounded units |

## Still open (not corrected)

- Reduced-motion token not applied to every channel
- `setDisplay` can still wake React subscribers every frame (meshes already `getState()` in useFrame)
- No OrbitControls vs inertia mutex
- Tessellator is not manifold-guaranteed
- No `package-lock.json` in the zip
- Word spec §§1–10 still show illegal snippets
