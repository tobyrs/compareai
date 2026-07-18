import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MODELS, providerOf } from "../data/models";
import { ProviderChip, TierBadge } from "../components";
import { useLevel } from "../level";

interface Preset {
  id: string;
  label: string;
  hint: string;
  reqs: number; // per month
  inTok: number; // avg input tokens per request
  outTok: number; // avg output tokens per request
}

const PRESETS: Preset[] = [
  { id: "chatbot", label: "Support chatbot", hint: "30K chats/mo, short answers", reqs: 30000, inTok: 2000, outTok: 300 },
  { id: "coding", label: "Coding assistant", hint: "5K requests/mo, code-heavy", reqs: 5000, inTok: 8000, outTok: 1500 },
  { id: "docs", label: "Document pipeline", hint: "10K long docs/mo, short summaries", reqs: 10000, inTok: 20000, outTok: 1000 },
  { id: "bulk", label: "Bulk classification", hint: "500K tiny requests/mo", reqs: 500000, inTok: 500, outTok: 10 },
];

function fmtMoney(v: number): string {
  if (v >= 1000) return `$${Math.round(v).toLocaleString()}`;
  if (v >= 100) return `$${v.toFixed(0)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(3)}`;
}

export default function Calculator() {
  const { level } = useLevel();
  const [reqs, setReqs] = useState(30000);
  const [inTok, setInTok] = useState(2000);
  const [outTok, setOutTok] = useState(300);
  const [activePreset, setActivePreset] = useState<string | null>("chatbot");

  const applyPreset = (p: Preset) => {
    setReqs(p.reqs); setInTok(p.inTok); setOutTok(p.outTok); setActivePreset(p.id);
  };

  const rows = useMemo(() => {
    const priced = MODELS.filter((m) => m.priceIn !== null && m.priceOut !== null);
    const computed = priced.map((m) => {
      const monthly =
        (reqs * inTok / 1_000_000) * (m.priceIn as number) +
        (reqs * outTok / 1_000_000) * (m.priceOut as number);
      const tooSmall = m.contextK !== null && inTok > m.contextK * 1000;
      return { m, monthly, tooSmall };
    });
    return computed.sort((a, b) => a.monthly - b.monthly);
  }, [reqs, inTok, outTok]);

  const maxCost = Math.max(...rows.map((r) => r.monthly), 0.000001);
  const unpriced = MODELS.filter((m) => m.priceIn === null || m.priceOut === null);

  const numInput = (
    label: string,
    value: number,
    set: (n: number) => void,
    hint: string,
  ) => (
    <label style={{ display: "block" }}>
      <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>{label}</div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => { set(Math.max(0, Number(e.target.value) || 0)); setActivePreset(null); }}
        style={{
          width: "100%", background: "var(--surface)", color: "var(--ink)",
          border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)",
          padding: "8px 10px", font: "inherit",
        }}
      />
      {level === "beginner" && <div className="small muted" style={{ marginTop: 3 }}>{hint}</div>}
    </label>
  );

  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Cost calculator</div>
        <h1>What would your project actually cost?</h1>
        <p className="muted">
          Describe your monthly usage once — see the estimated monthly bill for every model, ranked.
          {level === "beginner" && " A token is roughly ¾ of a word; 1,000 tokens ≈ a page of text."}
        </p>
      </div>

      <div className="card">
        <div className="q-title" style={{ marginBottom: 8 }}>Start from a preset</div>
        <div className="pick-row" style={{ marginBottom: 18 }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`pick-chip ${activePreset === p.id ? "on" : ""}`}
              onClick={() => applyPreset(p)}
              title={p.hint}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {numInput("Requests per month", reqs, setReqs, "How many times your app calls the AI each month")}
          {numInput("Avg input tokens / request", inTok, setInTok, "How much text you send each time (prompt + context)")}
          {numInput("Avg output tokens / request", outTok, setOutTok, "How much text the AI writes back each time")}
        </div>
      </div>

      <div className="section">
        <h2>Estimated monthly cost</h2>
        <p className="small muted">
          Standard API rates — prompt caching and batch APIs can cut real-world bills by 50–90%.
          Sorted cheapest first.
        </p>
        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th className="rowlabel">Model</th>
                <th style={{ width: 120 }}>Monthly cost</th>
                <th>Relative</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ m, monthly, tooSmall }, i) => (
                <tr key={m.id} style={tooSmall ? { opacity: 0.45 } : undefined}>
                  <td className="rowlabel" style={{ fontWeight: 400 }}>
                    <ProviderChip provider={providerOf(m)} />
                    <div>
                      <Link to={`/model/${m.id}`} style={{ color: "var(--ink)", fontWeight: 600 }}>{m.name}</Link>
                      {" "}<TierBadge model={m} />
                      {i === 0 && !tooSmall && <span className="best-flag">✓ CHEAPEST</span>}
                      {tooSmall && (
                        <div className="small" style={{ color: "var(--warning)" }}>
                          ⚠ Your input ({inTok.toLocaleString()} tokens) exceeds this model's context window
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="num">{fmtMoney(monthly)}</span></td>
                  <td style={{ minWidth: 160 }}>
                    <div className="cbar"><i style={{ width: `${Math.max(1.5, (monthly / maxCost) * 100)}%` }} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {unpriced.length > 0 && (
          <p className="small muted" style={{ marginTop: 10 }}>
            Not shown (pricing unconfirmed or self-hosted): {unpriced.map((m) => m.name).join(", ")}.
          </p>
        )}
        <p className="small muted">
          Estimates only — real bills depend on caching, batching, retries, and exact tokenization.
          <Link to="/about" style={{ marginLeft: 6 }}>How our data works →</Link>
        </p>
      </div>
    </div>
  );
}
