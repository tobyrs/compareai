import { useLevel } from "../level";

interface Topic {
  title: string;
  tag: "basics" | "pricing" | "capabilities" | "strategy";
  beginner: string;
  expert: string;
}

const TOPICS: Topic[] = [
  {
    title: "What is a token?",
    tag: "basics",
    beginner:
      "AI models read and write text in small chunks called tokens — roughly ¾ of a word each. 'Hello world' is about 2–3 tokens. Prices are quoted per million tokens, so a whole novel costs pennies to read with a cheap model.",
    expert:
      "Tokenization varies by model family — the same text can differ 30%+ in token count between tokenizers (e.g. Claude Sonnet 5's tokenizer produces ~30% more tokens than Sonnet 4.6's). Never reuse counts across models; use each provider's count-tokens endpoint.",
  },
  {
    title: "What is a context window?",
    tag: "basics",
    beginner:
      "The context window is the model's 'working memory' — how much text it can consider at once. A 1M-token window fits several long books. If your conversation grows past it, the model starts forgetting the beginning.",
    expert:
      "Context is input + history + output budget. Long-context pricing may differ (e.g. Gemini 3.1 Pro surcharges above 200K; some providers bill 2x above thresholds). Effective recall degrades before the hard limit — test retrieval at your real depth.",
  },
  {
    title: "Input vs output pricing",
    tag: "pricing",
    beginner:
      "You pay separately for what you send (input) and what the model writes back (output). Output is usually 3–6x more expensive. A chatbot that writes long answers costs more than one that reads long documents.",
    expert:
      "Model your real ratio: agentic workloads are typically input-heavy (tool results re-sent each turn) — prompt caching (up to 90% off cached reads) and batch APIs (typically 50% off) often matter more than the sticker price.",
  },
  {
    title: "What are reasoning / thinking models?",
    tag: "capabilities",
    beginner:
      "Some models can 'think before speaking' — working through a problem privately before answering. This makes them much better at math, logic, and complex tasks, but slower and more expensive per answer.",
    expert:
      "Implementations differ: Anthropic uses adaptive thinking with effort levels (low→max); OpenAI has reasoning-effort tiers; thinking tokens are billed as output. On hard tasks a single request can run minutes — plan timeouts and streaming.",
  },
  {
    title: "Open weights vs API-only",
    tag: "capabilities",
    beginner:
      "Open-weight models (like Llama or DeepSeek) can be downloaded and run on your own computers — free per use, but you provide the hardware. API-only models (Claude, GPT, Gemini) live on the maker's servers and you pay per token.",
    expert:
      "Self-hosting trades per-token cost for GPU capex/opex + ops burden. Break-even typically requires sustained high volume. Middle path: open models via hosted inference providers. Consider data-governance and fine-tuning requirements.",
  },
  {
    title: "How do I actually pick?",
    tag: "strategy",
    beginner:
      "Start with a mid-tier model (like Claude Sonnet or GPT Terra-class) — they're 90% as good as flagships at a third of the price. Only upgrade if you hit real quality problems, and only downgrade to budget models for simple, repetitive tasks.",
    expert:
      "Route by task: flagship for hard reasoning/agentic work, mid-tier as default, budget for classification/extraction. Build an eval set from real traffic before switching. Prices change monthly — re-benchmark quarterly.",
  },
  {
    title: "Why do output limits matter?",
    tag: "capabilities",
    beginner:
      "'Max output' is the longest single answer a model can write — like the size of one essay. 64K tokens is roughly a 50-page document. For most uses, any modern limit is plenty.",
    expert:
      "Large max_tokens (128K on current frontier models) usually requires streaming to avoid HTTP timeouts. Thinking tokens count against the output budget — leave headroom on reasoning-heavy requests or you'll truncate mid-answer.",
  },
  {
    title: "One provider or several?",
    tag: "strategy",
    beginner:
      "It's fine to start with one provider. But the market moves fast — the 'best' model changes every few months. Keeping your app flexible enough to swap models later can save a lot of money.",
    expert:
      "Abstract the model call behind an interface; keep prompts model-agnostic where possible (over-tuned prompts often regress on newer models). Multi-provider fallbacks also hedge rate limits and outages.",
  },
];

const TAG_LABEL: Record<Topic["tag"], string> = {
  basics: "Basics",
  pricing: "Pricing",
  capabilities: "Capabilities",
  strategy: "Strategy",
};

export default function Learn() {
  const { level } = useLevel();
  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Education hub</div>
        <h1>Learn the AI landscape</h1>
        <p className="muted">
          {level === "beginner"
            ? "Everything explained in plain English. Flip the toggle in the top bar to 'Expert' any time for the deeper version."
            : "Deeper technical notes. Flip the toggle to 'Beginner' for plain-English versions."}
        </p>
      </div>
      <div className="section">
        {TOPICS.map((t) => (
          <div key={t.title} className="card learn-item">
            <h3>
              {t.title}
              <span className="lvl-tag">{TAG_LABEL[t.tag]}</span>
            </h3>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>
              {level === "beginner" ? t.beginner : t.expert}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
