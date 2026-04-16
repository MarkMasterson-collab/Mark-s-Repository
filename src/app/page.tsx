import Link from "next/link";
import { AnimatedStats } from "@/components/AnimatedStats";

const LINE1 = "Prepare";
const LINE2 = "Smarter.";
const BASE_MS = 300;
const CHAR_MS = 38;

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-10 flex min-h-screen flex-col">
      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Dot-grid overlay (CSS only, no JS) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(ellipse 75% 70% at center, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 70% at center, black 30%, transparent 100%)",
          }}
        />

        {/* ── EHL label ── */}
        <p
          className="animate-fade-in-up mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30"
          style={{ animationDelay: "80ms" }}
        >
          École hôtelière de Lausanne
        </p>

        {/* ── Headline with per-character blur-reveal ── */}
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: "clamp(3.4rem, 11vw, 8rem)", lineHeight: 0.9 }}
          aria-label="Prepare Smarter."
        >
          {/* "Prepare" */}
          <span className="block">
            {LINE1.split("").map((ch, i) => (
              <span
                key={i}
                className="char-animate text-white"
                style={{ animationDelay: `${BASE_MS + i * CHAR_MS}ms` }}
              >
                {ch}
              </span>
            ))}
          </span>

          {/* "Smarter." — period glows green */}
          <span className="block mt-1">
            {LINE2.split("").map((ch, i) => (
              <span
                key={i}
                className={`char-animate ${ch === "." ? "text-[#22c55e]" : "text-white"}`}
                style={{
                  animationDelay: `${BASE_MS + (LINE1.length + i) * CHAR_MS + 60}ms`,
                  textShadow: ch === "." ? "0 0 30px rgba(34,197,94,0.7)" : undefined,
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* ── Subtitle ── */}
        <p
          className="animate-fade-in-up mt-8 max-w-[26rem] text-base leading-relaxed text-white/45"
          style={{ animationDelay: "950ms" }}
        >
          AI-powered exam prep built for EHL students — past papers,
          practice tests, and progress tracking.
        </p>

        {/* ── CTAs ── */}
        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "1150ms" }}
        >
          {/* Primary — green with pulse rings */}
          <div className="relative">
            <div className="pulse-ring rounded-lg" />
            <div className="pulse-ring pulse-ring-2 rounded-lg" />
            <Link
              href="/subjects"
              className="accent-glow glow-pulse relative z-10 block cursor-pointer rounded-lg bg-[#22c55e] px-7 py-3.5 text-sm font-semibold text-[#020617] transition-all duration-200 hover:bg-[#16a34a] hover:scale-[1.04] active:scale-[0.97]"
            >
              Browse Courses
            </Link>
          </div>

          {/* Ghost */}
          <Link
            href="/login"
            className="cursor-pointer rounded-lg border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05] hover:text-white"
          >
            Sign In
          </Link>
        </div>

        {/* ── Scroll hint ── */}
        <div
          className="animate-fade-in-up animate-float absolute bottom-10 flex flex-col items-center gap-1.5"
          style={{ animationDelay: "1600ms" }}
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">scroll</span>
          <svg
            className="h-4 w-4 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── STATS ROW (animated counters) ─────────────────── */}
      <AnimatedStats />
    </div>
  );
}
