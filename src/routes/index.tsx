import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ParamSlider } from "@/components/param-slider";
import { useBracketStore } from "@/apps/bracket/store";
import { useLampStore, LAMP_LIMITS } from "@/apps/lamp/store";
import { useRingStore } from "@/apps/ring/store";
import {
  BRACKET_LIMITS,
  estimateVolumeMm3,
  holeCenters,
  holeRadiusAt,
  MAX_HOLES,
  type BracketParams,
} from "@/geometry/bracket";
import { RING_LIMITS, usSizeFromBore } from "@/geometry/ring";
import { downloadText, exportPlateStl } from "@/geometry/exportStl";
import { postBracketGcode } from "@/geometry/gcode";
import { budgets } from "@/engine/tokens";
import { SceneStage } from "@/components/scene-stage";

export const Route = createFileRoute("/")({
  component: Studio,
});

type Cell = "bracket" | "lamp" | "ring";

const CELLS: { id: Cell; label: string; hint: string }[] = [
  { id: "bracket", label: "Plate cell", hint: "Fixed topology. Four hole slots. Holes collapse, they do not remesh." },
  { id: "lamp", label: "Lamp", hint: "The neck is a spring. Height is not another model." },
  { id: "ring", label: "Shank", hint: "US size is circumference / π. Not a mandrel." },
];

