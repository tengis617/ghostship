import type { Metadata } from "next";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getAppUrl(),
  title: "ghostship — Phantom users for every pull request",
  description:
    "Every Vercel preview is already an A/B test. It just has zero users. GhostShip sends phantom users to evaluate your preview before you ship.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ghostship",
    description: "Phantom users for every pull request.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-[#EAEAEA] antialiased">
        {children}
      </body>
    </html>
  );
}
