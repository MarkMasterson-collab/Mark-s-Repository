"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "27",   label: "Courses",   numeric: true,  color: "#4F46E5" },
  { value: "3",    label: "Semesters", numeric: true,  color: "#7C3AED" },
  { value: "AI",   label: "Powered",   numeric: false, color: "#F97316" },
  { value: "Free", label: "To Use",    numeric: false, color: "#10B981" },
];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useCountUp(target: number, duration: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now(); let id: number;
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active, target, duration]);
  return n;
}

function useScramble(value: string, active: boolean) {
  const [display, setDisplay] = useState("—");
  useEffect(() => {
    if (!active) return;
    let iter = 0;
    const id = setInterval(() => {
      setDisplay(value.split("").map((ch, i) => i < iter ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]).join(""));
      iter += 0.5; if (iter > value.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [active, value]);
  return display;
}

function Stat({ stat, active, index }: { stat: typeof STATS[0]; active: boolean; index: number }) {
  const count    = useCountUp(stat.numeric ? parseInt(stat.value) : 0, 1800, active && stat.numeric);
  const scramble = useScramble(stat.value, active && !stat.numeric);

  return (
    <div className="group flex cursor-default flex-col items-center py-10 text-center transition-all duration-300 hover:bg-white/60 hover:rounded-2xl"
      style={{ animationDelay: `${index * 100}ms` }}>
      <span className="font-display text-4xl font-bold sm:text-5xl transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`, WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        {stat.numeric ? count : scramble}
      </span>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9CA3AF]">{stat.label}</span>
    </div>
  );
}

export function AnimatedStats() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-4 rounded-2xl bg-white/50 shadow-sm" style={{ border: "1px solid rgba(79,70,229,0.08)" }}>
      {STATS.map((s, i) => (
        <div key={s.label} style={{ borderRight: i < STATS.length - 1 ? "1px solid rgba(79,70,229,0.08)" : "none" }}>
          <Stat stat={s} active={active} index={i} />
        </div>
      ))}
    </div>
  );
}
