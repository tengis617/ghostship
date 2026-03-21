import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ghostship",
  description: "Phantom users for every pull request. Free, Pro, and Enterprise plans.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with phantom evaluations on your previews.",
    cta: "Get Started",
    highlighted: false,
    features: [
      "10 phantom evaluations/month",
      "3 personas per evaluation",
      "Slack integration",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "Unlimited evaluations with the full persona panel.",
    cta: "Start Free Trial",
    highlighted: true,
    features: [
      "Unlimited evaluations",
      "All 5 personas",
      "Custom persona creation",
      "Slack + GitHub integration",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams that ship dozens of experiments per week.",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Custom persona panels (20+)",
      "SSO & SAML",
      "SLA & dedicated support",
      "API access",
    ],
  },
];

export default function PricingPage() {
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
      <header className="px-6 pb-16 pt-8 text-center md:pt-14">
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
      </header>

      {/* Pricing Cards */}
      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-24 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-lg border p-6 md:p-8 ${
              tier.highlighted
                ? "border-ghost/30 bg-ghost/[0.03]"
                : "border-[#1e1e1e] bg-[#111]"
            }`}
          >
            {/* Badge */}
            {tier.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-ghost px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Most Popular
              </span>
            )}

            {/* Tier name */}
            <h2 className="mb-1 font-mono text-xs uppercase tracking-[0.15em] text-[#888]">
              {tier.name}
            </h2>

            {/* Price */}
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-white">
                {tier.price}
              </span>
              {tier.period && (
                <span className="font-mono text-sm text-[#555]">
                  {tier.period}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mb-6 text-sm text-[#777]">{tier.description}</p>

            {/* Features */}
            <ul className="mb-8 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      tier.highlighted ? "text-ghost" : "text-[#555]"
                    }`}
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
                  <span className="text-[#bbb]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className={`w-full rounded py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                tier.highlighted
                  ? "bg-ghost text-[#0A0A0A] hover:bg-ghost/90"
                  : "border border-[#2a2a2a] bg-[#161616] text-[#ccc] hover:border-[#444] hover:text-white"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
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
