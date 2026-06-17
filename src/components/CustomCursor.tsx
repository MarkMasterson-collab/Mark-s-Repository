"use client";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const hovered = useRef(false);
  const clicking = useRef(false);
  const raf     = useRef<number>(0);

  useEffect(() => {
    document.body.style.cursor = "none";
    const onMove  = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onDown  = () => { clicking.current = true; };
    const onUp    = () => { clicking.current = false; };
    const setHov  = (v: boolean) => () => { hovered.current = v; };

    function attachListeners() {
      document.querySelectorAll("a,button,[role='button'],summary,input,label,select").forEach((el) => {
        el.addEventListener("mouseenter", setHov(true));
        el.addEventListener("mouseleave", setHov(false));
      });
    }

    function tick() {
      const dot = dotRef.current;
      const r   = ringRef.current;
      if (dot) dot.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px) scale(${clicking.current ? 0.4 : 1})`;
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (r) {
        const size = hovered.current ? 52 : clicking.current ? 24 : 38;
        const half = size / 2;
        r.style.width  = `${size}px`;
        r.style.height = `${size}px`;
        r.style.transform = `translate(${ring.current.x - half}px,${ring.current.y - half}px)`;
        r.style.borderColor = hovered.current ? "rgba(79,70,229,0.9)" : "rgba(79,70,229,0.4)";
        r.style.backgroundColor = hovered.current ? "rgba(79,70,229,0.07)" : "transparent";
      }
      raf.current = requestAnimationFrame(tick);
    }

    tick(); attachListeners();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    const obs = new MutationObserver(attachListeners);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      obs.disconnect();
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{ position:"fixed", top:0, left:0, width:8, height:8, borderRadius:"50%", background:"#4F46E5", boxShadow:"0 0 10px rgba(79,70,229,0.9), 0 0 24px rgba(79,70,229,0.4)", pointerEvents:"none", zIndex:99999, willChange:"transform", transition:"transform 0.08s ease" }} />
      <div ref={ringRef} aria-hidden="true" style={{ position:"fixed", top:0, left:0, width:38, height:38, border:"1.5px solid rgba(79,70,229,0.4)", borderRadius:"50%", pointerEvents:"none", zIndex:99998, willChange:"transform", transition:"width 0.22s cubic-bezier(0.34,1.56,0.64,1), height 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background-color 0.2s ease" }} />
    </>
  );
}
