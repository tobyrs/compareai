import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MODELS, PROVIDERS, Tier, TIER_LABEL } from "../data/models";
import { ModelCard } from "../components";

type SortKey = "priceIn" | "priceOut" | "contextK" | "name";

export default function ModelsPage() {
  const [provider, setProvider] = useState<string>("all");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<SortKey>("priceIn");

  const shown = useMemo(() => {
    let list = MODELS.filter(
      (m) =>
        (provider === "all" || m.providerId === provider) &&
        (tier === "all" || m.tier === tier),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const av = a[sort], bv = b[sort];
      if (av === null) return 1;
      if (bv === null) return -1;
      return sort === "contextK" ? bv - av : av - bv;
    });
    return list;
  }, [provider, tier, sort]);

  return (
    <div className="container">
      <div className="section">
        <div className="kicker">Model database</div>
        <h1>All models</h1>
        <p className="muted">Browse and filter every model we track, then jump into a comparison.</p>
      </div>

      <div className="filters">
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
      </div>

      <div className="model-grid section" style={{ marginTop: 0 }}>
        {shown.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            extra={
              <Link to={`/compare?m=${m.id}`} className="small" style={{ marginTop: 4 }}>
                Compare this model →
              </Link>
            }
          />
        ))}
      </div>
      {shown.length === 0 && (
        <div className="card">No models match those filters.</div>
      )}
    </div>
  );
}
