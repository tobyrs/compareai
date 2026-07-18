# CompareAI — AI Model Comparison Platform

## Vision
"PCPartPicker for AI models." A web app where anyone — from a curious beginner to a CTO —
can compare AI providers and models side-by-side, learn what each model is good at, and get
a recommendation for their specific project. Sellable to: small businesses choosing an AI
vendor, freelancers picking a model for client work, employees justifying AI spend,
individuals learning the landscape.

## Core product decisions
- **Adaptable audience**: a global experience-level toggle (Beginner / Expert)
  changes how much jargon and detail is shown. Beginners see plain-English explanations;
  experts see raw numbers and API-level details.
- **CPU-benchmark-style comparison**: pick 2, 3, or more models → side-by-side spec table
  with visual bars (price, context window), capability matrix (vision, tools,
  reasoning), and expandable advanced sections.
- **Education database**: every stat has a "what does this mean?" explainer. A Learn page
  teaches concepts (tokens, context windows, reasoning models, open vs closed weights).
- **Advisor**: answer a few questions about your project → ranked model recommendations
  with reasoning.
- **Data freshness is the product**: all model data lives in one typed file
  (`src/data/models.ts`) so updating for new releases is a single-file edit. Data snapshot:
  July 2026 (verified via web sources + Anthropic docs).

## Pages
1. **Home** — hero, quick-compare launcher, featured matchups
2. **Compare** — the flagship page. Multi-select models, spec table + bars + capability matrix
3. **Models** (database) — browse/filter/sort all models by provider, price, context, tier
4. **Advisor** — guided questionnaire → recommendations
5. **Learn** — education hub, leveled content

## Tech
- Vite + React + TypeScript, React Router, hand-rolled CSS design system (dark theme,
  data-dense, benchmark-site aesthetic)
- No backend for v1 — static data, deployable anywhere (GitHub Pages / Vercel / Netlify)
- Future: user accounts, saved comparisons, live pricing API, affiliate/referral revenue,
  B2B "AI procurement report" generator (monetization path)

## Data coverage (v1, July 2026 snapshot)
Anthropic (Fable 5, Opus 4.8/4.7/4.6, Sonnet 5, Sonnet 4.6, Haiku 4.5), OpenAI (GPT-5.6
Sol/Terra/Luna, GPT-5.4 family, GPT-5.1), Google (Gemini 3.1 Pro, 3.5 Flash, 3.1 Flash-Lite,
2.5 Flash), xAI (Grok 4.5, 4.3), DeepSeek (V4 Pro, V3.2), Mistral (Large 3), Meta (Llama 4).

## Roadmap after v1
- Benchmark score integration (GPQA, coding evals) with sourced citations
- Shareable comparison URLs
- "Model of the week" content for SEO
- Business tier: exportable PDF comparison reports

---
*Note: the previous Toby OS plan was moved out of this repo (kept privately) before the repo went public.*
