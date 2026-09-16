import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { ASSOCIATED_ORGS, NAV } from "@/lib/site";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div className="min-w-0">
          <BrandLogo href="/" />
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em]">
            {BRAND.brand}
          </p>
          <p className="display mt-2 text-2xl uppercase sm:text-3xl">
            {BRAND.name}
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            Personal finance and investment education — awareness before action.
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
            <Link href="/" data-cursor="link">
              Home
            </Link>
            {NAV.map((link) => (
              <Link key={link.href} href={link.href} data-cursor="link">
                {link.label}
              </Link>
            ))}
            <Link href="/gallery" data-cursor="link">
              Media / Gallery
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Free resources</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            <Link href="/calculators" data-cursor="link">
              Calculator
            </Link>
            <Link href="/planner" data-cursor="link">
              Planner
            </Link>
            <Link href="/resources/analysis" data-cursor="link">
              Equity analysis
            </Link>
            <Link href="/resources/tracker" data-cursor="link">
              Investment tracker
            </Link>
            <Link href="/resources/ask" data-cursor="link">
              Ask a Finance Question
            </Link>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Associated
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {ASSOCIATED_ORGS.map((o) => o.name).join(" · ")}
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:px-5 sm:text-[11px] sm:tracking-[0.16em] md:px-10">
        <p className="leading-relaxed">
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.holding} ·
          Educational content — not SEBI-registered advice
        </p>
      </div>
    </footer>
  );
}
