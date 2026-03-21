export interface Persona {
  id: string;
  name: string;
  emoji: string;
  age: number;
  background: string;
  goals: string;
  evaluationCriteria: string;
  behaviorPattern: string;
}

export interface PersonaResult {
  personaId: string;
  personaName: string;
  personaEmoji: string;
  preference: "production" | "preview";
  confidence: "high" | "medium" | "low";
  rationale: string;
  productionPros: string[];
  productionCons: string[];
  previewPros: string[];
  previewCons: string[];
}

export interface GhostshipReport {
  winner: "production" | "preview" | "inconclusive";
  confidence: number;
  preferenceSplit: { production: number; preview: number };
  personas: PersonaResult[];
  summary: string;
  previewUrl: string;
  productionUrl: string;
}

export const personas: Persona[] = [
  {
    id: "budget-buyer",
    name: "Budget-Conscious Buyer",
    emoji: "🛍️",
    age: 34,
    background:
      "A mid-30s professional who compares pricing across multiple competitors before making any purchase decision. Extremely cost-sensitive and reads every line of pricing pages, including footnotes and terms. Has been burned by hidden fees before and approaches SaaS pricing with healthy skepticism.",
    goals:
      "Find the best value-for-money option by thoroughly understanding what each pricing tier includes and excludes. Identify any hidden costs, upsells, or confusing pricing structures that could lead to unexpected charges. Build enough trust in the product to justify the spend to a partner or manager.",
    evaluationCriteria:
      "Pricing clarity and transparency — are costs immediately obvious or buried? Value perception — does the page communicate what you get for your money? Trust signals — testimonials, guarantees, clear refund policies. Absence of dark patterns like pre-selected expensive tiers or misleading 'most popular' badges.",
    behaviorPattern:
      "Scrolls slowly and methodically through the entire page, paying special attention to pricing tables, feature comparisons, and fine print. Compares tiers side-by-side, looking for the catch in each one. Spends extra time on any asterisks, footnotes, or 'starting at' language that might obscure the true cost.",
  },
  {
    id: "power-user",
    name: "Power User / Developer",
    emoji: "💻",
    age: 28,
    background:
      "A late-20s software engineer who is technically literate, impatient, and values efficiency above all else. Evaluates tools based on developer experience, API quality, and documentation depth. Has no patience for marketing fluff and wants to get to the substance immediately.",
    goals:
      "Quickly determine if this product solves a real technical problem and how fast they can get started. Find the primary call-to-action (docs, signup, or demo) within seconds. Assess whether the product is built by people who understand developers or is just another marketing-first tool.",
    evaluationCriteria:
      "Information density — does the page respect their time with concise, substantive content? CTA clarity — is there a single, obvious next step (not three competing buttons)? Page load perception — does the site feel fast and responsive? Layout efficiency — no-nonsense structure that surfaces technical details without forcing them through a marketing funnel.",
    behaviorPattern:
      "Scans the page rapidly in an F-pattern, spending less than 5 seconds on the hero before looking for the action button or docs link. Skips testimonials and marketing copy entirely. Gets visibly annoyed by autoplaying videos, chatbot popups, or anything that interrupts their scan. Will bounce immediately if the page feels slow or bloated.",
  },
  {
    id: "executive",
    name: "Non-Technical Executive",
    emoji: "💼",
    age: 52,
    background:
      "A C-suite executive in their 50s evaluating tools for their team. Has limited time and delegates technical details to reports. Makes decisions based on whether something 'feels right' — professional appearance, clear value proposition, and trustworthiness matter more than feature lists.",
    goals:
      "Understand what this product does and why it matters for their organization within 10 seconds. Determine if it looks credible enough to forward to a team lead for deeper evaluation. Get a clear sense of the business value without needing to understand the technical implementation.",
    evaluationCriteria:
      "Professional appearance — does the site look like it belongs to a serious company? Clarity of value proposition — can they explain what this does to their board in one sentence? Trustworthiness — recognizable logos, enterprise features, security mentions. Simplicity — the page should not overwhelm with technical jargon or complex feature matrices.",
    behaviorPattern:
      "Spends fewer than 10 seconds on the page and needs to 'get it' immediately or bounces. Reads only the headline, subheadline, and maybe one section of body copy. Looks for social proof (logos, customer names) and skips everything else. If the value isn't obvious at a glance, they close the tab and move on to the next option.",
  },
  {
    id: "first-timer",
    name: "First-Time Visitor",
    emoji: "👀",
    age: 25,
    background:
      "A 25-year-old who landed on this page from a Google search with no prior brand awareness. Currently has 3-4 competitor tabs open and is actively comparing options. Has no loyalty and will pick whichever product makes the strongest first impression and clearest case for itself.",
    goals:
      "Quickly understand what this product does and whether it's worth exploring further versus the other tabs already open. Find a clear differentiator — what makes this option stand out from the alternatives? Determine how easy it would be to get started if they chose this product.",
    evaluationCriteria:
      "First impression — does the page immediately communicate what this is and who it's for? Ease of understanding — can a newcomer grasp the value proposition without domain expertise? Differentiation — is there a clear reason to choose this over competitors? Onboarding friction — how many steps between 'interested' and 'using the product'?",
    behaviorPattern:
      "Does a quick 3-5 second scan of the hero section, looking for reasons to stay or leave. Compares the headline and visual style against the other open tabs. Scrolls down only if the first impression passes the bar. Clicks away at the first sign of confusion, jargon overload, or unclear next steps.",
  },
  {
    id: "accessibility",
    name: "Accessibility-Focused User",
    emoji: "♿",
    age: 40,
    background:
      "A 40-year-old professional who uses screen magnification software and is highly sensitive to visual design choices that affect usability. Has low vision and relies on clear contrast, logical heading structure, and predictable keyboard navigation to use the web effectively.",
    goals:
      "Navigate the page effectively using their assistive tools and determine if the product is usable and accessible. Identify any visual or structural barriers that would prevent them from using the product confidently. Assess whether the company cares about accessibility — which signals whether the product itself will be accessible.",
    evaluationCriteria:
      "Visual hierarchy — are headings, sections, and CTAs clearly distinguished through size, weight, and spacing? Contrast ratios — is text readable against its background, especially smaller body text? Logical heading order — does the page follow a sensible H1 → H2 → H3 structure? CTA discoverability — are buttons and links obvious without relying solely on color? Text readability — reasonable font sizes, line heights, and paragraph widths.",
    behaviorPattern:
      "Relies on clear visual structure to orient themselves on the page. Struggles with cluttered layouts, low-contrast text, and decorative elements that interfere with content. Uses keyboard navigation and expects focus indicators on interactive elements. Zooms in frequently, so horizontal scrolling or content that breaks at larger text sizes is a dealbreaker.",
  },
];
