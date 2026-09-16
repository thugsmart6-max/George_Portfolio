"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function fallbackFor(path: string) {
  if (path.startsWith("/resources/")) return "/resources";
  if (path === "/calculators" || path === "/planner") return "/resources";
  if (path === "/gallery") return "/";
  return "/";
}

export function BackControl() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackFor(pathname));
      }}
      aria-label="Go back to the previous page"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
    >
      <ArrowLeft size={16} />
    </button>
  );
}
