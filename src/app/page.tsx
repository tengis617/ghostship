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

/* ─── Ship silhouette (removed — using real image now) ─── */

/* ─── Phantom data ─── */

const phantoms = [
  {
    color: "#D4F5F5",
    label: "Where do I start?",
    persona: "First-time visitor",
    image: "/images/personas/first-timer.png",
    x: "28%",
    y: "24%",
    size: 72,
    bobDuration: "3.2s",
    bobDelay: "0s",
    bubbleDuration: "4.0s",
    bubbleDelay: "0.5s",
  },
  {
    color: "#F5D4E6",
    label: "Show me pricing",
    persona: "Buyer",
    image: "/images/personas/budget-buyer.png",
    x: "42%",
    y: "58%",
    size: 66,
    bobDuration: "3.6s",
    bobDelay: "0.4s",
    bubbleDuration: "4.5s",
    bubbleDelay: "1.4s",
  },
  {
    color: "#D4F5D8",
    label: "Good contrast ratio",
    persona: "Accessibility auditor",
    image: "/images/personas/accessibility.png",
    x: "56%",
    y: "18%",
    size: 76,
    bobDuration: "2.9s",
    bobDelay: "0.8s",
    bubbleDuration: "3.8s",
    bubbleDelay: "0.8s",
  },
  {
    color: "#F5EED4",
    label: "Gets to the point",
    persona: "Executive",
    image: "/images/personas/executive.png",
    x: "62%",
    y: "60%",
    size: 62,
    bobDuration: "3.4s",
    bobDelay: "0.2s",
    bubbleDuration: "5.0s",
    bubbleDelay: "2.0s",
  },
  {
    color: "#E0D4F5",
    label: "Prefer version B",
    persona: "Developer",
    image: "/images/personas/power-user.png",
    x: "82%",
    y: "20%",
    size: 70,
    bobDuration: "3.1s",
    bobDelay: "0.6s",
    bubbleDuration: "4.2s",
    bubbleDelay: "0.3s",
  },
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

          {/* Pipeline comparison — three eras */}
          <div className="mb-14 space-y-10">
            {/* Era 1: Before AI — balanced cadence */}
            <div>
              <div className="mb-3 flex items-baseline gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666]">
                  Before AI
                </p>
                <p className="font-mono text-[10px] text-[#444]">
                  dev speed ≈ test throughput
                </p>
              </div>
              {/* Column headers */}
              <div className="mb-2 grid grid-cols-[1fr_8px_1fr_8px_auto] items-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">Dev</span>
                <span />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">A/B test</span>
                <span />
                <span />
              </div>
              <div className="space-y-1.5">
                {["Feature 1", "Feature 2", "Feature 3"].map((name, i) => (
                  <div key={i} className="grid grid-cols-[1fr_8px_1fr_8px_auto] items-center">
                    <div className="rounded border border-[#1e1e1e] bg-[#111] px-2.5 py-1.5 text-center">
                      <span className="text-xs text-[#999]">{name}</span>
                    </div>
                    <div className="flex justify-center"><div className="h-px w-full bg-[#333]" /></div>
                    <div className="rounded border border-[#1e1e1e] bg-[#111] px-2.5 py-1.5 text-center">
                      <span className="text-xs text-[#999]">A/B test</span>
                    </div>
                    <div className="flex justify-center"><div className="h-px w-full bg-[#333]" /></div>
                    <div className="rounded border border-[#1e1e1e] bg-[#111] px-2.5 py-1.5">
                      <span className="text-xs text-[#555]">Ship</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-[#444]">
                One feature finishes dev → one slot opens for A/B test. No queue.
              </p>
            </div>

            {/* Era 2: Today — features pile up */}
            <div>
              <div className="mb-3 flex items-baseline gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666]">
                  Today
                </p>
                <p className="font-mono text-[10px] text-[#FF6B6B]/60">
                  features ship faster than you can test them
                </p>
              </div>
              {/* Column headers */}
              <div className="mb-2 grid grid-cols-[100px_8px_1fr] items-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">Dev</span>
                <span />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#444]">A/B test</span>
              </div>
              <div className="space-y-1.5">
                {/* Feature 1 — currently testing */}
                <div className="grid grid-cols-[100px_8px_1fr] items-center">
                  <div className="rounded border border-[#1e1e1e] bg-[#111] px-2.5 py-1.5 text-center">
                    <span className="font-mono text-[10px] text-emerald-500/50">done</span>
                  </div>
                  <div className="flex justify-center"><div className="h-px w-full bg-[#333]" /></div>
                  <div className="flex items-center rounded border border-amber-500/20 bg-amber-500/[0.03]">
                    <div className="flex-1 px-2.5 py-1.5">
                      <span className="text-xs text-amber-500">Feature 1</span>
                    </div>
                    <div className="border-l border-amber-500/10 px-2 py-1.5">
                      <span className="font-mono text-[10px] text-amber-500/60 queue-pulse">2-4 wk</span>
                    </div>
                  </div>
                </div>
                {/* Features 2-5 — done but queued */}
                {["Feature 2", "Feature 3", "Feature 4", "Feature 5"].map((name, i) => (
                  <div key={i} className="grid grid-cols-[100px_8px_1fr] items-center">
                    <div className="rounded border border-[#1e1e1e] bg-[#111] px-2.5 py-1.5 text-center">
                      <span className="font-mono text-[10px] text-emerald-500/50">done</span>
                    </div>
                    <div className="flex justify-center"><div className="h-px w-full bg-[#333]" /></div>
                    <div className="rounded border border-[#FF2A2A]/20 bg-[#FF2A2A]/[0.03] px-2.5 py-1.5">
                      <span className="text-xs text-[#FF6B6B]">{name}</span>
                      <span className="ml-2 font-mono text-[10px] text-[#FF6B6B]/40">queued</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-[#FF6B6B]/50">
                Dev takes hours. A/B tests take weeks. The queue only grows.
              </p>
            </div>

            {/* Era 3: With GhostShip */}
            <div>
              <div className="mb-3 flex items-baseline gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ghost/70">
                  With GhostShip
                </p>
                <p className="font-mono text-[10px] text-ghost/40">
                  pre-filter before real traffic
                </p>
              </div>
              <div className="overflow-x-auto pb-2">
                <div className="flex w-max items-start">
                  <div className="mt-4 flex items-center">
                    <div className="rounded-l border border-[#1e1e1e] bg-[#111] px-3 py-1.5">
                      <span className="text-xs text-[#999]">Dev</span>
                    </div>
                    <div className="border-y border-r border-[#1e1e1e] bg-[#111] px-2 py-1.5">
                      <span className="font-mono text-[10px] text-emerald-500/70">~2hr</span>
                    </div>
                  </div>

                  <div className="mx-1.5 mt-[18px] h-px w-2 bg-[#333]" />

                  <div className="mt-4 rounded border border-ghost/20 bg-ghost/5 px-2.5 py-1.5">
                    <span className="font-mono text-[10px] text-ghost">Persona review</span>
                    <span className="ml-1.5 font-mono text-[9px] text-ghost/50">30s</span>
                  </div>

                  <div className="mx-1.5 mt-[18px] h-px w-2 bg-[#333]" />

                  {/* Three parallel outcome paths */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-px w-3 bg-[#333]" />
                      <div className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
                        <span className="font-mono text-[10px] text-emerald-500">Ship</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-px w-3 bg-[#333]" />
                      <div className="rounded border border-[#FF4444]/20 bg-[#FF4444]/5 px-2.5 py-1">
                        <span className="font-mono text-[10px] text-[#FF6B6B]">Kill</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-px w-3 bg-[#333]" />
                      <div className="rounded border border-amber-500/20 bg-amber-500/5 px-2.5 py-1">
                        <span className="font-mono text-[10px] text-amber-500">A/B test</span>
                      </div>
                    </div>
                  </div>
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
          style={{ left: "2%", width: "220px" }}
        >
          <Image
            src="/images/ghost-ship-side.jpg"
            alt="Ghost pirate ship"
            width={220}
            height={220}
            className="ship-rock mix-blend-lighten opacity-60"
            style={{
              maskImage:
                "radial-gradient(ellipse 85% 85% at center, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 85% at center, black 40%, transparent 100%)",
            }}
          />
        </div>

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
                <Image
                  src={ghost.image}
                  alt={ghost.persona}
                  width={ghost.size}
                  height={ghost.size}
                  className="mix-blend-lighten"
                  style={{
                    maskImage: "radial-gradient(circle, black 45%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 75%)",
                  }}
                />
              </div>
              {/* Persona pill */}
              <div className="mt-1 flex justify-center">
                <span
                  className="whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                  style={{
                    color: ghost.color,
                    background: `${ghost.color}12`,
                    border: `1px solid ${ghost.color}20`,
                  }}
                >
                  {ghost.persona}
                </span>
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
              <div key={`m-${i}`} className="flex flex-col items-center gap-2">
                <div
                  className="ghost-bob"
                  style={{
                    animationDuration: ghost.bobDuration,
                    animationDelay: ghost.bobDelay,
                  }}
                >
                  <Image
                    src={ghost.image}
                    alt={ghost.persona}
                    width={56}
                    height={56}
                    className="mix-blend-lighten"
                    style={{
                      maskImage: "radial-gradient(circle, black 45%, transparent 75%)",
                      WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 75%)",
                    }}
                  />
                </div>
                {/* Persona pill */}
                <span
                  className="whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider"
                  style={{
                    color: ghost.color,
                    background: `${ghost.color}12`,
                    border: `1px solid ${ghost.color}20`,
                  }}
                >
                  {ghost.persona}
                </span>
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
