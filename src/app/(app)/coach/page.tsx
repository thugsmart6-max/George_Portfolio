"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { AiMessage, DashboardData } from "@/types";
import { Button } from "@/components/ui/Button";

const suggestions = [
  "Can I buy a ₹10 lakh car?",
  "How can I increase my savings?",
  "Am I ready to buy a house?",
  "Why is my wealth score low?",
  "What should I focus on this month?",
];

export default function CoachPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const [dash, conv] = await Promise.all([
        fetch("/api/dashboard").then((r) => r.json()),
        fetch("/api/ai/conversation").then((r) => r.json()),
      ]);
      setData(dash);
      if (conv.conversation) {
        setMessages(conv.conversation.messages);
        setConversationId(conv.conversation.conversationId);
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setInput("");
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "AI unavailable");
      setConversationId(json.conversationId);
      setMessages(json.messages);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I couldn't process that just now. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-[var(--border)] px-5 py-10 lg:border-b-0 lg:border-r lg:px-8">
        <p className="eyebrow">Module 5 · AI Coach</p>
        <h1 className="display mt-3 text-3xl">Context</h1>
        {data ? (
          <dl className="mt-10 space-y-4 text-sm">
            {[
              ["Net Worth", formatINR(data.metrics.netWorth)],
              ["Savings Rate", formatPercent(data.metrics.savingsRate)],
              ["Debt Ratio", formatPercent(data.metrics.debtRatio)],
              ["Wealth Score", `${data.wealthScore.score}/100`],
              [
                "Goals",
                data.goals.length
                  ? data.goals.map((g) => g.name).join(", ")
                  : "None",
              ],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-[var(--border)] pb-3">
                <dt className="text-[var(--text-muted)]">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-8 space-y-3">
            <div className="shimmer h-8" />
            <div className="shimmer h-8" />
          </div>
        )}
        <p className="mt-8 text-xs leading-relaxed text-[var(--text-muted)]">
          Answers use Modules 1–4. Educational only — not certified advice.
        </p>
      </aside>

      <div className="flex flex-col" data-cursor="ask">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-8 md:px-10">
          {messages.length === 0 ? (
            <div className="flex min-h-[280px] flex-col justify-center">
              <p className="display text-3xl md:text-5xl">
                Ask with your numbers in the room.
              </p>
              <div className="mt-10 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:border-[var(--text-primary)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-2xl ${m.role === "user" ? "ml-auto text-right" : ""}`}
              >
                <p className="eyebrow">
                  {m.role === "user" ? "You" : "Coach"}
                </p>
                <div
                  className={`mt-2 whitespace-pre-wrap border px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-[var(--border)] p-4 md:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Wealth Coach..."
              className="focus-ring flex-1 border-b border-[var(--border-strong)] bg-transparent px-0 py-3 text-sm outline-none"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "…" : "Ask"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
