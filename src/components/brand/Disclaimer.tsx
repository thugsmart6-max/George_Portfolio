export function FinanceDisclaimer({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-2xl border border-[var(--warning)]/35 bg-[rgba(240,160,96,0.08)] p-5 text-sm leading-relaxed text-[var(--text-secondary)] ${className}`}
      role="note"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--warning)]">
        Important disclaimer
      </p>
      <p className="mt-3">
        These calculators and pages are for <strong className="text-[var(--text-primary)]">education and awareness only</strong>.
        They are <strong className="text-[var(--text-primary)]">not investment advice</strong>, not a SEBI-registered advisory
        service, and not a recommendation to buy, sell, or hold any security or product.
      </p>
      <p className="mt-2">
        Markets, tax rules (including GST), interest rates, and personal circumstances vary. Always verify with a
        qualified CA / SEBI-registered advisor / lender before acting. Past or illustrative returns do not guarantee
        future results.
      </p>
    </aside>
  );
}
