import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ghostship",
  description:
    "Phantom users for every pull request. Free, Pro, and Enterprise plans.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
