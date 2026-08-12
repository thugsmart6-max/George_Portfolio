"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (FORMSPREE_ID) {
      setStatus("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error("Formspree rejected the message");
        setStatus("sent");
        form.reset();
      } catch {
        setStatus("error");
        setError("Could not send via form. Opening your email app instead…");
        window.location.href = buildMailto(name, email, message);
      }
      return;
    }

    window.location.href = buildMailto(name, email, message);
    setStatus("sent");
  };

  if (status === "sent" && FORMSPREE_ID) {
    return (
      <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-8 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-2)]">
          Status
        </p>
        <p className="display mt-4 text-4xl">Message sent.</p>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Thank you — we&apos;ll reply to your email shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-0 border border-[var(--border)] md:grid-cols-[1fr_1.2fr]"
      onSubmit={onSubmit}
    >
      <div className="border-b border-[var(--border)] p-7 md:border-b-0 md:border-r md:p-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Channel
        </p>
        <p className="display mt-4 text-3xl md:text-4xl">
          {FORMSPREE_ID ? "Form inbox" : "Email client"}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {FORMSPREE_ID
            ? "Messages go to the inbox via Formspree."
            : `Submits through your email app to ${BRAND.email}.`}
        </p>
        <a
          href={`mailto:${BRAND.email}`}
          className="mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          Or email directly
          <span className="h-px w-8 bg-[var(--text-primary)]" />
        </a>
      </div>

      <div className="space-y-8 p-7 md:p-10">
        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Name
          </span>
          <input
            required
            name="name"
            className="w-full border-b border-[var(--border-strong)] bg-transparent py-3 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Email
          </span>
          <input
            required
            type="email"
            name="email"
            className="w-full border-b border-[var(--border-strong)] bg-transparent py-3 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Message
          </span>
          <textarea
            required
            name="message"
            rows={5}
            className="w-full resize-none border-b border-[var(--border-strong)] bg-transparent py-3 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button
          type="submit"
          data-cursor="cta"
          disabled={status === "sending"}
          className="btn-primary px-8 py-3 text-[11px]"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function buildMailto(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Wealth By George — message from ${name}`);
  const body = encodeURIComponent(
    `${message}\n\n—\nFrom: ${name}\nReply-to: ${email}`
  );
  return `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
}
