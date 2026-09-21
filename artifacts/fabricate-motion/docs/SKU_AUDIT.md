# Documentation + SKU audit

**Author:** Jennipher Troup (`melodicbloom`)  
**Date:** 2026-09-14  
**Scope:** every sale card vs the files that actually exist after P0+P1.

Verdict key: SHIP (card matches code) · DRIFT (card overclaims) · GAP (code missing what we sell).

## Documentation corpus

| Doc | Status | Issue |
|---|---|---|
| LICENSE | SHIP | Org is melodicbloom; melodyfire explained as a separate repo |
| README | SHIP | Maps kits, credit, sales doc |
| CHANGELOG | SHIP | Dated; keep appending |
| FILE_INDEX | DRIFT | Still describes bracket mesh as box+cylinders; B14 changed that |
| DIFFS | SHIP | Historical; does not list P0/P1 until CHANGELOG |
| ARCHITECTURE | SHIP | Pipeline still true |
| PITCH / SALES | SHIP | Complementary; PITCH is the outreach map |
| Kit cards | mixed | See per-SKU |
| Word §§1–10 | DRIFT by design | Original illegal snippets left historical |
| Word §11 | SHIP | Points at kit docs + melodicbloom |
| Word 386+ | DRIFT | Chat transcript, not a spec |

## Per SKU

### FM-CORE — SHIP with a caveat
Code: tokens, clock, solver, channels, table, reducedMotion, tape, tests.  
Card promise: one clock, interrupt-by-target, 30/60 tests.  
Caveat: reduced-motion is one-way (flag never restores springs if the user toggles the OS setting mid-session). Tape exists but no app records unless wired.

### FM-MACHINE — SHIP as a library, GAP as a productized editor
Only **bracket** calls `dispatch` / `reduceState`. Lamp and ring are target-only.  
Card is honest if sold with BRACKET or a custom editor. Do not imply lamp/ring have Esc/export states.

### FM-CHROME — SHIP / small GAP
Slider now has a numeric twin (B6). Canvas posters when WebGL is missing (B5). Orbit mutex only on bracket.  
Hover GPU lift still absent (card already says so). Demo CSS is not a design system (card already says so).

### FM-TESSELLATE — SHIP / hitch risk
Worker + main fallback + ASCII STL + test.  
B14 now feeds the **same** tessellator into the viewport. Rebuild is on the animation thread when params change — a hitch on large pitch. Card should say “rebuild on dirty key, main thread until queued.”

### FM-TOOLPATH — SHIP as preview
Used by bracket sim. Path is parsed from posted NC. Preview post, not a CAM kernel.

### FM-GESTURE — GAP
`gestures.ts` exists. **No app imports it.** Drag velocity / pinch are not wired to channels. Selling FM-GESTURE today is selling a lookup table. Wire or stop listing it as attachable.

### FM-BRACKET — SHIP after B14, still not manufacturable
Fixed topology, state machine, STL download, tessellated viewport.  
Still: 4 holes max, grid fillet, no fasteners, volume is an estimate. Card’s “scaled box” line is now stale — update to “tessellated plate, same as export.”

### FM-LAMP — SHIP as a demo PDP
CORE+CHROME only. No cart, no HDRI, primitive meshes. Card honest if we keep “do not claim fulfillment.”

### FM-RING — SHIP as a module, GAP as jewelry
Torus + circumference estimate. Card already warns. Do not let atelier hero photography outrun that sentence.

### FM-STUDIO — SHIP as a pack, not as a platform
Umbrella is documentation + three apps. No auth, no CI lockfile, no published npm package.

## Scoreboard

| SKU | Card vs code | Block sale? |
|---|---|---|
| CORE | SHIP | No |
| MACHINE | SHIP if scoped to editors | No, if scoped |
| CHROME | SHIP | No |
| TESSELLATE | SHIP | No, with “preview” spoken |
| TOOLPATH | SHIP as preview post | No, say preview post |
| GESTURE | GAP | **Yes, until wired** |
| BRACKET | SHIP | No, with “not metal” |
| LAMP | SHIP | No |
| RING | SHIP | No, with “not iJewel” |
| STUDIO | SHIP | No, as source pack |

## P1 just done — rationale

| ID | What | Why now | Intended result |
|---|---|---|---|
| B4 tape | `src/engine/tape.ts` | Sales demo and CI need a replayable input | Same tape → nearby pose |
| B5 poster | `hasWebGL` + poster div | Shop tablets fail WebGL; white canvas kills trust | Editable sliders, no hole |
| B6 number field | `ParamSlider` number input | Keyboard users and exact mm | WCAG-ish twin |
| B14 tessellated viewport | BracketMesh uses `tessellatePlate` | Visual ≠ STL was an audit lie | Screen matches export topology |
| B12 | Storyboard only | Film needs a running app + lockfile | Do not fake the proof |

## Next after this (unchanged P2/P3 + new)

1. Wire FM-GESTURE or pull it from the catalog.
2. `package-lock.json` + `npm ci` in Action.
3. Queue tessellation off rAF (hitch).
4. Restore path when reduced-motion turns off.
5. B8/B9/B10 tandem (kernel, cart, mandrel).

## 2026-09-14 addendum — G-code vote
User directed G-code in. Reveal is now parsed from the same text you can download.
Still not: arcs, cutter comp, multi-tool, stock sim, vendor posts.


## Final sweep (2026-09-14)

Improvements this pass: package author/repo; removed missing bench script; PITCH/catalog G-code language; BUILD_ORDER, BUILD_PROMPTS, IMAGE_PROMPTS; sales hardening list.

Gaps that remain by design: lockfile, proof film, worker mesh queue, hover shader, vendor posts, stock, cart, kernel, mandrel, GitHub publish. Tracked in BUILD_ORDER.md.

Errors spotted and left: Word doc 386+ is still a chat transcript; original spec snippets in §§1–10 are historical; tessellate still sync on dirty key; `npm test` not executed in this sandbox this pass.
