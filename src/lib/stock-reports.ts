import type { StockLesson } from "@/lib/stock-lessons";
import type { NseYearRow } from "@/lib/nse-format";

export type StockReport = {
  exchange: string;
  tagline: string;
  chips: string[];
  marketCap?: string;
  sector?: string;
  industry?: string;
  priceBand?: string;
  does: string;
  doesLines?: string[];
  moat: string[];
  position: string;
  years?: NseYearRow[];
  finance: { label: string; value: string }[];
  financeTakeaway: string;
  management: { label: string; value: string }[];
  valuation: { label: string; value: string }[];
  valuationNote: string;
  peers: string;
  peerBars?: { label: string; value: number }[];
  fairValue?: string;
  marginOfSafety?: string;
  tech: {
    trend: string;
    trendLong?: string;
    trendMid?: string;
    trendShort?: string;
    support: string;
    resistance: string;
    volume: string;
    delivery: string;
    spark: number[];
  };
  risks: { label: string; items: string[] }[];
  outlook: { y1: string; y3: string; y5: string };
  thesis: { bull: string; base: string; bear: string };
  thesisTargets?: { bull: string; base: string; bear: string };
  riskScore: number;
  outlookScore: number;
  headlineScore?: number;
  drivers: string[];
  verdictQuote?: string;
};

