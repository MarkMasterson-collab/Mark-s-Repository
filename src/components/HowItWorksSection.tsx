"use client";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Pick Your Course",
    desc: "Browse all 27 EHL courses across 3 semesters. Find exactly what you're being tested on next.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M6 8h20M6 13h20M6 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M25 22h-3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#4F46E5",
  },
  {
    number: "02",
    title: "Take a Practice Test",
    desc: "AI builds you a custom quiz. Every question gets instant feedback with a clear explanation.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#7C3AED",
  },
  {
    number: "03",
    title: "Watch Your Score Soar",
    desc: "Your dashboard tracks every attempt. See patterns, fill gaps, and crush your actual exam.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M4 26V18M10 26V12M16 26V16M22 26V8M28 26V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M4 18l6-6 6 4 6-8 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0"/>
      </svg>
    ),
    color: "#F97316",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED] mb-4">Simple as 1-2-3</p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h2 className="font-display text-center text-4xl font-bold text-[#0F0E2A] sm:text-5xl mb-4" style={{ letterSpacing: "-0.02em" }}>
            How it <span className="text-gradient">works.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 150} type="up">
              <div className="group relative flex flex-col items-center text-center">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+3rem)] top-10 hidden h-px w-[calc(100%+2rem)] sm:block" style={{ background: "linear-gradient(90deg, rgba(79,70,229,0.3), rgba(124,58,237,0.1))" }} />
                )}

                {/* Step circle */}
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg" style={{ background: `${step.color}12`, border: `2px solid ${step.color}30` }}>
                  <div style={{ color: step.color }}>{step.icon}</div>
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: step.color }}>
                    {i + 1}
                  </span>
                </div>

                {/* Large number watermark */}
                <span className="font-display absolute -top-2 left-1/2 -translate-x-1/2 text-7xl font-bold opacity-[0.04] select-none" style={{ color: step.color }}>
                  {step.number}
                </span>

                <h3 className="font-display text-xl font-bold text-[#0F0E2A] mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
