import { CASE_STUDIES, STUDENT_WINS, TESTIMONIALS } from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";
import { ExpandCards } from "@/components/ui/ExpandCards";

export const metadata = {
  title: "Success Stories",
  description:
    "Client testimonials, student achievements, and case studies from Wealth By George education work.",
};

export default function StoriesPage() {
  return (
    <PageShell>
      <ChapterRail
        items={[
          { id: "clients", label: "Clients" },
          { id: "students", label: "Students" },
          { id: "cases", label: "Cases" },
        ]}
      />

      <EditorialPageHero
        index="04 / 07"
        eyebrow="Success Stories"
        title={
          <>
            Proof
            <br />
            of practice
          </>
        }
        meta="Testimonials · Achievements · Case studies"
        description="Composite classroom and review stories — typical paths, not guaranteed outcomes. Open a card for the rest of the brief."
        crumbs={[{ label: "Success Stories" }]}
        action={{ href: "/contact", label: "Start yours" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection
        id="clients"
        index="01"
        eyebrow="Client testimonials"
        title="What the room said"
        flush
      >
        <ExpandCards
          items={TESTIMONIALS.map((t) => ({
            id: t.who,
            kicker: t.kind,
            title: t.quote,
            summary: t.who,
            detail: t.detail,
            quote: true,
          }))}
        />
      </PageSection>

      <PageSection
        id="students"
        index="02"
        eyebrow="Student achievements"
        title="What they kept"
      >
        <ExpandCards
          items={STUDENT_WINS.map((s) => ({
            id: s.title,
            kicker: s.metric,
            title: s.title,
            summary: s.line,
            detail: s.detail,
          }))}
        />
      </PageSection>

      <PageSection id="cases" index="03" eyebrow="Case studies" title="Before / after">
        <ExpandCards
          items={CASE_STUDIES.map((c, i) => ({
            id: c.title,
            kicker: `0${i + 1} · ${c.sector}`,
            title: c.title,
            summary: c.result,
            detail: c.detail,
          }))}
        />
      </PageSection>

      <PageTraverse current="/stories" />
      <PageEndCta
        title={
          <>
            Tools
            <br />
            next
          </>
        }
        primary={{ href: "/resources", label: "Open resources" }}
        secondary={{ href: "/academy", label: "Academy" }}
      />
    </PageShell>
  );
}
