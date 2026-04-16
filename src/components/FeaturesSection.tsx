"use client";
import { ScrollReveal } from "./ScrollReveal";

const features = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="rgba(79,70,229,0.1)" />
        <path d="M14 12h20M14 18h20M14 24h14" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M32 28l4 4-4 4" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M36 32h-8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="10" y="8" width="28" height="32" rx="4" stroke="#4F46E5" strokeWidth="2"/>
      </svg>
    ),
    title: "Past Papers",
    desc: "Access hundreds of real EHL exam papers across all 27 courses. AI-tagged by topic so you always practise what matters.",
    color: "#4F46E5",
    badge: "500+ papers",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="rgba(124,58,237,0.1)" />
        <circle cx="24" cy="22" r="10" stroke="#7C3AED" strokeWidth="2"/>
        <path d="M21 22l2 2 4-4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 32v4M20 36h8" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 16l-2-2M36 16l2-2" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Practice Tests",
    desc: "AI-generated adaptive quizzes that get harder as you improve. Instant feedback with full explanations for every answer.",
    color: "#7C3AED",
    badge: "Adaptive AI",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="rgba(249,115,22,0.1)" />
        <path d="M10 36V24M18 36V18M26 36V22M34 36V14" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
        <path d="M10 24l8-6 8 4 8-8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="14" r="2.5" fill="#F97316"/>
      </svg>
    ),
    title: "Progress Tracking",
    desc: "Visual dashboards show exactly where you stand in each subject. See your improvement week over week in real time.",
    color: "#F97316",
    badge: "Live insights",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-28 px-4">
      {/* Label */}
      <ScrollReveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#4F46E5] mb-4">
          Everything you need
        </p>
      </ScrollReveal>

      {/* Heading */}
      <ScrollReveal delay={80}>
        <h2 className="font-display text-center text-4xl font-bold text-[#0F0E2A] sm:text-5xl" style={{ letterSpacing: "-0.02em" }}>
          Your complete{" "}
          <span className="text-gradient">study hub.</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={140}>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-[#6B7280] leading-relaxed">
          Everything an EHL student needs to walk into exam season feeling unstoppable.
        </p>
      </ScrollReveal>

      {/* Cards */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 120} type="up">
            <div
              className="card-shine group relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {/* Gradient top bar */}
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl transition-all duration-300 group-hover:h-1.5" style={{ background: `linear-gradient(90deg, ${f.color}, ${f.color}88)` }} />

              <div className="mb-5 flex items-start justify-between">
                {f.icon}
                <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${f.color}14`, color: f.color }}>
                  {f.badge}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-[#0F0E2A] mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">{f.desc}</p>

              {/* Arrow */}
              <div className="mt-5 flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2" style={{ color: f.color }}>
                Learn more
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
