import { MotionCanvas } from "../../ui/MotionCanvas";
import { ParamSlider } from "../../ui/ParamSlider";
import { RING_LIMITS, usSizeFromRadius } from "../../geometry/ring";
import { useRingStore } from "./store";
import { stepRing } from "./step";
import { RingMesh } from "./RingMesh";

/**
 * Third app on the identical channel table: jewelry shank workshop.
 * Parametric bore / width / wall / twist / metal / polish.
 */
export function RingApp() {
  const targets = useRingStore((s) => s.targets);
  const display = useRingStore((s) => s.display);
  const setParam = useRingStore((s) => s.setParam);
  const size = usSizeFromRadius(display.innerRadius);

  return (
    <div className="fm-app fm-ring">
      <header>
        <strong>Atelier · shank</strong>
        <span>US ~ {size.toFixed(1)}</span>
      </header>
      <div className="fm-stage">
        <MotionCanvas step={stepRing}>
          <gridHelper args={[80, 8, "#2a241c", "#1a1713"]} />
          <RingMesh />
        </MotionCanvas>
      </div>
      <aside>
        <ParamSlider label="inner radius" unit="mm" value={targets.innerRadius} {...RING_LIMITS.innerRadius} step={0.05} onTarget={(n) => setParam("innerRadius", n)} />
        <ParamSlider label="shank width" unit="mm" value={targets.shankWidth} {...RING_LIMITS.shankWidth} onTarget={(n) => setParam("shankWidth", n)} />
        <ParamSlider label="wall" unit="mm" value={targets.shankThickness} {...RING_LIMITS.shankThickness} onTarget={(n) => setParam("shankThickness", n)} />
        <ParamSlider label="twist" unit="°" value={targets.twist} {...RING_LIMITS.twist} onTarget={(n) => setParam("twist", n)} />
        <ParamSlider label="metal hue" value={targets.metalHue} {...RING_LIMITS.metalHue} step={0.01} onTarget={(n) => setParam("metalHue", n)} />
        <ParamSlider label="polish" value={targets.polish} {...RING_LIMITS.polish} step={0.01} onTarget={(n) => setParam("polish", n)} />
        <p className="fm-meta">Twist uses spring.snap. Size is a circumference estimate, not a mandrel measurement.</p>
      </aside>
    </div>
  );
}
