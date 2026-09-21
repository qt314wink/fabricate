# FM-CORE — motion contract

**SKU:** FM-CORE  
**Author:** Jennipher Troup (`melodicbloom`)  
**License:** commercial kit grant + attribution

## What you buy
The Δt engine. Tokens, clock, solver, channels, ChannelTable.

## Files in this kit
- `src/engine/tokens.ts`
- `src/engine/clock.ts`
- `src/engine/solver.ts`
- `src/engine/channels.ts`
- `src/engine/table.ts`
- `src/engine/index.ts`
- `tests/solver.test.ts`
- `tests/table.test.ts`

## Relies on (in zip)
Nothing above the engine folder except TypeScript.

## Create in tandem
- Design-token export to Figma / CSS variables
- CI RAF p95 harness (not only unit dt tests)
- Reduced-motion wiring into every `ChannelDef`
- Timeline recorder if you need deterministic replay for QA

## Application
Any UI where a number change must *become* the object, not replace it:
sliders on a part, a configurator dimension, a live preview.

## Novel architecture (honest)
Not a new integrator. The scarce piece is the **contract**: one clock,
named springs, interrupt-by-retarget, 30/60 fps tests as acceptance.
Most configurators snap. Most kernels rebuild and pop. CORE forbids both.

## Notable examples in the wild
Tylko (parametric furniture that *is* the order), Onshape feature rebuilds
(correct solids, often a visual pop), generic R3F part-swap templates.

## Differentiation
CORE does not render and does not tessellate. It only produces display
numbers. Buyers who already have Three or a kernel attach those as matter.

## Distinguishing features / tradeoffs
+ Deterministic follow/spring/inertia  
+ Shared table across verticals  
− No visual default look  
− Springs are semi-implicit Euler, not RK4  
− Hitch clamp skips motion after a 50 ms stall (required, visible)

## Constraints
Do not call `v *= 0.92` per frame. Do not `setTimeout` a highlight.
Do not let GSAP write a property CORE owns.

## Performance / result
Follow 0→10 after 1 s matches at 30 and 60 fps within 0.05 (tested).
Inertia `v0=10` after 1 s < 0.1. Frame work is O(channels), typically < 20.

## Buyer intrigue
“Your sliders stop murdering the object.” Demo: drag a dimension at 30 fps
and 60 fps; the pose agrees.

## Use-cases
Parametric PDP, fabricate preview, instrument panels, any live spec UI.
