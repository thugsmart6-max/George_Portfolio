import { connectDB } from "@/lib/db";
import { AiConversation, AiRecommendation } from "@/models";
import { formatINR, formatPercent } from "@/lib/utils";
import type {
  AiInsight,
  FinancialGoal,
  GoalProjection,
  UserProfile,
  WealthMetrics,
  WealthScoreResult,
} from "@/types";

export interface WealthContext {
  profile: UserProfile;
  metrics: WealthMetrics;
  wealthScore: WealthScoreResult;
  goals: FinancialGoal[];
  projections: GoalProjection[];
}

function buildContextPrompt(ctx: WealthContext): string {
  const goalLines = ctx.projections
    .map(
      (g) =>
        `- ${g.name}: ${g.progressPercent.toFixed(0)}% progress, needs ${formatINR(g.requiredMonthlySavings)}/mo, ${g.onTrack ? "on track" : "behind"}`
    )
    .join("\n");

  return [
    `User: ${ctx.profile.name}, ${ctx.profile.age}, ${ctx.profile.profession}`,
    `Net Worth: ${formatINR(ctx.metrics.netWorth)}`,
    `Monthly Income: ${formatINR(ctx.metrics.monthlyIncome)}`,
    `Monthly Expenses: ${formatINR(ctx.metrics.monthlyExpenses)}`,
    `Monthly Savings: ${formatINR(ctx.metrics.monthlySavings)}`,
    `Savings Rate: ${formatPercent(ctx.metrics.savingsRate)}`,
    `Debt Ratio: ${formatPercent(ctx.metrics.debtRatio)}`,
    `Emergency Fund: ${ctx.metrics.emergencyFundMonths.toFixed(1)} months`,
    `Wealth Score: ${ctx.wealthScore.score}/100`,
    `Strengths: ${ctx.wealthScore.strengths.join("; ")}`,
    `Weaknesses: ${ctx.wealthScore.weaknesses.join("; ")}`,
    `Goals:\n${goalLines || "- None yet"}`,
  ].join("\n");
}

function contextualReply(message: string, ctx: WealthContext): string {
  const q = message.toLowerCase();
  const { metrics, wealthScore, projections } = ctx;
  const disclaimer =
    "\n\n— This is educational guidance based on your Wealth Creator data, not certified financial advice.";

  if (q.includes("car") || q.includes("vehicle") || q.includes("afford")) {
    const priceMatch = q.match(/₹?\s?([\d,]+)\s*(lakh|lac|l)?/i);
    let target = 10_00_000;
    if (priceMatch) {
      const n = Number(priceMatch[1].replace(/,/g, ""));
      target =
        priceMatch[2] && /lakh|lac|l/i.test(priceMatch[2]) ? n * 1_00_000 : n;
    }

    const emiEstimate = target / 48;
    const postEmiSavings = metrics.monthlySavings - emiEstimate;
    const emergencyOk = metrics.emergencyFundMonths >= 3;
    const debtOk = metrics.debtRatio < 50;

    if (!emergencyOk) {
      return (
        `A ${formatINR(target)} purchase looks premature. Your emergency fund covers only ${metrics.emergencyFundMonths.toFixed(1)} months — aim for 3–6 months before adding vehicle EMI around ${formatINR(emiEstimate)}/mo.` +
        disclaimer
      );
    }
    if (postEmiSavings < metrics.monthlyIncome * 0.15) {
      return (
        `You could technically finance ~${formatINR(target)}, but an estimated EMI of ${formatINR(emiEstimate)} would drop savings to ${formatINR(postEmiSavings)}. That risks your ${formatPercent(metrics.savingsRate)} savings rate and active goals.` +
        disclaimer
      );
    }
    if (!debtOk) {
      return (
        `Debt is already ${formatPercent(metrics.debtRatio)} of annual income. Adding a car loan would increase pressure. Pay down high-interest liabilities first.` +
        disclaimer
      );
    }
    return (
      `Based on income ${formatINR(metrics.monthlyIncome)}, savings ${formatINR(metrics.monthlySavings)}, and ${metrics.emergencyFundMonths.toFixed(1)} months reserves, a ${formatINR(target)} car is within range if EMI stays near ${formatINR(emiEstimate)} and goals stay funded.` +
      disclaimer
    );
  }

  if (q.includes("savings") || q.includes("save more") || q.includes("increase")) {
    const targetRate = Math.min(40, metrics.savingsRate + 5);
    const extra = Math.max(
      5000,
      Math.round((metrics.monthlyIncome * 0.05) / 1000) * 1000
    );
    return (
      `You currently save ${formatINR(metrics.monthlySavings)} (${formatPercent(metrics.savingsRate)}). Increasing by ${formatINR(extra)}/month would move you toward ~${formatPercent(targetRate)}. Start with the largest discretionary categories and automate the transfer on payday.` +
      disclaimer
    );
  }

  if (q.includes("house") || q.includes("home") || q.includes("ready")) {
    const house = projections.find((g) =>
      g.name.toLowerCase().includes("house")
    );
    if (house) {
      return (
        `Your house goal is at ${house.progressPercent.toFixed(0)}%. You need about ${formatINR(house.requiredMonthlySavings)}/month to stay on schedule. ${house.onTrack ? "You are on track." : `You are behind — shortfall risk ${formatINR(house.expectedShortfall)}.`} Emergency fund: ${metrics.emergencyFundMonths.toFixed(1)} months. Strengthen reserves before locking a large down payment.` +
        disclaimer
      );
    }
    return (
      `No house goal is set yet. With net worth ${formatINR(metrics.netWorth)} and savings rate ${formatPercent(metrics.savingsRate)}, define a target amount and date so the Goal Engine can compute required monthly savings.` +
      disclaimer
    );
  }

  if (q.includes("score") || q.includes("wealth score") || q.includes("why")) {
    const weak = wealthScore.breakdown
      .filter((f) => f.status !== "strong")
      .map((f) => `${f.label} (${f.score})`)
      .join(", ");
    return (
      `Your Wealth Score is ${wealthScore.score}/100. Strongest areas: ${wealthScore.strengths[0] ?? "steady fundamentals"}. Focus next on: ${weak || "fine-tuning allocations"}. Top move: ${wealthScore.recommendations[0]}` +
      disclaimer
    );
  }

  if (q.includes("focus") || q.includes("this month") || q.includes("priority")) {
    const top = wealthScore.recommendations[0];
    const goalHint = projections[0]
      ? ` Keep ${projections[0].name} funded at ${formatINR(projections[0].requiredMonthlySavings)}/mo.`
      : "";
    return (
      `This month: ${top}${goalHint} Protect emergency reserves at ${metrics.emergencyFundMonths.toFixed(1)} months while you execute.` +
      disclaimer
    );
  }

  return (
    `Looking at your picture — net worth ${formatINR(metrics.netWorth)}, savings rate ${formatPercent(metrics.savingsRate)}, debt ratio ${formatPercent(metrics.debtRatio)}, score ${wealthScore.score}/100 — ${wealthScore.recommendations[0]} Ask me about affordability, savings, goals, or your score for a deeper read.` +
    disclaimer
  );
}

