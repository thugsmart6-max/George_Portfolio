import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  invert?: boolean;
};

export function PageEndCta({
  eyebrow = "Next",
  title,
  primary,
  secondary,
  invert = true,
}: Props) {
  const inner = (
    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
      <div>
        <p
          className={`text-[11px] uppercase tracking-[0.24em] ${
            invert ? "opacity-60" : "text-[var(--text-muted)]"
          }`}
        >
          {eyebrow}
        </p>
        <p className="display mt-4 text-3xl uppercase md:text-5xl">{title}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href={primary.href}
          data-cursor="cta"
          className={`${
            invert ? "btn-invert" : "btn-primary"
          } px-6 py-3 text-[11px]`}
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className={`${
              invert ? "btn-invert-ghost" : "btn-ghost"
            } px-6 py-3 text-[11px] font-semibold`}
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </div>
  );

  if (invert) {
    return (
      <section className="mt-24 invert-block px-6 py-14 md:mt-32 md:px-12 md:py-20">
        {inner}
      </section>
    );
  }

  return (
    <section className="mt-24 border-t border-[var(--border)] pt-14 md:mt-32 md:pt-20">
      {inner}
    </section>
  );
}
