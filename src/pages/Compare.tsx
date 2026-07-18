import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AIModel, MODELS, PROVIDERS, TIER_LABEL, fmtContext, fmtPrice, providerOf } from "../data/models";
import { Explain, ProviderChip } from "../components";
import { useLevel } from "../level";

const DEFAULT_PICKS = ["claude-sonnet-5", "gpt-5-6-terra", "gemini-3-5-flash"];

/** Horizontal magnitude bar, scaled to the max of the selected set. */
function Bar({ value, max }: { value: number | null; max: number }) {
  if (value === null || max <= 0) return null;
  const pct = Math.max(2, (value / max) * 100);
  return (
    <div className="cbar" role="img" aria-label={`${value} of ${max}`}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

function Cap({ on, yes, no }: { on: boolean; yes?: string; no?: string }) {
  return on ? (
    <span className="cap-cell cap-yes">✓ {yes ?? "Yes"}</span>
  ) : (
    <span className="cap-cell cap-no">— {no ?? "No"}</span>
  );
}

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const { level } = useLevel();

  const picked: string[] = useMemo(() => {
    const m = params.get("m");
    if (!m) return DEFAULT_PICKS;
    const ids = m.split(",").filter((id) => MODELS.some((x) => x.id === id));
    return ids.length ? ids : DEFAULT_PICKS;
  }, [params]);

  const models: AIModel[] = picked
    .map((id) => MODELS.find((m) => m.id === id)!)
    .filter(Boolean);

  const toggle = (id: string) => {
    const next = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id];
    setParams(next.length ? { m: next.join(",") } : {});
  };

  const maxIn = Math.max(...models.map((m) => m.priceIn ?? 0));
  const maxOut = Math.max(...models.map((m) => m.priceOut ?? 0));
  const maxCtx = Math.max(...models.map((m) => m.contextK ?? 0));

  const minOf = (vals: (number | null)[], lowerBetter: boolean) => {
    const nums = vals.filter((v): v is number => v !== null);
    if (nums.length < 2) return null;
    return lowerBetter ? Math.min(...nums) : Math.max(...nums);
  };
  const bestIn = minOf(models.map((m) => m.priceIn), true);
  const bestOut = minOf(models.map((m) => m.priceOut), true);
  const bestCtx = minOf(models.map((m) => m.contextK), false);

  const anyGpqa = models.some((m) => m.bench?.gpqaDiamond !== undefined);
  const anySwe = models.some((m) => m.bench?.sweVerified !== undefined);
  const bestGpqa = minOf(models.map((m) => m.bench?.gpqaDiamond ?? null), false);
  const bestSwe = minOf(models.map((m) => m.bench?.sweVerified ?? null), false);

  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Comparison tool</div>
        <h1>Compare AI models</h1>
        <p className="muted">
          Pick 2 or more models to compare side by side — like a CPU benchmark site, but for AI.
          {level === "beginner" && " Don't worry about the jargon: every row explains what it means."}
        </p>
      </div>

      {PROVIDERS.map((p) => {
        const provModels = MODELS.filter((m) => m.providerId === p.id);
        return (
          <div key={p.id} style={{ marginBottom: 10 }}>
            <div className="pick-row" style={{ alignItems: "center" }}>
              <span className="small muted" style={{ width: 84, flexShrink: 0 }}>{p.name}</span>
              {provModels.map((m) => (
                <button
                  key={m.id}
                  className={`pick-chip ${picked.includes(m.id) ? "on" : ""}`}
                  onClick={() => toggle(m.id)}
                >
                  <span className="provider-dot" style={{ background: p.color }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {models.length < 2 ? (
        <div className="card section">
          <p style={{ margin: 0 }}>Select at least two models above to start comparing.</p>
        </div>
      ) : (
        <div className="section">
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th className="rowlabel">Spec</th>
                  {models.map((m) => (
                    <th key={m.id}>
                      <ProviderChip provider={providerOf(m)} />
                      <div style={{ fontSize: "1rem", marginTop: 2 }}>{m.name}</div>
                      <div className="small muted">{TIER_LABEL[m.tier]} · {m.released}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="rowlabel">
                    Input price / 1M tokens
                    <Explain text="What you pay to send text TO the model. Lower is better." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}>
                      <span className="num">{fmtPrice(m.priceIn)}</span>
                      {m.priceIn !== null && m.priceIn === bestIn && <span className="best-flag">✓ CHEAPEST</span>}
                      <Bar value={m.priceIn} max={maxIn} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Output price / 1M tokens
                    <Explain text="What you pay for the model's answers. Usually the bigger cost. Lower is better." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}>
                      <span className="num">{fmtPrice(m.priceOut)}</span>
                      {m.priceOut !== null && m.priceOut === bestOut && <span className="best-flag">✓ CHEAPEST</span>}
                      <Bar value={m.priceOut} max={maxOut} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Context window
                    <Explain text="How much the model can 'read' at once — bigger means longer documents and conversations." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}>
                      <span className="num">{fmtContext(m.contextK)}</span>
                      {m.contextK !== null && m.contextK === bestCtx && <span className="best-flag">✓ LARGEST</span>}
                      <Bar value={m.contextK} max={maxCtx} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Max output
                    <Explain text="The longest single answer the model can write." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}>
                      <span className="num">{m.maxOutputK === null ? "—" : `${m.maxOutputK}K tokens`}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Reasoning / thinking mode
                    <Explain text="Can it 'think step by step' internally before answering? Better for hard problems." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}><Cap on={m.caps.reasoning} /></td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Vision (images)
                    <Explain text="Can it look at pictures, screenshots, and PDFs?" />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}><Cap on={m.caps.vision} /></td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Tool use / function calling
                    <Explain text="Can it call your code, search, and APIs? Essential for building agents." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}><Cap on={m.caps.toolUse} /></td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Open weights
                    <Explain text="Can you download the model and run it on your own computers?" />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}><Cap on={m.caps.openWeights} yes="Yes" no="API only" /></td>
                  ))}
                </tr>
                <tr>
                  <td className="rowlabel">
                    Prompt caching
                    <Explain text="Discounts for repeated context — can cut costs by up to 90% in apps." />
                  </td>
                  {models.map((m) => (
                    <td key={m.id}><Cap on={m.caps.promptCaching} /></td>
                  ))}
                </tr>
                {anyGpqa && (
                  <tr>
                    <td className="rowlabel">
                      GPQA Diamond score
                      <Explain text="Graduate-level science questions — a test of hard reasoning. Higher is better." />
                    </td>
                    {models.map((m) => (
                      <td key={m.id}>
                        <span className="num">
                          {m.bench?.gpqaDiamond !== undefined ? `${m.bench.gpqaDiamond}%` : "not published"}
                        </span>
                        {m.bench?.gpqaDiamond !== undefined && m.bench.gpqaDiamond === bestGpqa && (
                          <span className="best-flag">✓ HIGHEST</span>
                        )}
                        {m.bench?.gpqaDiamond !== undefined && (
                          <Bar value={m.bench.gpqaDiamond} max={100} />
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                {anySwe && (
                  <tr>
                    <td className="rowlabel">
                      SWE-bench Verified
                      <Explain text="Fixing real bugs in real software — the key coding benchmark. Higher is better." />
                    </td>
                    {models.map((m) => (
                      <td key={m.id}>
                        <span className="num">
                          {m.bench?.sweVerified !== undefined ? `${m.bench.sweVerified}%` : "not published"}
                        </span>
                        {m.bench?.sweVerified !== undefined && m.bench.sweVerified === bestSwe && (
                          <span className="best-flag">✓ HIGHEST</span>
                        )}
                        {m.bench?.sweVerified !== undefined && (
                          <Bar value={m.bench.sweVerified} max={100} />
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                <tr>
                  <td className="rowlabel">Best for</td>
                  {models.map((m) => (
                    <td key={m.id}>
                      <ul style={{ margin: 0, paddingLeft: 16 }} className="small">
                        {m.bestFor.map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <details className="adv">
              <summary>Advanced: strengths, considerations & API notes</summary>
              <table className="compare">
                <tbody>
                  <tr>
                    <td className="rowlabel">Strengths</td>
                    {models.map((m) => (
                      <td key={m.id}>
                        <ul style={{ margin: 0, paddingLeft: 16 }} className="small">
                          {m.strengths.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="rowlabel">Considerations</td>
                    {models.map((m) => (
                      <td key={m.id}>
                        <ul style={{ margin: 0, paddingLeft: 16 }} className="small">
                          {m.considerations.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="rowlabel">{level === "beginner" ? "In plain English" : "API notes"}</td>
                    {models.map((m) => (
                      <td key={m.id} className="small" style={{ color: "var(--ink-2)" }}>
                        {level === "beginner" ? m.beginnerNote : m.expertNote}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </details>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button className="btn" onClick={copyLink}>
              {copied ? "✓ Link copied!" : "Copy shareable link"}
            </button>
            <Link className="btn" to="/calculator">Estimate monthly costs →</Link>
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>
            Data snapshot: July 2026. Prices are USD per 1M tokens, standard API rates (batch and
            cached rates are typically much lower). "—" or "not published" means no public figure
            exists — we never estimate. <Link to="/about">About the data →</Link>
          </p>
        </div>
      )}
    </div>
  );
}
