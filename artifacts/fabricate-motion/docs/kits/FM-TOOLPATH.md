# FM-TOOLPATH — reveal, not CAM

**SKU:** FM-TOOLPATH  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/geometry/toolpath.ts`

## Relies on
A parametric outline (`bracket.ts` or equivalent) + a CORE channel
`pathProgress` with τ ≈ 1.8 s.

## Create in tandem
- Real CAM (EasyCAM, Fusion, G54.APP)
- G-code parse + stock sim
- Worker rebuild at CAM density
- Tool diameter / stepdown

## Application
Show process from **posted G-code**: `postBracketGcode` → `parseGcode` → pathProgress reveal. Export `bracket.nc`.

## Novel architecture
Replacing `progress += 0.01` per frame with a time channel. That is the
whole correction.

## Notable examples
G54.APP, projected toolpath preview (Folk Computer), machine OEM sims.

## Differentiation
Polyline theater vs material removal. Sold as communication.

## Features / tradeoffs
+ Deterministic duration  
− Feeds and rapids exist as constants (F400 / F120 / safeZ)
− No G2/G3, no tool table, no stock removal, no machine warranty

## Constraints
Do not label this G-code.

## Performance
Hundreds of points: fine on main. Thousands: worker + dirty key
(already in BracketMesh).

## Buyer intrigue
The path *draws itself* when you hit Simulate — the spec’s missing verb.

## Use-cases
Sales engineering, training, pre-CAM sanity.
