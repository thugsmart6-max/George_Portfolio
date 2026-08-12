import { BRAND, VALUES, TOPICS } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell>
      <ChapterRail
        items={[
          { id: "intro", label: "Intro" },
          { id: "motto", label: "Motto" },
          { id: "values", label: "Values" },
          { id: "path", label: "Path" },
        ]}
      />

      <EditorialPageHero
        index="01 / 06"
        eyebrow="About George"
        title={
          <>
            Who&apos;s
            <br />
            this?
          </>
        }
        meta={`${BRAND.roles.join(" · ")} · ${BRAND.location}`}
        description={BRAND.heroLine}
        crumbs={[{ label: "About" }]}
        action={{ href: "/contact", label: "Say hi" }}
      />

      <section
        id="intro"
        className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
      >
        <div className="relative max-w-md lg:max-w-none">
          <EditorialPortrait
            src="/images/george-antony-office.jpg"
            alt={BRAND.name}
            caption="Single frame expression"
            meta={BRAND.shortName}
            index="02"
            variant="about"
            objectPosition="center 18%"
          />
          <div className="mt-8 grid grid-cols-3 border border-[var(--border)]">
            {[
              ["Holding", BRAND.holding],
              ["Brand", BRAND.brand],
              ["Horizon", BRAND.visionYear],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`p-4 ${i > 0 ? "border-l border-[var(--border)]" : ""}`}
              >
                <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {k}
                </p>
                <p className="mt-2 text-[11px] leading-snug">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pt-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Hello, hi, hey
          </p>
          <h2 className="display mt-4 text-4xl md:text-5xl">{BRAND.name}</h2>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--accent-2)]">
            Founder, {BRAND.holding}
          </p>
          <blockquote className="display-italic mt-10 border-l-2 border-[var(--text-primary)] pl-6 text-3xl leading-snug md:text-4xl">
            “{BRAND.philosophy}”
          </blockquote>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              Entrepreneur, educator, and founder of multiple ventures under{" "}
              <strong className="text-[var(--text-primary)]">{BRAND.holding}</strong>.
              Creator of <strong className="text-[var(--text-primary)]">{BRAND.brand}</strong>.
            </p>
            <p>
              I teach wealth mindset across Tamil Nadu and India — then prove it by
              building asset-generating businesses in education, technology, and
              real estate.
            </p>
            <p>
              Long-term horizon: Thanith verticals prepared for public markets by{" "}
              <strong className="text-[var(--text-primary)]">{BRAND.visionYear}</strong>.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <span key={t} className="tag-pill">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="motto" className="mt-20 invert-block px-6 py-14 md:px-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-[100px_1fr]">
          <p className="font-mono text-[11px] tracking-[0.2em] opacity-60">
            02
          </p>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] opacity-60">
              Motto
            </p>
            <p className="display mt-6 max-w-4xl text-3xl leading-snug md:text-5xl">
              “{BRAND.motto}”
            </p>
          </div>
        </div>
      </section>

      <PageSection id="values" index="03" eyebrow="Values" title="What I build on">
        <ul className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <li
              key={v.title}
              className="border border-[var(--border)] p-7 transition-colors hover:bg-[var(--surface)] sm:-ml-px sm:-mt-px"
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display mt-4 text-2xl md:text-3xl">{v.title}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{v.blurb}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="path" index="04" eyebrow="Path" title="From thinking to building">
        <ol className="grid gap-0 md:grid-cols-3">
          {[
            {
              t: "Think",
              d: "Wealth starts in how you interpret money, assets, and time.",
            },
            {
              t: "Teach",
              d: "Wealth By George turns mindset into clear, practical awareness.",
            },
            {
              t: "Build",
              d: "Thanith verticals prove principles with real cash-flow systems.",
            },
          ].map((s, i) => (
            <li
              key={s.t}
              className="relative border border-[var(--border)] p-8 md:-ml-px"
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                0{i + 1}
              </p>
              <p className="display mt-4 text-4xl">{s.t}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {s.d}
              </p>
              {i < 2 ? (
                <span className="absolute right-4 top-8 hidden text-[var(--text-muted)] md:block">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </PageSection>

      <PageTraverse current="/about" />

      <PageEndCta
        title={
          <>
            Explore the
            <br />
            Thanith map
          </>
        }
        primary={{ href: "/group", label: "Group structure" }}
        secondary={{ href: "/calculators", label: "Open tools" }}
      />
    </PageShell>
  );
}
