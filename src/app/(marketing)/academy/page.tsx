import Link from "next/link";
import { ACADEMY_COURSES, ACADEMY_RHYTHM } from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ExpandCards } from "@/components/ui/ExpandCards";

export const metadata = {
  title: "Academy",
  description:
    "Wealth By George Academy — Stock Market Basics, Personal Finance, Investing for Beginners, Advanced Wealth Building.",
};

export default function AcademyPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="03 / 07"
        eyebrow="Academy"
        title={
          <>
            Learn
            <br />
            money
          </>
        }
        meta="Four courses · education first"
        description="A room for people who want to understand finance and investing — not a tip factory. Open a card for the brief."
        crumbs={[{ label: "Academy" }]}
        action={{ href: "/contact", label: "Join the Academy" }}
      />

      <PageSection index="01" eyebrow="Curriculum" title="The four rooms" flush>
        <ExpandCards
          columns={2}
          items={ACADEMY_COURSES.map((course) => ({
            id: course.n,
            kicker: `${course.n} · ${course.level}`,
            title: course.title,
            summary: course.line,
            detail: course.detail,
          }))}
        />
      </PageSection>

      <PageSection index="02" eyebrow="How it feels" title="Classroom, not feed">
        <ExpandCards
          items={ACADEMY_RHYTHM.map((item) => ({
            id: item.title,
            title: item.title,
            summary: item.line,
            detail: item.detail,
          }))}
        />
        <Link
          href="/resources"
          className="btn-ghost mt-8 inline-flex px-5 py-3 text-[11px] font-semibold"
        >
          Use free tools meanwhile
        </Link>
      </PageSection>

      <PageTraverse current="/academy" />
      <PageEndCta
        title={
          <>
            Enrol
            <br />
            a seat
          </>
        }
        primary={{ href: "/contact", label: "Join the Academy" }}
        secondary={{ href: "/stories", label: "Success Stories" }}
      />
    </PageShell>
  );
}