const REPORTS: Record<string, StockReport> = {
  HDFCBANK: {
    exchange: "NSE: HDFCBANK",
    tagline: "Deposits in. Loans out. Trust as the product.",
    chips: ["Banking", "Deposits", "Retail credit", "Fees"],
    does: "Takes deposits, gives loans, earns the spread, plus cards and fees. Salary accounts make customers stay.",
    moat: [
      "Brand and trust",
      "Salary / current-account habit",
      "Branch + app reach",
    ],
    position: "Among India’s largest private banks — a leader, not a monopoly.",
    finance: [
      { label: "How to read", value: "NIM, bad loans, deposit cost" },
      { label: "Debt lens", value: "A bank IS leverage — don’t use FMCG ratios" },
      { label: "Cash", value: "Watch deposit franchise, not ‘FCF like IT’" },
      { label: "5-year ask", value: "Loans vs deposits, slippages calm?" },
    ],
    financeTakeaway: "Healthy bank = cheap deposits + clean book. One fat year of loans is not enough.",
    management: [
      { label: "Promoter / holding", value: "Widely held, professional bench" },
      { label: "Pledge", value: "Usually not the headline — still check" },
      { label: "Governance", value: "Listed, heavily watched by RBI + market" },
      { label: "Capital allocation", value: "Grow the book without getting sloppy" },
      { label: "Related-party", value: "Read the notes like any other name" },
    ],
    valuation: [
      { label: "Compare with", value: "Other large private banks — not IT" },
      { label: "Useful ratios", value: "P/B and PE vs peers" },
      { label: "Trap", value: "Cheap PB can mean dirty assets" },
      { label: "Live price", value: "Look up on the exchange — not here" },
    ],
    valuationNote: "Quality often already sits in the price. A good bank at a full PE is only a middle valuation score.",
    peers: "ICICIBANK · KOTAKBANK · SBIN (different DNA)",
    tech: {
      trend: "Index heavyweight — follow the weekly first",
      support: "Old swing zones (look up live)",
      resistance: "Prior highs (look up live)",
      volume: "Institutions can move a day",
      delivery: "More useful than one noisy session",
      spark: [42, 48, 46, 55, 58, 52, 60, 64, 61, 68, 66, 70],
    },
    risks: [
      { label: "Business", items: ["Credit cycle", "Unsecured lending"] },
      { label: "Industry", items: ["Rate cycle", "Deposit war"] },
      { label: "Financial", items: ["Bad-loan spike", "NIM squeeze"] },
      { label: "Regulatory", items: ["RBI rules", "Provisioning"] },
    ],
    outlook: {
      y1: "Deposit cost and loan growth — operations, not a target price.",
      y3: "Does the franchise still gather cheap money?",
      y5: "India still needs credit. Will this brand still be trusted?",
    },
    thesis: {
      bull: "Clean book, cheap deposits, India under-banked.",
      base: "Ordinary credit growth at a rich price.",
      bear: "A credit slip or deposit-cost squeeze.",
    },
    riskScore: 6,
    outlookScore: 7,
    drivers: ["Deposit franchise", "Retail + wholesale credit", "Fee income"],
  },
  INFY: {
    exchange: "NSE: INFY",
    tagline: "People × rate × utilisation — in dollars.",
    chips: ["IT services", "Digital", "Exports", "USD revenue"],
    does: "Global clients pay for software projects, maintenance, and platforms. Money is people time, billed mostly in dollars.",
    moat: ["Account depth", "Delivery reputation", "Scale of talent"],
    position: "Top-tier Indian IT — a leader pack with TCS, not a unique product.",
    finance: [
      { label: "Growth", value: "Constant-currency revenue" },
      { label: "Margin", value: "Operating margin vs wages" },
      { label: "Cash", value: "Free cash flow usually the tell" },
      { label: "Debt", value: "Often low — unlike a bank" },
    ],
    financeTakeaway: "A weak year is often a client-budget year, not a broken factory.",
    management: [
      { label: "Promoter / holding", value: "Widely held, professional" },
      { label: "Pledge", value: "Typically not the story — still check" },
      { label: "Governance", value: "Large-cap, high disclosure" },
      { label: "Capital allocation", value: "Dividends / buybacks vs hiring" },
      { label: "Related-party", value: "Read annual notes" },
    ],
    valuation: [
      { label: "Compare with", value: "TCS, HCL, Wipro" },
      { label: "Trap", value: "FX moves ≠ a better shop" },
      { label: "High PE needs", value: "Growth you can see" },
      { label: "Live price", value: "Exchange — not this page" },
    ],
    valuationNote: "Same industry only. A bank PE is the wrong homework.",
    peers: "TCS · HCLTECH · WIPRO · LTIM",
    tech: {
      trend: "Often tracks global risk / Nasdaq mood",
      support: "Look up weekly swing lows",
      resistance: "Look up prior result highs",
      volume: "Result days can be noise",
      delivery: "Institutions over a few quarters",
      spark: [70, 68, 72, 65, 60, 58, 62, 55, 57, 52, 54, 50],
    },
    risks: [
      { label: "Business", items: ["Client concentration", "Attrition"] },
      { label: "Industry", items: ["US/EU freeze", "AI billing change"] },
      { label: "Financial", items: ["Wage inflation", "FX"] },
      { label: "Regulatory", items: ["Visa / labour rules"] },
    ],
    outlook: {
      y1: "Deal pipeline and margins.",
      y3: "Is AI extra work — or fewer billable hours?",
      y5: "Still a needed vendor, or a crowded commodity?",
    },
    thesis: {
      bull: "Digital work stays, margins hold, cash returns.",
      base: "Mid-cycle growth, PE in line with peers.",
      bear: "A long Western IT winter.",
    },
    riskScore: 6,
    outlookScore: 6,
    drivers: ["Large deals", "Utilisation", "Digital mix"],
  },
  TCS: {
    exchange: "NSE: TCS",
    tagline: "Scale + Tata trust. Still a people business.",
    chips: ["IT services", "Large deals", "Exports", "Tata"],
    does: "The largest Indian IT services company. Long client relationships and a wide service menu. Switching a core system is painful.",
    moat: ["Scale", "Tata name", "Switching cost on core systems"],
    position: "Industry leader in Indian IT services.",
    finance: [
      { label: "Profile", value: "High margin, cash, low debt (typical)" },
      { label: "Watch", value: "Growth vs wage inflation" },
      { label: "5-year ask", value: "Did margins stay boring-stable?" },
      { label: "Cash", value: "Free cash after hiring" },
    ],
    financeTakeaway: "Quality is in the repeatability of cash — not one heroic quarter.",
    management: [
      { label: "Promoter", value: "Tata group (trust), not a pledged family shop" },
      { label: "Pledge", value: "Usually clean — still verify" },
      { label: "Governance", value: "High disclosure, large-cap" },
      { label: "Capital allocation", value: "Return cash vs reinvest" },
      { label: "Related-party", value: "Still read the notes" },
    ],
    valuation: [
      { label: "Compare with", value: "INFY, HCL — same aisle" },
      { label: "Habit", value: "Often a premium to smaller IT" },
      { label: "Trap", value: "Paying for perfection" },
      { label: "Live price", value: "Exchange — not here" },
    ],
    valuationNote: "A premium is a question: is growth still real?",
    peers: "INFY · HCLTECH · WIPRO",
    tech: {
      trend: "Index giant — follows the IT pack",
      support: "Look up weekly zones",
      resistance: "Look up old highs",
      volume: "FII/DII over quarters",
      delivery: "More than one session",
      spark: [64, 66, 70, 68, 72, 74, 71, 76, 73, 78, 75, 77],
    },
    risks: [
      { label: "Business", items: ["People / wages", "Deal delays"] },
      { label: "Industry", items: ["Western budgets", "AI unbundling"] },
      { label: "Financial", items: ["Margin squeeze", "FX"] },
      { label: "Regulatory", items: ["Visa", "Data rules"] },
    ],
    outlook: {
      y1: "Large-deal conversion.",
      y3: "Digital vs old maintenance mix.",
      y5: "Still the default vendor for many CFOs?",
    },
    thesis: {
      bull: "Scale + trust + cash.",
      base: "Slow compounder at a full PE.",
      bear: "A long client freeze.",
    },
    riskScore: 5,
    outlookScore: 7,
    drivers: ["Large deals", "Talent machine", "Cash return"],
  },
  ITC: {
    exchange: "NSE: ITC",
    tagline: "One cash engine. Several shops.",
    chips: ["Cigarettes", "FMCG", "Hotels", "Paper", "Agri"],
    does: "Cigarettes still fund a lot. Foods, hotels, paper, and agri are the other taps. Write which tap is largest before the chart.",
    moat: ["Cigarette habit + brand", "Distribution", "Hotel / paper assets"],
    position: "Leader in legal cigarettes; challenger in many FMCG aisles.",
    finance: [
      { label: "Read", value: "Segment results — not one sales line" },
      { label: "Cash engine", value: "Cigarettes usually fatter margins" },
      { label: "FMCG", value: "Thinner margins, longer proof" },
      { label: "Dividend", value: "Often part of the story" },
    ],
    financeTakeaway: "One total number can hide a strong tap and a weak tap.",
    management: [
      { label: "Holding", value: "Widely held, professional" },
      { label: "Pledge", value: "Check — usually not the drama" },
      { label: "Governance", value: "Large-cap disclosure" },
      { label: "Capital allocation", value: "Dividend vs building foods" },
      { label: "Related-party", value: "Read notes; mix of businesses is the real homework" },
    ],
    valuation: [
      { label: "Compare with", value: "HUL for foods — not a bank" },
      { label: "Debate", value: "Cigarette cash vs FMCG execution" },
      { label: "Live price", value: "Exchange — not here" },
      { label: "Trap", value: "Calling it cheap without the mix" },
    ],
    valuationNote: "The market argues about the mix. You should too.",
    peers: "HINDUNILVR · Godfrey (different) · hotel / paper peers by segment",
    tech: {
      trend: "Liquid, widely held",
      support: "Look up old ranges",
      resistance: "Look up prior highs",
      volume: "Result weeks",
      delivery: "Institutions usually present",
      spark: [50, 52, 51, 55, 58, 56, 60, 59, 63, 61, 64, 62],
    },
    risks: [
      { label: "Business", items: ["Mix of unlike shops"] },
      { label: "Industry", items: ["FMCG competition"] },
      { label: "Financial", items: ["Thinner foods margins"] },
      { label: "Regulatory", items: ["Tobacco tax", "ESG exclusion"] },
    ],
    outlook: {
      y1: "Cigarette volumes and tax.",
      y3: "Do foods actually gain share?",
      y5: "Cigarette company with extras — or a real FMCG house?",
    },
    thesis: {
      bull: "Cash cow funds a real FMCG climb.",
      base: "Fat dividend, slow mix shift.",
      bear: "Regulation or a failed FMCG spend.",
    },
    riskScore: 7,
    outlookScore: 6,
    drivers: ["Cigarette cash", "FMCG execution", "Tax / regulation"],
  },
  RELIANCE: {
    exchange: "NSE: RELIANCE",
    tagline: "Many businesses. One ticker.",
    chips: ["O2C", "Jio", "Retail", "New energy"],
    does: "Oil-to-chemicals, telecom, stores, and new energy. You must know which shop is earning this year.",
    moat: ["Scale and capital", "Jio network", "Retail reach"],
    position: "India’s largest listed conglomerate by many measures — complexity is the tax.",
    finance: [
      { label: "Read", value: "Segments, not one headline" },
      { label: "Capex", value: "Old engine vs new bets" },
      { label: "Debt", value: "Watch the pile while building" },
      { label: "5-year", value: "Will look lumpy on purpose" },
    ],
    financeTakeaway: "Right on Jio and wrong on refining can happen in the same quarter.",
    management: [
      { label: "Promoter", value: "Promoter-led, high-profile" },
      { label: "Pledge", value: "Check every year" },
      { label: "Governance", value: "Large, watched — still read notes" },
      { label: "Capital allocation", value: "The whole story" },
      { label: "Related-party", value: "Do not skip" },
    ],
    valuation: [
      { label: "Honest frame", value: "Sum-of-parts, not one PE" },
      { label: "Trap", value: "Treating it like simple FMCG or simple oil" },
      { label: "Live price", value: "Exchange — not here" },
      { label: "SOTP", value: "This page does not compute a live SOTP" },
    ],
    valuationNote: "One PE can mislead. Split the shops in your notebook.",
    peers: "No clean twin — compare each vertical to its own peers",
    tech: {
      trend: "Index giant; futures matter",
      support: "Look up weekly zones",
      resistance: "Look up prior highs",
      volume: "FII/DII + derivatives",
      delivery: "Breakouts need volume",
      spark: [55, 58, 62, 60, 65, 70, 68, 74, 72, 78, 75, 80],
    },
    risks: [
      { label: "Business", items: ["Complexity", "Execution"] },
      { label: "Industry", items: ["Oil spreads", "Telecom price war"] },
      { label: "Financial", items: ["Huge capex", "Debt"] },
      { label: "Regulatory", items: ["Energy / telecom rules"] },
    ],
    outlook: {
      y1: "O2C cycle and capex.",
      y3: "Retail and Jio cash vs investment.",
      y5: "Is new energy a real third engine?",
    },
    thesis: {
      bull: "India consumption + cheap data + energy transition.",
      base: "A giant that grows with India, at a full price.",
      bear: "Capex without returns.",
    },
    riskScore: 7,
    outlookScore: 6,
    drivers: ["O2C cash", "Jio + retail", "New-energy spend"],
  },
  HINDUNILVR: {
    exchange: "NSE: HINDUNILVR",
    tagline: "Everyday brands. High repeat. Often a high PE.",
    chips: ["FMCG", "Soaps", "Foods", "Rural + urban"],
    does: "Soaps, detergents, foods — small tickets, high repeat. Kirana plus modern trade.",
    moat: ["Brand", "Distribution", "Advertising muscle"],
    position: "India’s classic FMCG leader in many bathroom and kitchen aisles.",
    finance: [
      { label: "Growth", value: "Often slow and calm" },
      { label: "Margins", value: "Usually strong vs many FMCG peers" },
      { label: "Debt", value: "Typically low" },
      { label: "ROCE", value: "Quality tell" },
    ],
    financeTakeaway: "Boring numbers can be the point. A rocket is not required.",
    management: [
      { label: "Parent", value: "Unilever, professional bench" },
      { label: "Pledge", value: "Usually not the story" },
      { label: "Governance", value: "High disclosure" },
      { label: "Capital allocation", value: "Brands and distribution" },
      { label: "Related-party", value: "Parent royalties — read the notes" },
    ],
    valuation: [
      { label: "Compare with", value: "NESTLEIND, BRITANNIA, DABUR" },
      { label: "Habit", value: "Almost always ‘expensive’" },
      { label: "Lesson", value: "Great shop ≠ great purchase" },
      { label: "Live price", value: "Exchange — not here" },
    ],
    valuationNote: "This is why the valuation score is low: little room to be wrong.",
    peers: "NESTLEIND · BRITANNIA · DABUR · ITC (foods only)",
    tech: {
      trend: "Defensive, often slow",
      support: "Look up long ranges",
      resistance: "Look up prior highs",
      volume: "Spikes around results",
      delivery: "Institutions hold a lot",
      spark: [80, 79, 81, 78, 80, 82, 81, 83, 82, 84, 83, 85],
    },
    risks: [
      { label: "Business", items: ["Rural slowdown"] },
      { label: "Industry", items: ["Local competition"] },
      { label: "Financial", items: ["Raw-material spike"] },
      { label: "Valuation", items: ["PE prices perfection"] },
    ],
    outlook: {
      y1: "Volume vs price growth.",
      y3: "Premium mix.",
      y5: "Still the default bathroom and kitchen brands?",
    },
    thesis: {
      bull: "India consumption + brands that do not die.",
      base: "Slow compounder at a rich PE.",
      bear: "You overpay and sit still for years.",
    },
    riskScore: 5,
    outlookScore: 7,
    drivers: ["Brand + reach", "Rural demand", "Commodity costs"],
  },
  KPITTECH: {
    exchange: "NSE: KPITTECH · BSE: 542651",
    tagline: "From cars to connected intelligence.",
    chips: ["Automotive software", "EV", "ADAS", "SDV", "AI", "Mobility"],
    marketCap: "₹15,000 Cr (approx)",
    sector: "Automotive Software",
    industry: "Mobility & Auto Tech",
    priceBand: "₹550 – ₹575 (approx)",
    does: "Specialised automotive software company focused on next-gen mobility — software-defined vehicles, EV platforms, ADAS, and connected cars.",
    doesLines: [
      "Software Defined Vehicles (SDV)",
      "EV Platforms & Powertrain Software",
      "Autonomous Driving & ADAS",
      "Embedded & Vehicle Engineering",
      "AI for Mobility & Connected Cars",
    ],
    moat: [
      "Deep automotive domain expertise",
      "Long-term OEM partnerships (global)",
      "High switching costs",
      "Global delivery capability",
      "EV & SDV tailwinds",
    ],
    position: "Leading pure-play automotive software player in India with global presence.",
    years: [
      { label: "FY22", revenueCr: 2432, patCr: 139 },
      { label: "FY23", revenueCr: 3247, patCr: 356 },
      { label: "FY24", revenueCr: 4472, patCr: 552 },
      { label: "FY25", revenueCr: 5674, patCr: 772 },
      { label: "FY26", revenueCr: 6455, patCr: 952 },
    ],
    finance: [
      { label: "Revenue CAGR (5Y)", value: "~25%" },
      { label: "Profit CAGR (5Y)", value: "~40%" },
      { label: "ROE", value: "~20%" },
      { label: "ROCE", value: "~26%" },
      { label: "Operating margin", value: "~18%" },
      { label: "Net margin", value: "~15%" },
      { label: "Debt / Equity", value: "Low" },
      { label: "Interest coverage", value: "Strong" },
      { label: "Dividend yield", value: "~1.3%" },
    ],
    financeTakeaway: "Revenue nearly tripled in four years. Healthy cash generation. Strong profitability.",
    management: [
      { label: "Promoter holding", value: "~50%+ (stable trend)" },
      { label: "Pledge status", value: "No significant pledge" },
      { label: "Corporate governance", value: "No major controversies; disclosed related-party policy" },
      { label: "Capital allocation", value: "Focused on growth, R&D, acquisitions and dividends" },
      { label: "Related-party transactions", value: "No material issues reported" },
    ],
    valuation: [
      { label: "P/E (TTM)", value: "25–27 vs industry 32–45" },
      { label: "P/B (TTM)", value: "4.4 vs industry 6–8" },
      { label: "EV/EBITDA", value: "18–20 vs industry 25–35" },
      { label: "Dividend yield", value: "1.3% vs industry 1–2%" },
    ],
    valuationNote: "KPIT trades at a discount to large IT peers. Current valuation is lower than historical peaks, offering a classroom margin of safety — not a buy call.",
    peers: "TCS · Infosys · HCLTech · LTIMindtree",
    peerBars: [
      { label: "KPITTECH", value: 26 },
      { label: "TCS", value: 33 },
      { label: "Infosys", value: 27 },
      { label: "HCLTech", value: 24 },
      { label: "LTIMindtree", value: 38 },
    ],
    fairValue: "₹650 – ₹800",
    marginOfSafety: "Current valuation is lower than historical peaks.",
    tech: {
      trend: "Long-term positive; medium-term weak recovery; short-term consolidation",
      trendLong: "Positive",
      trendMid: "Weak recovery",
      trendShort: "Consolidation",
      support: "₹540 / ₹500",
      resistance: "₹650 / ₹750",
      volume: "Moderate",
      delivery: "70–75%",
      spark: [540, 580, 620, 700, 660, 720, 680, 640, 610, 590, 570, 560, 555],
    },
    risks: [
      { label: "Business", items: ["Global automotive demand", "Client concentration"] },
      { label: "Industry", items: ["EV adoption slowdown", "Industry cyclicality"] },
      { label: "Financial", items: ["Global recession impact", "Currency fluctuations"] },
      { label: "Regulatory", items: ["EV & emissions regulations", "Geopolitical risks"] },
    ],
    outlook: {
      y1: "Recovery possible if auto-tech spending improves.",
      y3: "ADAS, EV & SDV adoption to drive growth.",
      y5: "Could emerge as a global automotive software leader.",
    },
    thesis: {
      bull: "EV boom accelerates. Autonomous driving adoption. Global OEM contracts increase.",
      base: "Steady 12–18% growth. Margin expansion. New wins in SDV/EV.",
      bear: "Global auto slowdown. Client spending cuts. Delay in EV adoption.",
    },
    thesisTargets: {
      bull: "₹900 – ₹1,100",
      base: "₹700 – ₹850",
      bear: "₹400 – ₹500",
    },
    riskScore: 7,
    outlookScore: 8,
    headlineScore: 84,
    drivers: ["EV & SDV growth", "Strong global OEM relationships", "R&D and innovation focus", "Attractive valuation vs peers"],
    verdictQuote:
      "KPIT is not a traditional IT company; it is a specialised automotive software and mobility technology company positioned to benefit from EVs, AI-powered vehicles and software-defined vehicles over the next decade.",
  },
  BSOFT: {
    exchange: "NSE: BSOFT",
    tagline: "Mid-tier IT. Digital work. CK Birla group.",
    chips: ["Digital", "Cloud", "ERP", "Manufacturing", "BFSI"],
    does: "IT services and digital transformation for global clients — cloud, enterprise apps, industry software. A mid-tier shop, not TCS-scale.",
    moat: [
      "Account relationships",
      "Manufacturing / BFSI domain",
      "CK Birla group backing",
    ],
    position: "Mid-tier Indian IT with a global client mix — smaller than INFY/TCS, more room (and more risk).",
    finance: [
      { label: "Growth", value: "Can outrun giants in a good cycle" },
      { label: "Margins", value: "Watch wage vs price" },
      { label: "Cash", value: "FCF is the honesty test" },
      { label: "Debt", value: "Healthy IT is usually light" },
    ],
    financeTakeaway: "Mid-tier IT can grow faster — and fall faster — than the giants.",
    management: [
      { label: "Promoter", value: "CK Birla group — check holding trend" },
      { label: "Pledge", value: "Healthy = no meaningful pledge" },
      { label: "Governance", value: "No major controversy is the clean read" },
      { label: "Capital allocation", value: "Dividend vs growth spend" },
      { label: "Related-party", value: "Read the notes" },
    ],
    valuation: [
      { label: "Compare with", value: "Other mid IT, not a bank" },
      { label: "Vs giants", value: "Often a cheaper PE — ask why" },
      { label: "Trap", value: "Discount can be a warning" },
      { label: "Live price", value: "Exchange — not here" },
    ],
    valuationNote: "A discount to TCS is a question, not a buy button.",
    peers: "TCS · INFY · HCLTECH · LTIM (size differs)",
    tech: {
      trend: "More volatile than the giants",
      support: "Look up weekly lows",
      resistance: "Look up prior highs",
      volume: "Moderate — check conviction",
      delivery: "Institutions can matter in a smaller float",
      spark: [48, 50, 47, 55, 58, 54, 60, 57, 63, 61, 66, 64],
    },
    risks: [
      { label: "Business", items: ["Client-budget cuts", "Pricing"] },
      { label: "Industry", items: ["IT spend cycle", "AI pressure"] },
      { label: "Financial", items: ["Wage inflation", "FX"] },
      { label: "Size", items: ["Smaller than TCS in a freeze"] },
    ],
    outlook: {
      y1: "Deal wins and margins.",
      y3: "Digital mix vs traditional work.",
      y5: "Independent mid-tier — or squeezed?",
    },
    thesis: {
      bull: "Digital spend + a reasonable price vs giants.",
      base: "Ordinary IT compounder.",
      bear: "A long IT winter hits mid-tier first.",
    },
    riskScore: 6,
    outlookScore: 7,
    drivers: ["Digital + cloud", "Manufacturing / BFSI", "Balance-sheet discipline"],
  },
};

