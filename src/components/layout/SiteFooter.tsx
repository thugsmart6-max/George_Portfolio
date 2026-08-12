import Link from "next/link";
import { BRAND, VERTICALS } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div className="min-w-0">
          <p className="binary-strip">0 1 0 1 0 1</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em]">
            {BRAND.brand}
          </p>
          <p className="display mt-2 text-2xl uppercase sm:text-3xl">
            {BRAND.name}
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            {BRAND.philosophy}
          </p>
          <a
            href={`mailto:${BRAND.email}`}
            className="mt-5 inline-block break-all text-sm"
            data-cursor="link"
          >
            {BRAND.email}
          </a>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            <Link href="/about" data-cursor="link">
              About
            </Link>
            <Link href="/group" data-cursor="link">
              Thanith Group
            </Link>
            <Link href="/books" data-cursor="link">
              Books
            </Link>
            <Link href="/calculators" data-cursor="link">
              Tools
            </Link>
            <Link href="/advice" data-cursor="link">
              Advice
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Ecosystem</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            {VERTICALS.slice(0, 4).map((v) => (
              <Link key={v.slug} href="/group" data-cursor="link">
                {v.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:px-5 sm:text-[11px] sm:tracking-[0.16em] md:px-10">
        <p className="leading-relaxed">
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.holding} ·
          Educational content
        </p>
      </div>
    </footer>
  );
}
