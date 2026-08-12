import Link from "next/link";

export const SITE_CHAPTERS = [
  { href: "/about", label: "About", index: "01" },
  { href: "/group", label: "Group", index: "02" },
  { href: "/books", label: "Books", index: "03" },
  { href: "/advice", label: "Advice", index: "04" },
  { href: "/calculators", label: "Tools", index: "05" },
  { href: "/contact", label: "Contact", index: "06" },
] as const;

type Props = {
  current: (typeof SITE_CHAPTERS)[number]["href"];
};

export function PageTraverse({ current }: Props) {
  const i = SITE_CHAPTERS.findIndex((c) => c.href === current);
  if (i < 0) return null;
  const prev = SITE_CHAPTERS[i - 1];
  const next = SITE_CHAPTERS[i + 1];

  return (
    <nav
      aria-label="Chapter navigation"
      className="mt-16 grid gap-0 border border-[var(--border)] md:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          data-cursor="link"
          className="group border-b border-[var(--border)] p-6 transition-colors hover:bg-[var(--surface)] md:border-b-0 md:border-r"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Previous · {prev.index}
          </p>
          <p className="display mt-3 text-2xl uppercase group-hover:text-[var(--accent-2)] md:text-3xl">
            {prev.label}
          </p>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          data-cursor="link"
          className="group p-6 text-right transition-colors hover:bg-[var(--surface)]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Next · {next.index}
          </p>
          <p className="display mt-3 text-2xl uppercase group-hover:text-[var(--accent-2)] md:text-3xl">
            {next.label}
          </p>
        </Link>
      ) : (
        <Link
          href="/"
          data-cursor="link"
          className="group p-6 text-right transition-colors hover:bg-[var(--surface)]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Return · 00
          </p>
          <p className="display mt-3 text-2xl uppercase group-hover:text-[var(--accent-2)] md:text-3xl">
            Home
          </p>
        </Link>
      )}
    </nav>
  );
}
