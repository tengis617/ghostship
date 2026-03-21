"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
  useCallback,
  useRef,
  Fragment,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Persona, PageEvaluation } from "@/lib/personas";
import type { Synthesis } from "@/lib/synthesize";

/* ─── Types ─── */

type StepId = "screenshot" | "analyze" | "evaluate" | "synthesize";
type StepStatus = "pending" | "active" | "complete";

interface Step {
  id: StepId;
  label: string;
  status: StepStatus;
}

const INITIAL_STEPS: Step[] = [
  { id: "screenshot", label: "Screenshot", status: "pending" },
  { id: "analyze", label: "Analyze", status: "pending" },
  { id: "evaluate", label: "Evaluate", status: "pending" },
  { id: "synthesize", label: "Report", status: "pending" },
];

const STEP_MESSAGES: Record<StepId, string> = {
  screenshot: "Navigating to the page…",
  analyze: "Summoning phantom users…",
  evaluate: "Boarding ghosts onto the page…",
  synthesize: "Ghosts conferring on their findings…",
};

/* ─── Typewriter ─── */

function TypewriterText({ text }: { text: string }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
  }, [text]);

  useEffect(() => {
    if (length >= text.length) return;
    const timer = setTimeout(() => setLength((l) => l + 1), 18);
    return () => clearTimeout(timer);
  }, [length, text]);

  return (
    <>
      {text.slice(0, length)}
      {length < text.length && (
        <span className="inline-block w-[5px] h-[13px] bg-ghost/60 ml-0.5 align-middle cursor-blink" />
      )}
    </>
  );
}

