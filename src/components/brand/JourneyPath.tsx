"use client";

import { useState } from "react";
import { JOURNEY } from "@/lib/site";

export function JourneyPath() {
  const [active, setActive] = useState(0);
  const step = JOURNEY[active];

  return (
    <div className="border border-[var(--border)]">
      <div className="grid grid-cols-2 border-b border-[var(--border)] md:grid-cols-4">
        {JOURNEY.map((item, i) => (
          <button
            key={item.year}
            type="button"
            onClick={() => setActive(i)}
            className={`border-[var(--border)] p-4 text-left transition-colors md:p-5 ${
              i > 0 ? "border-l" : ""
            } ${i > 1 ? "border-t md:border-t-0" : ""} ${
              active === i
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                : "hover:bg-[var(--surface)]"
            }`}
          >
            <p
              className={`font-mono text-[10px] tracking-[0.18em] ${
                active === i ? "opacity-70" : "text-[var(--text-muted)]"
              }`}
            >
              0{i + 1}
            </p>
            <p className="display mt-2 text-xl md:text-2xl">{item.year}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--accent-2)]">
            {step.year}
          </p>
          <h3 className="display mt-3 text-3xl md:text-5xl">{step.title}</h3>
        </div>
        <div>
          <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            {step.body}
          </p>
          <p className="display-italic mt-6 text-2xl md:text-3xl">
            “{step.gimmick}”
          </p>
        </div>
      </div>
    </div>
  );
}
