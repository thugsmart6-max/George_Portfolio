import { BRAND } from "@/lib/brand";
import {
  ASSOCIATED_ORGS,
  CHANNEL_PARTNERS,
  QUALIFICATIONS,
} from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";
import { JourneyPath } from "@/components/brand/JourneyPath";
import { FOUNDER } from "@/lib/media";

export const metadata = {
  title: "About",
  description:
    "About Dr. George Antony — journey, B.E. CSE, NISM qualifications, channel partners, and associated organisations.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <ChapterRail
        items={[
          { id: "me", label: "About" },
          { id: "journey", label: "Journey" },
          { id: "education", label: "Education" },
          { id: "partners", label: "Partners" },
          { id: "orgs", label: "Orgs" },
        ]}
      />

      <EditorialPageHero
        index="01 / 07"
        eyebrow="About Me"
        title={
          <>
            The
            <br />
            teacher
          </>
        }
        meta={`${BRAND.roles.join(" · ")} · ${BRAND.location}`}
        description="Engineer, NISM-certified educator, and founder. The story is not a résumé dump — it is how a systems mind learned to talk about money."
        crumbs={[{ label: "About" }]}
        action={{ href: "/contact", label: "Contact Us" }}
      />

      <section
        id="me"
        className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
      >
        <div className="relative max-w-md lg:max-w-none">
          <EditorialPortrait
            src={FOUNDER.office}
            alt={BRAND.name}
            caption="Working frame"
            meta={BRAND.shortName}
            index="01"
            variant="about"
            objectPosition="center 18%"
          />
        </div>
        <div className="lg:pt-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            About Me
          </p>
          <h2 className="display mt-4 text-4xl md:text-5xl">{BRAND.name}</h2>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--accent-2)]">
            {BRAND.brand} · {BRAND.holding}
          </p>
          <blockquote className="display-italic mt-10 border-l-2 border-[var(--text-primary)] pl-6 text-3xl leading-snug md:text-4xl">
            “{BRAND.philosophy}”
          </blockquote>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              I teach personal finance and investing so people can decide — not
              so a product can decide for them. Classrooms, workshops, and
              one-to-one reviews sit next to the companies I build.
            </p>
            <p>
              The public brand is {BRAND.brand}. The holding is{" "}
              {BRAND.holding}. The work is the same: awareness, then allocation.
            </p>
          </div>
        </div>
      </section>

      <PageSection
        id="journey"
        index="02"
        eyebrow="Journey / Story"
        title="Years, flipped"
      >
        <p className="mb-8 max-w-2xl text-sm text-[var(--text-secondary)] md:text-base">
          Tap a chapter. Each one keeps a small gimmick — a line you can steal
          for the week.
        </p>
        <JourneyPath />
      </PageSection>

      <PageSection
        id="education"
        index="03"
        eyebrow="Education & qualifications"
        title="Paper that matters"
      >
        <ul className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {QUALIFICATIONS.map((q, i) => (
            <li
              key={`${q.code}-${q.title}`}
              className="border border-[var(--border)] p-6 sm:-ml-px sm:-mt-px"
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")} · {q.kind}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--accent-2)]">
                {q.code}
              </p>
              <p className="display mt-2 text-2xl md:text-3xl">{q.title}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        id="partners"
        index="04"
        eyebrow="Channel partners"
        title="Channel partner with"
      >
        <div className="grid gap-0 border border-[var(--border)] md:grid-cols-2">
          {CHANNEL_PARTNERS.map((p, i) => (
            <article
              key={p.name}
              className={`p-8 ${i > 0 ? "border-t border-[var(--border)] md:border-l md:border-t-0" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {p.role}
              </p>
              <p className="display mt-4 text-3xl md:text-4xl">{p.name}</p>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">{p.line}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="orgs"
        index="05"
        eyebrow="Associated organisations"
        title="Marks on the door"
      >
        <div
          data-theme="light"
          className="border border-[var(--border)] bg-[var(--bg-primary)] p-5 text-[var(--text-primary)] sm:p-8"
        >
          <p className="mb-8 max-w-xl text-sm text-[var(--text-secondary)]">
            Ventures under the Thanith group — education, technology, and real
            assets sitting beside the JG Antony brand.
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {ASSOCIATED_ORGS.map((org) => (
              <li
                key={org.name}
                className="flex flex-col border border-[var(--border)] bg-[var(--surface-elevated)]"
              >
                <div className="flex h-28 w-full items-center justify-center px-4 sm:h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="h-16 w-full max-w-[148px] object-contain object-center sm:h-[4.5rem]"
                  />
                </div>
                <div className="border-t border-[var(--border)] px-4 py-3 text-center">
                  <p className="text-sm font-medium leading-snug">{org.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {org.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageTraverse current="/about" />
      <PageEndCta
        title={
          <>
            See the
            <br />
            services
          </>
        }
        primary={{ href: "/services", label: "Explore Services" }}
        secondary={{ href: "/academy", label: "Join the Academy" }}
      />
    </PageShell>
  );
}
