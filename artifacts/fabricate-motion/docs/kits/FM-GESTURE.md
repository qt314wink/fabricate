# FM-GESTURE — pointer and touch map

**SKU:** FM-GESTURE  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/interact/gestures.ts`

## Relies on
FM-CORE `inertia.dragGain`, `dampingPerSecond`.

## Create in tandem
- Pointer capture helper
- Keyboard rotate / nudge
- Mobile reduced-gain profile actually applied in the app store
- Conflict rule with OrbitControls (not coded)

## Status
Wired on the bracket mesh: drag → rotate impulse, tap → highlight, pinch → width scale.

## Application
pinch→scale, swipe→rotate, tap→highlight; drag velocity for inertia.

## Novel architecture
None. It is the spec table with units.

## Notable examples
drei PresentationControls; browser Pointer Events; iOS sheet physics.

## Differentiation
Tiny. Buy with CORE so drag gain matches inertia k.

## Features / tradeoffs
+ One map for mobile policy  
− No recognizer graph  
− Desktop hover lift shader not included

## Constraints
Hover is desktop-only (`pointer: fine`). Do not add a second aesthetic
on mobile.

## Performance
Event handlers only. Velocity math is trivial.

## Buyer intrigue
The mobile *subtraction* policy from the spec, packaged.

## Use-cases
Any canvas editor that must feel like mass.
