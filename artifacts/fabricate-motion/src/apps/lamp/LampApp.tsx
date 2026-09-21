import { MotionCanvas } from "../../ui/MotionCanvas";
import { ParamSlider } from "../../ui/ParamSlider";
import { useLampStore, LAMP_LIMITS } from "./store";
import { stepLamp } from "./step";
import { LampMesh } from "./LampMesh";

/**
 * Out-of-the-box application: D2C lamp configurator.
 * Same solver, tokens, sliders, and canvas. No CAM, no state machine required.
 * Shows the kit is a product motion layer, not only a fabricate editor.
 */
export function LampApp() {
  const targets = useLampStore((s) => s.targets);
  const setParam = useLampStore((s) => s.setParam);

  return (
    <div className="fm-app fm-lamp">
      <header>
        <strong>Lumen · custom lamp</strong>
        <span>storefront configurator</span>
      </header>
      <div className="fm-stage">
        <MotionCanvas step={stepLamp}>
          <gridHelper args={[80, 8, "#2a241c", "#1a1713"]} />
          <LampMesh />
        </MotionCanvas>
      </div>
      <aside>
        <ParamSlider label="height" unit="mm" value={targets.height} {...LAMP_LIMITS.height} onTarget={(n) => setParam("height", n)} />
        <ParamSlider label="shade" unit="mm" value={targets.shadeRadius} {...LAMP_LIMITS.shadeRadius} onTarget={(n) => setParam("shadeRadius", n)} />
        <ParamSlider label="neck bend" unit="°" value={targets.neckBend} {...LAMP_LIMITS.neckBend} onTarget={(n) => setParam("neckBend", n)} />
        <ParamSlider label="temperature" unit="K" value={targets.temperature} {...LAMP_LIMITS.temperature} step={50} onTarget={(n) => setParam("temperature", n)} />
        <p className="fm-meta">Neck uses spring token; other dims follow τ=158ms. Add-to-cart is a separate chrome action.</p>
      </aside>
    </div>
  );
}
