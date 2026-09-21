# Changelog — @fabricate/motion

Dates are America/New_York. This file is the kit record. The Word spec's
"Implementation delta" section is the short in-document twin.

## 2026-09-14 — audit, table, STL, ring

### Documented (was only in chat)

- Full audit of the first kit: broken orbit impulse, stale hole meshes,
  per-frame toolpath alloc, Color GC, copy-paste steppers, stub export,
  stale README.
- Market map (Tylko, iJewel3D, PartMode, Kelp3D, G54.APP) and
  novel / sellable / unique judgment.

### Revised in code

- Shared `ChannelTable` (`src/engine/table.ts`). Bracket, lamp, and ring
  use the same class.
- Orbit is a consumed `orbitImpulse`, not a position/velocity mix.
- Holes and toolpath mutate refs; toolpath rebuilds on a dirty key.
- Reused `THREE.Color` for emissive / metal.
- `ExportSheet` types fixed.

### Next slice

- 2.5D plate tessellator + ASCII STL (`src/geometry/tessellate.ts`).
- Optional worker (`tessellate.worker.ts`) via `exportPlateStl()`.
- Bracket export sheet downloads `bracket.stl` and reports
  `triangles · ms · worker|main`.
- Tests: `tests/tessellate.test.ts`, `tests/table.test.ts`.

### Third app

- `src/apps/ring` — shank workshop on the identical channel table
  (follow on bore/width/wall/hue/polish; `spring.snap` on twist).

### Still open

- Reduced-motion not applied to every channel.
- `setDisplay` still ticks React for labels.
- STL is a grid plate, not a BREP / Manifold solid.
- No OrbitControls vs inertia mutex.
- Word spec sections 1–10 still contain the original `* 0.1` /
  `v *= 0.92` / `progress += 0.01` snippets. Those are historical.

## 2026-09-14 — first kit (pre-audit)

Tokens, Δt solver, clock, evented state machine, MotionCanvas,
ParamSlider, ExportSheet, ModeScrim, bracket cell, lamp storefront,
solver 30/60fps tests. README written; later made stale by the
revision above.

## 2026-09-14 — documentation pack (sale kits)

- LICENSE: Copyright Jennipher Troup / melodicbloom; eval vs commercial
- README rewritten with credit and kit map
- docs/FILE_INDEX.md — every path, depends-on, tandem gaps
- docs/DIFFS.md — devised / created / corrected in this chat
- docs/ARCHITECTURE.md — pipeline and ownership
- docs/kits/ — FM-CORE through FM-STUDIO cards for bounded sale

## 2026-09-14 — P0 build start + SKU creatives

- B1 `applyReducedMotion` + tests
- B2 `ChannelTable.publish` 10 Hz; meshes read tables
- B3 `orbitEnabled={ui !== "manipulating"}`
- B13 GitHub Action `test.yml` (npm install until lockfile)
- `docs/PITCH.md` + `docs/creative/skus/` hero and diagram per SKU

## 2026-09-14 — P1 + SKU audit

- B4 tape recorder + test
- B5 WebGL poster
- B6 numeric twin on ParamSlider
- B14 tessellated bracket viewport
- B12 proof-film storyboard only
- docs/SKU_AUDIT.md
- FM-GESTURE marked GAP until wired

## 2026-09-14 — G-code + gesture wire + restore

- `src/geometry/gcode.ts` post + parse; sim path is parsed NC
- Export downloads `bracket.nc`
- FM-GESTURE session on bracket drag/tap/pinch
- `restoreMotion` / `syncReducedMotion`

## 2026-09-14 — final sales harden + out-of-env build order

- docs/BUILD_ORDER.md, BUILD_PROMPTS.md, IMAGE_PROMPTS.md
- package.json author + repository (melodicbloom); dropped missing bench
- PITCH / catalog / SKU_AUDIT language aligned to preview G-code
- SALES hardening: do-not-say list

## 2026-09-14 — proceed: queue, hover, G2

- Worker can return transferable mesh buffers; BracketMesh applies async (stale id drop)
- Desktop hover lift via follow τ, off for reduced-motion / coarse pointer
- Hole cycles posted as G2 I J; parser samples arcs

## 2026-09-14 — constitution + handoff
- docs/CONSTITUTION.md (accurate brief)
- docs/HANDOFF.md (commands, tests, competitors, decisions)
