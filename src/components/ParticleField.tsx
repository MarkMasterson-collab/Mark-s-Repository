"use client";
import { useEffect, useRef } from "react";

interface Particle { x:number; y:number; vx:number; vy:number; size:number; baseOpacity:number; opacity:number; }

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const ptsRef    = useRef<Particle[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 80, CONNECT = 120, REPEL = 100;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => {
      ptsRef.current = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.2 + 0.3,
        baseOpacity: Math.random() * 0.18 + 0.06,
        opacity: Math.random() * 0.18 + 0.06,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = ptsRef.current;
      for (const p of pts) {
        const dx = p.x - mouseRef.current.x, dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < REPEL && dist > 0) {
          const f = ((REPEL - dist) / REPEL) * 0.7;
          p.vx += (dx/dist)*f; p.vy += (dy/dist)*f;
          p.opacity = Math.min(p.baseOpacity + f*0.35, 0.5);
        } else { p.opacity += (p.baseOpacity - p.opacity) * 0.04; }
        const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (spd > 2) { p.vx = (p.vx/spd)*2; p.vy = (p.vy/spd)*2; }
        p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = canvas.width+10; if (p.x > canvas.width+10) p.x = -10;
        if (p.y < -10) p.y = canvas.height+10; if (p.y > canvas.height+10) p.y = -10;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(79,70,229,${p.opacity})`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i+1; j < pts.length; j++) {
          const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < CONNECT) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(79,70,229,${(1-d/CONNECT)*0.07})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" style={{ zIndex:1 }} aria-hidden="true" />;
}
