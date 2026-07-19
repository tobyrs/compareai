import { Link } from "react-router-dom";
import { DATA_UPDATED, MODELS, PROVIDERS } from "../data/models";
import { ModelCard, StatTile } from "../components";
import { useLevel } from "../level";

const FEATURED: { title: string; desc: string; ids: string[] }[] = [
  {
    title: "Frontier heavyweights",
    desc: "The smartest money can buy: Claude Fable 5 vs GPT-5.6 Sol vs Gemini 3.1 Pro",
    ids: ["claude-fable-5", "gpt-5-6-sol", "gemini-3-1-pro"],
  },
  {
    title: "The production sweet spot",
    desc: "Best quality-per-dollar for real apps: Sonnet 5 vs GPT-5.6 Terra vs Gemini 3.5 Flash vs Grok 4.5",
    ids: ["claude-sonnet-5", "gpt-5-6-terra", "gemini-3-5-flash", "grok-4-5"],
  },
  {
    title: "Budget battle",
    desc: "Cheap and cheerful: Haiku 4.5 vs GPT-5.6 Luna vs DeepSeek V3.2 vs Gemini Flash-Lite",
    ids: ["claude-haiku-4-5", "gpt-5-6-luna", "deepseek-v3-2", "gemini-3-1-flash-lite"],
  },
];

const TOOLS = [
  {
    to: "/compare", icon: "⚖️", title: "Compare",
    desc: "Side-by-side specs, prices, and capabilities — pick any models, share the link.",
    cta: "Start comparing",
  },
  {
    to: "/calculator", icon: "🧮", title: "Cost calculator",
    desc: "Describe your usage once, see the monthly bill for every model, ranked.",
    cta: "Estimate my costs",
  },
  {
    to: "/advisor", icon: "🧭", title: "Advisor",
    desc: "Three questions about your project — get ranked recommendations with reasons.",
    cta: "Help me choose",
  },
];

export default function Home() {
  const { level } = useLevel();
  const cheapest = MODELS.filter((m) => m.priceIn !== null).sort((a, b) => a.priceIn! - b.priceIn!)[0];
  const biggestCtx = MODELS.filter((m) => m.contextK !== null).sort((a, b) => b.contextK! - a.contextK!)[0];

  return (
    <div className="container">
      <div className="hero">
        <span className="live-badge">
          <span className="live-dot" /> Prices auto-updated daily · last refresh {DATA_UPDATED}
        </span>
        <h1>
          Compare AI models <span className="grad">like you'd compare CPUs.</span>
        </h1>
        <p className="sub">
          {level === "beginner"
            ? "Every major AI — Claude, ChatGPT, Gemini, Grok and more — side by side, in plain English. Find the one that fits your project and your budget."
            : "Live pricing, context windows, published benchmarks, and capability matrices across Anthropic, OpenAI, Google, xAI, DeepSeek, Mistral, and Meta."}
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/compare">Start comparing</Link>
          <Link className="btn" to="/models">Browse all {MODELS.length} models</Link>
          <Link className="btn" to="/learn">I'm new to AI</Link>
        </div>
      </div>

      <div className="section tool-grid">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="tool-card">
            <div className="icon" aria-hidden>{t.icon}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <span className="go">{t.cta} →</span>
          </Link>
        ))}
      </div>

      <div className="section tiles">
        <StatTile value={String(MODELS.length)} label="Models tracked" />
        <StatTile value={String(PROVIDERS.length)} label="Providers covered" />
        <StatTile value={`$${cheapest.priceIn}`} label={`Cheapest input /1M (${cheapest.name})`} />
        <StatTile
          value={biggestCtx.contextK! >= 1000 ? `${biggestCtx.contextK! / 1000}M` : `${biggestCtx.contextK}K`}
          label={`Largest context (${biggestCtx.name})`}
        />
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Featured matchups</h2>
          <Link className="all-link" to="/compare">Build your own →</Link>
        </div>
        <p className="muted">One tap to a ready-made comparison.</p>
        <div className="model-grid">
          {FEATURED.map((f) => (
            <Link
              key={f.title}
              to={`/compare?m=${f.ids.join(",")}`}
              className="card"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <h3>{f.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Latest flagship models</h2>
          <Link className="all-link" to="/models">All models →</Link>
        </div>
        <div className="model-grid">
          {MODELS.filter((m) => m.tier === "flagship").slice(0, 6).map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </div>

      <div className="section card" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ maxWidth: 520 }}>
          <h3 style={{ marginBottom: 4 }}>New to AI? Start with the basics.</h3>
          <p className="small muted" style={{ margin: 0 }}>
            Tokens, context windows, reasoning models, open weights — explained in plain English,
            with an expert mode when you're ready for more.
          </p>
        </div>
        <Link className="btn" to="/learn">Open the Learn hub →</Link>
      </div>
    </div>
  );
}
