import Link from "next/link";
import { RESOURCE_FLOW } from "@/lib/site";

export function ResourceFlow() {
  return (
    <ol className="grid gap-0 border border-[var(--border)] md:grid-cols-3">
      {RESOURCE_FLOW.map((step, i) => (
        <li
          key={step.title}
          className={`relative p-6 md:p-8 ${
            i > 0 ? "border-t border-[var(--border)] md:border-l md:border-t-0" : ""
          }`}
        >
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            {step.n}
          </p>
          <p className="display mt-4 text-3xl md:text-4xl">{step.title}</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {step.line}
          </p>
          {i < RESOURCE_FLOW.length - 1 ? (
            <span className="pointer-events-none absolute right-4 top-8 hidden text-[var(--accent-2)] md:block">
              →
            </span>
          ) : null}
        </li>
      ))}
      <li className="md:col-span-3 border-t border-[var(--border)] p-5 md:px-8">
        <Link
          href="/planner"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-2)]"
          data-cursor="link"
        >
          Walk the flow in the planner
        </Link>
      </li>
    </ol>
  );
}
