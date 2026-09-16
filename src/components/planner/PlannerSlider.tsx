"use client";

import { useState } from "react";
import { clamp } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

export function PlannerSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const safe = clamp(Number.isFinite(value) ? value : 0, min, max);
  const pct = ((safe - min) / (max - min || 1)) * 100;
  const shown = draft ?? String(Number.isFinite(value) ? value : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <label className="text-sm text-[var(--text-secondary)]">{label}</label>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3 py-2.5 sm:min-w-[8.5rem] sm:max-w-[11rem] sm:flex-none">
            {prefix ? (
              <span className="text-sm font-semibold text-[var(--accent-2)]">
                {prefix}
              </span>
            ) : null}
            <input
              type="text"
              inputMode="decimal"
              value={shown}
              onFocus={(e) => {
                setDraft(value === 0 ? "" : String(value));
                requestAnimationFrame(() => e.target.select());
              }}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.]/g, "");
                setDraft(raw);
                if (raw === "" || raw === ".") {
                  onChange(0);
                  return;
                }
                const n = Number(raw);
                if (!Number.isFinite(n)) return;
                onChange(Math.min(max, Math.max(0, n)));
              }}
              onBlur={() => {
                setDraft(null);
                const n = Number.isFinite(value) ? value : 0;
                onChange(Math.min(max, Math.max(0, n)));
              }}
              className="w-full min-w-0 bg-transparent text-right text-sm font-semibold outline-none"
            />
            {suffix ? (
              <span className="shrink-0 text-sm text-[var(--text-muted)]">
                {suffix}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              setDraft("0");
              onChange(0);
            }}
            className="shrink-0 px-2 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Clear
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safe}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range"
        style={{ "--range-pct": `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
    </div>
  );
}
