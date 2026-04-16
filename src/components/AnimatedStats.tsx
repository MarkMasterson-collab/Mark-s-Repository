"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "27",   label: "Courses",   numeric: true  },
  { value: "3",    label: "Semesters", numeric: true  },
  { value: "AI",   label: "Powered",   numeric: false },
  { value: "Free", label: "To Use",    numeric: false },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useCountUp(target: number, duration: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    let id: number;
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
      setDisplay(value.split("").map((ch, i) =>
        i < iter ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(""));
      iter += 0.5;
      if (iter > value.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [active, value]);
  return display;
}

function Stat({ stat, active, index }: { stat: typeof STATS[0]; active: boolean; index: number }) {
  const count    = useCountUp(stat.numeric ? parseInt(stat.value) : 0, 2000, active && stat.numeric);
  const scramble = useScramble(stat.value, active && !stat.numeric);

  return (
    <div
      className="group flex cursor-default flex-col items-center py-9 text-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span
        className="font-display text-4xl font-light italic transition-all duration-300 sm:text-5xl"
        style={{
          background: active
            ? "linear-gradient(135deg, #C9A84C 0%, #FFD870 50%, #C9A84C 100%)"
            : "transparent",
          WebkitBackgroundClip: active ? "text" : undefined,
          backgroundClip: active ? "text" : undefined,
          WebkitTextFillColor: active ? "transparent" : "#EDE8D8",
          color: active ? undefined : "transparent",
          transition: "all 0.5s ease",
          textShadow: "none",
        }}
      >
        {stat.numeric ? count : scramble}
      </span>
      <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[rgba(237,232,216,0.35)]">
        {stat.label}
      </span>
    </div>
  );
}

export function AnimatedStats() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-4" style={{ borderTop: "1px solid rgba(201,168,76,0.12)" }}>
      {STATS.map((s, i) => (
        <div key={s.label} style={{ borderRight: i < STATS.length - 1 ? "1px solid rgba(201,168,76,0.12)" : "none" }}>
          <Stat stat={s} active={active} index={i} />
        </div>
      ))}
    </div>
  );
}
