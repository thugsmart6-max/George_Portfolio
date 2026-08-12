import { BRAND, VERTICALS, VISION_MILESTONES } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { GroupOrbit } from "@/components/brand/GroupOrbit";

export const metadata = { title: "Thanith Investments Group" };

export default function GroupPage() {
  return (
    <PageShell wide>
      <ChapterRail
        items={[
          { id: "orbit", label: "Orbit" },
          { id: "index", label: "Index" },
          { id: "synergy", label: "Synergy" },
          { id: "roadmap", label: "Roadmap" },
        ]}
      />

      <EditorialPageHero
        index="02 / 06"
        eyebrow="The group"
        title={
          <>
            Thanith
            <br />
            structure
          </>
        }
        meta={`Holding · IPO horizon ${BRAND.visionYear}`}
        description={`A holding structure for education, technology, real estate, and financial asset building — steered toward IPO-readiness by ${BRAND.visionYear}.`}
        crumbs={[{ label: "Group" }]}
        action={{ href: "/contact", label: "Partner" }}
      />

      <div className="mt-10 grid gap-0 border border-[var(--border)] md:grid-cols-4">
        {[
          ["Verticals", String(VERTICALS.length)],
          ["Focus", "Assets"],
          ["Base", BRAND.location],
          ["Target", BRAND.visionYear],
        ].map(([k, v], i) => (
          <div
            key={k}
            className={`p-5 ${i > 0 ? "border-t border-[var(--border)] md:border-l md:border-t-0" : ""}`}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {k}
            </p>
            <p className="display mt-2 text-2xl md:text-3xl">{v}</p>
          </div>
        ))}
      </div>

      <PageSection
        id="orbit"
        index="01"
        eyebrow="Interactive map"
        title="Orbit the verticals"
        flush
      >
        <GroupOrbit />
      </PageSection>

      <PageSection id="index" index="02" eyebrow="Index" title="Verticals in detail">
        <ul>
          {VERTICALS.map((v, i) => (
            <li key={v.slug}>
              <article className="work-row grid-cols-1 md:grid-cols-[72px_1.1fr_1.4fr]">
                <p className="font-mono text-[11px] text-[var(--text-muted)]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="mt-2 block text-[var(--accent-2)]">{v.mark}</span>
                </p>
                <div>
                  <h3 className="display text-3xl md:text-4xl">{v.name}</h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {v.role} · {v.sector}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  {v.summary}
                </p>
              </article>
            </li>
          ))}
          <li className="border-t border-[var(--border)]" />
        </ul>
      </PageSection>

      <PageSection id="synergy" index="03" eyebrow="Synergy" title="How the system compounds">
        <div className="invert-block px-6 py-12 md:px-12 md:py-16">
          <p className="display max-w-4xl text-2xl leading-snug md:text-4xl">
            Rafzon trains → Jaxpat builds tech → RKR builds assets → finance arm
            builds capital pathways → Wealth By George builds trust → Thanith
            holds and lists.
          </p>
        </div>
        <div className="mt-8 grid gap-0 border border-[var(--border)] sm:grid-cols-3">
          {["Education", "Technology", "Real assets"].map((label, i) => (
            <div
              key={label}
              className={`p-6 ${i > 0 ? "border-t border-[var(--border)] sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                0{i + 1}
              </p>
              <p className="display mt-3 text-2xl">{label}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="roadmap"
        index="04"
        eyebrow={`Road to ${BRAND.visionYear}`}
        title="Milestones"
      >
        <ol className="relative grid gap-0 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-3 hidden h-px bg-[var(--border-strong)] md:block" />
          {VISION_MILESTONES.map((m) => (
            <li
              key={m.year}
              className="relative border-t border-[var(--border)] px-0 py-8 md:border-t-0 md:px-4 md:pt-10"
            >
              <span className="absolute left-0 top-0 h-2 w-2 -translate-y-1/2 bg-[var(--text-primary)] md:left-4" />
              <p className="font-mono text-[11px] text-[var(--accent-2)]">
                {m.year}
              </p>
              <p className="display mt-3 text-2xl md:text-3xl">{m.label}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{m.detail}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageTraverse current="/group" />

      <PageEndCta
        title={
          <>
            Read the
            <br />
            book trail
          </>
        }
        primary={{ href: "/books", label: "Library" }}
        secondary={{ href: "/about", label: "About George" }}
      />
    </PageShell>
  );
}
