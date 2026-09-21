# FM-BRACKET — jig / plate cell

**SKU:** FM-BRACKET  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/geometry/bracket.ts`
- `src/apps/bracket/store.ts`
- `src/apps/bracket/step.ts`
- `src/apps/bracket/BracketMesh.tsx`
- `src/apps/bracket/BracketApp.tsx`

## Relies on
FM-CORE, FM-MACHINE, FM-CHROME, FM-TESSELLATE, FM-TOOLPATH, FM-GESTURE.

## Create in tandem
- Fastener library, material spec, finish
- True boolean holes (kernel)
- CAM post and feeds
- Drawing sheet / PDF
- Auth if this is a multi-user shop cell

## Application
Live parametric mounting plate. Hole count never remeshes; unused bores
collapse. Sim reveals a path. Export writes preview STL.

## Novel architecture
Topology freeze as a product rule, not a mesh trick.

## Notable examples
MakerWorld parametric brackets; jesseflorig rack generator; Toolpath.com
for the CAM side.

## Differentiation
Feel + communication first. Solids second (and honest about that).

## Features / tradeoffs
+ Object permanence while dimensions move  
+ Volume estimate as a canary, not a certificate  
− On-screen mesh now uses the same tessellator as STL (B14)
− Coarse pitch still faceted; rebuild can hitch on the animation thread

## Constraints
Fixed max four hole slots. No angle / T / Y families in this SKU.

## Performance
60 fps canvas target; export off-thread.

## Buyer intrigue
“The plate is still the plate when you add a hole.”

## Use-cases
Hardware SKUs, maker spaces, fixture shops, sales engineering.