async function tryOpenAI(message: string, ctx: WealthContext): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are the Wealth Creator AI Coach. Use ONLY the provided financial context. Be precise with INR figures. Never invent accounts. Always note insights are educational, not certified advice. Keep answers concise and actionable.",
          },
          {
            role: "system",
            content: buildContextPrompt(ctx),
          },
          { role: "user", content: message },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function generateCoachReply(
  message: string,
  ctx: WealthContext
): Promise<string> {
  const ai = await tryOpenAI(message, ctx);
  return ai ?? contextualReply(message, ctx);
}

export function generatePrimaryInsight(ctx: WealthContext): AiInsight {
  const house = ctx.projections.find((g) =>
    /house|home/i.test(g.name)
  );
  const extra = 5000;

  if (house && !house.onTrack) {
    return {
      title: "AI INSIGHT",
      message: `Increase monthly savings by ${formatINR(extra)} to reach your ${house.name} goal roughly 8 months earlier.`,
      why: `At ${formatINR(house.requiredMonthlySavings)}/mo required and current contribution trailing, the Goal Engine projects a shortfall of ${formatINR(house.expectedShortfall)}.`,
      whatChanges: [
        `Redirect ${formatINR(extra)} from discretionary spend`,
        "Automate transfer on salary credit day",
        "Recheck goal trajectory next month",
      ],
      projectedImpact: `Higher probability of hitting ${house.name} near the target date while lifting savings rate.`,
      priority: "high",
    };
  }

  if (ctx.metrics.emergencyFundMonths < 3) {
    return {
      title: "AI INSIGHT",
      message: `Park ${formatINR(Math.max(10000, ctx.metrics.monthlyExpenses))} into liquid reserves to strengthen emergency coverage.`,
      why: `You currently cover ${ctx.metrics.emergencyFundMonths.toFixed(1)} months of expenses. Three months is a healthier floor.`,
      whatChanges: [
        "Prioritize bank/cash/FD allocation",
        "Pause non-essential upgrades for 60 days",
      ],
      projectedImpact: "Lower financial fragility and a higher Wealth Score emergency factor.",
      priority: "high",
    };
  }

  return {
    title: "AI INSIGHT",
    message: ctx.wealthScore.recommendations[0],
    why: `Wealth Score ${ctx.wealthScore.score}/100 with savings rate ${formatPercent(ctx.metrics.savingsRate)}.`,
    whatChanges: ctx.wealthScore.recommendations.slice(0, 3),
    projectedImpact: "Steady improvement in score factors and goal readiness.",
    priority: "medium",
  };
}

export async function persistInsight(userId: string, insight: AiInsight) {
  await connectDB();
  await AiRecommendation.create({ userId, ...insight });
}

export async function chatWithCoach(
  userId: string,
  message: string,
  ctx: WealthContext,
  conversationId?: string
) {
  await connectDB();
  let conversation = conversationId
    ? await AiConversation.findOne({ _id: conversationId, userId })
    : null;

  if (!conversation) {
    conversation = await AiConversation.create({
      userId,
      title: message.slice(0, 60),
      messages: [],
    });
  }

  conversation.messages.push({
    role: "user",
    content: message,
    createdAt: new Date(),
  });

  const reply = await generateCoachReply(message, ctx);

  conversation.messages.push({
    role: "assistant",
    content: reply,
    createdAt: new Date(),
  });

  await conversation.save();

  return {
    conversationId: conversation._id.toString(),
    reply,
    messages: conversation.messages.map(
      (m: {
        _id?: { toString(): string };
        role: string;
        content: string;
        createdAt: Date;
      }) => ({
        id: m._id?.toString?.() ?? crypto.randomUUID(),
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        createdAt: new Date(m.createdAt).toISOString(),
      })
    ),
  };
}

export async function getLatestConversation(userId: string) {
  await connectDB();
  const conversation = await AiConversation.findOne({ userId }).sort({
    updatedAt: -1,
  });
  if (!conversation) return null;
  return {
    conversationId: conversation._id.toString(),
    messages: conversation.messages.map(
      (m: {
        _id?: { toString(): string };
        role: string;
        content: string;
        createdAt: Date;
      }) => ({
        id: m._id?.toString?.() ?? crypto.randomUUID(),
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        createdAt: new Date(m.createdAt).toISOString(),
      })
    ),
  };
}