function Studio() {
  const [cell, setCell] = useState<Cell>("bracket");
  const ui = useBracketStore((s) => s.ui);
  const dispatch = useBracketStore((s) => s.dispatch);
  const hint = CELLS.find((c) => c.id === cell)?.hint ?? "";

  useEffect(() => {
    dispatch({ type: "ENTER_WORKSPACE" });
  }, [dispatch]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-4 md:px-6">
        <div>
          <p className="font-mono text-micro tracking-label text-subtle uppercase">Melodicbloom</p>
          <h1 className="text-xl font-medium tracking-tight text-balance">Fabricate</h1>
        </div>
        <p className="max-w-md text-sm text-pretty text-muted">{hint}</p>
      </header>

      <nav className="flex flex-wrap items-center gap-1 border-b border-border px-4 py-2 md:px-6" aria-label="Cells">
        <div className="flex rounded-[var(--radius-md)] bg-elevated p-1">
          {CELLS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCell(c.id)}
              className={`min-h-11 rounded-[var(--radius-sm)] px-4 text-sm ${
                cell === c.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {cell === "bracket" && (
          <span className="ml-auto self-center font-mono text-micro text-subtle">{ui}</span>
        )}
      </nav>

      {cell === "bracket" && <BracketCell />}
      {cell === "lamp" && <LampCell />}
      {cell === "ring" && <RingCell />}

      <footer className="border-t border-border px-4 py-4 text-micro text-subtle md:px-6">
        Jennipher Troup · melodicbloom · one clock · preview, not a mill
      </footer>
    </div>
  );
}

function BracketCell() {
  const ui = useBracketStore((s) => s.ui);
  const targets = useBracketStore((s) => s.targets);
  const display = useBracketStore((s) => s.display);
  const setParam = useBracketStore((s) => s.setParam);
  const dispatch = useBracketStore((s) => s.dispatch);
  const [meta, setMeta] = useState("");
  const vol = estimateVolumeMm3(display);

  return (
    <div className="grid lg:grid-cols-[1fr_20rem]">
      <div className="relative">
        <SceneStage cell="bracket" orbitEnabled={ui !== "manipulating"} />
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle">
          {display.width.toFixed(1)} × {display.height.toFixed(1)} × {display.thickness.toFixed(1)} mm
        </p>
      </div>
      <aside className="flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l">
        {(
          [
            ["width", "mm"],
            ["height", "mm"],
            ["thickness", "mm"],
            ["fillet", "mm"],
            ["holeCount", ""],
            ["holeRadius", "mm"],
          ] as const
        ).map(([k, unit]) => (
          <ParamSlider
            key={k}
            label={k}
            unit={unit}
            value={targets[k]}
            {...BRACKET_LIMITS[k]}
            step={k === "holeCount" ? 1 : 0.1}
            onTarget={(n) => setParam(k, n)}
          />
        ))}
        <p className="font-mono text-micro text-subtle">
          est. {vol.toFixed(0)} mm³ · four hole slots · ack ≤ {budgets.ackMs} ms
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={() => dispatch({ type: ui === "simulating" ? "EXIT_SIM" : "RUN_SIM" })}
          >
            {ui === "simulating" ? "Exit path" : "Simulate path"}
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: "OPEN_EXPORT" })}>
            Export draft
          </Button>
        </div>
      </aside>
      {ui === "exporting" && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-bg/70 p-3 md:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-xl">
            <h2 className="text-base font-medium">Draft files</h2>
            <p className="mt-2 text-sm text-pretty text-muted">
              Same tessellator as the viewport. NC is a GRBL-ish preview post, not a mill warranty.
            </p>
            <p className="mt-2 font-mono text-micro text-subtle">{meta || "Ready."}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={async () => {
                  const d = useBracketStore.getState().display;
                  const holes = Array.from({ length: MAX_HOLES }, (_, i) => {
                    const [x, y] = holeCenters(d as BracketParams)[i];
                    return { x, y, r: holeRadiusAt(d as BracketParams, i) };
                  });
                  setMeta("tessellating…");
                  try {
                    const res = await exportPlateStl(
                      {
                        width: d.width,
                        height: d.height,
                        thickness: d.thickness,
                        fillet: d.fillet,
                        holes,
                      },
                      "bracket",
                    );
                    downloadText("bracket.stl", res.stl);
                    setMeta(`${res.triangles} tris · ${res.ms.toFixed(0)}ms · ${res.via}`);
                  } catch (e) {
                    setMeta(String(e));
                  }
                }}
              >
                Download STL
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  const d = useBracketStore.getState().display;
                  const nc = postBracketGcode(d as BracketParams);
                  downloadText("bracket.nc", nc);
                  setMeta(`G-code ${nc.split("\n").length} lines · preview post`);
                }}
              >
                Download G-code
              </Button>
              <Button variant="ghost" onClick={() => dispatch({ type: "CLOSE_EXPORT" })}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LampCell() {
  const targets = useLampStore((s) => s.targets);
  const display = useLampStore((s) => s.display);
  const setParam = useLampStore((s) => s.setParam);
  return (
    <div className="grid lg:grid-cols-[1fr_20rem]">
      <div className="relative">
        <SceneStage cell="lamp" />
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle">
          {display.height.toFixed(0)} mm · {display.temperature.toFixed(0)} K
        </p>
      </div>
      <aside className="flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l">
        <ParamSlider label="height" unit="mm" value={targets.height} {...LAMP_LIMITS.height} onTarget={(n) => setParam("height", n)} />
        <ParamSlider label="shade" unit="mm" value={targets.shadeRadius} {...LAMP_LIMITS.shadeRadius} onTarget={(n) => setParam("shadeRadius", n)} />
        <ParamSlider label="neck bend" unit="°" value={targets.neckBend} {...LAMP_LIMITS.neckBend} onTarget={(n) => setParam("neckBend", n)} />
        <ParamSlider
          label="temperature"
          unit="K"
          value={targets.temperature}
          {...LAMP_LIMITS.temperature}
          step={50}
          onTarget={(n) => setParam("temperature", n)}
        />
        <p className="text-sm text-muted">Neck is a spring. Height is not another model.</p>
      </aside>
    </div>
  );
}

function RingCell() {
  const targets = useRingStore((s) => s.targets);
  const display = useRingStore((s) => s.display);
  const setParam = useRingStore((s) => s.setParam);
  const size = usSizeFromBore(display.innerRadius);
  return (
    <div className="grid lg:grid-cols-[1fr_20rem]">
      <div className="relative">
        <SceneStage cell="ring" />
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle">
          US size ≈ {size.toFixed(1)}
        </p>
      </div>
      <aside className="flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l">
        <ParamSlider label="bore" unit="mm" value={targets.innerRadius} {...RING_LIMITS.innerRadius} step={0.05} onTarget={(n) => setParam("innerRadius", n)} />
        <ParamSlider label="width" unit="mm" value={targets.shankWidth} {...RING_LIMITS.shankWidth} onTarget={(n) => setParam("shankWidth", n)} />
        <ParamSlider label="wall" unit="mm" value={targets.shankThickness} {...RING_LIMITS.shankThickness} step={0.05} onTarget={(n) => setParam("shankThickness", n)} />
        <ParamSlider label="twist" unit="°" value={targets.twist} {...RING_LIMITS.twist} onTarget={(n) => setParam("twist", n)} />
        <ParamSlider label="hue" value={targets.metalHue} {...RING_LIMITS.metalHue} step={0.005} onTarget={(n) => setParam("metalHue", n)} />
        <ParamSlider label="polish" value={targets.polish} {...RING_LIMITS.polish} step={0.01} onTarget={(n) => setParam("polish", n)} />
        <p className="font-mono text-micro text-subtle">Circumference estimate, not a mandrel</p>
      </aside>
    </div>
  );
}
