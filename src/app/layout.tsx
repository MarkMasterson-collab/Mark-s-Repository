import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ParticleField } from "@/components/ParticleField";
import { CustomCursor } from "@/components/CustomCursor";
import { AuroraBackground } from "@/components/AuroraBackground";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
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
    <html lang="en" className={`${firaSans.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-[#020617] text-white antialiased">
        {/* ── Full-page ambient layers (z 0–2) ── */}
        <AuroraBackground />
        <ParticleField />
        <div className="scanline" aria-hidden="true" />

        {/* ── Custom cursor (z 99998–99999) ── */}
        <CustomCursor />

        {/* ── App shell (z 10) ── */}
        <div className="relative" style={{ zIndex: 10 }}>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
