import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayfarer AI — Intelligent Travel Planning & AI Itineraries",
  description: "Turn your travel dreams into thoughtfully planned, personalized journeys with your personal AI travel companion.",
  keywords: ["AI travel planner", "itinerary generator", "travel planning", "vacation planner", "smart travel"],
  openGraph: {
    title: "Wayfarer AI — Intelligent Travel Planning",
    description: "Personalized itineraries, smart budgets, and interactive travel maps powered by AI.",
    siteName: "Wayfarer AI",
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧭</text></svg>"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F7F3] text-[#101827]">
        {children}
      </body>
    </html>
  );
}
