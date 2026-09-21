# Handoff — scripts, tests, commands, build order

**Author:** Jennipher Troup (`melodicbloom`)  
Run these on a laptop with Node 20. This sandbox did not complete `npm install`.

## 0. First hour

```bash
cd fabricate-motion
node -v          # expect v20+
npm install      # creates package-lock.json
npm test         # vitest run
npm run dev      # Vite; exercise bracket / lamp / ring
```

Looking for: all current tests green (solver, table, tessellate, tape, reducedMotion, gcode).  
Optimizing: nothing — if red, stop and read the failing file.  
Constraint: do not “fix” tokens to make a test pass (τ=0.158, k=4.997, springs 170/26 and 170/20).

Then:

```bash
# after lockfile exists
# edit .github/workflows/test.yml: npm install → npm ci
git add package-lock.json .github/workflows/test.yml
```

## 1. Test map — what each file is for

| File | Looking for | Benchmark / gate | Do not |
|---|---|---|---|
| `tests/solver.test.ts` | follow/inertia/spring 30 vs 60 fps | follow 0→10 after 1s differs < 0.05; inertia v0=10 after 1s < 0.1 | change k or τ to pass |
| `tests/table.test.ts` | table only steps declared channels | unknown id throws | add silent no-ops |
| `tests/tessellate.test.ts` | ASCII STL wrapper + triangle count | solid + endsolid present | claim manifold |
| `tests/tape.test.ts` | JSON tape replay | length preserved; value > 0 after steps | require bit-exact floats |
| `tests/reducedMotion.test.ts` | τ cap + kind demote | τ ≤ 0.08 s; inertia/spring → follow | skip restore test if you add one |
| `tests/gcode.test.ts` | post header + G2 + parse points | `G21 G90 G17`, `G2 `, `M2`, points.length > 20 | treat as Fanuc |

Add after LOCK:

```bash
# optional local gate, not in CI yet
npx vitest run
```

## 2. Build order (exact) — owner = you or agent with a browser

Prompts: `docs/BUILD_PROMPTS.md`.

| Step | Commands / work | Looking for | Optimize | Constraint | Strategy it protects |
|---|---|---|---|---|---|
| LOCK | `npm install` then CI `npm ci` | clean install on a second machine | cache in Actions | Node 20 | You cannot support what you cannot reinstall |
| PROOF | `npm run dev` + capture 6s 1920×1080 split 30/60 | same tape, end poses agree; p95 frame on 60 side < 16.7ms | cap DPR 2 | no generated fake UI | CORE is sold as a test, not a look |
| QUEUE | finish worker mesh path; zero tessellate in profiler `useFrame` | stale id dropped; previous mesh stays until new buffers | pitch 3 default | do not tessellate every slider tick — commit-on-pointerup is allowed | Preview must not hitch or people bounce |
| HOVER | device lab Chrome Performance pointermove | <16ms; no setState; coarse pointer = 0 lift | vertex shader later | reduced-motion kills lift | Spec P2/P3 without lying on mobile |
| POST | extend `gcode.ts` only | existing parse test still green; human diffs NC | dialects as flag | no unattended mill; no “G-code ready” in ads | Honesty vs G54 / Fusion |
| STOCK | new package `src/geometry/stock.ts` + kit card FM-STOCK | sim-only; paused off simulating | coarse heightfield | not inside TOOLPATH invoice | Don’t hide a product in a preview |
| CART | Shopify line items from lamp/ring targets | snapshot payload | no motion in checkout | LAMP/RING stay PDP modules | Tylko analog is order, not our job yet |
| KERNEL | adapter behind tessellate | default still 2.5D | OCCT/Manifold optional | never auto-stamp manufacturable | PartMode/OCCT stay tandem |
| MANDREL | replace torus | ±0.2 mm vs physical gauge | table not π | RING is not iJewel | Craft buyers bounce on torus |
| PUBLISH | `git tag v0.2.0` to github.com/melodicbloom | LICENSE + credit intact | GitHub Release notes = CONSTITUTION.md short | no public npm without kit grant | Org handle is the brand |

## 3. Runtime checks while `npm run dev`

Bracket
- Slider width: mesh follows, does not pop; volume label updates ≤10 Hz.
- Pointerdown plate: `ui === manipulating`, orbit off; pointerup: inertia decay.
- Simulate: path grows from **parsed NC**; Export downloads `bracket.stl` and `bracket.nc`; NC contains `G2`.
- Prefers-reduced-motion: no hover lift, springs become follow.
- Kill WebGL (software render off): poster, sliders still work.

Lamp / ring
- Neck / twist use spring; other dims follow.
- No state machine required.

## 4. Competitor data → decisions already made

Sources: triangulated 2026 public pages / how-tos, not a paid analyst feed. Treat as **direction**, not a price database.

| Name | What they are | Price / motion signal | Decision we already made |
|---|---|---|---|
| Tylko | Parametric furniture **is** the order | Premium D2C; morph-not-snap in furniture | Do not claim the factory. Sell the spine. LAMP cart is tandem. |
| iJewel3D / Thinkspace / 3D Jewelry Viewer | Look + gems + refraction | Crowded jewelry WebGL | RING is a shank module beside them, never a replacement. |
| Agency R3F PDP wraps | Look packs | Often quoted ~$80k–$250k full commerce | Install CORE+vertical at $3.5k–$18k **under** that wrap. |
| Gumroad component packs | Shaders / kits | ~$29–$149 | Digital SKUs $49–$497. Not $9, not $2k PDF. |
| Kelp3D / OpenSCAD customizer | Export-ish | Maker tools | TESSELLATE is preview. Don’t out-CAD them. |
| PartMode / OCCT WASM | Browser solids | Innovator | KERNEL is adapter, default 2.5D. |
| G54.APP / Fusion / EasyCAM | Real CAM | Professional seats | TOOLPATH = preview post. POST/STOCK are later SKUs. |
| drei PresentationControls / GSAP-on-mesh | Default agency motion | Free / common | Illegal for matter. Chrome only. This is the CORE differentiator. |
| Onshape FeatureScript | Expert rebuild (can pop) | CAD SaaS | We do not rebuild identity. |

Implementation choices that follow from that table (do not reopen without a buyer):
1. One writer per property.
2. Fixed 4-hole topology instead of boolean remesh.
3. NC text as preview source, not a secret parallel polyline.
4. No photoreal jewelry or HDRI in RING/LAMP kits.
5. No “manufacturable” in copy, LICENSE, or export UI.
6. Gesture + machine sold with BRACKET first.
7. Future SKUs (STOCK, POST dialects, HOVER shader, KERNEL) stay separate invoices.

## 5. Package the handoff

```bash
# from repo parent, excluding node_modules
zip -r fabricate-motion-handoff.zip fabricate-motion \
  -x "*/node_modules/*"
```

Give the receiver: this file, `CONSTITUTION.md`, `BUILD_PROMPTS.md`, `PITCH.md`, `LICENSE`, and `npm test` green on their machine.
