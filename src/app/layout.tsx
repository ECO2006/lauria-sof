import type { Metadata } from "next";
import { Caprasimo } from "next/font/google"; // 1. Importa il font da Google Fonts
import "./globals.css";

// 2. Configura Caprasimo
const caprasimo = Caprasimo({
  weight: "400",               // Caprasimo è disponibile solo in peso Regular (già molto Bold)
  subsets: ["latin"],          // Carica solo i caratteri necessari
  variable: "--font-cooper",   // Mantieni la stessa variabile CSS per comodità
});

export const metadata: Metadata = {
  title: "Laurea Sofia · 12 Ottobre 2026",
  description: "Album fotografico live della laurea di Sofia — scatta e condividi i tuoi ricordi!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 3. Applica la variabile nel tag <html>
    <html lang="it" className={`h-full antialiased ${caprasimo.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
