"use client";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const hovered = useRef(false);
  const clicking = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onDown = () => { clicking.current = true; };
    const onUp = () => { clicking.current = false; };

    const setHover = (val: boolean) => () => { hovered.current = val; };

    function attachListeners() {
      document.querySelectorAll("a,button,[role='button'],summary,input,label,select").forEach((el) => {
        el.addEventListener("mouseenter", setHover(true));
        el.addEventListener("mouseleave", setHover(false));
      });
    }

    function tick() {
      const dot = dotRef.current;
      const r = ringRef.current;

      // Dot: instant
      if (dot) {
        dot.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px) scale(${clicking.current ? 0.5 : 1})`;
      }

      // Ring: lerped
      ring.current.x += (pos.current.x - ring.current.x) * 0.11;
      ring.current.y += (pos.current.y - ring.current.y) * 0.11;

      if (r) {
        const size = hovered.current ? 54 : clicking.current ? 28 : 40;
        const half = size / 2;
        r.style.width = `${size}px`;
        r.style.height = `${size}px`;
        r.style.transform = `translate(${ring.current.x - half}px,${ring.current.y - half}px)`;
        r.style.borderColor = hovered.current
          ? "rgba(34,197,94,0.9)"
          : "rgba(34,197,94,0.4)";
        r.style.backgroundColor = hovered.current ? "rgba(34,197,94,0.07)" : "transparent";
        r.style.mixBlendMode = hovered.current ? "normal" : "normal";
      }

      raf.current = requestAnimationFrame(tick);
    }

    tick();
    attachListeners();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const obs = new MutationObserver(attachListeners);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      obs.disconnect();
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 10px rgba(34,197,94,0.9), 0 0 20px rgba(34,197,94,0.4)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "transform 0.1s ease",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: "1.5px solid rgba(34,197,94,0.4)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform, width, height",
          transition:
            "width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background-color 0.2s ease",
        }}
      />
    </>
  );
}
