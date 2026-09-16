import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { FOUNDER } from "@/lib/media";
import { ACADEMY_COURSES, SERVICE_GROUPS } from "@/lib/site";
import { EditorialHero } from "@/components/brand/EditorialHero";
import { MeaningTicker } from "@/components/brand/MeaningTicker";
import { ResourceFlow } from "@/components/brand/ResourceFlow";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";
import { SITE_CHAPTERS } from "@/components/layout/PageTraverse";
import { ThemeDoodle } from "@/components/brand/ThemeDoodles";

const CTAS = [
  { href: "/contact", label: "Schedule a Consultation" },
  { href: "/academy", label: "Join a Wealth Workshop" },
  { href: "/services", label: "Start Your Journey" },
] as const;

export default function HomePage() {
  return (
    <div>
      <EditorialHero />
      <MeaningTicker />

      <section className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-5 md:px-10 md:py-24">
        <p className="eyebrow">{BRAND.mark}</p>
        <h2 className="display mt-3 text-4xl uppercase md:text-6xl">
          Money that
          <br />
          works
        </h2>
        <div className="mt-8 max-w-2xl space-y-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          <p>
            At {BRAND.mark}, we believe wealth is not built by working harder
            alone — it is built by making money work intelligently for you.
          </p>
          <p>
            We help ambitious individuals, professionals, business owners, and
            aspiring investors build the mindset, strategy, and systems for
            long-term wealth — from business growth and investment planning to
            financial education and preservation.
          </p>
          <p>
            The path is simple to say and hard to live: stop only earning. Start
            owning assets, generating cash flow, and leaving independence that
            outlasts a salary.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--border)] px-4 py-8 sm:px-5 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-3">
          {CTAS.map((cta, i) => (
            <Link
              key={cta.label}
              href={cta.href}
              data-cursor="cta"
              className={`${i === 0 ? "btn-primary" : "btn-ghost"} px-5 py-3 text-[11px] font-semibold`}
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {SITE_CHAPTERS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              data-cursor="link"
              className="group border-b border-r border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface)] sm:p-5"
            >
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                {c.index}
              </p>
              <p className="display mt-2 text-lg uppercase group-hover:text-[var(--accent-2)] sm:text-xl">
                {c.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-5 md:px-10 md:py-24">
        <ThemeDoodle
          id="percent"
          rotate={12}
          className="absolute bottom-6 right-4 hidden w-[70px] lg:block"
        />
        <p className="eyebrow">Who it is for</p>
        <h2 className="display mt-3 text-4xl uppercase md:text-6xl">
          Three doors
        </h2>
        <p className="mt-5 max-w-2xl text-sm text-[var(--text-secondary)] md:text-base">
          Individuals, professionals, business owners, and aspiring investors —
          each with a clear next step.
        </p>
        <div className="mt-12 grid gap-0 border border-[var(--border)] lg:grid-cols-3">
          {SERVICE_GROUPS.map((group, i) => (
            <Link
              key={group.slug}
              href={`/services#${group.slug}`}
              data-cursor="link"
              className={`group p-6 transition-colors hover:bg-[var(--surface)] md:p-8 ${
                i > 0 ? "border-t border-[var(--border)] lg:border-l lg:border-t-0" : ""
              }`}
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                0{i + 1}
              </p>
              <h3 className="display mt-4 text-3xl group-hover:text-[var(--accent-2)]">
                {group.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {group.blurb}
              </p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em]">
                Learn more
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-5 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Academy</p>
            <h2 className="display mt-3 text-4xl uppercase md:text-5xl">
              Join a workshop
            </h2>
          </div>
          <Link
            href="/academy"
            className="btn-ghost px-5 py-3 text-[11px] font-semibold"
          >
            Join a Wealth Workshop
          </Link>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {ACADEMY_COURSES.map((course) => (
            <li key={course.n} className="border border-[var(--border)] p-6">
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {course.n} · {course.level}
              </p>
              <p className="display mt-3 text-2xl md:text-3xl">{course.title}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {course.line}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-5 md:px-10 md:pb-24">
        <p className="eyebrow">Roadmap</p>
        <h2 className="display mt-3 text-4xl uppercase md:text-5xl">
          Debt → SIP → Invest
        </h2>
        <p className="mt-5 mb-10 max-w-xl text-sm text-[var(--text-secondary)]">
          Clear expensive debt, build the SIP habit, then choose investments
          with a philosophy — the first decision is to begin.
        </p>
        <ResourceFlow />
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-5 md:grid-cols-[0.85fr_1.15fr] md:items-center md:px-10 md:py-28">
        <EditorialPortrait
          src={FOUNDER.office}
          alt={BRAND.name}
          caption="Office frame"
          meta={BRAND.name}
          index="02"
          variant="about"
          objectPosition="center 20%"
        />
        <div>
          <p className="eyebrow">The founder</p>
          <h2 className="display mt-4 text-4xl uppercase sm:text-5xl md:text-6xl">
            Who
            <br />
            teaches?
          </h2>
          <p className="display-italic mt-8 text-2xl leading-snug md:text-3xl">
            “{BRAND.philosophy}”
          </p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            {BRAND.name} — {BRAND.mark}. B.E. CSE. NISM-certified. A complete
            roadmap from earning money to owning assets and building lasting
            independence.
          </p>
          <Link
            href="/about"
            className="btn-ghost mt-10 inline-flex px-5 py-3 text-[11px] font-semibold"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="invert-block">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-4 py-16 sm:px-5 md:flex-row md:items-end md:px-10 md:py-28">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] opacity-60">
              Begin
            </p>
            <p className="display mt-4 text-3xl uppercase md:text-6xl">
              Start your
              <br />
              wealth-building
              <br />
              journey
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              data-cursor="cta"
              className="btn-invert justify-center px-6 py-3 text-[11px]"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/academy"
              className="btn-invert-ghost justify-center px-6 py-3 text-[11px] font-semibold"
            >
              Join a Wealth Workshop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
