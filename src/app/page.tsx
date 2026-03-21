import Image from "next/image";

/* ─── Ghost SVG (matches logo shape) ─── */

function Ghost({ color, size = 48 }: { color: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 80 96"
      width={size}
      height={size * 1.2}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <path
        d="M 10 84 V 38 C 10 10, 70 10, 70 38 V 84 Q 62 70, 56 84 Q 48 98, 40 84 Q 32 70, 24 84 Q 16 98, 10 84 Z"
        fill={color}
      />
      {/* Left eye */}
      <circle cx="30" cy="42" r="5" fill="#0A0A0A" />
      {/* Right eye — wink */}
      <path
        d="M 46 46 Q 52 39, 58 46"
        stroke="#0A0A0A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Smirk */}
      <path
        d="M 36 58 Q 42 64, 48 58"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Ship silhouette ─── */

function ShipSilhouette() {
  return (
    <svg
      viewBox="0 0 180 220"
      className="ship-rock w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hull */}
      <path
        d="M 25 175 C 55 200, 135 200, 160 175 L 150 148 L 35 148 Z"
        fill="#181818"
      />
      {/* Mast */}
      <rect x="90" y="32" width="3" height="120" fill="#1a1a1a" />
      {/* Main sail — tattered edge */}
      <path
        d="M 48 50 L 90 42 L 90 135 L 56 126 Q 60 120, 54 114 Q 58 108, 52 102 Z"
        fill="#151515"
      />
      {/* Rear sail */}
      <path d="M 93 42 L 138 52 L 132 126 L 93 135 Z" fill="#131313" />
      {/* Crow's nest */}
      <rect x="83" y="30" width="18" height="3" rx="1" fill="#1a1a1a" />
      {/* Flag */}
      <path d="M 92 32 L 112 24 L 112 42 L 92 34 Z" fill="#1c1c1c" />
    </svg>
  );
}

/* ─── Phantom data ─── */

const phantoms = [
  {
    color: "#D4F5F5",
    label: "Where do I start?",
    x: "28%",
    y: "24%",
    size: 48,
    bobDuration: "3.2s",
    bobDelay: "0s",
    bubbleDuration: "4.0s",
    bubbleDelay: "0.5s",
  },
  {
    color: "#F5D4E6",
    label: "Show me pricing",
    x: "42%",
    y: "58%",
    size: 44,
    bobDuration: "3.6s",
    bobDelay: "0.4s",
    bubbleDuration: "4.5s",
    bubbleDelay: "1.4s",
  },
  {
    color: "#D4F5D8",
    label: "Good contrast ratio",
    x: "56%",
    y: "18%",
    size: 52,
    bobDuration: "2.9s",
    bobDelay: "0.8s",
    bubbleDuration: "3.8s",
    bubbleDelay: "0.8s",
  },
  {
    color: "#F5EED4",
    label: "Gets to the point",
    x: "68%",
    y: "52%",
    size: 40,
    bobDuration: "3.4s",
    bobDelay: "0.2s",
    bubbleDuration: "5.0s",
    bubbleDelay: "2.0s",
  },
  {
    color: "#E0D4F5",
    label: "Prefer version B",
    x: "82%",
    y: "30%",
    size: 46,
    bobDuration: "3.1s",
    bobDelay: "0.6s",
    bubbleDuration: "4.2s",
    bubbleDelay: "0.3s",
  },
];

/* ─── Particle trail between ship and ghosts ─── */

const particles = [
  { x: 16, y: 42, s: 2 },
  { x: 18, y: 37, s: 3 },
  { x: 20, y: 46, s: 2 },
  { x: 22, y: 40, s: 2.5 },
  { x: 24, y: 35, s: 2 },
  { x: 26, y: 44, s: 3 },
  { x: 27, y: 38, s: 2 },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <main>
      {/* ════════════════════════════════════════════
          Section 1 — Hero
          ════════════════════════════════════════════ */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo with glow */}
          <div className="relative">
            <div
              className="absolute inset-0 scale-150 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, var(--color-ghost-dim), transparent 70%)",
              }}
            />
            <Image
              src="/images/logo-square.png"
              alt="GhostShip — pirate ghost mascot"
              width={144}
              height={144}
              priority
              className="relative z-10"
            />
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
            ghostship
          </h1>

          <p className="max-w-lg text-lg font-medium tracking-tight text-[#EAEAEA] md:text-xl">
            Phantom users for every pull request.
          </p>

          <p className="max-w-md font-mono text-sm tracking-wide text-[#666666]">
            Every Vercel preview is already an A/B test.
            <br />
            It just has zero users.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 scroll-hint">
          <svg
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 L10 8 L18 2"
              stroke="#666"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px w-12 bg-[#222]" />

      {/* ════════════════════════════════════════════
          Section 2 — The Bottleneck
          ════════════════════════════════════════════ */}
      <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-3xl">
          {/* Headline — the anchor */}
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
            You build in hours.
            <br />
            You validate in weeks.
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-sm text-[#888]">
            Coding agents collapsed the build cycle. The experiment queue didn&apos;t.
          </p>

          {/* Pipeline comparison — two rows */}
          <div className="mb-14 space-y-4">
            {/* Row 1: Today's pipeline */}
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#666]">
                Today
              </p>
              <div className="flex items-center gap-0 overflow-x-auto">
                <div className="flex shrink-0 items-center gap-1.5 rounded-l border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#999]">Coding agent</span>
                </div>
                <div className="flex shrink-0 items-center border-y border-[#1e1e1e] bg-[#111] px-2 py-2">
                  <span className="font-mono text-[10px] text-emerald-500/70">~2hr</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#999]">PR + Preview</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center border border-[#FF2A2A]/20 bg-[#FF2A2A]/5 px-3 py-2">
                  <span className="text-xs text-[#FF6B6B]">A/B test queue</span>
                </div>
                <div className="flex shrink-0 items-center border-y border-r border-[#FF2A2A]/20 bg-[#FF2A2A]/5 px-2 py-2">
                  <span className="font-mono text-[10px] text-[#FF6B6B]">2-4 wk</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center rounded-r border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#555]">Statsig result</span>
                </div>
              </div>
            </div>

            {/* Row 2: With GhostShip */}
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ghost/70">
                With GhostShip
              </p>
              <div className="flex items-center gap-0">
                <div className="flex shrink-0 items-center gap-1.5 rounded-l border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#999]">Coding agent</span>
                </div>
                <div className="flex shrink-0 items-center border-y border-[#1e1e1e] bg-[#111] px-2 py-2">
                  <span className="font-mono text-[10px] text-emerald-500/70">~2hr</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#999]">PR + Preview</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center border border-ghost/20 bg-ghost/5 px-3 py-2">
                  <span className="text-xs text-ghost">GhostShip</span>
                </div>
                <div className="flex shrink-0 items-center rounded-r border-y border-r border-ghost/20 bg-ghost/5 px-2 py-2">
                  <span className="font-mono text-[10px] text-ghost">30s</span>
                </div>
                <div className="h-px w-3 shrink-0 bg-[#333]" />
                <div className="flex shrink-0 items-center rounded-r border border-[#1e1e1e] bg-[#111] px-3 py-2">
                  <span className="text-xs text-[#999]">Ship / kill / test</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two columns — queue vs results */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: The queue (the problem) */}
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#ccc]">
                  Experiment backlog
                </h3>
                <span className="font-mono text-[11px] text-[#FF6B6B]">
                  7 waiting
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: "Redesigned checkout flow", wait: "18d", status: "running" },
                  { name: "New pricing table", wait: "14d", status: "waiting" },
                  { name: "Simplified onboarding", wait: "11d", status: "waiting" },
                  { name: "Updated hero CTA", wait: "8d", status: "waiting" },
                  { name: "Dark mode support", wait: "5d", status: "queued" },
                  { name: "Mobile nav redesign", wait: "3d", status: "queued" },
                  { name: "Footer link cleanup", wait: "1d", status: "queued" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-[#1e1e1e] bg-[#111] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.status === "running"
                            ? "bg-amber-500 queue-pulse"
                            : item.status === "waiting"
                              ? "bg-[#FF4444]"
                              : "bg-[#333]"
                        }`}
                      />
                      <span className="text-sm text-[#bbb]">{item.name}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] ${
                        item.status === "running"
                          ? "text-amber-500"
                          : item.status === "waiting"
                            ? "text-[#FF6B6B]"
                            : "text-[#444]"
                      }`}
                    >
                      {item.status === "running" ? `${item.wait} running` : item.wait}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-mono text-[11px] text-[#555]">
                1 test at a time &middot; 2-4 weeks each &middot; most show no winner
              </p>
            </div>

            {/* Right: With GhostShip (the solution) */}
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#ccc]">
                  With GhostShip
                </h3>
                <span className="font-mono text-[11px] text-ghost">
                  all pre-filtered
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: "Redesigned checkout flow", result: "Ship it", verdict: "5/5 prefer B", win: true },
                  { name: "New pricing table", result: "Ship it", verdict: "4/5 prefer B", win: true },
                  { name: "Simplified onboarding", result: "Kill it", verdict: "1/5 prefer B", win: false },
                  { name: "Updated hero CTA", result: "Ship it", verdict: "4/5 prefer B", win: true },
                  { name: "Dark mode support", result: "Test more", verdict: "3/5 prefer B", win: null },
                  { name: "Mobile nav redesign", result: "Ship it", verdict: "5/5 prefer B", win: true },
                  { name: "Footer link cleanup", result: "Kill it", verdict: "1/5 prefer B", win: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-[#1e1e1e] bg-[#111] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.win === true
                            ? "bg-emerald-500"
                            : item.win === false
                              ? "bg-[#FF4444]"
                              : "bg-amber-500"
                        }`}
                      />
                      <span className="text-sm text-[#bbb]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden font-mono text-[10px] text-[#555] sm:inline">
                        {item.verdict}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-medium ${
                          item.win === true
                            ? "text-emerald-500"
                            : item.win === false
                              ? "text-[#FF6B6B]"
                              : "text-amber-500"
                        }`}
                      >
                        {item.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-mono text-[11px] text-ghost/70">
                All 7 evaluated in 30 seconds &middot; only 1 needs a real A/B test
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px w-12 bg-[#222]" />

      {/* ════════════════════════════════════════════
          Section 3 — Ghost Fleet
          ════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] overflow-hidden px-6 py-24">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#555]">
          [ phantom users deploy ]
        </p>

        {/* Ship — left side, desktop only */}
        <div
          className="absolute top-1/2 hidden -translate-y-1/2 md:block"
          style={{ left: "5%", width: "160px", height: "200px" }}
        >
          <ShipSilhouette />
        </div>

        {/* Particle trail — desktop only */}
        {particles.map((p, i) => (
          <div
            key={`p-${i}`}
            className="absolute hidden rounded-full md:block"
            style={{
              width: `${p.s}px`,
              height: `${p.s}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `rgba(212, 245, 245, ${0.04 + i * 0.008})`,
            }}
          />
        ))}

        {/* Ghosts — desktop: scattered absolute, mobile: flex grid */}
        <div className="relative mx-auto h-[420px] w-full max-w-6xl">
          {/* Desktop ghosts */}
          {phantoms.map((ghost, i) => (
            <div
              key={`d-${i}`}
              className="absolute hidden md:block"
              style={{ left: ghost.x, top: ghost.y }}
            >
              {/* Bobbing ghost */}
              <div
                className="ghost-bob"
                style={{
                  animationDuration: ghost.bobDuration,
                  animationDelay: ghost.bobDelay,
                }}
              >
                <Ghost color={ghost.color} size={ghost.size} />
              </div>
              {/* Speech bubble */}
              <div
                className="bubble-fade absolute -top-9 left-12 whitespace-nowrap"
                style={{
                  animationDuration: ghost.bubbleDuration,
                  animationDelay: ghost.bubbleDelay,
                }}
              >
                <span
                  className="rounded-full px-3 py-1 font-mono text-[11px]"
                  style={{
                    color: ghost.color,
                    background: `${ghost.color}0d`,
                    border: `1px solid ${ghost.color}1a`,
                  }}
                >
                  {ghost.label}
                </span>
              </div>
            </div>
          ))}

          {/* Mobile ghosts — simpler layout */}
          <div className="flex flex-wrap items-start justify-center gap-10 pt-12 md:hidden">
            {phantoms.map((ghost, i) => (
              <div key={`m-${i}`} className="flex flex-col items-center gap-3">
                <div
                  className="ghost-bob"
                  style={{
                    animationDuration: ghost.bobDuration,
                    animationDelay: ghost.bobDelay,
                  }}
                >
                  <Ghost color={ghost.color} size={40} />
                </div>
                <div
                  className="bubble-fade"
                  style={{
                    animationDuration: ghost.bubbleDuration,
                    animationDelay: ghost.bubbleDelay,
                  }}
                >
                  <span
                    className="whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px]"
                    style={{
                      color: ghost.color,
                      background: `${ghost.color}0d`,
                    }}
                  >
                    {ghost.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="font-mono text-sm text-[#555]">
            <span className="text-ghost">@ghostship</span> in Slack with any
            preview URL
          </p>
          <p className="font-mono text-[11px] text-[#333]">
            30 seconds. Not 3 weeks.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#2a2a2a]">
          ghostship v0.1 — phantom users for every pull request
        </p>
      </footer>
    </main>
  );
}
