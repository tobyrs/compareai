// ============================================================
// CompareAI model database — single source of truth.
// Prices are USD per 1M tokens.
// Static values below are the July 2026 snapshot/fallback;
// live.json (refreshed daily from OpenRouter by GitHub Actions)
// overrides price + context at load time — see bottom of file.
// null = not publicly confirmed (render as "—").
// ============================================================
import live from "./live.json";

export type Tier = "flagship" | "balanced" | "budget" | "open";

export interface Provider {
  id: string;
  name: string;
  color: string; // identity accent (chips/badges only — bars stay single-hue)
  blurb: string;
}

export interface AIModel {
  id: string;
  providerId: string;
  name: string;
  tier: Tier;
  released: string; // human-readable
  /** Context window in thousands of tokens (1000 = 1M). null = varies/unconfirmed */
  contextK: number | null;
  /** Max output tokens in thousands. */
  maxOutputK: number | null;
  priceIn: number | null;
  priceOut: number | null;
  caps: {
    reasoning: boolean; // extended/adaptive thinking
    vision: boolean;
    toolUse: boolean;
    openWeights: boolean;
    promptCaching: boolean;
  };
  /** Published benchmark scores (%, only where publicly reported — never estimated). */
  bench?: {
    gpqaDiamond?: number; // graduate-level science reasoning
    sweVerified?: number; // real-world software engineering
  };
  bestFor: string[];
  beginnerNote: string; // plain-English one-liner
  expertNote: string; // API-level detail
  strengths: string[];
  considerations: string[];
}

export const PROVIDERS: Provider[] = [
  // colors = validated dark-mode categorical slots (CVD-safe ordering); dots always paired with name labels
  { id: "openai", name: "OpenAI", color: "#3987e5", blurb: "Maker of ChatGPT and the GPT family — the largest AI API provider, broad model ladder from nano to frontier." },
  { id: "google", name: "Google", color: "#199e70", blurb: "Maker of Gemini — the biggest context windows on the market and very cheap fast-tier models." },
  { id: "mistral", name: "Mistral", color: "#c98500", blurb: "European lab — cheapest flagship-class model, strong open-weight heritage." },
  { id: "xai", name: "xAI", color: "#008300", blurb: "Maker of Grok — aggressive pricing and strong pure-reasoning benchmark results." },
  { id: "deepseek", name: "DeepSeek", color: "#9085e9", blurb: "Chinese lab shipping near-frontier quality at a fraction of typical API prices." },
  { id: "meta", name: "Meta", color: "#e66767", blurb: "Maker of Llama — open-weight models you can download and run on your own hardware." },
  { id: "anthropic", name: "Anthropic", color: "#d95926", blurb: "Maker of the Claude family — known for strong reasoning, coding, and long-horizon agentic work." },
];

