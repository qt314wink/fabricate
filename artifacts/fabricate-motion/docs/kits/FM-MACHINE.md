# FM-MACHINE — evented UI states

**SKU:** FM-MACHINE  
**Author:** Jennipher Troup (`melodicbloom`)

## What you buy
The five-state machine the spec sketched without events.

## Files
- `src/engine/machine.ts`

## Relies on
FM-CORE only for timing policy (transition ≤ 300 ms is a *caller* duty).
The reducer is pure.

## Create in tandem
- Undo / history
- Analytics `ui.transition` events
- Focus management per state
- Error state (not modeled)

## Application
Editors with modes: idle, editing, manipulating, simulating, exporting.

## Novel architecture
Completing a mood-board state list with an event column and CANCEL.
Not a new statechart library.

## Notable examples
CAD command managers; game UI FSMs; XState kits. Those are heavier.

## Differentiation
Tiny, typed, no runtime. You own rendering of landing / sheet / kill.

## Features / tradeoffs
+ Exhaustive-enough table for the spec  
− No nested states, no guards beyond “edge exists”  
− Motion flavor (`landing|mode|sheet|kill`) is a hint, not a player

## Constraints
Do not transition without an event. Do not animate during an unknown edge.

## Performance
O(1) lookup. Not on the frame budget.

## Buyer intrigue
“Esc always means something.” Missing in the original spec.

## Use-cases
Fabricate workspace, any multimodal tool.
