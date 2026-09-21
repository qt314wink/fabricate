# FM-CHROME — DOM / canvas shell

**SKU:** FM-CHROME  
**Author:** Jennipher Troup (`melodicbloom`)

## Files
- `src/ui/MotionCanvas.tsx`
- `src/ui/ParamSlider.tsx`
- `src/ui/ExportSheet.tsx`
- `src/ui/ModeScrim.tsx`
- `src/styles.css`

## Relies on
FM-CORE (`clock`, `motionMs`, `budgets`).  
npm: `react`, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`.

## Create in tandem
- WebGL capability detect + poster fallback
- Accessible number input beside each slider
- Focus trap and `aria-modal` on the sheet
- CSS variables from `tokens.ts`
- DPR / power-preference policy per device class

## Application
The visible shell: canvas owns rAF; sliders write targets; sheet is Framer;
scrim is CSS.

## Novel architecture
The split is the product. Framer may not write mesh pose. Canvas may not
own sheet Y.

## Notable examples
Agency R3F configurator shells; Framer site templates; drei `<Canvas>`.

## Differentiation
Chrome is sold as a *boundary*, not as a look-and-feel pack.

## Features / tradeoffs
+ Sheet drag-to-dismiss matches spec velocity snap  
+ Slider copy states the ack budget  
− Demo CSS is not a design system  
− OrbitControls enabled by default (conflicts with mesh inertia unless gated)

## Constraints
No `setState` on pointermove inside the canvas tree.

## Performance
Overlays target ≥30 fps. Canvas 60. Sheet is DOM.

## Buyer intrigue
“One writer per property” as a purchasable rule, not a Slack argument.

## Use-cases
Any CORE attach: PDP, workshop, jig cell.
