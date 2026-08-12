export const BRAND = {
  name: "Dr. George Antony",
  shortName: "Dr. George",
  brand: "Wealth By George",
  holding: "Thanith Investments Pvt Ltd",
  email: "jayageorgeantony.mg@gmail.com",
  location: "Chennai, India",
  visionYear: 2031,
  motto:
    "The poor man and the rich man have the same 24 hours. What differs is the mind that runs them.",
  philosophy: "Wealth isn't built by income. It's built by thinking.",
  heroLine:
    "Building businesses, empowering people, and creating wealth through education, technology, and innovation.",
  roles: ["Entrepreneur", "Investor", "Educator"],
} as const;

export const VALUES = [
  { title: "Innovation", blurb: "Build what does not exist yet." },
  { title: "Continuous Learning", blurb: "Stay curious. Stay sharp." },
  { title: "Integrity", blurb: "Trust is the real compound interest." },
  { title: "Strategic Thinking", blurb: "Decide with clarity, not noise." },
  { title: "Wealth Creation", blurb: "Assets over appearances." },
  { title: "Positive Impact", blurb: "Grow people as you grow enterprises." },
] as const;

export const VERTICALS = [
  {
    slug: "thanith",
    mark: "TI",
    name: "Thanith Investments Pvt Ltd",
    role: "Holding Company",
    sector: "Capital · Governance · Strategy",
    summary:
      "Parent entity that owns, funds, and governs all verticals — capital allocation, brand oversight, and IPO-readiness by 2031.",
  },
  {
    slug: "rafzon",
    mark: "RZ",
    name: "Rafzon Institute of Education",
    role: "The Talent Engine",
    sector: "EdTech · Skill Development",
    summary:
      "Skill-based learning with programs like Full Stack Development — pan-India, multilingual. Builds human capital for the group.",
  },
  {
    slug: "jaxpat",
    mark: "JX",
    name: "Jaxpat Hyper Technology",
    role: "The Technology Engine",
    sector: "Product-based IT",
    summary:
      "Proprietary software products and digital IP — converting trained talent into technology assets.",
  },
  {
    slug: "rkr",
    mark: "RK",
    name: "RKR Landmark's",
    role: "The Asset Engine",
    sector: "Construction · Real Estate (est. 2000)",
    summary:
      "The most established vertical — tangible asset backing, property cash flow, and credibility for expansion.",
  },
  {
    slug: "fourth",
    mark: "04",
    name: "Fourth Venture",
    role: "The Asset-Building Engine",
    sector: "Concept stage · Finance-facing",
    summary:
      "Completing the portfolio — designed to connect Wealth By George audiences with financial asset pathways.",
  },
  {
    slug: "wbg",
    mark: "WG",
    name: "Wealth By George",
    role: "Brand & Distribution",
    sector: "Content · Community · Trust",
    summary:
      "Audience and trust layer across everything — business growth, wealth creation, entrepreneurship, and financial awareness.",
  },
] as const;

export const BOOKS = [
  {
    n: "01",
    title: "Wealth Thinking",
    subtitle: "Mindset before money",
    blurb:
      "A practical philosophy of financial awareness — how thinking, not income alone, shapes long-term wealth.",
    topics: ["Mindset", "Financial Awareness", "Habits"],
    status: "coming_soon" as const,
  },
  {
    n: "02",
    title: "Build to Own",
    subtitle: "Entrepreneurship as an asset path",
    blurb:
      "From idea to enterprise — frameworks for building businesses that create value, cash flow, and optionality.",
    topics: ["Entrepreneurship", "Business Growth", "Strategy"],
    status: "coming_soon" as const,
  },
  {
    n: "03",
    title: "The Same 24 Hours",
    subtitle: "Personal development for builders",
    blurb:
      "Communication, discipline, and presence — the soft infrastructure behind hard results.",
    topics: ["Personal Development", "Communication", "Leadership"],
    status: "coming_soon" as const,
  },
] as const;

export const TOPICS = [
  "Business Growth",
  "Wealth Creation",
  "Entrepreneurship",
  "Personal Development",
  "Communication Skills",
  "Financial Awareness",
] as const;

export const VISION_MILESTONES = [
  { year: "Now", label: "Operate & educate", detail: "Grow verticals + Wealth By George community" },
  { year: "2027", label: "Cash-flow systems", detail: "Strengthen Rafzon & Jaxpat revenue engines" },
  { year: "2029", label: "Asset depth", detail: "RKR + finance arm maturity" },
  { year: "2031", label: "IPO-ready group", detail: "Thanith verticals prepared for public markets" },
] as const;
