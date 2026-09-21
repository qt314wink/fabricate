import { budgets } from "../engine/tokens";

/** DOM control only. Writes a target; the solver follows. Never snaps the mesh. */
export function ParamSlider({
  label,
  unit,
  value,
  min,
  max,
  step = 0.1,
  onTarget,
}: {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onTarget: (n: number) => void;
}) {
  return (
    <label className="fm-slider">
      <span>
        {label}
        <span className="fm-slider-readout">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number(value.toFixed(4))}
            onChange={(e) => onTarget(Number((e.target as HTMLInputElement).value))}
            aria-label={`${label} numeric`}
          />
          <em>{unit ?? ""}</em>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onTarget(Number((e.target as HTMLInputElement).value))}
        style={{ accentColor: "#7cdb7a" }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <small>ack ≤ {budgets.ackMs}ms · mesh follows, does not snap</small>
    </label>
  );
}
