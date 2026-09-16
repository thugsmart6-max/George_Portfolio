import { BRAND } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { ContactForm } from "@/components/brand/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Dr. George Antony — academy, services, speaking, and finance questions.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="07 / 07"
        eyebrow="Contact Us"
        title={<>Get started</>}
        meta="Academy · Services · Speaking"
        description="Write about a workshop, a review, a student cohort, or a question. Clarity over speed — expect a thoughtful reply."
        crumbs={[{ label: "Contact Us" }]}
      />

      <section className="mt-14 grid gap-0 border border-[var(--border)] md:grid-cols-3">
        {[
          {
            label: "Email",
            value: (
              <a href={`mailto:${BRAND.email}`} className="break-all">
                {BRAND.email}
              </a>
            ),
          },
          { label: "Based in", value: BRAND.location },
          { label: "Brand", value: BRAND.brand },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`p-7 ${i > 0 ? "border-t border-[var(--border)] md:border-l md:border-t-0" : ""}`}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              0{i + 1} · {item.label}
            </p>
            <p className="mt-4 text-sm md:text-base">{item.value}</p>
          </div>
        ))}
      </section>

      <PageSection index="01" eyebrow="Message" title="Write a note" flush>
        <ContactForm heading="Contact inbox" />
      </PageSection>

      <PageSection index="02" eyebrow="Also" title="Useful starting points">
        <div className="grid gap-0 border border-[var(--border)] sm:grid-cols-3">
          {[
            { href: "/services", label: "Services", n: "01" },
            { href: "/academy", label: "Academy", n: "02" },
            { href: "/resources", label: "Resources", n: "03" },
          ].map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`group p-6 transition-colors hover:bg-[var(--surface)] ${
                i > 0 ? "border-t border-[var(--border)] sm:border-l sm:border-t-0" : ""
              }`}
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {item.n}
              </p>
              <p className="display mt-3 text-2xl group-hover:text-[var(--accent-2)]">
                {item.label}
              </p>
            </a>
          ))}
        </div>
      </PageSection>

      <PageTraverse current="/contact" />
    </PageShell>
  );
}
