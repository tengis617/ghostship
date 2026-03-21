"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroForm() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    router.push(`/evaluate?url=${encodeURIComponent(normalized)}`);
  }

  const presets = [
    { label: "Vercel Pricing", url: "https://vercel.com/pricing" },
    { label: "Linear Homepage", url: "https://linear.app" },
    { label: "Stripe Docs", url: "https://docs.stripe.com" },
    { label: "Tailwind CSS", url: "https://tailwindcss.com" },
  ];

  function go(target: string) {
    router.push(`/evaluate?url=${encodeURIComponent(target)}`);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-website.com"
          className="flex-1 rounded-full border border-[#333] bg-[#111] px-5 py-3 font-mono text-sm text-[#eee] placeholder-[#555] outline-none transition-colors focus:border-ghost/40"
        />
        <button
          type="submit"
          disabled={!url.trim()}
          className="group flex items-center gap-2 rounded-full bg-ghost px-6 py-3 font-mono text-sm font-semibold text-[#0a0a0a] transition-all hover:brightness-110 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30"
        >
          Evaluate
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className="opacity-60 transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M3 7 L11 7 M8 4 L11 7 L8 10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        <span className="py-1 font-mono text-[11px] text-[#444]">Try:</span>
        {presets.map((p) => (
          <button
            key={p.url}
            type="button"
            onClick={() => go(p.url)}
            className="rounded-full border border-[#222] bg-[#111] px-3 py-1 font-mono text-[11px] text-[#777] transition-colors hover:border-ghost/25 hover:text-ghost"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
