import Link from "next/link";
import { AnimatedStats } from "@/components/AnimatedStats";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { SmashSection } from "@/components/SmashSection";
import { ScrollReveal } from "@/components/ScrollReveal";

const LINE1 = "Ace every";
const LINE2 = "exam.";
const BASE_MS = 200;
const CHAR_MS = 35;

const SUBJECTS = [
  "Financial Accounting","Micro-economics","Statistics","Revenue Management",
  "Managerial Accounting","Services Operations Management","International Marketing",
  "Corporate Sustainability","Legal Challenges","Talent Management",
  "Business Communication","Academic Writing","Computational Thinking",
];

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-10">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">

        {/* Dot grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(79,70,229,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at center, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at center, black 20%, transparent 100%)",
        }} />

        {/* ── Pill badge ── */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(79,70,229,0.2)] bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm" style={{ animationDelay: "50ms" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-semibold text-[#4F46E5]">AI-powered · Free for EHL students</span>
        </div>

        {/* ── Headline ── */}
        <h1 aria-label="Ace every exam." className="font-display font-bold" style={{ fontSize: "clamp(3.8rem, 13vw, 9rem)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>
          <span className="block">
            {LINE1.split("").map((ch, i) => (
              <span key={i} className={`char-animate ${ch === " " ? "inline-block w-[0.28em]" : ""}`}
                style={{ animationDelay: `${BASE_MS + i * CHAR_MS}ms`, color: "#0F0E2A" }}>
                {ch !== " " ? ch : null}
              </span>
            ))}
          </span>
          <span className="block">
            {LINE2.split("").map((ch, i) => (
              <span key={i} className="char-animate text-gradient"
                style={{ animationDelay: `${BASE_MS + (LINE1.length + i) * CHAR_MS + 60}ms` }}>
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="animate-fade-in-up mt-7 max-w-[30rem] text-lg font-light leading-relaxed text-[#6B7280]" style={{ animationDelay: "900ms" }}>
          The smartest way to prepare for your EHL exams — past papers, adaptive
          practice tests, and real-time progress tracking. All free.
        </p>

        {/* ── CTAs ── */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "1100ms" }}>
          <div className="relative">
            <div className="pulse-ring rounded-full" />
            <div className="pulse-ring pulse-ring-2 rounded-full" />
            <Link href="/subjects"
              className="glow-pulse relative z-10 block cursor-pointer rounded-full bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#EA6C0A] hover:scale-[1.04] active:scale-[0.97]"
              style={{ boxShadow: "0 4px 20px rgba(249,115,22,0.4)", letterSpacing: "0.02em" }}>
              Start Preparing — It&apos;s Free
            </Link>
          </div>
          <Link href="/login"
            className="cursor-pointer rounded-full border border-[rgba(79,70,229,0.2)] bg-white/70 px-8 py-3.5 text-sm font-semibold text-[#4F46E5] backdrop-blur-sm transition-all duration-200 hover:border-[rgba(79,70,229,0.4)] hover:bg-white hover:scale-[1.02]">
            Sign In
          </Link>
        </div>

        {/* ── Floating badges ── */}
        <div className="animate-fade-in-up pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" style={{ animationDelay: "1300ms" }}>
          <div className="badge-float-1 absolute left-[8%] top-[28%] hidden rounded-2xl bg-white px-3 py-2 shadow-lg sm:block" style={{ border: "1px solid rgba(79,70,229,0.1)" }}>
            <span className="text-xs font-semibold text-[#4F46E5]">📚 27 Courses</span>
          </div>
          <div className="badge-float-2 absolute right-[8%] top-[32%] hidden rounded-2xl bg-white px-3 py-2 shadow-lg sm:block" style={{ border: "1px solid rgba(124,58,237,0.1)" }}>
            <span className="text-xs font-semibold text-[#7C3AED]">🤖 AI Powered</span>
          </div>
          <div className="badge-float-3 absolute left-[6%] bottom-[28%] hidden rounded-2xl bg-white px-3 py-2 shadow-lg sm:block" style={{ border: "1px solid rgba(16,185,129,0.1)" }}>
            <span className="text-xs font-semibold text-[#10B981]">✅ Free forever</span>
          </div>
          <div className="badge-float-4 absolute right-[6%] bottom-[30%] hidden rounded-2xl bg-white px-3 py-2 shadow-lg sm:block" style={{ border: "1px solid rgba(249,115,22,0.1)" }}>
            <span className="text-xs font-semibold text-[#F97316]">⚡ 3 Semesters</span>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div className="animate-fade-in-up animate-float absolute bottom-10 flex flex-col items-center gap-1.5" style={{ animationDelay: "1600ms" }} aria-hidden="true">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[rgba(79,70,229,0.4)]">scroll</span>
          <svg className="h-4 w-4 text-[rgba(79,70,229,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════ MARQUEE ═══════════════════ */}
      <div className="overflow-hidden border-y border-[rgba(79,70,229,0.08)] bg-white/60 py-3 backdrop-blur-sm">
        <div className="marquee-track flex whitespace-nowrap">
          {[...SUBJECTS, ...SUBJECTS].map((s, i) => (
            <span key={i} className="mx-5 inline-flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(79,70,229,0.4)]">
              {s}<span className="text-[rgba(249,115,22,0.4)]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════ STATS ═════════════════════ */}
      <div className="mx-4 mt-8">
        <AnimatedStats />
      </div>

      {/* ════════════════ CALCULATOR BANNER ═══════════════ */}
      <div className="mx-4 mt-4">
        <Link href="/grade-calculator"
          className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[rgba(79,70,229,0.12)] bg-white/60 px-5 py-4 shadow-sm transition-all duration-200 hover:border-[rgba(79,70,229,0.25)] hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(79,70,229,0.08)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[#4F46E5]" stroke="currentColor" strokeWidth={2}>
                <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round"/>
                <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F0E2A]">Grade Calculator</p>
              <p className="text-xs text-[#6B7280]">BOSC 1, 2, 3 & 5 — real-time module &amp; semester grades</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-[#4F46E5]">Try it →</span>
        </Link>
      </div>

      {/* ══════════════ FEATURES SECTION ══════════════════ */}
      <FeaturesSection />

      {/* ════════════ HOW IT WORKS SECTION ═══════════════ */}
      <div className="bg-white/40 py-2">
        <HowItWorksSection />
      </div>

      {/* ══════════════ SMASH SECTION ═════════════════════ */}
      <SmashSection />

      {/* ════════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-32 px-4 text-center">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316] mb-4">Ready?</p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h2 className="font-display text-5xl font-bold text-[#0F0E2A] sm:text-6xl" style={{ letterSpacing: "-0.03em" }}>
            Your next exam<br />
            <span className="text-gradient">starts here.</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="mx-auto mt-5 max-w-md text-base text-[#6B7280] leading-relaxed">
            Join EHL students who are already scoring higher, stressing less, and walking into exams with confidence.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={260}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/subjects"
              className="cursor-pointer rounded-full bg-[#4F46E5] px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#4338CA] hover:scale-[1.03] active:scale-[0.97]"
              style={{ boxShadow: "0 4px 24px rgba(79,70,229,0.4)" }}>
              Browse All Courses
            </Link>
            <Link href="/login"
              className="cursor-pointer rounded-full border border-[rgba(79,70,229,0.2)] px-10 py-4 text-base font-semibold text-[#4F46E5] transition-all duration-200 hover:border-[rgba(79,70,229,0.4)] hover:bg-[rgba(79,70,229,0.04)]">
              Create an account
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
