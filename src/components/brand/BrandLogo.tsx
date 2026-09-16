import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LOGOS } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  showName?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function BrandLogo({ href = "/", showName = true, size = "md", className }: Props) {
  const mark =
    size === "sm"
      ? "relative inline-flex h-7 w-11 shrink-0 items-center"
      : "relative inline-flex h-9 w-14 shrink-0 items-center sm:h-10 sm:w-16";
  const img =
    size === "sm" ? "h-7 w-11 object-contain" : "h-9 w-14 object-contain sm:h-10 sm:w-16";
  const name =
    size === "sm"
      ? "hidden min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] sm:inline"
      : "min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em]";

  const inner = (
    <>
      <span className={mark}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGOS.mark} alt="" className={img} />
      </span>
      {showName ? <span className={name}>{BRAND.mark}</span> : null}
    </>
  );

  const classes = cn("flex min-w-0 items-center gap-2.5", className);

  if (!href) {
    return <span className={classes}>{inner}</span>;
  }

  return (
    <Link href={href} className={classes} data-cursor="link" aria-label={BRAND.mark}>
      {inner}
    </Link>
  );
}
