# Build-order prompts

Paste one block into a coding agent on a machine that can install and run.

Credit in every commit: Jennipher Troup (`melodicbloom`).

## 1 — LOCK

You are hardening @fabricate/motion. Run `npm install` at the repo root until `package-lock.json` exists. Change `.github/workflows/test.yml` from `npm install` to `npm ci`. Run `npm test`. Do not change solver constants. Commit message: `chore: lockfile and ci`.

## 2 — PROOF

You are shooting the CORE proof. Start `npm run dev`. Record a 6s 1920×1080 split: left cap at 30fps, right 60fps, same slider tape 40→80 mm width. Overlay SAME TAPE / 30 = 60. End card: Motion architecture by Jennipher Troup (melodicbloom). Do not use generated fake UI. Follow docs/PROOF_FILM.md.

## 3 — QUEUE

Move `tessellatePlate` out of `BracketMesh` `useFrame`. Worker should return `positions` + `indices` (not only STL). Apply buffers when the worker replies. If params change twice before reply, drop the stale id. Fail the ticket if a profiler still shows tessellate inside the animation frame.

## 4 — HOVER

Desktop only (`pointer: fine`). Vertex Z lift from pointer distance, GPU, no setState on move. Budget &lt;16 ms. Mobile: no lift. Token the max lift in `tokens.ts`. Test: reduced-motion disables lift.

## 5 — POST

You are extending `src/geometry/gcode.ts` without breaking the parse test. Add optional G2/G3 hole circles, a tool-diameter comment, and a `--machine=grbl|fanuc` switch that only changes header/M-codes. Do not claim cutter compensation. A human must read the NC before any spindle turns.

## 6 — STOCK

Add a low-res heightfield stock that subtracts along parsed G1 segments in sim mode only. Pause when ui !== simulating. This is FM-STOCK, a new kit card, not a silent fold into TOOLPATH.

## 7 — CART

Shopify theme app extension: lamp/ring display numbers as line-item properties. No motion code in checkout. Snapshot test the payload.

## 8 — KERNEL

Replace grid tessellator behind an adapter. Default stays 2.5D. `KERNEL=manifold` optional. Manifold volume vs `estimateVolumeMm3` logged, never labeled manufacturable automatically.

## 9 — MANDREL

Replace torus inner profile with a comfort-fit rail. Drive size from a measured mandrel table, not circumference/π. Label leftover error in mm.

## 10 — PUBLISH

Push to github.com/melodicbloom. Tag v0.2.0. LICENSE and attribution line unchanged. Do not publish to npm as public without a kit grant note.
