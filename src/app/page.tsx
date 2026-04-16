import Link from "next/link";
import { AnimatedStats } from "@/components/AnimatedStats";

const SUBJECTS = [
  "Financial Accounting", "Micro-economics", "Statistics", "Revenue Management",
  "Managerial Accounting", "Services Operations Management", "International Services Marketing",
  "Corporate Sustainability", "Legal Challenges", "Talent Management Systems",
  "Business Communication", "Academic Writing", "Computational Thinking",
  "Hospitality Economics", "Rooms Division Management",
];

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-10 flex min-h-screen flex-col">

      {/* ── HERO ───────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Fine dot grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(201,168,76,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 65% at center, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at center, black 20%, transparent 100%)",
        }} />

        {/* ── Decorative rule + label ── */}
        <div className="animate-fade-in-up mb-10 flex items-center gap-5" style={{ animationDelay: "100ms" }}>
          <div className="rule-expand h-px w-16 bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.5)]" style={{ animationDelay: "200ms" }} />
          <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[rgba(237,232,216,0.35)]">
            École hôtelière de Lausanne
          </p>
          <div className="rule-expand h-px w-16 bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.5)]" style={{ animationDelay: "200ms" }} />
        </div>

        {/* ── Headline — luxury word-rise ── */}
        <h1 aria-label="Prepare Smarter." className="font-display font-light" style={{ fontSize: "clamp(5rem, 16vw, 12rem)", lineHeight: 0.88, letterSpacing: "-0.02em" }}>
          {/* "PREPARE" */}
          <span className="word-rise-wrap">
            <span className="word-rise text-gold" style={{ animationDelay: "350ms" }}>
              Prepare
            </span>
          </span>
          {/* "SMARTER." */}
          <span className="word-rise-wrap mt-1 block">
            <span className="word-rise" style={{ animationDelay: "520ms", color: "#EDE8D8" }}>
              Smarter
              <span style={{ color: "#C9A84C", textShadow: "0 0 40px rgba(201,168,76,0.6)" }}>.</span>
            </span>
          </span>
        </h1>

        {/* ── Thin rule below headline ── */}
        <div className="animate-fade-in-up mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.4)] to-transparent" style={{ animationDelay: "750ms" }} />

        {/* ── Subtitle ── */}
        <p className="animate-fade-in-up mt-7 max-w-[28rem] text-base font-light leading-relaxed" style={{ color: "rgba(237,232,216,0.5)", animationDelay: "850ms" }}>
          AI-powered exam prep built for EHL students — past papers,
          practice tests, and intelligent progress tracking.
        </p>

        {/* ── CTAs ── */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "1050ms" }}>
          {/* Primary gold button */}
          <div className="relative">
            <div className="pulse-ring rounded-full" />
            <div className="pulse-ring pulse-ring-2 rounded-full" />
            <Link
              href="/subjects"
              className="gold-glow-pulse relative z-10 block cursor-pointer rounded-full px-8 py-3.5 text-sm font-medium tracking-wide text-[#07070E] transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #FFD870, #C9A84C)",
                backgroundSize: "200% auto",
                letterSpacing: "0.08em",
              }}
            >
              Browse Courses
            </Link>
          </div>

          {/* Ghost button */}
          <Link
            href="/login"
            className="cursor-pointer rounded-full border px-8 py-3.5 text-sm font-light tracking-wide transition-all duration-300 hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.06)] hover:text-[#EDE8D8]"
            style={{ borderColor: "rgba(237,232,216,0.15)", color: "rgba(237,232,216,0.6)", letterSpacing: "0.08em" }}
          >
            Sign In
          </Link>
        </div>

        {/* ── Scroll hint ── */}
        <div className="animate-fade-in-up animate-float absolute bottom-10 flex flex-col items-center gap-2" style={{ animationDelay: "1500ms" }} aria-hidden="true">
          <span className="text-[9px] font-medium uppercase tracking-[0.3em]" style={{ color: "rgba(201,168,76,0.3)" }}>scroll</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "rgba(201,168,76,0.3)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── SUBJECT MARQUEE ────────────────────────────── */}
      <div className="animate-fade-in-up overflow-hidden border-y py-3" style={{ borderColor: "rgba(201,168,76,0.1)", animationDelay: "1200ms" }}>
        <div className="marquee-track flex whitespace-nowrap">
          {[...SUBJECTS, ...SUBJECTS].map((s, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.35)" }}>
              {s}
              <span style={{ color: "rgba(201,168,76,0.2)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────── */}
      <AnimatedStats />
    </div>
  );
}
