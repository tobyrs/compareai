import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MODELS, PROVIDERS, Tier, TIER_LABEL, fmtContext, fmtPrice, providerOf } from "../data/models";
import { ModelCard, ProviderChip } from "../components";

type SortKey = "priceIn" | "priceOut" | "contextK" | "name";
type View = "cards" | "table";

export default function ModelsPage() {
  const [provider, setProvider] = useState<string>("all");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<SortKey>("priceIn");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("cards");
  const navigate = useNavigate();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = MODELS.filter(
      (m) =>
        (provider === "all" || m.providerId === provider) &&
        (tier === "all" || m.tier === tier) &&
        (q === "" ||
          m.name.toLowerCase().includes(q) ||
          providerOf(m).name.toLowerCase().includes(q) ||
          m.bestFor.some((b) => b.toLowerCase().includes(q))),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const av = a[sort], bv = b[sort];
      if (av === null) return 1;
      if (bv === null) return -1;
      return sort === "contextK" ? bv - av : av - bv;
    });
    return list;
  }, [provider, tier, sort, query]);

  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Model database</div>
        <h1>All models</h1>
        <p className="muted">Browse, search, and filter every model we track, then jump into a comparison.</p>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search models, providers, use cases…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--hairline)",
            borderRadius: 999, padding: "7px 14px", font: "inherit", fontSize: "0.88rem", minWidth: 240,
          }}
        />
        <button className={`filter-btn ${provider === "all" ? "on" : ""}`} onClick={() => setProvider("all")}>
          All providers
        </button>
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            className={`filter-btn ${provider === p.id ? "on" : ""}`}
            onClick={() => setProvider(p.id)}
          >
            {p.name}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <select className="filter-select" value={tier} onChange={(e) => setTier(e.target.value as Tier | "all")}>
          <option value="all">All tiers</option>
          {(Object.keys(TIER_LABEL) as Tier[]).map((t) => (
            <option key={t} value={t}>{TIER_LABEL[t]}</option>
          ))}
        </select>
        <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="priceIn">Sort: input price</option>
          <option value="priceOut">Sort: output price</option>
          <option value="contextK">Sort: context window</option>
          <option value="name">Sort: name</option>
        </select>
        <div className="level-toggle">
          <button className={view === "cards" ? "on" : ""} onClick={() => setView("cards")}>Cards</button>
          <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}>Table</button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="model-grid section" style={{ marginTop: 0 }}>
          {shown.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              extra={
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <Link to={`/model/${m.id}`} className="small">Details →</Link>
                  <Link to={`/compare?m=${m.id}`} className="small">Compare →</Link>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="compare-wrap section" style={{ marginTop: 0 }}>
          <table className="compare">
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Tier</th>
                <th>Input /1M</th>
                <th>Output /1M</th>
                <th>Context</th>
                <th>GPQA</th>
                <th>SWE-bench</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => navigate(`/model/${m.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td><ProviderChip provider={providerOf(m)} /></td>
                  <td className="small">{TIER_LABEL[m.tier]}</td>
                  <td className="num">{fmtPrice(m.priceIn)}</td>
                  <td className="num">{fmtPrice(m.priceOut)}</td>
                  <td className="num">{fmtContext(m.contextK)}</td>
                  <td className="num">{m.bench?.gpqaDiamond !== undefined ? `${m.bench.gpqaDiamond}%` : "—"}</td>
                  <td className="num">{m.bench?.sweVerified !== undefined ? `${m.bench.sweVerified}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shown.length === 0 && (
        <div className="card">No models match — try clearing the search or filters.</div>
      )}
    </div>
  );
}
