# FM-LAMP — storefront lamp

**SKU:** FM-LAMP  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/apps/lamp/store.ts`
- `src/apps/lamp/step.ts`
- `src/apps/lamp/LampMesh.tsx`
- `src/apps/lamp/LampApp.tsx`

## Relies on
FM-CORE, FM-CHROME.

## Create in tandem
- Cart / Shopify line properties
- SKU / inventory matrix
- HDRI studio lighting
- GLB shade with real textiles
- Pricing rules
- AR poster

## Application
D2C dimensioned lamp: height, shade, neck (spring), color temperature.

## Novel architecture
Proof that CORE is a product layer, not a CAD feature. Neck mass is a
spring token; other dims follow.

## Notable examples
Tylko; Nike By You (materials, not dimensions); agency R3F PDPs ($80k–$250k
wraps).

## Differentiation
Morph-not-snap on dimensions. Tylko already owns this in furniture;
this kit is the motion spine without commerce.

## Features / tradeoffs
+ Small surface area  
− No BOM, no add-to-cart  
− Primitive meshes, not a photographed product

## Constraints
Do not claim photoreal. Do not claim fulfillment.

## Performance
Trivial scene graph. CORE budget dominates.

## Buyer intrigue
A PDP whose height slider does not *cut to another GLB*.

## Use-cases
Lighting brands, furniture pilots, sales demos.