function fallbackReport(lesson: StockLesson): StockReport {
  const thesis = splitThesis(lesson.notes.thesis);
  return {
    exchange: `NSE: ${lesson.symbol}`,
    tagline: lesson.summary.split(".")[0] + ".",
    chips: lesson.sector.split(/[·,/]/).map((s) => s.trim()).filter(Boolean),
    does: lesson.notes.business,
    moat: ["Read the annual report", "Name the repeat customer", "Ask what a rival cannot copy"],
    position: lesson.sector,
    finance: [
      { label: "5-year sales", value: "Look up — this page is not live" },
      { label: "Profit", value: "Should walk with sales" },
      { label: "Cash", value: "Profit without cash is a story" },
      { label: "Debt", value: "Industry-relative" },
    ],
    financeTakeaway: lesson.notes.financials,
    management: [
      { label: "Promoter holding", value: "Rising, stable, or leaving?" },
      { label: "Pledge", value: "Zero is clean" },
      { label: "Governance", value: "Auditor + board can say no" },
      { label: "Capital allocation", value: "Grow, return, or empire?" },
      { label: "Related-party", value: "Read the notes" },
    ],
    valuation: [
      { label: "PE / PB", value: "Vs same-industry peers" },
      { label: "Fair band", value: "A range, not a magic number" },
      { label: "Margin of safety", value: "Room to be wrong" },
      { label: "Live price", value: "Exchange — not here" },
    ],
    valuationNote: lesson.notes.valuation,
    peers: "Same industry only",
    tech: {
      trend: lesson.notes.technicals,
      support: "Look up swing lows",
      resistance: "Look up old highs",
      volume: "Conviction on up days?",
      delivery: "Shares taken home?",
      spark: [40, 44, 42, 50, 48, 55, 52, 58, 56, 60, 59, 62],
    },
    risks: [
      { label: "Business", items: [lesson.notes.risks] },
      { label: "Industry", items: ["Cycle / commodity / tech shift"] },
      { label: "Financial", items: ["Debt, cash, pledge"] },
      { label: "Regulatory", items: ["SEBI / RBI / tax / licence"] },
    ],
    outlook: {
      y1: lesson.notes.outlook,
      y3: "Does ROCE still beat the cost of capital?",
      y5: "Will the shop still be needed?",
    },
    thesis,
    riskScore: 6,
    outlookScore: 6,
    drivers: ["Homework first", "Cash second", "Price last"],
  };
}

