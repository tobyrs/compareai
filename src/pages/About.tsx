export default function About() {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="section">
        <div className="kicker">Transparency</div>
        <h1>About the data</h1>
        <p className="muted">
          A comparison site is only as good as its honesty. Here's exactly where our numbers come
          from and what they do and don't mean.
        </p>
      </div>

      <div className="card learn-item">
        <h3>Where the data comes from</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          Pricing, context windows, and capabilities are compiled from provider documentation and
          public pricing pages, cross-checked against independent trackers. Benchmark scores are
          included <b>only when publicly reported</b> by the provider or an independent leaderboard —
          we never estimate or interpolate a score. When a number isn't publicly confirmed, we show
          "—" instead of guessing.
        </p>
      </div>

      <div className="card learn-item">
        <h3>Data snapshot</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          Current snapshot: <b>July 2026</b>. AI pricing changes monthly and new models ship
          constantly — always verify against the provider's own pricing page before signing a
          contract. Prices shown are standard pay-as-you-go API rates; batch APIs (typically 50%
          off) and prompt caching (up to 90% off repeated context) can substantially reduce real
          bills.
        </p>
      </div>

      <div className="card learn-item">
        <h3>What the benchmarks mean</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          <b>GPQA Diamond</b> tests graduate-level science reasoning. <b>SWE-bench Verified</b>{" "}
          measures fixing real bugs in real open-source software. Some newly released models (e.g.
          GPT-5.6 and Grok 4.5 at launch) published only agentic/coding evals rather than classic
          academic benchmarks — that's why some cells are blank, not because the models are bad.
        </p>
      </div>

      <div className="card learn-item">
        <h3>How we're different</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          Great engineering-focused trackers already exist — Artificial Analysis, LLM-Stats, and
          OpenRouter's model pages are excellent for API developers. CompareAI focuses on what they
          don't: plain-English explanations at every step, an adjustable experience level, and
          guided recommendations for people who aren't AI engineers yet.
        </p>
      </div>

      <div className="card learn-item">
        <h3>Disclaimer</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          CompareAI is an independent comparison resource. We're not affiliated with any AI
          provider, and nothing here is professional procurement advice. Model names and trademarks
          belong to their respective owners.
        </p>
      </div>
    </div>
  );
}
