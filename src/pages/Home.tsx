import { Link } from "react-router-dom";
import { MODELS, PROVIDERS } from "../data/models";
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

export default function Home() {
  const { level } = useLevel();
  const cheapest = MODELS.filter((m) => m.priceIn !== null).sort((a, b) => a.priceIn! - b.priceIn!)[0];
  const biggestCtx = MODELS.filter((m) => m.contextK !== null).sort((a, b) => b.contextK! - a.contextK!)[0];

  return (
    <div className="container">
      <div className="hero">
        <div className="kicker">The AI model comparison database</div>
        <h1>Compare AI models like you'd compare CPUs.</h1>
        <p className="sub">
          {level === "beginner"
            ? "Every major AI — Claude, ChatGPT, Gemini, Grok and more — side by side, in plain English. Find out which one fits your project and your budget."
            : "Pricing, context windows, and capability matrices for every major provider — Anthropic, OpenAI, Google, xAI, DeepSeek, Mistral, Meta. July 2026 snapshot."}
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/compare">Start comparing</Link>
          <Link className="btn" to="/advisor">Help me choose</Link>
          <Link className="btn" to="/learn">I'm new to AI</Link>
        </div>
      </div>

      <div className="section tiles">
        <StatTile value={String(MODELS.length)} label="Models tracked" />
        <StatTile value={String(PROVIDERS.length)} label="Providers covered" />
        <StatTile value={`$${cheapest.priceIn}`} label={`Cheapest input /1M (${cheapest.name})`} />
        <StatTile value="2M" label={`Largest context (${biggestCtx.name})`} />
      </div>

      <div className="section">
        <h2>Featured matchups</h2>
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
        <h2>Latest flagship models</h2>
        <div className="model-grid">
          {MODELS.filter((m) => m.tier === "flagship").slice(0, 6).map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
