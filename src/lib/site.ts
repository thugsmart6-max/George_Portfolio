export const NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/stories", label: "Success Stories" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const QUALIFICATIONS = [
  { code: "B.E.", title: "Computer Science & Engineering", kind: "Education" },
  { code: "NISM", title: "Mutual Fund Distributor", kind: "Certification" },
  { code: "NISM", title: "Research Analyst", kind: "Certification" },
  { code: "NISM", title: "Investment Adviser — Level 1", kind: "Certification" },
  { code: "NISM", title: "Investment Adviser — Level 2", kind: "Certification" },
] as const;

export const CHANNEL_PARTNERS = [
  {
    name: "Alice Blue",
    role: "Channel partner",
    line: "Execution and market access for learners who are ready to practise with a broker.",
  },
  {
    name: "NJ Wealth",
    role: "Channel partner",
    line: "Mutual-fund and wealth-distribution pathway for long-horizon families.",
  },
] as const;

export const ASSOCIATED_ORGS = [
  {
    mark: "TH",
    name: "Thanith Investments",
    note: "Holding & capital",
    logo: "/company-logo/thanith.png",
  },
  {
    mark: "RZ",
    name: "Rafzon Institute of Education",
    note: "Talent engine",
    logo: "/company-logo/Rafzon.png",
  },
  {
    mark: "RK",
    name: "RKR Landmark's",
    note: "Real assets",
    logo: "/company-logo/RKR.png",
  },
  {
    mark: "JX",
    name: "Jaxpat Hyper Technology",
    note: "Technology",
    logo: "/company-logo/jaxpat.png",
  },
] as const;

export const JOURNEY = [
  {
    year: "Foundation",
    title: "Engineer first",
    body: "B.E. in Computer Science — systems thinking before market thinking. Code taught sequence. Markets later taught patience.",
    gimmick: "If-then, then compound.",
  },
  {
    year: "Licence",
    title: "NISM stack",
    body: "Mutual Fund Distributor, Research Analyst, Investment Adviser Level 1 and Level 2 — the paper trail that lets education stay honest.",
    gimmick: "Four certificates. One filter: can I explain it simply?",
  },
  {
    year: "Build",
    title: "Thanith & classrooms",
    body: "Ventures under Thanith, teaching rooms under Rafzon, and a public brand — Wealth By George — so mindset and machinery sit in the same week.",
    gimmick: "Teach Monday. Build Tuesday. Repeat.",
  },
  {
    year: "Now",
    title: "Chennai, outward",
    body: "Investors, students, and businesses — three doors, one promise: awareness before action. Tamil Nadu first, India next.",
    gimmick: "Same 24 hours. Different operating system.",
  },
] as const;

export const SERVICE_GROUPS = [
  {
    slug: "investors",
    title: "Investors",
    blurb: "Clarity on what you already hold — and what the next decade needs.",
    items: [
      {
        title: "Portfolio Review",
        line: "A structured read of allocation, overlap, and risk — education first, no product push.",
        detail:
          "We map what you already hold: equity, debt, gold, insurance-as-investment, and idle cash. Overlap across funds is named in plain language. You leave with a written picture of risk — not a product to sign that afternoon. Education first; you decide what to change.",
      },
      {
        title: "Financial Planning",
        line: "Goals, cash-flow, insurance, and investing sequenced so EMI does not eat the future.",
        detail:
          "Goals are sequenced against salary, EMIs, and a real emergency pocket. Insurance is treated as protection, not a savings substitute. Investing starts after the buffer exists. The plan is a calendar you can keep when the market is loud.",
      },
      {
        title: "Investment Education",
        line: "How SIP, SWP, debt, and equity actually behave — so you stop borrowing someone else’s conviction.",
        detail:
          "SIP, SWP, debt, and equity are walked as behaviour, not slogans. You see what compounding needs (time, contribution, not a hot tip) and what leverage costs. The aim is your own conviction — so a WhatsApp forward cannot move the SIP.",
      },
    ],
  },
  {
    slug: "students",
    title: "Students",
    blurb: "Literacy before leverage. Careers that understand money.",
    items: [
      {
        title: "Career Guidance",
        line: "Finance, markets, and adjacent paths — mapped to aptitude, not Instagram titles.",
        detail:
          "NISM, markets, family business, and adjacent tech paths are compared to aptitude and household reality. Titles from Instagram are stripped. You leave with a map: what to study this year, what to ignore, and what a first job in this field actually pays in time.",
      },
      {
        title: "Stock Market Basics",
        line: "Indices, orders, risk, and the difference between trading and investing.",
        detail:
          "What an index is, how an order reaches the exchange, and why brokerage plus emotion is expensive tuition. Trading and investing are separated on the board. Students practise reading a quote without copying a thumbnail.",
      },
      {
        title: "Financial Literacy Program",
        line: "Salary, savings, EMIs, and the first SIP — campus or cohort format.",
        detail:
          "Campus or cohort: salary in, needs vs wants, EMI math, and the first SIP sized to a number they can keep. Three sessions typical — leave with a written amount, not a motivational quote.",
      },
    ],
  },
  {
    slug: "business",
    title: "Business",
    blurb: "Teams that can talk money without theatre.",
    items: [
      {
        title: "Corporate Financial Awareness Sessions",
        line: "Workshops for employees on salary, tax basics, and long-term investing.",
        detail:
          "HR-friendly rooms on salary structure, PF/NPS, tax basics, and long-term investing. No product desk. Teams leave able to ask better questions of their own CA — and stop treating the office uncle as the family CIO.",
      },
      {
        title: "Investment Workshops",
        line: "Half-day or full-day rooms for founders and operators who need a shared language.",
        detail:
          "Half-day or full-day. Founders and operators get one vocabulary for cash, debt, and equity so the leadership table does not argue in slogans. Worked examples use the planner and calculators live.",
      },
      {
        title: "Guest Speaking",
        line: "Colleges, chambers, and company offsites — wealth mindset with a Tamil Nadu lens.",
        detail:
          "Colleges, chambers, and offsites. Wealth mindset with a Tamil Nadu lens: salary, gold, land, and SIP in the same hour. The brief is education — not a pitch deck disguised as a keynote.",
      },
    ],
  },
] as const;

