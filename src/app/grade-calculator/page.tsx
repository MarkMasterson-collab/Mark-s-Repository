import { GradeCalculator } from "@/components/GradeCalculator";

export const metadata = {
  title: "Grade Calculator | EHL Exam Prep",
  description: "Calculate your EHL semester grades for BOSC 1, 2, 3, and 5 — real-time, per-module breakdown.",
};

export default function GradeCalculatorPage() {
  return (
    <div className="-mx-4 -mt-10 min-h-screen px-4 pt-20 pb-20">
      {/* Dot grid background (matches hero) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" style={{
        backgroundImage: "radial-gradient(circle, rgba(79,70,229,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 70% at center, black 20%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at center, black 20%, transparent 100%)",
      }} />

      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Tools
          </p>
          <h1 className="font-display text-4xl font-bold text-[#0F0E2A] sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}>
            Grade{" "}
            <span className="text-gradient">Calculator</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#6B7280]">
            Enter your midterm and final grades to instantly see your course, module,
            and semester averages — for every EHL semester.
          </p>
        </div>

        <GradeCalculator />
      </div>
    </div>
  );
}
