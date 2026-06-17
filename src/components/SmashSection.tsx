"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

/* ─── Confetti canvas ──────────────────────────────────── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const COLORS = ["#4F46E5","#7C3AED","#F97316","#10B981","#F59E0B","#EC4899","#3B82F6","#FBBF24"];
    const particles = Array.from({ length: 160 }, () => ({
      x:  Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 7,
      opacity: Math.random() * 0.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.rotation += p.spin;
        p.vy += 0.04;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; p.vy = Math.random() * 3 + 1.5; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ─── Animated score counter ───────────────────────────── */
function ScoreCounter({ active }: { active: boolean }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const duration = 2200;
    let id: number;
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(eased * 94));
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active]);

  return (
    <div className="font-display text-center">
      <div className="text-[7rem] font-bold leading-none tabular-nums text-white sm:text-[10rem]" style={{ textShadow: "0 0 60px rgba(255,255,255,0.3)" }}>
        {score}<span className="text-[4rem] sm:text-[6rem]" style={{ color: "#FBBF24" }}>%</span>
      </div>
      <p className="mt-2 text-lg font-medium text-white/60">average score after 5 practice tests</p>
    </div>
  );
}

/* ─── Progress bar ─────────────────────────────────────── */
function ProgressBar({ label, value, active, color, delay }: { label: string; value: number; active: boolean; color: string; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const duration = 1600;
      let id: number;
      const step = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        setWidth((1 - Math.pow(1 - p, 3)) * value);
        if (p < 1) id = requestAnimationFrame(step);
      };
      id = requestAnimationFrame(step);
      return () => cancelAnimationFrame(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, value, delay]);

  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium text-white/80">
        <span>{label}</span>
        <span style={{ color }}>{Math.round(width)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-none" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

/* ─── Main SmashSection ────────────────────────────────── */
export function SmashSection() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden rounded-3xl mx-4 my-12 py-24 px-6 sm:py-32"
      style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 40%, #1E1B4B 100%)" }}>

      {/* Confetti */}
      <ConfettiCanvas active={active} />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: "#4F46E5" }} />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: "#7C3AED" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Label */}
        <ScrollReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] mb-6" style={{ color: "#FBBF24" }}>
            ⚡ Time to smash it
          </p>
        </ScrollReveal>

        {/* Score */}
        <ScrollReveal delay={100}>
          <ScoreCounter active={active} />
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={200}>
          <h2 className="font-display mt-10 text-center text-4xl font-bold text-white sm:text-5xl" style={{ letterSpacing: "-0.02em" }}>
            Students who prep here{" "}
            <span style={{ background: "linear-gradient(135deg,#FBBF24,#F97316)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ace their exams.
            </span>
          </h2>
        </ScrollReveal>

        {/* Progress bars */}
        <ScrollReveal delay={350}>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="space-y-5">
              <ProgressBar label="Financial Accounting" value={91} active={active} color="#FBBF24" delay={400} />
              <ProgressBar label="Statistics" value={88} active={active} color="#F97316" delay={550} />
              <ProgressBar label="Revenue Management" value={94} active={active} color="#34D399" delay={700} />
            </div>
            <div className="space-y-5">
              <ProgressBar label="Micro-economics" value={86} active={active} color="#818CF8" delay={450} />
              <ProgressBar label="Services Operations" value={92} active={active} color="#F472B6" delay={600} />
              <ProgressBar label="Marketing" value={89} active={active} color="#60A5FA" delay={750} />
            </div>
          </div>
        </ScrollReveal>

        {/* Lightning badges */}
        <ScrollReveal delay={500}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["🏆 Top scorer", "⚡ 2x faster prep", "📈 +23% average", "🎯 Targeted practice"].map((b) => (
              <span key={b} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
                {b}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
