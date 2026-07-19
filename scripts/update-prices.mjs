// Fetches live pricing/context data from OpenRouter's public models API
// and writes src/data/live.json. Run by .github/workflows/update-data.yml
// on a daily schedule, or manually: node scripts/update-prices.mjs
//
// OpenRouter prices are USD per token — multiplied by 1M here.

import { writeFileSync } from "node:fs";

/** our model id → OpenRouter model id */
const MAP = {
  "claude-fable-5": "anthropic/claude-fable-5",
  "claude-opus-4-8": "anthropic/claude-opus-4.8",
  "claude-opus-4-7": "anthropic/claude-opus-4.7",
  "claude-sonnet-5": "anthropic/claude-sonnet-5",
  "claude-sonnet-4-6": "anthropic/claude-sonnet-4.6",
  "claude-haiku-4-5": "anthropic/claude-haiku-4.5",
  "gpt-5-6-sol": "openai/gpt-5.6-sol",
  "gpt-5-6-terra": "openai/gpt-5.6-terra",
  "gpt-5-6-luna": "openai/gpt-5.6-luna",
  "gpt-5-5": "openai/gpt-5.5",
  "gpt-5-4": "openai/gpt-5.4",
  "gpt-5-1": "openai/gpt-5.1",
  "gemini-3-1-pro": "google/gemini-3.1-pro-preview",
  "gemini-3-5-flash": "google/gemini-3.5-flash",
  "gemini-3-1-flash-lite": "google/gemini-3.1-flash-lite",
  "gemini-2-5-flash": "google/gemini-2.5-flash",
  "grok-4-5": "x-ai/grok-4.5",
  "grok-4-3": "x-ai/grok-4.3",
  "deepseek-v4-pro": "deepseek/deepseek-v4-pro",
  "deepseek-v3-2": "deepseek/deepseek-v3.2",
  "mistral-large-3": "mistralai/mistral-large-2512",
  // Representative hosted-inference pricing for the open-weight family:
  "llama-4": "meta-llama/llama-4-maverick",
};

const res = await fetch("https://openrouter.ai/api/v1/models");
if (!res.ok) {
  console.error(`OpenRouter API returned ${res.status} — keeping existing live.json`);
  process.exit(1);
}
const { data } = await res.json();
const byId = new Map(data.map((m) => [m.id, m]));

const round = (n) => Math.round(n * 1000) / 1000;
const models = {};
let missing = 0;

for (const [ourId, orId] of Object.entries(MAP)) {
  const m = byId.get(orId);
  if (!m) {
    console.warn(`  MISSING on OpenRouter: ${orId} (${ourId}) — static fallback will be used`);
    missing++;
    continue;
  }
  models[ourId] = {
    priceIn: round(Number(m.pricing.prompt) * 1_000_000),
    priceOut: round(Number(m.pricing.completion) * 1_000_000),
    contextK: Math.round(m.context_length / 1000),
  };
}

const out = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  source: "openrouter.ai public models API",
  models,
};

writeFileSync(new URL("../src/data/live.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote live.json: ${Object.keys(models).length} models updated, ${missing} missing.`);
