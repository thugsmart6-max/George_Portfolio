import type { NseAnalysis } from "@/lib/analysis-engine";

export async function explainNseAnalysis(analysis: NseAnalysis): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;

  const payload = {
    stock: analysis.stock,
    quote: analysis.quote,
    trend: analysis.trend,
    evidence: analysis.evidence,
    risk: analysis.risk,
    returns: analysis.returns,
    technical: {
      rsi14: analysis.technical.rsi14,
      macdHist: analysis.technical.macdHist,
      sma50: analysis.technical.sma50,
      sma200: analysis.technical.sma200,
      relativeVolume: analysis.technical.relativeVolume,
    },
    scorecard: analysis.scorecard,
    missing: analysis.scorecard.categories.filter((c) => c.score == null).map((c) => c.label),
    theory: analysis.theory,
    notes: analysis.metadata.notes,
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You explain NSE equity tape from provided JSON only. Never invent prices, ratios, or fundamentals. If a field is null, say Data unavailable. Educational, not advice. Short paragraphs.",
          },
          { role: "user", content: JSON.stringify(payload) },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
