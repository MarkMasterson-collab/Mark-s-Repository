"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "27", label: "Courses",   numeric: true  },
  { value: "3",  label: "Semesters", numeric: true  },
  { value: "AI", label: "Powered",   numeric: false },
  { value: "Free",label: "To Use",   numeric: false },
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
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(eased * target));
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
      setDisplay(
        value
          .split("")
          .map((ch, i) =>
            i < iter ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      iter += 0.6;
      if (iter > value.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [active, value]);
  return display;
}

function Stat({
  stat,
  active,
  index,
}: {
  stat: (typeof STATS)[0];
  active: boolean;
  index: number;
}) {
  const count = useCountUp(stat.numeric ? parseInt(stat.value) : 0, 1800, active && stat.numeric);
  const scramble = useScramble(stat.value, active && !stat.numeric);

  return (
    <div
      className="group flex cursor-default flex-col items-center py-8 text-center transition-all duration-300 hover:bg-white/[0.02]"
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      <span
        className="font-mono text-2xl font-bold transition-all duration-300 group-hover:text-[#22c55e] sm:text-3xl"
        style={{
          color: active ? "#f8fafc" : "transparent",
          transition: "color 0.4s ease",
          textShadow: active ? "0 0 20px rgba(34,197,94,0.2)" : "none",
        }}
      >
        {stat.numeric ? count : scramble}
      </span>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
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
    <div
      ref={ref}
      className="grid grid-cols-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          style={{
            borderRight:
              i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}
        >
          <Stat stat={s} active={active} index={i} />
        </div>
      ))}
    </div>
  );
}
