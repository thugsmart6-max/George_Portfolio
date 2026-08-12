import { BRAND } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { ContactForm } from "@/components/brand/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="06 / 06"
        eyebrow="Contact"
        title={<>Say hi</>}
        meta="Collaborations · Speaking · Partnerships"
        description="Want to talk wealth, building, education — or Thanith ecosystem conversations? Reach out."
        crumbs={[{ label: "Contact" }]}
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

      <section className="mt-10 invert-block px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
              Office note
            </p>
            <p className="display mt-3 max-w-xl text-2xl md:text-3xl">
              Prefer clarity over speed — expect a thoughtful reply.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] opacity-70">
            {BRAND.holding}
          </p>
        </div>
      </section>

      <PageSection index="01" eyebrow="Message" title="Write a note" flush>
        <ContactForm />
      </PageSection>

      <PageSection index="02" eyebrow="Also" title="Useful starting points">
        <div className="grid gap-0 border border-[var(--border)] sm:grid-cols-3">
          {[
            { href: "/group", label: "Thanith map", n: "01" },
            { href: "/calculators", label: "Tools", n: "02" },
            { href: "/advice", label: "Advice", n: "03" },
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