export const ACADEMY_COURSES = [
  {
    n: "01",
    title: "Stock Market Basics",
    level: "Start here",
    line: "How markets open, what you actually buy, and why most first trades are expensive tuition.",
    detail:
      "Open, high, low, close; what a share is; how brokerage and slippage eat a first trade. Indices vs single names. The room practises a paper ticket before anyone talks about ‘calls’. You should leave knowing the difference between the exchange and a YouTube thumbnail.",
  },
  {
    n: "02",
    title: "Personal Finance",
    level: "Everyday money",
    line: "Salary, emergency fund, debt, insurance, and the 6-month / 3-month buffers.",
    detail:
      "Salary in, needs vs wants, EMI as a percentage of take-home, and the 3-month then 6-month buffer. Insurance is protection. Gold and land are named honestly — not worshipped, not dismissed. The homework is a written cash-flow, not a new app.",
  },
  {
    n: "03",
    title: "Investing for Beginners",
    level: "First corpus",
    line: "SIP discipline, asset classes, and how to sit still while the chart shouts.",
    detail:
      "Asset classes, SIP as behaviour, and why sitting still is a skill. Factsheets without copying a thumbnail. You size a first SIP to money you will not miss next month. The course is quiet on purpose.",
  },
  {
    n: "04",
    title: "Advanced Wealth Building",
    level: "Compound years",
    line: "SWP design, goal corpus math, good vs bad debt, and building assets that outlive income.",
    detail:
      "Goal corpus math, SWP design, good vs bad debt, and assets that should outlive a salary. For people who already have a SIP and a buffer. Still education — not a managed-account pitch.",
  },
] as const;

export const ACADEMY_RHYTHM = [
  {
    title: "Listen",
    line: "Stories and numbers in the same hour.",
    detail:
      "A case, then the calculator. Narrative without numbers is theatre; numbers without a story do not stick. The hour holds both.",
  },
  {
    title: "Work",
    line: "Calculators and the planner — live in the session.",
    detail:
      "SIP, lumpsum, SWP, and the wealth planner are used in the room. You leave with a screenshot of your own numbers, not a PDF of someone else’s.",
  },
  {
    title: "Keep",
    line: "A rule you can repeat when the market shouts.",
    detail:
      "One sentence you can say in a crash: no leverage until the buffer exists; SIP date does not move because a cousin forwarded a chart.",
  },
] as const;

export const TESTIMONIALS = [
  {
    who: "IT professional · Chennai",
    kind: "Client",
    quote:
      "The review did not sell me a product. It showed me three overlapping funds and one EMI I was romanticising.",
    detail:
      "A 90-minute portfolio review: three funds doing the same job, one EMI dressed as ‘investment’. The homework was overlap, not a new folio. Composite classroom story — typical path, not a guaranteed outcome.",
  },
  {
    who: "First-generation investor · Coimbatore",
    kind: "Client",
    quote:
      "I wanted a stock tip. I left with a 12-month SIP and a rule: no leverage until the emergency fund exists.",
    detail:
      "Walked in for a name to buy. Walked out with a 12-month SIP calendar and a written rule on leverage. The tip was refused on purpose. Composite story — not a promise of returns.",
  },
  {
    who: "MBA cohort · campus session",
    kind: "Student",
    quote:
      "Stock Market Basics finally separated trading from investing. The room went quiet at the brokerage slide.",
    detail:
      "Campus session. Brokerage, slippage, and the difference between a trade and a SIP. The quiet was the point. Classroom composite — not a placement statistic.",
  },
] as const;

