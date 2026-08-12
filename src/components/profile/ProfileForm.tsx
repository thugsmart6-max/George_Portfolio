"use client";

import { useState } from "react";
import type { UserProfile } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ProfileForm({ user }: { user: UserProfile }) {
  const [form, setForm] = useState({
    name: user.name,
    mobile: user.mobile,
    age: String(user.age),
    profession: user.profession,
  });
  const [message, setMessage] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });
    setMessage(res.ok ? "Profile updated" : "Unable to update profile");
  };

  return (
    <form onSubmit={save} className="max-w-xl space-y-4">
      <div className="grid gap-4 border border-[var(--border)] p-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-[var(--text-muted)]">Email</p>
          <p className="mt-1">{user.email}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">KYC Status</p>
          <p className="mt-1 capitalize">{user.kycStatus.replace("_", " ")}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            KYC reserved for a future release
          </p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Subscription</p>
          <p className="mt-1 capitalize">{user.subscriptionStatus}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Member since</p>
          <p className="mt-1">
            {new Date(user.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <Input
        label="Mobile"
        value={form.mobile}
        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
      />
      <Input
        label="Age"
        type="number"
        value={form.age}
        onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
      />
      <Input
        label="Profession"
        value={form.profession}
        onChange={(e) => setForm((f) => ({ ...f, profession: e.target.value }))}
      />
      <Button type="submit">Save changes</Button>
      {message ? (
        <p className="text-sm text-[var(--accent)]">{message}</p>
      ) : null}
    </form>
  );
}
