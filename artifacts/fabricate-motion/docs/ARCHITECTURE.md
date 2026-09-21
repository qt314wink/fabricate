# Architecture

**Author:** Jennipher Troup (`melodicbloom`)  
**Date:** 2026-09-14

```
Input adapters (slider / pointer / touch / keyboard)
        ↓ events + numeric targets
UI state machine (idle|editing|manipulating|simulating|exporting)
        ↓ targets
ChannelTable (follow | spring | inertia | hold)  ← single clock, Δt
        ↓ display numbers
Geometry (fixed-topology params, optional tessellator)
        ↓
R3F / Three (matter)     Framer / DOM (chrome)
```

## Ownership

| Property class | Writer | Illegal writer |
|---|---|---|
| Mesh pose, param morph, toolpath progress, emissive | rAF ChannelTable | GSAP, CSS, setTimeout |
| Bottom sheet Y, button pulse, scrim opacity | Framer / CSS tokens | ChannelTable |
| Camera chrome | OrbitControls *or* a channel, never both | — |

## Tokens (units)

- Time: ms (`motionMs`) or seconds (`tau`, `dampingPerSecond`)
- Spring: tension / friction / mass as in the spec, named `standard` and `snap`
- Inertia: `k = -60 * ln(0.92) ≈ 4.997 s⁻¹` replaces `v *= 0.92` per frame
- Follow τ: 0.158 s ≡ spec lerp 0.1 at 60 fps

## Interrupt

Replace **target**. Never reset **value**. That is P1 + P2.

## What this is not

OpenCascade, Manifold, iJewel refraction, Tylko commerce, CAM posts.
Those are tandem systems listed on each kit card.
