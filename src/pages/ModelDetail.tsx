import { Link, useParams } from "react-router-dom";
import { MODELS, TIER_LABEL, fmtContext, fmtPrice, providerOf } from "../data/models";
import { ProviderChip, StatTile, TierBadge } from "../components";
import { useLevel } from "../level";

function BenchBar({ label, value, explain }: { label: string; value: number; explain: string }) {
  const { level } = useLevel();
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span className="num" style={{ fontWeight: 700 }}>{value}%</span>
      </div>
      {level === "beginner" && <div className="small muted">{explain}</div>}
      <div className="cbar" style={{ marginTop: 5 }}>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ModelDetail() {
  const { id } = useParams();
  const { level } = useLevel();
  const model = MODELS.find((m) => m.id === id);

  if (!model) {
    return (
      <div className="container section">
        <h1>Model not found</h1>
        <p><Link to="/models">← Back to all models</Link></p>
      </div>
    );
  }

  const provider = providerOf(model);
  const rivals = MODELS.filter((m) => m.tier === model.tier && m.id !== model.id && m.providerId !== model.providerId).slice(0, 3);
  const siblings = MODELS.filter((m) => m.providerId === model.providerId && m.id !== model.id);

  return (
    <div className="container">
      <div className="section">
        <p className="small" style={{ marginBottom: 8 }}><Link to="/models">← All models</Link></p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <ProviderChip provider={provider} />
          <TierBadge model={model} />
          <span className="small muted">Released {model.released}</span>
        </div>
        <h1 style={{ marginTop: 6 }}>{model.name}</h1>
        <p className="muted" style={{ maxWidth: 640 }}>
          {level === "beginner" ? model.beginnerNote : model.expertNote}
        </p>
        <div className="hero-actions" style={{ marginTop: 12 }}>
          {rivals.length > 0 && (
            <Link className="btn primary" to={`/compare?m=${[model.id, ...rivals.map((r) => r.id)].join(",")}`}>
              Compare vs {rivals.length} rivals
            </Link>
          )}
          <Link className="btn" to={`/compare?m=${model.id}`}>Build my own comparison</Link>
        </div>
      </div>

      <div className="section tiles">
        <StatTile value={fmtPrice(model.priceIn)} label="Input / 1M tokens" />
        <StatTile value={fmtPrice(model.priceOut)} label="Output / 1M tokens" />
        <StatTile value={fmtContext(model.contextK)} label="Context window" />
        <StatTile value={model.maxOutputK === null ? "—" : `${model.maxOutputK}K`} label="Max output tokens" />
      </div>

      {model.bench && (
        <div className="section card">
          <h2>Published benchmarks</h2>
          <p className="small muted">
            Only scores the provider or independent leaderboards actually published — we never estimate.
          </p>
          {model.bench.gpqaDiamond !== undefined && (
            <BenchBar
              label="GPQA Diamond"
              value={model.bench.gpqaDiamond}
              explain="Graduate-level science questions — a test of hard reasoning."
            />
          )}
          {model.bench.sweVerified !== undefined && (
            <BenchBar
              label="SWE-bench Verified"
              value={model.bench.sweVerified}
              explain="Fixing real bugs in real software projects — the key coding benchmark."
            />
          )}
        </div>
      )}

      <div className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div className="card">
          <h3>Best for</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {model.bestFor.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Strengths</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {model.strengths.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Considerations</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {model.considerations.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </div>

      <div className="section card">
        <h3>Capabilities</h3>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 6 }}>
          <span className={model.caps.reasoning ? "cap-yes" : "cap-no"}>{model.caps.reasoning ? "✓" : "—"} Reasoning</span>
          <span className={model.caps.vision ? "cap-yes" : "cap-no"}>{model.caps.vision ? "✓" : "—"} Vision</span>
          <span className={model.caps.toolUse ? "cap-yes" : "cap-no"}>{model.caps.toolUse ? "✓" : "—"} Tool use</span>
          <span className={model.caps.openWeights ? "cap-yes" : "cap-no"}>{model.caps.openWeights ? "✓" : "—"} Open weights</span>
          <span className={model.caps.promptCaching ? "cap-yes" : "cap-no"}>{model.caps.promptCaching ? "✓" : "—"} Prompt caching</span>
        </div>
      </div>

      {siblings.length > 0 && (
        <div className="section">
          <h2>Other {provider.name} models</h2>
          <div className="pick-row">
            {siblings.map((s) => (
              <Link key={s.id} to={`/model/${s.id}`} className="pick-chip">
                <span className="provider-dot" style={{ background: provider.color }} />
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
