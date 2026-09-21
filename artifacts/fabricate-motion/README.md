# Fabricate Motion

**Author:** Jennipher Troup  
**GitHub org:** [melodicbloom](https://github.com/melodicbloom)  
**License:** see `LICENSE` — evaluation permitted; commercial kit licenses sold separately.

A deterministic motion architecture for *parametric objects that must not pop*.
Geometry follows targets on one clock. Chrome (sheets, sliders) never writes
the mesh. Three demo apps share one `ChannelTable`.

This is not a CAD kernel and not a photoreal jewelry engine. It is a
**bounded motion contract** you can drop under a fabricate UI, a storefront
configurator, or a shank workshop.

## Start

```bash
npm i
npm test
npm run dev
```

Apps in the demo shell: **Bracket cell** · **Lamp storefront** · **Ring shank**.

## Documentation map

| File | What it is |
|---|---|
| `LICENSE` | Copyright Jennipher Troup / melodicbloom; eval vs commercial |
| `CHANGELOG.md` | Dated revision log |
| `docs/DIFFS.md` | File-by-file diffs from this design chat |
| `docs/FILE_INDEX.md` | Every file: role, depends on, created with |
| `docs/ARCHITECTURE.md` | Pipeline, tokens, ownership rules |
| `docs/kits/00-kit-catalog.md` | Sale SKUs and what you buy |
| `docs/kits/*.md` | One reusable unit per file |
| `docs/PITCH.md` | Who to walk to |
| `docs/SKU_AUDIT.md` | Card vs code |
| `docs/BUILD_ORDER.md` | Work this machine cannot finish |
| `docs/BUILD_PROMPTS.md` | Paste-ready agent prompts |
| `docs/IMAGE_PROMPTS.md` | Hero / diagram / ad prompts |
| `docs/CONSTITUTION.md` | Accurate one-brief |
| `docs/HANDOFF.md` | Commands, tests, competitors, gates |

## Bounded kits for sale

See `docs/kits/00-kit-catalog.md`.

- **FM-CORE** — clock, tokens, solver, channels, table
- **FM-MACHINE** — evented UI state
- **FM-CHROME** — canvas, slider, sheet, scrim
- **FM-TESSELLATE** — 2.5D plate + worker STL
- **FM-TOOLPATH** — time-based path reveal
- **FM-GESTURE** — pointer / touch map
- **FM-BRACKET** · **FM-LAMP** · **FM-RING** — vertical apps
- **FM-STUDIO** — the whole studio pack

## Sales and stills

`docs/SALES_AND_CREATIVE.md` — personas, prices, two-scenario stills in `docs/creative/`, next build order with QA.

## Credit

Architecture, specification critique, and implementation direction:
**Jennipher Troup** (`melodicbloom`).

Required attribution in licensed products:

```
Motion architecture by Jennipher Troup (melodicbloom)
```
