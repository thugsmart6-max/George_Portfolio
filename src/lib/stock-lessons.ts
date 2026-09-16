export type StockLesson = {
  symbol: string;
  aliases: string[];
  name: string;
  sector: string;
  summary: string;
  notes: {
    business: string;
    financials: string;
    management: string;
    valuation: string;
    technicals: string;
    risks: string;
    outlook: string;
    thesis: string;
  };
  scores: {
    business: number;
    financials: number;
    management: number;
    valuation: number;
    technicals: number;
  };
  reasons: {
    overall: string;
    business: string;
    financials: string;
    management: string;
    valuation: string;
    technicals: string;
  };
};

export const STOCK_LESSONS: StockLesson[] = [
  {
    symbol: "HDFCBANK",
    aliases: ["hdfc bank", "hdfc", "hdfcbank"],
    name: "HDFC Bank",
    sector: "Private bank",
    summary:
      "India’s largest private bank by many measures. It earns mainly from loans minus the cost of deposits, plus fees. A teaching name for how to read a bank — book quality and cheap deposits matter more than a fancy PE story.",
    notes: {
      business:
        "The shop is simple: take deposits, give loans, earn the spread, plus cards and fees. Customers stay because the branch, app, and salary account become habit. That is a moat of trust and switching pain — not a gadget.",
      financials:
        "Banks are read on net interest margin, bad-loan ratio, and return on assets — not the same ratios as a soap company. Look at five years of loan growth versus deposit growth, and whether slippages stay calm.",
      management:
        "A widely held private bank with professional management. Watch succession, credit culture, and any sudden jump in riskier loans. Pledge is usually not the story here — culture is.",
      valuation:
        "Compare P/B and PE with other large private banks, not with IT. A premium is common when the book is clean. A cheap PB can mean the market doubts asset quality. Look up today’s multiple on the exchange — this page does not quote a live price.",
      technicals:
        "A heavyweight — institutions move it. Trend on the weekly chart first. Delivery and FII/DII changes matter more than one noisy day. Support and resistance are zones, not magic lines.",
      risks:
        "Credit cycle, unsecured lending, deposit cost if rates stay high, and regulation from the RBI. A bank can look fine until one credit season is not.",
      outlook:
        "1 year: deposit cost and loan growth. 3 years: whether it still gathers cheap money. 5 years: India’s credit demand — if the franchise stays trusted.",
      thesis:
        "Bull: clean book, cheap deposits, India still under-banked. Base: ordinary credit growth, premium valuation stays rich. Bear: a credit slip or deposit-cost squeeze. Not a buy or sell call — a way to practise the desk.",
    },
    scores: { business: 8, financials: 7, management: 8, valuation: 5, technicals: 6 },
    reasons: {
      overall:
        "About 6.8 / 10. The bank is easy to understand and usually well run — the score is not 9 because the share price is often already expensive, and banks can have a bad-loan year.",
      business:
        "8 / 10 — Simple shop: deposits in, loans out. People stay because salary accounts are sticky. Not 10 because it is not the only private bank.",
      financials:
        "7 / 10 — Usually clean books for a bank. Not 9 because loan quality can worsen in a tough year — always re-check bad loans.",
      management:
        "8 / 10 — Professional team, widely held. Not 10 because credit culture must stay strict as the bank grows.",
      valuation:
        "5 / 10 — Quality is high, so the market often asks a high price. A good shop at a full price is only a middle score.",
      technicals:
        "6 / 10 — Heavyweight, lots of institutional trade. Chart helps with timing, not with whether the bank is good.",
    },
  },
  {
    symbol: "INFY",
    aliases: ["infosys", "infy"],
    name: "Infosys",
    sector: "IT services",
    summary:
      "A large Indian IT services firm. Clients pay for software projects and ongoing work, often in dollars. A teaching name for export services: people, utilisation, and the US/Europe budget cycle.",
    notes: {
      business:
        "Clients pay for digital projects, maintenance, and platforms. Revenue is people × rate × utilisation. The moat is account depth and delivery reputation — not a single product patent.",
      financials:
        "Watch revenue growth in constant currency, operating margin, and free cash flow. IT can show high ROE with little debt. A weak year is often a client-budget year, not a broken factory.",
      management:
        "Professionally run, widely held. Watch large deal wins, attrition, and capital return (dividends / buybacks) versus hiring for the next cycle.",
      valuation:
        "PE versus TCS, HCL, Wipro — same industry. A high PE needs growth you can see. Dollar/rupee moves change reported numbers; do not confuse FX with a better shop.",
      technicals:
        "Often tracks global risk mood and Nasdaq-related flows. Weekly trend first. Volume on result days can be noise. Institutions matter.",
      risks:
        "US/Europe slowdown, visa and wage inflation, AI changing how work is billed, and client concentration in a few verticals.",
      outlook:
        "1 year: deal pipeline and margin. 3 years: whether AI is extra work or fewer billable hours. 5 years: still a needed vendor, or a crowded commodity.",
      thesis:
        "Bull: digital work stays, margins hold, cash returns. Base: mid-cycle growth, PE in line with peers. Bear: a long Western IT winter or pricing pressure from AI. Teaching sketch only.",
    },
    scores: { business: 7, financials: 8, management: 7, valuation: 6, technicals: 5 },
    reasons: {
      overall:
        "About 6.6 / 10. Strong cash and a clear services model — pulled down because Western clients can freeze budgets, and AI may change how work is billed.",
      business:
        "7 / 10 — Clients pay for people and projects. Clear, but not a unique product. Many IT firms do the same work.",
      financials:
        "8 / 10 — Often high cash, low debt, decent margins. Not 10 because one weak US/Europe year can slow growth fast.",
      management:
        "7 / 10 — Professional and widely held. Score is not higher because hiring and large deals must keep working every cycle.",
      valuation:
        "6 / 10 — Sometimes fair versus TCS/HCL, sometimes rich. You must compare PE with other IT names, not with a bank.",
      technicals:
        "5 / 10 — Moves with global risk mood. The chart is noisier than the business. Only a mid score.",
    },
  },
  {
    symbol: "TCS",
    aliases: ["tata consultancy", "tcs"],
    name: "Tata Consultancy Services",
    sector: "IT services",
    summary:
      "The largest Indian IT services company. Same shop type as Infosys — people, clients, dollar revenue — with the Tata name as extra trust for many boards.",
    notes: {
      business:
        "Long client relationships, large deals, and a wide service menu. Switching a core system is painful — that is part of the moat. Scale is the other part.",
      financials:
        "Usually a high-margin, cash-rich, low-debt profile in this industry. Read five-year growth and whether margins stay steady when wages rise.",
      management:
        "Tata group governance is a teaching point: promoter is a trust, not a pledged family holding. Still read related-party notes like any other name.",
      valuation:
        "Often trades at a premium to smaller IT names. Pay for quality only if growth is real. Compare PE/EV to Infosys and HCL, not to a bank.",
      technicals:
        "Index heavyweight. Trend follows the IT pack and global risk. Delivery % and DII/FII over a few quarters, not one session.",
      risks:
        "Same industry risks as peers: Western budgets, wages, currency, and AI unbundling some work.",
      outlook:
        "1 year: large-deal conversion. 3 years: mix of new digital vs old maintenance. 5 years: still the default vendor for many CFOs, or not.",
      thesis:
        "Bull: scale + Tata trust + cash. Base: slow-and-steady services compounder at a full PE. Bear: a long client freeze. Not advice — a classroom case.",
    },
    scores: { business: 8, financials: 8, management: 8, valuation: 5, technicals: 6 },
    reasons: {
      overall:
        "About 7.0 / 10. A large, cash-rich IT shop with Tata trust — not 8+ overall because the price is often full, and the same Western-budget risk as peers.",
      business:
        "8 / 10 — Biggest Indian IT services name. Clients stay because switching a core system hurts. Not 10: still a people business, not a monopoly.",
      financials:
        "8 / 10 — Typically high margin, cash, little debt. Not 10 because wage inflation and a slow client year can dent growth.",
      management:
        "8 / 10 — Tata group, professional bench. Not 10: still watch how cash is returned versus reinvested.",
      valuation:
        "5 / 10 — Quality often already in the price. Paying a premium leaves little room if growth slows.",
      technicals:
        "6 / 10 — Index heavyweight. Useful for trend, not a reason to buy the story.",
    },
  },
  {
    symbol: "ITC",
    aliases: ["itc limited", "itc"],
    name: "ITC Limited",
    sector: "FMCG / hotels / paper / agri",
    summary:
      "A well-known Indian company: cigarettes still fund a lot, while foods, hotels, paper, and agri are the other taps. A teaching name for ‘one cash engine, many shops’.",
    notes: {
      business:
        "Cigarettes are high-margin and habitual. FMCG wants to be the next engine. Hotels and paper are cyclical. Write which tap is largest before you look at the chart.",
      financials:
        "Cash generation from the cigarette line has historically been strong. FMCG margins are thinner. Read segment results — one number for the whole company can hide the mix.",
      management:
        "Widely held, professionally run. Watch how cash is allocated: dividends versus building the non-cigarette brands. Related-party is usually not the headline; mix of businesses is.",
      valuation:
        "The market often argues: cigarette cash (higher multiple?) versus FMCG execution (prove it). Compare with HUL for foods, not with a bank. Look up the live PE yourself.",
      technicals:
        "A liquid, widely held name. Support/resistance from old ranges. Volume and delivery on result weeks. Institutions are usually present.",
      risks:
        "Tobacco tax and regulation, FMCG competition from HUL and local brands, hotel cycles, and ESG funds that simply will not own tobacco.",
      outlook:
        "1 year: cigarette volumes and tax. 3 years: whether foods share actually rises. 5 years: is ITC still a cigarette company with extras, or a real FMCG house.",
      thesis:
        "Bull: cash cow funds a real FMCG climb. Base: fat dividend, slow mix shift. Bear: regulation or a failed FMCG spend. Classroom case — not a call.",
    },
    scores: { business: 7, financials: 8, management: 7, valuation: 6, technicals: 6 },
    reasons: {
      overall:
        "About 6.8 / 10. Strong cash from cigarettes, and a real company — the score is not 8 because tobacco rules can change, and the foods business still has to prove it.",
      business:
        "7 / 10 — Easy to see the cash engine (cigarettes). Not 8+ because hotels/paper/foods are different shops under one name.",
      financials:
        "8 / 10 — Cigarette cash has usually been strong. Not 10: foods make thinner margins, so one total number can hide the mix.",
      management:
        "7 / 10 — Professional, widely held. Score stays 7 until foods become a bigger, proven engine — not only a plan.",
      valuation:
        "6 / 10 — Sometimes looks cheap, sometimes the market already prices the dividend. Compare with FMCG peers, not banks.",
      technicals:
        "6 / 10 — Liquid and widely traded. Chart is average-useful: not the reason for the score.",
    },
  },
  {
    symbol: "RELIANCE",
    aliases: ["reliance industries", "ril", "reliance"],
    name: "Reliance Industries",
    sector: "Oil-to-chemicals · retail · telecom · new energy",
    summary:
      "A very large Indian conglomerate. Oil-to-chemicals still matter; Jio and retail are the consumer face; new energy is the long story. A teaching name for ‘many businesses under one ticker’.",
    notes: {
      business:
        "Several shops: refining/petchem, telecom, stores, and new energy. You must know which one is earning this year. A conglomerate moat is scale and capital — also a complexity tax.",
      financials:
        "Read segments, not one headline sales line. Debt, capex, and cash from the old engine versus spend on the new ones. Five years will look lumpy when a new vertical is being built.",
      management:
        "Promoter-led, high-profile capital allocation. Watch related-party, capex discipline, and whether new energy stays a plan or becomes a P&L.",
      valuation:
        "Sum-of-parts is the honest beginner frame: what is the oil shop worth, what is Jio, what is retail. A single PE can mislead. This page does not compute a live SOTP.",
      technicals:
        "Index giant — FII/DII and futures matter. Weekly trend. Breakouts without volume are common theatre.",
      risks:
        "Oil spreads, telecom price wars, retail execution, huge capex, and regulation. Complexity itself is a risk: you can be right on Jio and wrong on refining in the same quarter.",
      outlook:
        "1 year: O2C cycle and capex. 3 years: retail and Jio cash vs investment. 5 years: whether new energy is a real third engine.",
      thesis:
        "Bull: India consumption + cheap data + energy transition funded by the old engine. Base: a giant that grows with India, at a full price. Bear: capex without returns. Teaching only.",
    },
    scores: { business: 7, financials: 6, management: 6, valuation: 5, technicals: 6 },
    reasons: {
      overall:
        "About 6.0 / 10. Huge and important in India — the score is mid because it is many businesses at once, spends a lot on the future, and one PE number can mislead.",
      business:
        "7 / 10 — Scale is real (fuel, Jio, stores). Not 8+ because you must know which shop is earning this year.",
      financials:
        "6 / 10 — The old engine can be cash-rich, but capex on new bets makes the five-year picture lumpy.",
      management:
        "6 / 10 — Promoter-led, bold bets. Not higher until new energy and retail show steady profit, not only headlines.",
      valuation:
        "5 / 10 — Hard to price as one number. Easy to overpay if you treat it like a simple FMCG or a simple oil company.",
      technicals:
        "6 / 10 — Giant stock; institutions and futures move it. Chart is for timing homework, not quality.",
    },
  },
  {
    symbol: "HINDUNILVR",
    aliases: ["hindustan unilever", "hul", "hindunilvr"],
    name: "Hindustan Unilever",
    sector: "FMCG",
    summary:
      "India’s classic everyday-products company — soaps, detergents, foods. A teaching name for brand moat, distribution, and paying a high PE for quality.",
    notes: {
      business:
        "Small tickets, high repeat. Rural and urban kirana plus modern trade. The moat is brand + distribution. A new player needs years and a lot of advertising cash to copy that.",
      financials:
        "Steady sales, strong margins versus many FMCG peers, high ROCE, usually low debt. Growth is often mid-single to low-double digit — boring on purpose.",
      management:
        "Unilever parent, professional bench. Watch rural demand, premium versus mass mix, and commodity-cost years when palm oil or crude-linked inputs bite.",
      valuation:
        "Almost always ‘expensive’ versus the market. That is the lesson: quality compounds, but margin of safety can be thin. Compare PE with Nestlé India, Britannia, Dabur — same aisle.",
      technicals:
        "Defensive favourite. Trends can be slow. Volume spikes around results. Institutions hold a lot — one week of FII selling is not a thesis.",
      risks:
        "Rural slowdown, raw-material spike, local competition, and a PE that already prices perfection.",
      outlook:
        "1 year: volume vs price growth. 3 years: premium mix. 5 years: still the default bathroom and kitchen brands in India.",
      thesis:
        "Bull: India consumption + brands that do not die. Base: slow compounder at a rich PE. Bear: you overpay and sit still for years. Not a recommendation.",
    },
    scores: { business: 9, financials: 8, management: 8, valuation: 4, technicals: 5 },
    reasons: {
      overall:
        "About 6.8 / 10. A wonderful everyday brand shop — the average is not 9 because the share is usually expensive. Great business ≠ great purchase.",
      business:
        "9 / 10 — Soaps and foods people buy again and again. Very hard to copy the brand and the kirana reach. Almost as high as a beginner score should go.",
      financials:
        "8 / 10 — Steady sales, usually low debt, healthy margins. Not 10 because growth is often slow and calm, not a rocket.",
      management:
        "8 / 10 — Unilever parent, professional team. Watch rural demand and raw-material costs.",
      valuation:
        "4 / 10 — This is why the overall score is not 8. The price often already assumes everything will go right. Little margin of safety.",
      technicals:
        "5 / 10 — Defensive, slow chart. Not a timing playground. The lesson is the business and the price, not the candles.",
    },
  },
  {
    symbol: "KPITTECH",
    aliases: ["kpit", "kpit technologies", "kpittech"],
    name: "KPIT Technologies",
    sector: "Automotive software",
    summary:
      "A specialist IT firm for cars — software that helps vehicles become electric, connected, and more autonomous. A teaching name for ‘not a generic IT shop’.",
    notes: {
      business:
        "OEMs pay for automotive software: EV, ADAS, connected cars. The moat is deep car-domain skill and long OEM relationships — switching a vehicle platform is slow and expensive.",
      financials:
        "Read like an IT name (growth, margin, cash) but the cycle is auto + software, not a bank. Watch how much growth is one-off projects versus repeat platform work.",
      management:
        "Promoter-linked, listed on NSE/BSE. Watch pledge, related-party, and whether cash goes back into R&D or only into expansion stories.",
      valuation:
        "Compare PE with other auto-tech / mid IT names, not with HUL. A high PE needs visible OEM wins. This page does not quote a live price.",
      technicals:
        "Mid-cap — can move fast. Weekly trend first. Delivery and volume on result weeks. Support/resistance are zones to look up, not magic lines.",
      risks:
        "OEM concentration, auto-cycle slowdown, EV adoption delays, currency if clients are global, and talent cost.",
      outlook:
        "1 year: OEM programme ramps. 3 years: EV + ADAS software share. 5 years: still a specialist, or just another IT vendor.",
      thesis:
        "Bull: cars need more software every year. Base: steady OEM work, full valuation. Bear: auto winter or a delayed EV cycle. Teaching sketch — not a call.",
    },
    scores: { business: 9, financials: 8.5, management: 8.5, valuation: 8, technicals: 7 },
    reasons: {
      overall:
        "About 8 / 10 as a classroom quality sketch — a clear specialist shop. Not a 10 because auto demand can pause, and the price can already be rich.",
      business:
        "9 / 10 — Easy to say what they do: software inside cars. Few Indian IT names are this focused.",
      financials:
        "8.5 / 10 — Teaching read: growth + cash matter. Not 10 because auto programmes can slip.",
      management:
        "8.5 / 10 — Listed, promoter present. Watch pledges and how R&D cash is used.",
      valuation:
        "8 / 10 — Only if you compare with the right peers. A fancy PE versus TCS is the wrong homework.",
      technicals:
        "7 / 10 — Useful for timing a homework idea. The car cycle still rules the chart.",
    },
  },
  {
    symbol: "BSOFT",
    aliases: ["birlasoft", "bsoft", "birla soft"],
    name: "Birlasoft",
    sector: "IT services",
    summary:
      "A mid-tier Indian IT services company (CK Birla group). Digital, cloud, and enterprise software for global clients. A teaching name for ‘not TCS — still a real shop’.",
    notes: {
      business:
        "Clients pay for digital transformation, cloud, ERP, and industry software. Moat is accounts + domain (manufacturing, BFSI), not a consumer brand.",
      financials:
        "Read revenue growth, margins, ROE/ROCE, and free cash. Mid-tier IT can grow faster than giants in a good cycle — and fall faster in a bad one.",
      management:
        "CK Birla group, professional bench. Watch promoter holding, pledge, and capital return (dividend vs growth spend).",
      valuation:
        "Often cheaper PE than TCS/Infosys. Cheap can be a gift or a warning. Compare with other mid IT, not with a bank.",
      technicals:
        "More volatile than the giants. Trend, volume, delivery. Institutions can matter in a small float.",
      risks:
        "Client-budget cuts, pricing pressure, rupee/dollar, and being smaller than TCS in a spending freeze.",
      outlook:
        "1 year: deal wins and margins. 3 years: digital mix. 5 years: still an independent mid-tier, or squeezed.",
      thesis:
        "Bull: digital spend + reasonable price. Base: ordinary IT compounder. Bear: a long IT winter. Not a recommendation.",
    },
    scores: { business: 8, financials: 8, management: 8, valuation: 8, technicals: 7 },
    reasons: {
      overall:
        "About 7.8 / 10 in the classroom — a clear mid-tier IT shop. Not 9 because it is smaller than the giants and client budgets can freeze.",
      business:
        "8 / 10 — Understandable services model. Not 9: many firms sell the same digital story.",
      financials:
        "8 / 10 — Teaching frame: growth + cash + low debt is the healthy IT picture. Re-check every year.",
      management:
        "8 / 10 — Group-backed, usually clean homework items (holding, pledge). Still read the notes.",
      valuation:
        "8 / 10 — Sometimes a discount to large peers. Discount is a question, not an answer.",
      technicals:
        "7 / 10 — Chart is usable, noisier than TCS. Timing aid only.",
    },
  },
];

export function normalizeStockQuery(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\.(ns|bo)$/i, "")
    .replace(/\s+/g, " ");
}

export function findStockLesson(raw: string): StockLesson | null {
  const q = normalizeStockQuery(raw);
  if (!q) return null;
  return (
    STOCK_LESSONS.find((s) => {
      if (s.symbol.toLowerCase() === q) return true;
      if (s.name.toLowerCase() === q) return true;
      if (s.aliases.includes(q)) return true;
      return q.length >= 4 && s.name.toLowerCase().includes(q);
    }) ?? null
  );
}
