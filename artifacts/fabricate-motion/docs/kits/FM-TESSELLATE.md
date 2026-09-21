# FM-TESSELLATE — 2.5D plate to STL

**SKU:** FM-TESSELLATE  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/geometry/tessellate.ts`
- `src/geometry/tessellate.worker.ts`
- `src/geometry/exportStl.ts`
- `tests/tessellate.test.ts`

## Relies on
Numeric plate spec (width, height, thickness, fillet, holes). Usually
FM-CORE display numbers + `src/geometry/bracket.ts` helpers.

## Create in tandem
- Manifold or OpenCascade WASM if the file must be a production solid
- Binary STL / glTF
- Job queue + progress
- Mesh manifold test (not in repo)
- Server-side kernel for legal “manufacturable” stamps

## Application
Preview export of a prismatic plate with collapsed holes.

## Novel architecture
None as geometry science. Grid-stamp 2.5D is old. The kit value is
*off the animation thread* and honest labeling.

## Notable examples
Kelp3D export, OpenSCAD customizer, PartMode/OCCT, jesseflorig brackets.

## Differentiation
Does not pretend to be BREP. Reports `triangles · ms · worker|main`.

## Features / tradeoffs
+ Worker fallback to main  
+ ASCII STL simple to debug  
− Fillet is 2D round-rect occupancy, not a 3D BREP fillet  
− Grid pitch trades fidelity for time  
− Not guaranteed manifold

## Constraints
Do not cut metal from this file without a kernel check.

## Performance
Typical demo plate: low thousands of tris, tens of ms on main or worker.
Does not run inside rAF.

## Buyer intrigue
“Download something tonight” without standing up OCCT.

## Use-cases
Jig shops, classroom fab, internal review packets.
