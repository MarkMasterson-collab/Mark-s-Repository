import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ParticleField } from "@/components/ParticleField";
import { CustomCursor } from "@/components/CustomCursor";
import { AuroraBackground } from "@/components/AuroraBackground";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EHL Exam Prep",
  description: "AI-powered exam prep for EHL students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#07070E] text-[#EDE8D8] antialiased">
        {/* ── Ambient layers ── */}
        <AuroraBackground />
        <ParticleField />
        <div className="scanline" aria-hidden="true" />

        {/* ── Custom cursor ── */}
        <CustomCursor />

        {/* ── App shell ── */}
        <div className="relative" style={{ zIndex: 10 }}>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