export const STUDENT_WINS = [
  {
    title: "Campus literacy sprint",
    metric: "3-session arc",
    line: "Salary → emergency fund → first SIP. Students left with a number, not a slogan.",
    detail:
      "Session one: take-home and needs. Session two: buffer math. Session three: SIP sized to leftover rupees. Attendance was the cohort; the artefact was a number on paper.",
  },
  {
    title: "Beginner cohort",
    metric: "8 weeks",
    line: "From ‘what is an index’ to reading a factsheet without copying a YouTube thumbnail.",
    detail:
      "Weekly rooms. Index, factsheet, SIP, and sitting still. The exam was reading a page aloud without a influencer’s caption. Eight weeks is literacy, not a trading desk.",
  },
  {
    title: "Career desk",
    metric: "1:1 maps",
    line: "NISM path vs coding path vs family business — chosen with eyes open.",
    detail:
      "One-to-one maps: what NISM actually is, what a first markets job looks like, and when the family shop is the honest path. Chosen with eyes open — not a course upsell.",
  },
] as const;

export const CASE_STUDIES = [
  {
    title: "Salary, two EMIs, no buffer",
    sector: "Household",
    result: "Paused one discretionary EMI, built a 3-month emergency pocket, then started a modest SIP.",
    detail:
      "Before: two EMIs, zero months of expenses in cash, SIP postponed ‘until next bonus’. After: one discretionary EMI paused, three-month pocket funded, SIP started small. Education sequence — not a managed account. Outcomes are typical classroom paths, not guarantees.",
  },
  {
    title: "Lumpsum itch after a bonus",
    sector: "Investor",
    result: "Split the bonus: tax, emergency top-up, and a 12-month SIP instead of one concentrated bet.",
    detail:
      "Before: bonus earmarked for a single name because a cousin was ‘sure’. After: tax set aside, emergency topped up, remainder into a 12-month SIP. The itch was named; the bet was refused.",
  },
  {
    title: "Team workshop for a services firm",
    sector: "Business",
    result: "Shared language on PF, NPS, and SIPs so HR was not the only person answering money questions.",
    detail:
      "Half-day for a services team. PF, NPS, and SIP on the same board. HR stopped being the unofficial wealth desk. Follow-up was a one-pager, not a product table.",
  },
] as const;

export const RESOURCE_ITEMS = [
  {
    href: "/resources#ebook",
    title: "E-Book",
    line: "Free wealth-thinking notes — mindset before products.",
  },
  {
    href: "/calculators",
    title: "Calculator",
    line: "SIP, lumpsum, SWP, EMI, GST, brokerage, margin — one formula at a time.",
  },
  {
    href: "/planner",
    title: "Planner",
    line: "SIP in, SWP need out — plus debt, buffers, inflation. One desk.",
  },
  {
    href: "/resources/tracker",
    title: "Investment Tracker",
    line: "NSE equity book: Alice LTP, dated lots, realized vs unrealized, XIRR when cash-flows exist.",
  },
  {
    href: "/resources/analysis",
    title: "Equity Research Analysis",
    line: "Live NSE sheet from Alice Blue LTP, range, and chart.",
  },
  {
    href: "/resources/ask",
    title: "Ask a Finance Question",
    line: "Send a clear question. Get an educational reply — not a product pitch.",
  },
] as const;

export const GALLERY_SLOTS = [
  {
    id: "events",
    title: "Event Photos",
    status: "Planned",
    note: "Community rooms, launches, and campus days.",
  },
  {
    id: "seminars",
    title: "Seminar Photos",
    status: "Planned",
    note: "Workshops and literacy sessions on record.",
  },
  {
    id: "speaking",
    title: "Public Speaking",
    status: "Planned",
    note: "Stage stills — colleges, chambers, companies.",
  },
  {
    id: "studio",
    title: "Professional Photo Shoot",
    status: "30 Oct",
    note: "Studio portraits scheduled within 30 days — add frames after 30 October.",
  },
] as const;

export const RESOURCE_FLOW = [
  {
    n: "01",
    title: "Debt",
    line: "Name it. Price it. Kill the expensive kind first.",
  },
  {
    n: "02",
    title: "SIP",
    line: "Then pay your future on a date the market cannot negotiate.",
  },
  {
    n: "03",
    title: "Investment",
    line: "Only then choose instruments — with a philosophy, not a tip.",
  },
] as const;
