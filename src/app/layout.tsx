import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laurea Sofia · 12 Ottobre 2026",
  description: "Album fotografico live della laurea di Sofia — scatta e condividi i tuoi ricordi!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
