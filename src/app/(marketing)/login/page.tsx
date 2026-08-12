"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/validators/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { BRAND } from "@/lib/brand";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Unable to sign in");
      return;
    }
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass mt-10 max-w-md space-y-5 rounded-3xl p-7"
    >
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex justify-between text-sm text-[var(--text-secondary)]">
        <Link href="/forgot-password" className="link-underline">
          Forgot password
        </Link>
        <Link href="/register" className="link-underline">
          Create account
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      <p className="eyebrow">{BRAND.brand}</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Sign in</h1>
      <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
        Private workspace access for Thanith / Wealth By George tools.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-8 text-sm text-[var(--text-muted)]">
        Looking for advice instead?{" "}
        <Link href="/advice" className="text-[var(--accent)]">
          Browse advice pillars →
        </Link>
      </p>
    </PageShell>
  );
}
