"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = params.get("token");
    if (!token) {
      setError("Missing reset token");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Unable to reset password");
      return;
    }
    router.push("/login");
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-4">
      <Input
        label="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="w-full">
        Update password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <p className="eyebrow">Recovery</p>
      <h1 className="display mt-3 text-4xl">Reset password</h1>
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
