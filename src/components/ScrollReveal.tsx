"use client";
import { useEffect, useRef, ReactNode } from "react";

type RevealType = "up" | "left" | "right" | "scale";

const CLASS_MAP: Record<RevealType, string> = {
  up:    "scroll-reveal",
  left:  "scroll-reveal-left",
  right: "scroll-reveal-right",
  scale: "scroll-reveal-scale",
};

export function ScrollReveal({
  children,
  delay = 0,
  type = "up",
  className = "",
  threshold = 0.15,
}: {
  children: ReactNode;
  delay?: number;
  type?: RevealType;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${CLASS_MAP[type]} ${className}`}>
      {children}
    </div>
  );
}
