import Link from "next/link";

export const metadata = { title: "Money" };

const modules = [
  {
    href: "/finance/income",
    n: "01",
    title: "Income",
    body: "Salary · Business · Rental · Freelance · Other",
  },
  {
    href: "/finance/expenses",
    n: "02",
    title: "Expenses",
    body: "Food · Rent · Travel · Shopping · Utilities…",
  },
  {
    href: "/finance/assets",
    n: "03",
    title: "Assets",
    body: "Bank · Funds · Stocks · Gold · Property…",
  },
  {
    href: "/finance/liabilities",
    n: "04",
    title: "Liabilities",
    body: "Home loan · Personal · Credit card…",
  },
];

export default function FinancePage() {
  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Module 2 · Financial Data</p>
      <h1 className="display mt-4 text-5xl md:text-7xl">Money ledger</h1>
      <p className="mt-5 max-w-xl text-[var(--text-secondary)]">
        Heart of the system. All records store under your User ID and feed the
        Wealth Engine.
      </p>
      <ul className="mt-16">
        {modules.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              data-cursor="link"
              className="index-row grid-cols-[60px_1fr] md:grid-cols-[80px_1fr_1.2fr]"
            >
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {m.n}
              </span>
              <span className="display text-3xl md:text-4xl">{m.title}</span>
              <span className="hidden text-sm text-[var(--text-secondary)] md:block">
                {m.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
