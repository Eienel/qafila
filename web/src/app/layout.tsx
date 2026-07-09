import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qafila",
  description: "The letter of credit, without the bank.",
};

// Root layout is required by Next.js; the real <html> lives in [locale]/layout.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