function splitThesis(raw: string) {
  const bull = raw.match(/Bull:\s*([^.]+)/i)?.[1]?.trim();
  const base = raw.match(/Base:\s*([^.]+)/i)?.[1]?.trim();
  const bear = raw.match(/Bear:\s*([^.]+)/i)?.[1]?.trim();
  return {
    bull: bull ? bull + "." : raw,
    base: base ? base + "." : "The boring middle — plan around this.",
    bear: bear ? bear + "." : "Name a way to lose money.",
  };
}

export function getStockReport(lesson: StockLesson): StockReport {
  return REPORTS[lesson.symbol] ?? fallbackReport(lesson);
}

export function reportTotal(lesson: StockLesson, report: StockReport) {
  const vals = [
    lesson.scores.business,
    lesson.scores.financials,
    lesson.scores.management,
    lesson.scores.valuation,
    lesson.scores.technicals,
    report.riskScore,
    report.outlookScore,
  ];
  const avg10 = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { avg10, score100: report.headlineScore ?? Math.round(avg10 * 10) };
}

export function verdictLabel(score100: number) {
  if (score100 >= 80) return "Strong quality case";
  if (score100 >= 70) return "Study further";
  if (score100 >= 55) return "Mixed homework";
  return "Weak / more risks";
}
