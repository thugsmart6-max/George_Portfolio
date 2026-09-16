import { DOODLES, SITE_ART } from "@/lib/media";
import { cn } from "@/lib/utils";

type DoodleId = keyof typeof DOODLES.light;
type CutoutId = keyof typeof SITE_ART;

/** Always the light (For white) set — readable on Paper and Ink. */
export function ThemeDoodle({
  id,
  className,
  rotate,
}: {
  id: DoodleId;
  className?: string;
  rotate?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={DOODLES.light[id]}
      alt=""
      aria-hidden
      className={cn("theme-doodle pointer-events-none z-0 select-none", className)}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    />
  );
}

export function SiteCutout({
  id,
  className,
  rotate,
}: {
  id: CutoutId;
  className?: string;
  rotate?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SITE_ART[id]}
      alt=""
      aria-hidden
      className={cn("site-cutout pointer-events-none z-0 select-none", className)}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    />
  );
}
