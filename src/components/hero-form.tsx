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

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://your-website.com"
        className="flex-1 rounded-full border border-[#1e1e1e] bg-[#111] px-5 py-2.5 font-mono text-sm text-[#eee] placeholder-[#444] outline-none transition-colors focus:border-ghost/30"
      />
      <button
        type="submit"
        disabled={!url.trim()}
        className="group flex items-center gap-2 rounded-full border border-ghost/20 bg-ghost/10 px-5 py-2.5 font-mono text-sm text-ghost transition-all hover:bg-ghost/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
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
  );
}
