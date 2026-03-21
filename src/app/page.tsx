import Image from "next/image";
import { HeroForm } from "@/components/hero-form";

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
              className="relative z-10 ghost-float"
            />
          </div>

          <h1 className="text-7xl font-black tracking-tighter text-white md:text-9xl drop-shadow-[0_0_40px_var(--color-ghost-dim)]">
            ghostship
          </h1>

          <p className="max-w-lg text-xl font-medium tracking-tight text-[#EAEAEA] md:text-2xl">
            Phantom users for every pull request.
          </p>

          <p className="max-w-md font-mono text-sm tracking-wide text-[#666666]">
            Every Vercel preview is already an A/B test.
            <br />
            It just has zero users.
          </p>

          {/* CTA */}
          <div className="mt-4 w-full max-w-lg">
            <HeroForm />
          </div>
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

          {/* Pipeline comparison — Gantt-style timelines */}
          <div className="mb-14 space-y-12">
            {/* Era 1: Before AI — balanced pipeline */}
            <div>
              <div className="mb-4 flex items-baseline gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666]">
                  Before AI
                </p>
                <p className="font-mono text-[10px] text-[#444]">
                  dev and testing stay in sync
                </p>
              </div>
              {/* Gantt chart */}
              <div className="relative space-y-2">
                {/* Time axis labels */}
                <div className="flex justify-between px-1 pb-1">
                  {["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"].map((wk) => (
                    <span key={wk} className="font-mono text-[8px] text-[#333]">{wk}</span>
                  ))}
                </div>
                {/* Grid lines */}
                <div className="pointer-events-none absolute inset-0 top-5 flex justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-full w-px bg-[#1a1a1a]" />
                  ))}
                </div>
                {/* Feature 1: dev wk1-3, test wk4-6 */}
                <div className="flex h-7 items-center gap-0.5">
                  <div className="flex h-full w-[37.5%] items-center rounded border border-[#1e1e1e] bg-[#111] px-2">
                    <span className="text-[10px] text-[#999]">Feature 1 dev</span>
                  </div>
                  <div className="flex h-full w-[37.5%] items-center rounded border border-[#1e1e1e] bg-[#161620] px-2">
                    <span className="text-[10px] text-[#999]">A/B test</span>
                  </div>
                  <div className="flex h-full w-[12.5%] items-center justify-center rounded border border-emerald-500/20 bg-emerald-500/5">
                    <span className="text-[9px] text-emerald-500">Ship</span>
                  </div>
                </div>
                {/* Feature 2: dev wk3-5, test wk6-8 — overlaps with F1 test */}
                <div className="flex h-7 items-center gap-0.5">
                  <div className="w-[25%]" />
                  <div className="flex h-full w-[37.5%] items-center rounded border border-[#1e1e1e] bg-[#111] px-2">
                    <span className="text-[10px] text-[#999]">Feature 2 dev</span>
                  </div>
                  <div className="flex h-full w-[37.5%] items-center rounded border border-[#1e1e1e] bg-[#161620] px-2">
                    <span className="text-[10px] text-[#999]">A/B test</span>
                  </div>
                </div>
                {/* Feature 3: dev wk5-7 — overlaps with F2 test */}
                <div className="flex h-7 items-center gap-0.5">
                  <div className="w-[50%]" />
                  <div className="flex h-full w-[37.5%] items-center rounded border border-[#1e1e1e] bg-[#111] px-2">
                    <span className="text-[10px] text-[#999]">Feature 3 dev</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 font-mono text-[10px] text-[#444]">
                Dev takes weeks → next feature starts during A/B test. No queue.
              </p>
            </div>

            {/* Era 2: Today — everything piles up */}
            <div>
              <div className="mb-4 flex items-baseline gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666]">
                  Today
                </p>
                <p className="font-mono text-[10px] text-[#FF6B6B]/60">
                  features ship faster than you can test them
                </p>
              </div>
              {/* Gantt chart */}
              <div className="relative space-y-2">
                {/* Time axis */}
                <div className="flex justify-between px-1 pb-1">
                  {["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"].map((wk) => (
                    <span key={wk} className="font-mono text-[8px] text-[#333]">{wk}</span>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-0 top-5 flex justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-full w-px bg-[#1a1a1a]" />
                  ))}
                </div>
                {/* Feature 1: tiny dev, then A/B test wk1-4 */}
                <div className="flex h-7 items-center gap-0.5">
                  <div className="flex h-full w-[4%] items-center justify-center rounded border border-emerald-500/20 bg-emerald-500/5">
                    <span className="text-[8px] text-emerald-500/70">&#9679;</span>
                  </div>
                  <div className="flex h-full w-[50%] items-center rounded border border-amber-500/20 bg-amber-500/[0.04] px-2">
                    <span className="text-[10px] text-amber-500">Feature 1 — A/B testing</span>
                    <span className="ml-auto font-mono text-[9px] text-amber-500/50 queue-pulse">2-4 wk</span>
                  </div>
                </div>
                {/* Features 2-5: tiny dev done, but queued — stacking */}
                {["Feature 2", "Feature 3", "Feature 4", "Feature 5"].map((name, i) => (
                  <div key={i} className="flex h-7 items-center gap-0.5">
                    <div className="flex h-full w-[4%] items-center justify-center rounded border border-emerald-500/20 bg-emerald-500/5">
                      <span className="text-[8px] text-emerald-500/70">&#9679;</span>
                    </div>
                    <div
                      className="flex h-full items-center rounded border border-[#FF2A2A]/20 bg-[#FF2A2A]/[0.03] px-2"
                      style={{ width: `${50 + (i + 1) * 8}%` }}
                    >
                      <span className="text-[10px] text-[#FF6B6B]">{name}</span>
                      <span className="ml-auto font-mono text-[9px] text-[#FF6B6B]/40">
                        queued {(i + 1) * 2}+ wk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-[#FF6B6B]/50">
                Dev takes hours. A/B tests take weeks. The queue only grows.
              </p>
            </div>

          </div>

          {/* ── Triage: same backlog, two outcomes ── */}
          <div className="mb-4 flex flex-col items-center gap-3">
            <div className="h-6 w-px bg-gradient-to-b from-[#FF6B6B]/20 to-transparent" />
            <p className="font-mono text-[11px] tracking-wide text-[#555]">
              Same 7 features. Two outcomes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-0">
            {/* Left: Without GhostShip */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#777]">Without GhostShip</p>
                <span className="rounded-full border border-[#FF2A2A]/10 bg-[#FF2A2A]/5 px-2.5 py-0.5 font-mono text-[10px] text-[#FF6B6B]/70">
                  ~14 weeks to clear
                </span>
              </div>

              <div className="space-y-1">
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
                    className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                      item.status === "running"
                        ? "border border-amber-500/10 bg-amber-500/[0.03]"
                        : "border border-transparent bg-[#111]/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "running"
                            ? "bg-amber-500 queue-pulse"
                            : item.status === "waiting"
                              ? "bg-[#FF4444]/60"
                              : "bg-[#2a2a2a]"
                        }`}
                      />
                      <span className={`text-[13px] ${item.status === "queued" ? "text-[#555]" : "text-[#888]"}`}>
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] ${
                        item.status === "running"
                          ? "text-amber-500/70 queue-pulse"
                          : item.status === "waiting"
                            ? "text-[#FF6B6B]/40"
                            : "text-[#2a2a2a]"
                      }`}
                    >
                      {item.status === "running" ? `${item.wait} running` : item.wait}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-[#1a1a1a] pt-3">
                <p className="font-mono text-[10px] text-[#444]">
                  1 running &middot; 6 waiting &middot; most will prove nothing
                </p>
              </div>
            </div>

            {/* Arrow connector (desktop) */}
            <div className="hidden items-center justify-center px-3 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#222] bg-[#111]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8m0 0L8 4m3 3L8 10" stroke="#D4F5F5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Right: With GhostShip */}
            <div className="rounded-xl border border-ghost/8 bg-[#0a0a0a]/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#ccc]">With GhostShip</p>
                <span className="rounded-full border border-ghost/15 bg-ghost/5 px-2.5 py-0.5 font-mono text-[10px] text-ghost">
                  30 seconds
                </span>
              </div>

              <div className="space-y-1">
                {[
                  { name: "Redesigned checkout flow", vote: "5–0", verdict: "Ship", win: true },
                  { name: "New pricing table", vote: "4–1", verdict: "Ship", win: true },
                  { name: "Simplified onboarding", vote: "1–4", verdict: "Kill", win: false },
                  { name: "Updated hero CTA", vote: "4–1", verdict: "Ship", win: true },
                  { name: "Dark mode support", vote: "3–2", verdict: "A/B test", win: null },
                  { name: "Mobile nav redesign", vote: "5–0", verdict: "Ship", win: true },
                  { name: "Footer link cleanup", vote: "1–4", verdict: "Kill", win: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg border-l-2 py-2 pr-3 pl-3 ${
                      item.win === true
                        ? "border-l-emerald-500/50 bg-emerald-500/[0.03]"
                        : item.win === false
                          ? "border-l-[#222] bg-[#111]/50"
                          : "border-l-amber-500/50 bg-amber-500/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 font-mono text-[10px] tabular-nums ${
                        item.win === true ? "text-emerald-500/40" : item.win === false ? "text-[#333]" : "text-amber-500/50"
                      }`}>
                        {item.vote}
                      </span>
                      <span className={`text-[13px] ${item.win === false ? "text-[#444]" : "text-[#bbb]"}`}>
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-medium ${
                        item.win === true
                          ? "bg-emerald-500/10 text-emerald-500"
                          : item.win === false
                            ? "bg-[#1a1a1a] text-[#555]"
                            : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {item.verdict}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-ghost/8 pt-3">
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="text-emerald-500/70">4 ship</span>
                  <span className="text-[#333]">&middot;</span>
                  <span className="text-[#FF6B6B]/50">2 killed</span>
                  <span className="text-[#333]">&middot;</span>
                  <span className="text-amber-500">1 → real A/B test</span>
                </div>
              </div>
            </div>
          </div>

          {/* Punchline */}
          <div className="mt-10 flex flex-col items-center gap-1.5 text-center">
            <p className="text-[15px] font-medium tracking-tight text-[#ccc]">
              7 decisions in 30 seconds.
            </p>
            <p className="font-mono text-[11px] text-[#555]">
              Only <span className="text-amber-500">1</span> needs a real A/B test.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px w-12 bg-[#222]" />

      {/* ════════════════════════════════════════════
          Section 2.5 — How it works (demos)
          ════════════════════════════════════════════ */}
      <section className="flex flex-col items-center px-6 py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#555]">
          [ one mention. five verdicts. ]
        </p>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
          Works where you already work.
        </h2>
        <div className="mb-14" />

        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
          {/* Slack demo */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#0a0a0a]">
            <div className="flex items-center gap-2.5 border-b border-[#222] bg-[#111] px-5 py-3.5">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M3.4 10.1a1.7 1.7 0 1 1-1.7-1.7h1.7v1.7Zm.85 0a1.7 1.7 0 1 1 3.4 0v4.2a1.7 1.7 0 1 1-3.4 0v-4.2Z" fill="#E01E5A"/>
                <path d="M5.9 3.4a1.7 1.7 0 1 1 1.7-1.7v1.7H5.9Zm0 .85a1.7 1.7 0 1 1 0 3.4H1.7a1.7 1.7 0 1 1 0-3.4h4.2Z" fill="#36C5F0"/>
                <path d="M12.6 5.9a1.7 1.7 0 1 1 1.7 1.7h-1.7V5.9Zm-.85 0a1.7 1.7 0 1 1-3.4 0V1.7a1.7 1.7 0 1 1 3.4 0v4.2Z" fill="#2EB67D"/>
                <path d="M10.1 12.6a1.7 1.7 0 1 1-1.7 1.7v-1.7h1.7Zm0-.85a1.7 1.7 0 1 1 0-3.4h4.2a1.7 1.7 0 1 1 0 3.4h-4.2Z" fill="#ECB22E"/>
              </svg>
              <span className="text-sm font-medium text-[#ccc]">Slack</span>
            </div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
              src="/videos/slack-demo.mp4"
            />
          </div>

          {/* GitHub demo */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#0a0a0a]">
            <div className="flex items-center gap-2.5 border-b border-[#222] bg-[#111] px-5 py-3.5">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#ccc">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
              </svg>
              <span className="text-sm font-medium text-[#ccc]">GitHub PR</span>
            </div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
              src="/videos/github-demo.mp4"
            />
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] text-[#333]">
          Autoplay &middot; loops &middot; actual product flow
        </p>
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

      {/* ════════════════════════════════════════════
          Footer — CTAs + branding
          ════════════════════════════════════════════ */}
      <footer className="flex flex-col items-center gap-8 px-6 py-20">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Add to Slack */}
          <button className="flex items-center gap-2.5 rounded-xl border border-[#222] bg-[#111] px-5 py-3 font-medium text-white transition-colors hover:border-[#333] hover:bg-[#1a1a1a]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3.4 10.1a1.7 1.7 0 1 1-1.7-1.7h1.7v1.7Zm.85 0a1.7 1.7 0 1 1 3.4 0v4.2a1.7 1.7 0 1 1-3.4 0v-4.2Z" fill="#E01E5A"/>
              <path d="M5.9 3.4a1.7 1.7 0 1 1 1.7-1.7v1.7H5.9Zm0 .85a1.7 1.7 0 1 1 0 3.4H1.7a1.7 1.7 0 1 1 0-3.4h4.2Z" fill="#36C5F0"/>
              <path d="M12.6 5.9a1.7 1.7 0 1 1 1.7 1.7h-1.7V5.9Zm-.85 0a1.7 1.7 0 1 1-3.4 0V1.7a1.7 1.7 0 1 1 3.4 0v4.2Z" fill="#2EB67D"/>
              <path d="M10.1 12.6a1.7 1.7 0 1 1-1.7 1.7v-1.7h1.7Zm0-.85a1.7 1.7 0 1 1 0-3.4h4.2a1.7 1.7 0 1 1 0 3.4h-4.2Z" fill="#ECB22E"/>
            </svg>
            <span className="text-sm">Add to Slack</span>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/nichochar/ghostship"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-ghost/15 bg-ghost/5 px-5 py-3 font-medium text-ghost transition-colors hover:border-ghost/25 hover:bg-ghost/10"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
            </svg>
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#2a2a2a]">
          ghostship v0.1 — phantom users for every pull request
        </p>
      </footer>
    </main>
  );
}
