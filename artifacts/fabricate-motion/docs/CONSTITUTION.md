# Fabricate Motion — constitution (accurate brief)

**Author:** Jennipher Troup (`melodicbloom`)  
**Not the org:** melodyfire is a separate platform/repo.  
**Credit:** Motion architecture by Jennipher Troup (melodicbloom)

## What this is

A motion contract for parametric objects: one clock, named channels, interrupt-by-retarget, chrome ≠ matter, tests that fail frame-coupled motion. Three proof apps (plate cell, lamp PDP, ring shank) share one `ChannelTable`.

It is not a CAD kernel, not verified CAM, not a jewelry engine, not Shopify.

## What is true in code (2026-09-14)

- Δt solvers replace spec `* 0.1`, `v *= 0.92`, `progress += 0.01`.
- Bracket, lamp, ring use the same table.
- Bracket: evented UI machine, orbit mutex while manipulating, tessellated viewport, worker STL, **preview NC** (`G21 G90 G17`, G1 contour, **G2 hole circles**, parse → reveal → download).
- Gestures on the plate: drag → impulse, tap → highlight, pinch → width.
- Desktop hover is **mesh `position.y` lift**, not a vertex shader; off on coarse pointer and reduced-motion.
- Tessellation is **requested async** (`tessellateMesh`); stale worker ids drop. Path sampling still runs in `useFrame` while simulating.
- Labels publish at 10 Hz; meshes read the table.
- Reduced-motion can apply and restore.
- WebGL miss → poster, sliders stay live.
- Tape helper exists; apps do not auto-record.
- `package-lock.json` and a timed GPU proof film are **not** in this sandbox.

## What must stay spoken

Preview STL/NC is a draft. Volume is an estimate. Ring size is circumference/π. Four hole slots are structural. Tylko owns parametric-as-order in furniture; iJewel owns jewelry look. We sell the spine.

## Novelty (honest)

Not a new category. Defensible bit: packaged discipline + tests + one table across verticals + refusal to label drafts as metal.
