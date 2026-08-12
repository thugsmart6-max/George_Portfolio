"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/validators/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { BRAND } from "@/lib/brand";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Unable to create account");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  };

  return (
    <PageShell>
      <p className="eyebrow">{BRAND.brand}</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Create account</h1>
      <p className="mt-3 max-w-lg text-sm text-[var(--text-secondary)]">
        Optional private workspace — the public site is advice, books, and
        calculators.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass mt-10 max-w-lg space-y-4 rounded-3xl p-7"
      >
        <Input label="Name" error={errors.name?.message} {...register("name")} />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Mobile"
          placeholder="9876543210"
          error={errors.mobile?.message}
          {...register("mobile")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Age"
            type="number"
            error={errors.age?.message}
            {...register("age", { valueAsNumber: true })}
          />
          <Input
            label="Profession"
            error={errors.profession?.message}
            {...register("profession")}
          />
        </div>
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Prefer the public site?{" "}
          <Link href="/advice" className="text-[var(--accent)]">
            Read advice →
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
