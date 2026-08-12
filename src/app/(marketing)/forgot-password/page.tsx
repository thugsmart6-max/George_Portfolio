"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    setMessage("If that email exists, a reset link has been prepared.");
    if (json.resetToken) setToken(json.resetToken);
  };

  return (
    <PageShell>
      <p className="eyebrow">Recovery</p>
      <h1 className="display mt-3 text-5xl">Forgot password</h1>
      <form
        onSubmit={onSubmit}
        className="glass mt-10 max-w-md space-y-4 rounded-3xl p-7"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full rounded-full">
          Send reset link
        </Button>
      </form>
      {message ? (
        <p className="mt-6 text-sm text-[var(--text-secondary)]">{message}</p>
      ) : null}
      {token ? (
        <p className="mt-3 break-all text-xs text-[var(--accent)]">
          Dev reset token:{" "}
          <Link href={`/reset-password?token=${token}`}>use this link</Link>
        </p>
      ) : null}
      <Link
        href="/login"
        className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-2)]"
      >
        Back to sign in →
      </Link>
    </PageShell>
  );
}
