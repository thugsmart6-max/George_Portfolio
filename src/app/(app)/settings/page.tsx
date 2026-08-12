"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Settings</p>
      <h1 className="display mt-3 text-4xl">Preferences</h1>

      <div className="mt-10 max-w-xl space-y-6">
        <div className="border border-[var(--border)] p-6">
          <p className="display text-2xl">Security</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sessions use httpOnly cookies. Financial data is never stored in
            localStorage. Banking credentials are never collected.
          </p>
        </div>

        <div className="border border-[var(--border)] p-6">
          <p className="display text-2xl">Learn the system</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Browse George Antonay&apos;s six-module architecture showcase.
          </p>
          <Link
            href="/advice"
            className="mt-4 inline-block text-sm text-[var(--accent)]"
          >
            Open modules →
          </Link>
        </div>

        <Button
          variant="danger"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
