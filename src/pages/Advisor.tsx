import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AIModel, MODELS, providerOf } from "../data/models";
import { ProviderChip, TierBadge } from "../components";

type UseCase = "chatbot" | "coding" | "content" | "documents" | "automation";
type Budget = "cheap" | "balanced" | "quality";
type Need = "vision" | "hugeDocs" | "selfHost" | "deepReasoning";

const USE_CASES: { id: UseCase; label: string; hint: string }[] = [
  { id: "chatbot", label: "Chatbot / assistant", hint: "Customer support, internal helpers, conversational apps" },
  { id: "coding", label: "Coding & dev tools", hint: "Code generation, review, agents that write software" },
  { id: "content", label: "Writing & content", hint: "Marketing copy, articles, summaries, emails" },
  { id: "documents", label: "Document analysis", hint: "Contracts, reports, research, large PDFs" },
  { id: "automation", label: "High-volume automation", hint: "Classification, extraction, routing at scale" },
];

const BUDGETS: { id: Budget; label: string; hint: string }[] = [
  { id: "cheap", label: "Lowest cost", hint: "Every fraction of a cent matters" },
  { id: "balanced", label: "Balanced", hint: "Good quality at a sensible price" },
  { id: "quality", label: "Best quality", hint: "Results matter more than cost" },
];

const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "vision", label: "Reads images / screenshots", hint: "Photos, scans, UI screenshots" },
  { id: "hugeDocs", label: "Very large documents", hint: "Whole books, big codebases (1M+ tokens)" },
  { id: "selfHost", label: "Self-host / open weights", hint: "Run on your own hardware" },
  { id: "deepReasoning", label: "Hard reasoning", hint: "Math, science, complex multi-step logic" },
];

interface Reco { model: AIModel; score: number; reasons: string[] }

function recommend(useCase: UseCase, budget: Budget, needs: Need[]): Reco[] {
  const results: Reco[] = [];
  for (const m of MODELS) {
    let score = 0;
    const reasons: string[] = [];

    // hard requirements
    if (needs.includes("vision") && !m.caps.vision) continue;
    if (needs.includes("selfHost") && !m.caps.openWeights) continue;
    if (needs.includes("hugeDocs") && (m.contextK === null || m.contextK < 1000)) continue;
    if (needs.includes("deepReasoning") && !m.caps.reasoning) continue;

    // use-case fit
    const tierScore: Record<string, Record<UseCase, number>> = {
      flagship: { chatbot: 1, coding: 3, content: 3, documents: 3, automation: 0 },
      balanced: { chatbot: 3, coding: 3, content: 2, documents: 2, automation: 2 },
      budget: { chatbot: 2, coding: 1, content: 1, documents: 1, automation: 3 },
      open: { chatbot: 1, coding: 1, content: 1, documents: 1, automation: 2 },
    };
    score += tierScore[m.tier][useCase] * 2;

    if (useCase === "coding" && m.caps.reasoning) { score += 2; }
    if (useCase === "documents" && m.contextK !== null && m.contextK >= 1000) {
      score += 2; reasons.push(`Large ${m.contextK >= 2000 ? "2M" : "1M"} context handles big documents`);
    }
    if (useCase === "automation" && m.priceIn !== null && m.priceIn <= 0.5) {
      score += 2; reasons.push("Cheap enough to run at very high volume");
    }

    // budget fit
    if (m.priceIn !== null) {
      if (budget === "cheap") score += Math.max(0, 4 - m.priceIn * 2);
      if (budget === "balanced") score += m.tier === "balanced" ? 3 : 1;
      if (budget === "quality") score += m.tier === "flagship" ? 4 : m.tier === "balanced" ? 2 : 0;
    } else if (m.caps.openWeights && budget === "cheap") {
      score += 3; reasons.push("No per-token fees when self-hosted");
    }

    if (needs.includes("deepReasoning") && m.tier === "flagship") {
      score += 2; reasons.push("Flagship-tier reasoning strength");
    }
    if (needs.includes("hugeDocs") && m.contextK !== null && m.contextK >= 2000) {
      score += 2; reasons.push("Largest context window available (2M tokens)");
    }

    // generic reasons from data
    if (budget === "cheap" && m.priceIn !== null && m.priceIn <= 1) {
      reasons.push(`Very low pricing ($${m.priceIn}/M input)`);
    }
    if (budget === "quality" && m.tier === "flagship") {
      reasons.push("Top-tier model from its provider");
    }
    reasons.push(`Best for: ${m.bestFor[0].toLowerCase()}`);

    results.push({ model: m, score, reasons: [...new Set(reasons)].slice(0, 3) });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function Advisor() {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);

  const recos = useMemo(
    () => (useCase && budget ? recommend(useCase, budget, needs) : null),
    [useCase, budget, needs],
  );

  const toggleNeed = (n: Need) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Project advisor</div>
        <h1>What should I use for my project?</h1>
        <p className="muted">Answer three quick questions — we'll rank the best models for your situation.</p>
      </div>

      <div className="q-block">
        <div className="q-title">1. What are you building?</div>
        <div className="opt-grid">
          {USE_CASES.map((u) => (
            <button key={u.id} className={`opt ${useCase === u.id ? "on" : ""}`} onClick={() => setUseCase(u.id)}>
              <div style={{ fontWeight: 600 }}>{u.label}</div>
              <div className="small muted">{u.hint}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="q-block">
        <div className="q-title">2. What matters more — cost or quality?</div>
        <div className="opt-grid">
          {BUDGETS.map((b) => (
            <button key={b.id} className={`opt ${budget === b.id ? "on" : ""}`} onClick={() => setBudget(b.id)}>
              <div style={{ fontWeight: 600 }}>{b.label}</div>
              <div className="small muted">{b.hint}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="q-block">
        <div className="q-title">3. Any special requirements? <span className="muted small">(optional, pick any)</span></div>
        <div className="opt-grid">
          {NEEDS.map((n) => (
            <button key={n.id} className={`opt ${needs.includes(n.id) ? "on" : ""}`} onClick={() => toggleNeed(n.id)}>
              <div style={{ fontWeight: 600 }}>{n.label}</div>
              <div className="small muted">{n.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {recos && (
        <div className="section">
          <h2>Our recommendations</h2>
          {recos.length === 0 ? (
            <div className="card">
              No model matches every requirement. Try removing a special requirement — for example,
              very few open-weight models also offer huge context windows.
            </div>
          ) : (
            <div className="model-grid">
              {recos.map((r, i) => (
                <div key={r.model.id} className={`card reco ${i === 0 ? "rank-1" : ""}`}>
                  <div className="kicker">{i === 0 ? "★ Top pick" : `#${i + 1}`}</div>
                  <div className="top" style={{ display: "flex", justifyContent: "space-between" }}>
                    <ProviderChip provider={providerOf(r.model)} />
                    <TierBadge model={r.model} />
                  </div>
                  <h3 style={{ marginTop: 6 }}>{r.model.name}</h3>
                  <ul className="why-list">
                    {r.reasons.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {recos.length > 0 && (
            <p style={{ marginTop: 14 }}>
              <Link className="btn primary" to={`/compare?m=${recos.map((r) => r.model.id).join(",")}`}>
                Compare these {recos.length} side by side →
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
