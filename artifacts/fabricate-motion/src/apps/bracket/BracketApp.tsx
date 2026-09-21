import { useEffect, useState } from "react";
import { MotionCanvas } from "../../ui/MotionCanvas";
import { ParamSlider } from "../../ui/ParamSlider";
import { ExportSheet } from "../../ui/ExportSheet";
import { ModeScrim } from "../../ui/ModeScrim";
import { BRACKET_LIMITS } from "../../geometry/bracket";
import { estimateVolumeMm3 } from "../../geometry/bracket";
import { useBracketStore } from "./store";
import { stepBracket } from "./step";
import { BracketMesh } from "./BracketMesh";
import { exportPlateStl, downloadText } from "../../geometry/exportStl";
import { postBracketGcode } from "../../geometry/gcode";
import { holeCenters, holeRadiusAt, MAX_HOLES } from "../../geometry/bracket";

/**
 * High-value use case: live parametric hardware / jig preview.
 * Shop or product team adjusts mm params; mesh morphs; sim draws a toolpath;
 * export sheet stages download. No remesh on hole count.
 */
export function BracketApp() {
  const ui = useBracketStore((s) => s.ui);
  const targets = useBracketStore((s) => s.targets);
  const display = useBracketStore((s) => s.display);
  const setParam = useBracketStore((s) => s.setParam);
  const dispatch = useBracketStore((s) => s.dispatch);
  const [exportMeta, setExportMeta] = useState<string>("");

  useEffect(() => {
    dispatch({ type: "ENTER_WORKSPACE" });
  }, [dispatch]);

  const vol = estimateVolumeMm3(display);

  return (
    <div className="fm-app">
      <header>
        <strong>Fabricate · Bracket cell</strong>
        <span>{ui}</span>
      </header>
      <div className="fm-stage">
        <MotionCanvas step={stepBracket} orbitEnabled={ui !== "manipulating"}>
          <gridHelper args={[200, 20, "#1c232c", "#161b22"]} />
          <BracketMesh />
        </MotionCanvas>
        <ModeScrim simulating={ui === "simulating"} />
      </div>
      <aside>
        {(["width", "height", "thickness", "fillet", "holeCount", "holeRadius"] as const).map((k) => (
          <ParamSlider
            key={k}
            label={k}
            unit={k === "holeCount" ? "" : "mm"}
            value={targets[k]}
            min={BRACKET_LIMITS[k].min}
            max={BRACKET_LIMITS[k].max}
            step={k === "holeCount" ? 1 : 0.1}
            onTarget={(n) => setParam(k, n)}
          />
        ))}
        <p className="fm-meta">est. volume {vol.toFixed(0)} mm³ · topology fixed (4 hole slots)</p>
        <div className="fm-actions">
          <button onClick={() => dispatch({ type: ui === "simulating" ? "EXIT_SIM" : "RUN_SIM" })}>
            {ui === "simulating" ? "Exit sim" : "Simulate toolpath"}
          </button>
          <button onClick={() => dispatch({ type: "OPEN_EXPORT" })}>Export</button>
        </div>
      </aside>
      <ExportSheet open={ui === "exporting"} onClose={() => dispatch({ type: "CLOSE_EXPORT" })}>
        <h2>Export bracket</h2>
        <p>Worker tessellates a 2.5D plate with collapsed holes. Not a BREP kernel.</p>
        <p className="fm-meta">{exportMeta || "Ready to export current display pose."}</p>
        <button
          onClick={async () => {
            const d = useBracketStore.getState().display;
            const holes = Array.from({ length: MAX_HOLES }, (_, i) => {
              const [x, y] = holeCenters(d as never)[i];
              return { x, y, r: holeRadiusAt(d as never, i) };
            });
            setExportMeta("tessellating…");
            try {
              const res = await exportPlateStl(
                { width: d.width, height: d.height, thickness: d.thickness, fillet: d.fillet, holes },
                "bracket",
              );
              downloadText("bracket.stl", res.stl);
              setExportMeta(`${res.triangles} tris · ${res.ms.toFixed(0)}ms · ${res.via}`);
            } catch (e) {
              setExportMeta(String(e));
            }
          }}
        >
          Download STL
        </button>
        <button
          onClick={() => {
            const d = useBracketStore.getState().display;
            const nc = postBracketGcode(d as never);
            downloadText("bracket.nc", nc);
            setExportMeta(`G-code ${nc.split("\n").length} lines · GRBL-ish preview post`);
          }}
        >
          Download G-code
        </button>
        <button onClick={() => dispatch({ type: "CLOSE_EXPORT" })}>Done</button>
      </ExportSheet>
    </div>
  );
}