/* ─── Timeline ─── */

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-start w-full max-w-xl mx-auto">
      {steps.map((step, i) => (
        <Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2.5">
            <div
              className={[
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                step.status === "complete" &&
                  "bg-ghost shadow-[0_0_8px_var(--color-ghost-dim)]",
                step.status === "active" &&
                  "border border-ghost bg-ghost/20 phase-pulse",
                step.status === "pending" && "border border-[#333]",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <span
              className={[
                "font-mono text-[10px] tracking-wide transition-colors duration-300",
                step.status === "complete" && "text-ghost",
                step.status === "active" && "text-ghost/70",
                step.status === "pending" && "text-[#444]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.label}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div
              className={[
                "flex-1 h-px mt-[5px] mx-1 transition-colors duration-700",
                step.status === "complete" ? "bg-ghost/30" : "bg-[#1e1e1e]",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

/* ─── Score Badge ─── */

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 5
        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs font-bold ${color}`}
    >
      {score}/10
    </span>
  );
}

/* ─── Expandable Persona Card ─── */

function PersonaCard({
  persona,
  evaluation,
}: {
  persona: Persona;
  evaluation?: PageEvaluation;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!evaluation) {
    return (
      <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] px-4 py-3 fade-in">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{persona.emoji}</span>
          <span className="text-sm text-[#888]">{persona.name}</span>
          <span className="ml-auto h-4 w-10 animate-pulse rounded-full bg-[#1a1a1a]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="group rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] cursor-pointer transition-colors hover:border-[#2a2a2a] fade-in"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Collapsed header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base shrink-0">{persona.emoji}</span>
          <span className="text-sm text-[#ccc] shrink-0">{persona.name}</span>
          <span className="hidden sm:block text-xs text-[#555] truncate italic">
            &ldquo;{evaluation.firstImpression}&rdquo;
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <ScoreBadge score={evaluation.score} />
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            className={`text-[#444] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path
              d="M1 1 L5 5 L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Expandable details */}
      <div
        className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#1a1a1a] px-4 py-3.5 space-y-3">
            <p className="text-xs text-[#999] italic leading-relaxed">
              &ldquo;{evaluation.firstImpression}&rdquo;
            </p>
            <p className="text-xs text-[#bbb] leading-relaxed">
              {evaluation.rationale}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-500/70">
                  Strengths
                </p>
                <ul className="space-y-1">
                  {evaluation.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-[11px] leading-snug text-[#888]"
                    >
                      <span className="mr-1 text-emerald-500/50">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-red-500/70">
                  Weaknesses
                </p>
                <ul className="space-y-1">
                  {evaluation.weaknesses.map((w, i) => (
                    <li
                      key={i}
                      className="text-[11px] leading-snug text-[#888]"
                    >
                      <span className="mr-1 text-red-500/50">&minus;</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {evaluation.suggestions.length > 0 && (
              <div className="border-t border-[#1a1a1a] pt-2.5">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#555]">
                  Suggestions
                </p>
                <ul className="space-y-1">
                  {evaluation.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="text-[11px] leading-snug text-[#777]"
                    >
                      <span className="mr-1 text-ghost/40">&rarr;</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Synthesis Report ─── */

function SynthesisReport({ synthesis }: { synthesis: Synthesis }) {
  return (
    <section className="fade-in space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#555]">
          Synthesis
        </p>
        <ScoreBadge score={Math.round(synthesis.averageScore * 10) / 10} />
      </div>

      <p className="text-sm text-[#bbb] leading-relaxed">
        {synthesis.summary}
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-emerald-500/70">
            Top strengths
          </p>
          <ul className="space-y-1.5">
            {synthesis.topStrengths.map((s, i) => (
              <li key={i} className="text-xs text-[#888] leading-snug">
                <span className="mr-1.5 text-emerald-500/50">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-red-500/70">
            Top weaknesses
          </p>
          <ul className="space-y-1.5">
            {synthesis.topWeaknesses.map((s, i) => (
              <li key={i} className="text-xs text-[#888] leading-snug">
                <span className="mr-1.5 text-red-500/50">&minus;</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-ghost/10 bg-ghost/[0.03] px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-ghost/40 mb-1">
          Recommendation
        </p>
        <p className="text-sm text-ghost/80">{synthesis.recommendation}</p>
      </div>
    </section>
  );
}

/* ─── Status Log ─── */

function StatusLog({
  messages,
}: {
  messages: string[];
}) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-1.5 font-mono text-xs">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-baseline gap-2 fade-in-fast">
          <span className="text-[#333] select-none shrink-0">&rsaquo;</span>
          <span className="text-[#666]">
            {i === messages.length - 1 ? (
              <TypewriterText text={msg} />
            ) : (
              msg
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main View ─── */

function EvaluateView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");

  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    description: string;
    pageType: string;
  } | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [evaluations, setEvaluations] = useState<PageEvaluation[]>([]);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRequestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateStep = useCallback((id: StepId, status: StepStatus) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  const addLog = useCallback((text: string) => {
    setLogMessages((prev) => [...prev, text]);
  }, []);

  const resetEvaluation = useCallback(() => {
    setSteps(INITIAL_STEPS.map((step) => ({ ...step })));
    setScreenshot(null);
    setAnalysis(null);
    setPersonas([]);
    setEvaluations([]);
    setSynthesis(null);
    setError(null);
    setLogMessages([]);
  }, []);

  const handleStreamEvent = useEffectEvent(
    (requestId: number, eventName: string, data: any) => {
      if (requestId !== streamRequestIdRef.current) {
        return;
      }

      startTransition(() => {
        switch (eventName) {
          case "step":
            updateStep(data.id, data.status);
            if (
              data.status === "active" &&
              typeof data.id === "string" &&
              data.id in STEP_MESSAGES
            ) {
              addLog(STEP_MESSAGES[data.id as StepId]);
            }
            break;
          case "screenshot":
            setScreenshot(data.thumbnail);
            addLog("Screenshot acquired");
            break;
          case "analysis":
            setAnalysis(data);
            break;
          case "persona":
            setPersonas((prev) =>
              prev.some((persona) => persona.id === data.id)
                ? prev
                : [...prev, data]
            );
            addLog(`${data.emoji} ${data.name} materialized`);
            break;
          case "evaluation":
            setEvaluations((prev) => {
              const next = prev.filter(
                (evaluation) => evaluation.personaId !== data.personaId
              );
              next.push(data);
              return next;
            });
            addLog(`${data.personaEmoji} ${data.personaName} reporting back`);
            break;
          case "synthesis":
            setSynthesis(data);
            addLog("Report assembled");
            break;
          case "error":
            setError(data.message);
            break;
        }
      });
    }
  );

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    logMessages.length,
    Boolean(screenshot),
    Boolean(analysis),
    personas.length,
    evaluations.length,
    Boolean(synthesis),
  ]);

  useEffect(() => {
    if (url) {
      return;
    }

    router.replace("/");
  }, [router, url]);

  useEffect(() => {
    if (!url) return;

    streamRequestIdRef.current += 1;
    const requestId = streamRequestIdRef.current;

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    resetEvaluation();

    async function run() {
      try {
        const response = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: abortController.signal,
        });

        if (
          requestId !== streamRequestIdRef.current ||
          abortController.signal.aborted
        ) {
          return;
        }

        if (!response.ok || !response.body) {
          setError("Failed to start evaluation");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done || abortController.signal.aborted) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop()!;

          for (const part of parts) {
            let eventName = "";
            let eventData = "";
            for (const line of part.split("\n")) {
              if (line.startsWith("event: ")) eventName = line.slice(7);
              else if (line.startsWith("data: ")) eventData = line.slice(6);
            }
            if (!eventName || !eventData) continue;

            const data = JSON.parse(eventData);
            handleStreamEvent(requestId, eventName, data);
          }
        }
      } catch (err) {
        if (
          !abortController.signal.aborted &&
          requestId === streamRequestIdRef.current
        ) {
          startTransition(() => {
            setError(err instanceof Error ? err.message : "Network error");
          });
        }
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    }

    void run();
    return () => {
      abortController.abort();
    };
  }, [handleStreamEvent, resetEvaluation, url]);

  if (!url) {
    return null;
  }

  const evaluationMap = new Map(evaluations.map((e) => [e.personaId, e]));
  const isComplete = steps.every((s) => s.status === "complete");

  return (
    <main className="min-h-screen page-enter">
      {/* Header — scrolls away */}
      <div className="mx-auto max-w-2xl px-6 pt-10 md:pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#555] hover:text-ghost transition-colors mb-8"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="opacity-60"
          >
            <path
              d="M8 2 L4 6 L8 10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          ghostship
        </Link>

        <p className="font-mono text-sm text-ghost/80 mb-6 truncate">{url}</p>
      </div>

      {/* Sticky timeline */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1e1e1e]/40">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <Timeline steps={steps} />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-16">
        {/* Error */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="font-mono text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Status log */}
          <StatusLog messages={logMessages} />

          {/* Screenshot */}
          {screenshot && (
            <section className="fade-in">
              <div className="overflow-hidden rounded-xl border border-[#1e1e1e] max-w-sm">
                <img
                  src={screenshot}
                  alt={`Screenshot of ${url}`}
                  className="w-full"
                />
              </div>
            </section>
          )}

          {/* Analysis */}
          {analysis && (
            <section className="fade-in">
              <p className="rounded-full inline-block border border-[#1e1e1e] bg-[#111] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#777] mb-2.5">
                {analysis.pageType}
              </p>
              <p className="text-sm text-[#bbb] leading-relaxed max-w-xl">
                {analysis.description}
              </p>
            </section>
          )}

          {/* Personas + Evaluations */}
          {personas.length > 0 && (
            <section className="fade-in">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#555] mb-3">
                Persona evaluations
                {evaluations.length > 0 &&
                  evaluations.length < personas.length && (
                    <span className="ml-2 text-ghost/50">
                      {evaluations.length}/{personas.length}
                    </span>
                  )}
              </p>
              <div className="space-y-1.5">
                {personas.map((p) => (
                  <PersonaCard
                    key={p.id}
                    persona={p}
                    evaluation={evaluationMap.get(p.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Synthesis */}
          {synthesis && (
            <div className="border-t border-[#1e1e1e] pt-8">
              <SynthesisReport synthesis={synthesis} />
            </div>
          )}

          {/* Done */}
          {isComplete && (
            <div className="text-center pt-2 pb-8">
              <Link
                href="/"
                className="font-mono text-xs text-[#555] hover:text-ghost transition-colors"
              >
                Evaluate another URL &rarr;
              </Link>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>
    </main>
  );
}

/* ─── Page (wrapped in Suspense for useSearchParams) ─── */

export default function EvaluatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-ghost/20 phase-pulse" />
        </main>
      }
    >
      <EvaluateView />
    </Suspense>
  );
}
