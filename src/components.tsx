import { AIModel, Provider, TIER_LABEL, providerOf } from "./data/models";
import { useLevel } from "./level";

export function ProviderChip({ provider }: { provider: Provider }) {
  return (
    <span className="provider-chip">
      <span className="provider-dot" style={{ background: provider.color }} />
      {provider.name}
    </span>
  );
}

export function TierBadge({ model }: { model: AIModel }) {
  return <span className="tier-badge">{TIER_LABEL[model.tier]}</span>;
}

/** Beginner-only inline explainer. Hidden in expert mode. */
export function Explain({ text }: { text: string }) {
  const { level } = useLevel();
  if (level !== "beginner") return null;
  return <span className="why">{text}</span>;
}

export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="tile">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export function ModelCard({ model, extra }: { model: AIModel; extra?: React.ReactNode }) {
  const p = providerOf(model);
  const { level } = useLevel();
  return (
    <div className="card model-card">
      <div className="top">
        <ProviderChip provider={p} />
        <TierBadge model={model} />
      </div>
      <h3>{model.name}</h3>
      <div className="model-meta">
        <span>In <b>{model.priceIn === null ? "—" : `$${model.priceIn}`}</b>/M</span>
        <span>Out <b>{model.priceOut === null ? "—" : `$${model.priceOut}`}</b>/M</span>
        <span>Ctx <b>{model.contextK === null ? "—" : model.contextK >= 1000 ? `${model.contextK / 1000}M` : `${model.contextK}K`}</b></span>
      </div>
      <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>
        {level === "beginner" ? model.beginnerNote : model.expertNote}
      </p>
      {extra}
    </div>
  );
}