export const MODELS: AIModel[] = [
  // ---------------- Anthropic ----------------
  {
    id: "claude-fable-5", providerId: "anthropic", name: "Claude Fable 5", tier: "flagship",
    released: "2026", contextK: 1000, maxOutputK: 128, priceIn: 10, priceOut: 50,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bench: { gpqaDiamond: 91.3, sweVerified: 95.0 },
    bestFor: ["Hardest reasoning problems", "Long autonomous agent runs", "Complex code migrations"],
    beginnerNote: "Anthropic's smartest model. Overkill for everyday tasks, incredible for the hardest ones.",
    expertNote: "Thinking always on (adaptive only; explicit disable 400s). Raw CoT never returned. Requires 30-day data retention. Effort levels low→max.",
    strengths: ["Top-tier long-horizon agentic execution", "1M context at default", "Excellent self-verification"],
    considerations: ["Premium pricing ($10/$50)", "Single requests can run many minutes", "Safety classifiers may refuse bio/cyber-adjacent work"],
  },
  {
    id: "claude-opus-4-8", providerId: "anthropic", name: "Claude Opus 4.8", tier: "flagship",
    released: "2026", contextK: 1000, maxOutputK: 128, priceIn: 5, priceOut: 25,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Agentic coding", "Knowledge work & documents", "Overnight autonomous runs"],
    beginnerNote: "The best all-round 'do hard work for me' model — great writing, coding, and reliability.",
    expertNote: "Adaptive thinking only; sampling params removed. 1M ctx at standard pricing. Fast mode available (beta). Mid-conversation system messages supported.",
    strengths: ["State-of-the-art agentic coding", "Warm, clear prose", "Strong code review / debugging"],
    considerations: ["More expensive than mid-tier models", "Asks for confirmation more often by default"],
  },
  {
    id: "claude-opus-4-7", providerId: "anthropic", name: "Claude Opus 4.7", tier: "flagship",
    released: "2026", contextK: 1000, maxOutputK: 128, priceIn: 5, priceOut: 25,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Vision-heavy workloads", "Memory-based agents", "Structured extraction"],
    beginnerNote: "Previous-generation flagship — still excellent, especially for reading images and screenshots.",
    expertNote: "First Claude with high-res vision (2576px). Literal instruction following. Same API surface as 4.8.",
    strengths: ["High-resolution vision, 1:1 pixel coordinates", "Predictable, literal prompt-following"],
    considerations: ["Superseded by Opus 4.8 at the same price"],
  },
  {
    id: "claude-sonnet-5", providerId: "anthropic", name: "Claude Sonnet 5", tier: "balanced",
    released: "2026", contextK: 1000, maxOutputK: 128, priceIn: 3, priceOut: 15,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Production coding assistants", "High-volume agent workloads", "Best speed/quality balance"],
    beginnerNote: "Near-flagship quality at a much friendlier price — the sensible default for most projects.",
    expertNote: "Adaptive thinking on by default. Intro pricing $2/$10 through Aug 2026. New tokenizer (~30% more tokens vs 4.6). effort up to xhigh.",
    strengths: ["Previously-Opus-tier coding quality at Sonnet cost", "High-res vision", "Full effort range"],
    considerations: ["Non-default sampling params rejected", "Token counts higher under new tokenizer"],
  },
  {
    id: "claude-sonnet-4-6", providerId: "anthropic", name: "Claude Sonnet 4.6", tier: "balanced",
    released: "2025–26", contextK: 1000, maxOutputK: 128, priceIn: 3, priceOut: 15,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Cost-stable production apps", "Computer-use agents"],
    beginnerNote: "The previous mid-tier Claude — proven, stable, and still widely used in production.",
    expertNote: "Supports both adaptive thinking and legacy budget_tokens (deprecated). 1M ctx.",
    strengths: ["Battle-tested in production", "Strong computer use"],
    considerations: ["Sonnet 5 beats it at the same list price"],
  },
  {
    id: "claude-haiku-4-5", providerId: "anthropic", name: "Claude Haiku 4.5", tier: "budget",
    released: "2025", contextK: 200, maxOutputK: 64, priceIn: 1, priceOut: 5,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Classification & routing", "Speed-critical chat", "High-volume simple tasks"],
    beginnerNote: "Anthropic's fast, cheap model — perfect when you need lots of quick, simple answers.",
    expertNote: "200K ctx / 64K out. Extended thinking uses legacy budget_tokens. Separate rate-limit pool.",
    strengths: ["Fast and cost-effective", "Good tool use for its size"],
    considerations: ["Smaller context window than siblings", "Not for hard reasoning"],
  },

  // ---------------- OpenAI ----------------
  {
    id: "gpt-5-6-sol", providerId: "openai", name: "GPT-5.6 Sol", tier: "flagship",
    released: "Jul 2026", contextK: 1000, maxOutputK: 128, priceIn: 5, priceOut: 30,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Hard reasoning & math", "Cybersecurity analysis", "Frontier agentic tasks"],
    beginnerNote: "OpenAI's newest and smartest model — the one to beat on hard science-style questions.",
    expertNote: "GA Jul 9 2026. Leads GPQA Diamond (94.6%). $0.50 cached-input reads. 1M ctx on all 5.6 tiers.",
    strengths: ["Best-in-class reasoning benchmarks", "Deep cached-input discount"],
    considerations: ["$30 output pricing is steep", "Very new — production track record still forming"],
  },
  {
    id: "gpt-5-6-terra", providerId: "openai", name: "GPT-5.6 Terra", tier: "balanced",
    released: "Jul 2026", contextK: 1000, maxOutputK: 128, priceIn: 2.5, priceOut: 15,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["General production workloads", "Balanced cost/quality"],
    beginnerNote: "The middle child of OpenAI's new family — solid quality at a mainstream price.",
    expertNote: "Matches GPT-5.4 pricing ($2.50/$15) with the newer 5.6 architecture and 1M ctx.",
    strengths: ["Modern architecture at mid-tier price", "1M context"],
    considerations: ["Sits close to Sonnet 5 and Gemini 3.5 Flash — compare carefully"],
  },
  {
    id: "gpt-5-6-luna", providerId: "openai", name: "GPT-5.6 Luna", tier: "budget",
    released: "Jul 2026", contextK: 1000, maxOutputK: 128, priceIn: 1, priceOut: 6,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Cheap high-volume production", "Long-context on a budget"],
    beginnerNote: "OpenAI's new budget tier — cheap, capable, and handles huge documents.",
    expertNote: "New $1/$6 production tier. 1M ctx — unusual at this price point.",
    strengths: ["1M context at budget pricing", "Modern 5.6 family behavior"],
    considerations: ["DeepSeek and Gemini Flash-Lite undercut it further"],
  },
  {
    id: "gpt-5-5", providerId: "openai", name: "GPT-5.5", tier: "flagship",
    released: "2026", contextK: 1050, maxOutputK: 128, priceIn: 5, priceOut: null,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bench: { gpqaDiamond: 92.8, sweVerified: 82.6 },
    bestFor: ["Hard science reasoning", "Established frontier workloads"],
    beginnerNote: "OpenAI's previous flagship — still one of the strongest models on hard science questions.",
    expertNote: "1.05M ctx / 128K out. Requests above 272K input billed 2x input / 1.5x output for the whole request. Pro variant at $30/M input.",
    strengths: ["Strong published benchmark record", "Very large context"],
    considerations: ["Long-context surcharge above 272K input", "Superseded by GPT-5.6 Sol"],
  },
  {
    id: "gpt-5-4", providerId: "openai", name: "GPT-5.4", tier: "balanced",
    released: "2026", contextK: 400, maxOutputK: 128, priceIn: 2.5, priceOut: 15,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Existing production apps", "Stable behavior"],
    expertNote: "Still on the live price sheet with mini ($0.75/$4.50) and nano ($0.20/$1.25) variants. 10% cached-input, 50% batch discount.",
    beginnerNote: "Last generation's mainstream OpenAI model — still a safe, proven choice.",
    strengths: ["Proven in production", "Cheap mini/nano variants"],
    considerations: ["Superseded by 5.6 Terra at the same price"],
  },
  {
    id: "gpt-5-1", providerId: "openai", name: "GPT-5.1", tier: "budget",
    released: "2025", contextK: 400, maxOutputK: 128, priceIn: 1.25, priceOut: 10,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Legacy integrations", "Cost-conscious existing apps"],
    beginnerNote: "An older OpenAI model kept around for apps already built on it.",
    expertNote: "$1.25/$10 with 10% cached-input rates and 50% batch discounts.",
    strengths: ["Cheap and stable"],
    considerations: ["Newer Luna is better at a similar price"],
  },

  // ---------------- Google ----------------
  {
    id: "gemini-3-1-pro", providerId: "google", name: "Gemini 3.1 Pro", tier: "flagship",
    released: "2026", contextK: 2000, maxOutputK: 128, priceIn: 2, priceOut: 12,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bench: { gpqaDiamond: 94.3 },
    bestFor: ["Massive documents & codebases", "Multimodal analysis", "Long-context research"],
    beginnerNote: "Google's flagship — it can read more at once than any other major model (2M tokens).",
    expertNote: "2M ctx — largest in lineup. $2/$12 up to 200K tokens; long-context surcharge above. Paid-only since Apr 2026.",
    strengths: ["Largest context window on the market", "Aggressive flagship pricing"],
    considerations: ["Long-context surcharge above 200K tokens", "No longer on the free tier"],
  },
  {
    id: "gemini-3-5-flash", providerId: "google", name: "Gemini 3.5 Flash", tier: "balanced",
    released: "May 2026", contextK: 1000, maxOutputK: 64, priceIn: null, priceOut: null,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Coding & agent tasks on a budget", "Fast production workloads"],
    beginnerNote: "Google's newest speed-focused model — reportedly beats their own flagship at coding, for less money.",
    expertNote: "Launched May 2026; beats 3.1 Pro on coding/agent benchmarks at a lower price point. Flash-tier latency.",
    strengths: ["Beats Gemini 3.1 Pro on coding & agent tasks", "Flash-tier speed"],
    considerations: ["Newer model — production track record still forming"],
  },
  {
    id: "gemini-3-1-flash-lite", providerId: "google", name: "Gemini 3.1 Flash-Lite", tier: "budget",
    released: "2026", contextK: 1000, maxOutputK: 64, priceIn: 0.1, priceOut: 0.4,
    caps: { reasoning: false, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Ultra-cheap high-volume tasks", "Latency-critical apps"],
    beginnerNote: "One of the cheapest capable AI models — and one of the fastest (363 tokens/sec).",
    expertNote: "363 tok/s — 45% faster than Gemini 2.5 Flash. Free tier with reduced quotas.",
    strengths: ["Very low pricing", "Very high throughput", "Still on free tier"],
    considerations: ["Not built for complex reasoning"],
  },
  {
    id: "gemini-2-5-flash", providerId: "google", name: "Gemini 2.5 Flash", tier: "budget",
    released: "2025", contextK: 1000, maxOutputK: 64, priceIn: 0.15, priceOut: 0.6,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Value-focused production", "Proven cheap workhorse"],
    beginnerNote: "An older but reliable cheap model — consistently rated one of the best value-for-money picks.",
    expertNote: "Consistently tops quality-per-dollar rankings alongside DeepSeek V3.2. Mature, stable, widely deployed.",
    strengths: ["Excellent value", "Mature and stable"],
    considerations: ["Two generations old"],
  },

  // ---------------- xAI ----------------
  {
    id: "grok-4-5", providerId: "xai", name: "Grok 4.5", tier: "flagship",
    released: "Jul 2026", contextK: 256, maxOutputK: 64, priceIn: 2, priceOut: 6,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bench: { sweVerified: 86.6 },
    bestFor: ["Reasoning on a budget", "Real-time / current-events apps"],
    beginnerNote: "xAI's newest model — flagship-level answers with unusually low prices.",
    expertNote: "Released Jul 8 2026 at $2/$6 — the cheapest current-gen frontier output pricing.",
    strengths: ["Aggressive flagship pricing", "X/Twitter data integration"],
    considerations: ["Smaller ecosystem than OpenAI/Anthropic/Google", "Context window smaller than 1M-class rivals"],
  },
  {
    id: "grok-4-3", providerId: "xai", name: "Grok 4.3", tier: "balanced",
    released: "2026", contextK: 256, maxOutputK: 64, priceIn: 1.25, priceOut: 2.5,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["Logic-heavy workloads", "Hard science & math on a budget"],
    beginnerNote: "A logic specialist — very strong at puzzles, math, and science questions, priced cheaply.",
    expertNote: "Tends to lead pure-reasoning benchmarks. $1.25/$2.50 — exceptional output pricing.",
    strengths: ["Leads pure-reasoning benchmarks", "$2.50 output is near-budget-tier"],
    considerations: ["Less proven for long agentic workflows"],
  },

  // ---------------- DeepSeek ----------------
  {
    id: "deepseek-v4-pro", providerId: "deepseek", name: "DeepSeek V4 Pro", tier: "balanced",
    released: "2026", contextK: 128, maxOutputK: 64, priceIn: 0.435, priceOut: 0.87,
    caps: { reasoning: true, vision: false, toolUse: true, openWeights: true, promptCaching: true },
    bestFor: ["Near-frontier quality at minimal cost", "Self-hostable production"],
    beginnerNote: "Shockingly good for the price — close to the big names at under a dollar per million tokens.",
    expertNote: "$0.435/$0.87. Competes directly with frontier closed models on developer benchmarks. Open weights available.",
    strengths: ["Near-frontier benchmark results", "Open weights", "~10x cheaper than Western flagships"],
    considerations: ["Data governance questions for some enterprises", "Smaller context window"],
  },
  {
    id: "deepseek-v3-2", providerId: "deepseek", name: "DeepSeek V3.2", tier: "budget",
    released: "2025–26", contextK: 128, maxOutputK: 64, priceIn: 0.14, priceOut: 0.28,
    caps: { reasoning: true, vision: false, toolUse: true, openWeights: true, promptCaching: true },
    bestFor: ["Cheapest capable API", "Cost-first automation"],
    beginnerNote: "Probably the best 'bang for buck' AI on the market — very cheap, surprisingly capable.",
    expertNote: "Consistently tops value rankings (quality points per dollar). Open weights also available for self-hosting.",
    strengths: ["Extreme value", "Open weights"],
    considerations: ["Not frontier-level on the hardest tasks", "No vision"],
  },

  // ---------------- Mistral ----------------
  {
    id: "mistral-large-3", providerId: "mistral", name: "Mistral Large 3", tier: "balanced",
    released: "2026", contextK: 256, maxOutputK: 64, priceIn: 0.5, priceOut: null,
    caps: { reasoning: true, vision: true, toolUse: true, openWeights: false, promptCaching: true },
    bestFor: ["EU data residency needs", "Cheap flagship-class quality"],
    beginnerNote: "Europe's flagship model — good quality, very low prices, EU-friendly for privacy rules.",
    expertNote: "Cheapest flagship-class input pricing at $0.50/1M. Strong for EU compliance requirements.",
    strengths: ["Cheapest flagship-class input price", "European data governance"],
    considerations: ["Ecosystem smaller than the big three"],
  },

  // ---------------- Meta ----------------
  {
    id: "llama-4", providerId: "meta", name: "Llama 4 (family)", tier: "open",
    released: "2025–26", contextK: null, maxOutputK: null, priceIn: null, priceOut: null,
    caps: { reasoning: false, vision: true, toolUse: true, openWeights: true, promptCaching: false },
    bestFor: ["Self-hosting & full control", "Fine-tuning on private data", "Zero per-token licence cost"],
    beginnerNote: "Free to download and run on your own computers. The price shown is what hosting companies typically charge to run it for you.",
    expertNote: "Open-weight family; price/context shown = Llama 4 Maverick via hosted inference (Scout variant reaches 10M ctx). Self-serve via vLLM/llama.cpp for zero per-token cost.",
    strengths: ["No API fees — self-host", "Fine-tunable", "Huge community ecosystem"],
    considerations: ["You manage infrastructure & scaling", "Behind closed frontier models on hardest tasks"],
  },
];

// ---- live data merge (daily refresh from OpenRouter) ----
interface LiveEntry { priceIn: number; priceOut: number; contextK: number }
const liveModels = live.models as Record<string, LiveEntry>;
for (const m of MODELS) {
  const l = liveModels[m.id];
  if (l) {
    m.priceIn = l.priceIn;
    m.priceOut = l.priceOut;
    // Live context is a serving limit, which can under-report a provider's
    // official window (e.g. Gemini 3.1 Pro's 2M). Only adopt it when it's
    // larger than our curated value — i.e. when our static number was stale.
    if (m.contextK === null || l.contextK > m.contextK) m.contextK = l.contextK;
  }
}
/** Date the live pricing data was last fetched (YYYY-MM-DD). */
export const DATA_UPDATED: string = live.fetchedAt;

export const providerOf = (m: AIModel): Provider =>
  PROVIDERS.find((p) => p.id === m.providerId)!;

export const fmtPrice = (v: number | null): string =>
  v === null ? "—" : `$${v < 1 ? v.toFixed(2).replace(/0$/, "") : v.toFixed(2).replace(/\.00$/, "")}`;

export const fmtContext = (k: number | null): string => {
  if (k === null) return "Varies";
  return k >= 1000 ? `${k / 1000}M tokens` : `${k}K tokens`;
};

export const TIER_LABEL: Record<Tier, string> = {
  flagship: "Flagship",
  balanced: "Balanced",
  budget: "Budget",
  open: "Open weights",
};
