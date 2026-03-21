"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const features = [
  {
    name: "Phantom evaluations",
    free: "10/month",
    pro: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    name: "Personas per evaluation",
    free: "3",
    pro: "All 5",
    enterprise: "20+",
  },
  {
    name: "Custom persona creation",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Slack integration",
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "GitHub integration",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "SSO & SAML",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "API access",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "SLA & dedicated support",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Support",
    free: "Community",
    pro: "Priority",
    enterprise: "Dedicated",
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4 text-ghost"}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4 text-[#333]"}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckIcon />;
  if (value === false) return <XIcon />;
  return (
    <span className="text-sm text-[#ccc]">{value}</span>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const freePrice = "$0";
  const proPrice = annual ? "$39" : "$49";
  const enterprisePrice = "Custom";

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#EAEAEA]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="text-lg font-bold tracking-tighter text-white transition-colors hover:text-ghost"
        >
          ghostship
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#555]">
          pricing
        </span>
      </nav>

      {/* Header */}
      <header className="px-6 pb-10 pt-8 text-center md:pt-14">
        <div className="relative mx-auto mb-6 w-fit">
          <div
            className="absolute inset-0 scale-125 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(212,245,245,0.08), transparent 70%)",
            }}
          />
          <Image
            src="/images/ghost-ship-front.jpg"
            alt="Ghost pirate captain at the helm"
            width={180}
            height={180}
            priority
            className="relative z-10 mix-blend-lighten"
            style={{
              maskImage:
                "radial-gradient(ellipse 80% 80% at center, black 50%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at center, black 50%, transparent 100%)",
            }}
          />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Ship faster, validate sooner.
        </h1>
        <p className="mx-auto max-w-md text-sm text-[#888]">
          Every plan includes phantom users that evaluate your Vercel previews
          before real users see them.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium transition-colors ${
              !annual ? "text-white" : "text-[#555]"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              annual ? "bg-ghost" : "bg-[#333]"
            }`}
            aria-label="Toggle annual pricing"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[#0A0A0A] transition-transform ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              annual ? "text-white" : "text-[#555]"
            }`}
          >
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-ghost/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ghost">
              Save 20%
            </span>
          )}
        </div>
      </header>

      {/* Comparison Table */}
      <section className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
        <div className="overflow-x-auto rounded-lg border border-[#1e1e1e]">
          <table className="w-full min-w-[600px] border-collapse">
            {/* Table Header — Tier names + prices */}
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="w-[40%] p-4 text-left">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#555]">
                    Compare plans
                  </span>
                </th>
                <th className="w-[20%] p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#888]">
                      Free
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold text-white">
                        {freePrice}
                      </span>
                      <span className="font-mono text-xs text-[#555]">/mo</span>
                    </div>
                  </div>
                </th>
                <th className="w-[20%] border-x border-ghost/20 bg-ghost/[0.03] p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-ghost">
                        Pro
                      </span>
                      <span className="rounded-full bg-ghost px-2 py-px font-mono text-[9px] font-semibold uppercase tracking-wider text-[#0A0A0A]">
                        Popular
                      </span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold text-white">
                        {proPrice}
                      </span>
                      <span className="font-mono text-xs text-[#555]">/mo</span>
                    </div>
                    {annual && (
                      <span className="text-[11px] text-[#555] line-through">
                        $49/mo
                      </span>
                    )}
                  </div>
                </th>
                <th className="w-[20%] p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#888]">
                      Enterprise
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {enterprisePrice}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Feature Rows */}
            <tbody>
              {features.map((feature, idx) => (
                <tr
                  key={feature.name}
                  className={`border-b border-[#1e1e1e] transition-colors hover:bg-[#111] ${
                    idx % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#0e0e0e]"
                  }`}
                >
                  <td className="p-4 text-sm text-[#aaa]">{feature.name}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <CellValue value={feature.free} />
                    </div>
                  </td>
                  <td className="border-x border-ghost/10 bg-ghost/[0.01] p-4 text-center">
                    <div className="flex items-center justify-center">
                      <CellValue value={feature.pro} />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <CellValue value={feature.enterprise} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* CTA Row */}
            <tfoot>
              <tr className="bg-[#0A0A0A]">
                <td className="p-4" />
                <td className="p-4 text-center">
                  <button className="w-full rounded py-2 font-mono text-[11px] font-semibold uppercase tracking-wider border border-[#2a2a2a] bg-[#161616] text-[#ccc] transition-colors hover:border-[#444] hover:text-white">
                    Get Started
                  </button>
                </td>
                <td className="border-x border-ghost/10 bg-ghost/[0.02] p-4 text-center">
                  <button className="w-full rounded py-2 font-mono text-[11px] font-semibold uppercase tracking-wider bg-ghost text-[#0A0A0A] transition-colors hover:bg-ghost/90">
                    Start Free Trial
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button className="w-full rounded py-2 font-mono text-[11px] font-semibold uppercase tracking-wider border border-[#2a2a2a] bg-[#161616] text-[#ccc] transition-colors hover:border-[#444] hover:text-white">
                    Contact Sales
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Tier descriptions below table */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <p className="text-center text-xs text-[#555]">
            Get started with phantom evaluations on your previews.
          </p>
          <p className="text-center text-xs text-[#555]">
            Unlimited evaluations with the full persona panel.
          </p>
          <p className="text-center text-xs text-[#555]">
            For teams that ship dozens of experiments per week.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#2a2a2a]">
          ghostship v0.1 — phantom users for every pull request
        </p>
      </footer>
    </div>
  );
}
