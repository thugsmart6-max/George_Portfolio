"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Link2Off, Loader2 } from "lucide-react";
import type { AliceStatus } from "@/lib/alice-types";

function maskClientId(id: string | null) {
  if (!id) return "";
  if (id.length <= 4) return id;
  return `··${id.slice(-4)}`;
}

export function AliceConnect({
  next,
  compact = false,
}: {
  next: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<AliceStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"ok" | "error" | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/alice/status", { cache: "no-store" });
      const data = (await res.json()) as AliceStatus & { error?: string };
      setStatus({
        configured: Boolean(data.configured),
        connected: Boolean(data.connected),
        clientId: data.clientId ?? null,
      });
    } catch {
      setStatus({ configured: false, connected: false, clientId: null });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("alice");
    const reason = params.get("reason");
    if (flag === "connected") {
      setTone("ok");
      setMessage("Alice Blue connected. Live holdings and LTP will load from your account.");
      void refresh();
    } else if (flag === "error") {
      setTone("error");
      setMessage(reason || "Alice Blue could not connect.");
    }
  }, [refresh]);

  async function disconnect() {
    setBusy(true);
    try {
      await fetch("/api/alice/logout", { method: "POST" });
      setTone(null);
      setMessage("Alice Blue disconnected. Connect again to load live LTP and holdings.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const connected = Boolean(status?.connected);
  const configured = Boolean(status?.configured);
  const maskedId = maskClientId(status?.clientId ?? null);
  const loginHref = `/api/alice/login?next=${encodeURIComponent(next)}`;

  return (
    <div
      className={`border border-[var(--border)] bg-[var(--surface)] ${compact ? "px-4 py-3" : "px-5 py-4 md:px-6"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Alice Blue
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {!status
              ? "Checking Alice Blue…"
              : connected
                ? `Live feed connected${maskedId ? ` · ${maskedId}` : ""}. Quotes and holdings only — this site never places orders.`
                : configured
                  ? "Connect your Alice Blue account for live NSE LTP and real holdings. This site never places orders."
                  : "Save .env.local with App Code and API Secret, then restart npm run dev."}
          </p>
        </div>
        {!status ? null : connected ? (
          <button
            type="button"
            onClick={() => void disconnect()}
            disabled={busy}
            className="btn-ghost btn-no-arrow min-h-11 px-4 py-2 text-[10px]"
          >
            {busy ? <Loader2 className="animate-spin" size={14} /> : <Link2Off size={14} />}
            Disconnect
          </button>
        ) : configured ? (
          <a href={loginHref} className="btn-primary min-h-11 px-4 py-2 text-[10px]" data-cursor="cta">
            <Link2 size={14} />
            Connect
          </a>
        ) : null}
      </div>
      {message ? (
        <p
          className={`mt-3 text-xs ${tone === "error" ? "text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
