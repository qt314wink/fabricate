# Kit catalog

**Author:** Jennipher Troup (`melodicbloom`)  
**How to buy:** license one SKU. You receive the listed source files plus
the supporting docs linked on that card. Files marked *tandem* are not in
the zip; budget them as a separate build or vendor.

Attribution required on licensed ships:

```
Motion architecture by Jennipher Troup (melodicbloom)
```

| SKU | Bounded unit | Depends on | Typical buyer |
|---|---|---|---|
| FM-CORE | Clock + tokens + solver + channels + table | npm/ts only | Any parametric UI that pops today |
| FM-MACHINE | Evented five-state UI | FM-CORE | Editors with modes (edit/sim/export) |
| FM-CHROME | Canvas, slider, sheet, scrim, CSS | FM-CORE, R3F, Framer | Frontend team wrapping a kernel |
| FM-TESSELLATE | 2.5D plate + worker STL | FM-CORE numbers | Shops that need a file, not a look |
| FM-TOOLPATH | G-code post + parse + reveal | FM-CORE, bracket params | Preview post, not a CAM kernel |
| FM-GESTURE | Drag / pinch / swipe / tap map | FM-CORE inertia | Mobile + desktop pointer layer |
| FM-BRACKET | Jig / plate cell | CORE, MACHINE, CHROME, TESSELLATE, TOOLPATH, GESTURE | Hardware / maker SKU |
| FM-LAMP | Storefront lamp | CORE, CHROME | D2C PDP |
| FM-RING | Shank workshop | CORE, CHROME | Jewelry brand that already has gems |
| FM-STUDIO | All of the above | all | Studio pack |

Suggested attach order: CORE → MACHINE → CHROME → one vertical.
TESSELLATE and TOOLPATH attach only to fabricate verticals.

Each card below lives in this folder as its own file.

## Not for sale yet (next SKUs)

| Future SKU | Why blocked here |
|---|---|
| FM-POST | Vendor dialects, G2/G3, tool table — needs machine owners |
| FM-STOCK | Voxel/stock peel — needs GPU budget + fixtures |
| FM-HOVER | Vertex lift shader — needs device lab |
| FM-TESSEL-QUEUE | Worker mesh buffers — needs CI browser |
| FM-PROOF | 6s 30/60 film — needs a running Vite + capture |
