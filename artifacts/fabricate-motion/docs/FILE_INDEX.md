# File index

**Author:** Jennipher Troup (`melodicbloom`)  
Every path in the kit. “Tandem” = files that are not in this repo but a
production buyer still needs.

## Root

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `LICENSE` | Copyright + eval vs commercial grant | — | Kit invoice / license grant PDF |
| `README.md` | Entry + credit | docs/* | Public repo landing |
| `CHANGELOG.md` | Dated revisions | — | Keep in lockstep with DIFFS |
| `package.json` | Deps and scripts | npm ecosystem | Lockfile (`package-lock.json`) not yet committed |
| `tsconfig.json` | Strict TS | src, tests | — |
| `vite.config.ts` | Dev/build; worker URL | `@vitejs/plugin-react` | Production CDN config |
| `index.html` | Vite shell | `src/main.tsx` | Hosting headers, CSP |

## Engine — kit FM-CORE + FM-MACHINE

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `src/engine/tokens.ts` | ms, easing, spring names, τ, budgets | — | Design-token JSON for Figma |
| `src/engine/clock.ts` | Single dt, hitch clamp, pause, reduced-motion detect | tokens (policy) | Visibility + tab throttle analytics |
| `src/engine/solver.ts` | follow1, stepSpring, stepInertia, clamp | tokens | SIMD / worker port if channel count explodes |
| `src/engine/channels.ts` | Per-property state + kind | solver, tokens | Persistence / timeline recorder |
| `src/engine/table.ts` | Shared table API | channels | Schema codegen from param types |
| `src/engine/machine.ts` | Evented UIState | — | Analytics events, undo stack |
| `src/engine/index.ts` | Barrel | all engine | — |

## Geometry — kits FM-TESSELLATE, FM-TOOLPATH, verticals

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `src/geometry/bracket.ts` | Fixed 4-hole param model + volume estimate | — | BREP kernel if holes must be true booleans |
| `src/geometry/toolpath.ts` | Contour + drill polyline | bracket | Real CAM / G-code (EasyCAM, G54) |
| `src/geometry/tessellate.ts` | Grid 2.5D mesh + ASCII STL | — | Manifold / OCCT WASM for watertight production solids |
| `src/geometry/tessellate.worker.ts` | Off-thread tessellate | tessellate.ts, Vite worker | Job queue, progress events |
| `src/geometry/exportStl.ts` | Worker-or-main + download | tessellate, worker | Signed URL upload, virus scan |
| `src/geometry/ring.ts` | Shank params + US size estimate | — | Mandrel table, comfort-fit profile |

## Interact — FM-GESTURE

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `src/interact/gestures.ts` | Session wired to bracket channels | CORE, bracket store | Keyboard nudge, hover shader |

## UI chrome — FM-CHROME

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `src/ui/MotionCanvas.tsx` | R3F canvas + clock bridge | clock, r3f, drei | Capability detect, DPR cap, fallback poster |
| `src/ui/ParamSlider.tsx` | Target-only slider | tokens.budgets | Accessible number field twin |
| `src/ui/ExportSheet.tsx` | Framer bottom sheet | framer-motion, tokens | Focus trap, aria-modal polish |
| `src/ui/ModeScrim.tsx` | Sim dim chrome | tokens.motionMs | Reduced-motion instant cut |
| `src/styles.css` | Demo layout | — | Design-system tokens → CSS vars |

## Apps

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `src/main.tsx` | App switcher | three apps | Router, feature flags |
| `src/apps/bracket/*` | FM-BRACKET | CORE, MACHINE, CHROME, TESSELLATE, TOOLPATH | Shop CAM, materials, fasteners |
| `src/apps/lamp/*` | FM-LAMP | CORE, CHROME | Cart, SKU, pricing, HDRI studio |
| `src/apps/ring/*` | FM-RING | CORE, CHROME | Head/gem library, try-on, iJewel-class look |

## Tests

| File | Role | Relies on | Tandem / create |
|---|---|---|---|
| `tests/solver.test.ts` | 30 vs 60 fps follow/inertia/spring | solver | RAF p95 harness in CI |
| `tests/table.test.ts` | Table steps declared channels | table | Snapshot of channel schemas |
| `tests/tessellate.test.ts` | STL wrapper + triangle count | tessellate | Mesh manifold check (not present) |
