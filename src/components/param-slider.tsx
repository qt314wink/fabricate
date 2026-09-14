import { clamp } from "@/engine/solver";

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
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3;
  const shown = Number(value.toFixed(decimals));

  return (
    <label className="grid gap-1.5">
      <span className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="flex items-center gap-1 font-mono text-xs tabular-nums text-fg">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={shown}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isFinite(n)) return;
              onTarget(clamp(n, min, max));
            }}
            aria-label={`${label} numeric`}
            className="h-8 w-20 rounded-[var(--radius-sm)] border border-border bg-elevated px-2 text-right text-fg"
          />
          <em className="not-italic text-subtle">{unit ?? ""}</em>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onTarget(Number((e.target as HTMLInputElement).value))}
        className="h-11 w-full accent-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      />
    </label>
  );
}
