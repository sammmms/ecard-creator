"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

const COLORS = [
  "#FF4444", "#FF6B35", "#FFD700", "#FF1744",
  "#FF9100", "#FFEA00", "#FF5252", "#FF8A80",
  "#FFE0B2", "#FFFFFF", "#FF6E40", "#FFD740",
];

export default function Fireworks({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rockets = useRef<Rocket[]>([]);
  const animRef = useRef<number>(0);

  const spawnRocket = useCallback((width: number, height: number) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    rockets.current.push({
      x: Math.random() * width * 0.6 + width * 0.2,
      y: height,
      vy: -(Math.random() * 4 + 6),
      targetY: Math.random() * height * 0.3 + height * 0.1,
      color,
      exploded: false,
    });
  }, []);

  const explode = useCallback((x: number, y: number, color: string) => {
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 5 + 2;
      const life = Math.random() * 40 + 30;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: Math.random() > 0.3 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2.5 + 1,
        gravity: 0.04 + Math.random() * 0.02,
        trail: [],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastSpawn = 0;
    const spawnInterval = 1200;

    const animate = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Spawn rockets periodically
      if (time - lastSpawn > spawnInterval) {
        spawnRocket(w, h);
        if (Math.random() > 0.5) spawnRocket(w, h);
        lastSpawn = time;
      }

      // Update rockets
      for (let i = rockets.current.length - 1; i >= 0; i--) {
        const r = rockets.current[i];
        r.y += r.vy;

        // Draw rocket trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Faint trail
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + (Math.random() - 0.5) * 2, r.y + 12);
        ctx.strokeStyle = `${r.color}80`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (r.y <= r.targetY && !r.exploded) {
          r.exploded = true;
          explode(r.x, r.y, r.color);
          rockets.current.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.trail.push({ x: p.x, y: p.y, alpha: p.life / p.maxLife });
        if (p.trail.length > 6) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);

        // Draw trail
        for (let t = 0; t < p.trail.length - 1; t++) {
          const pt = p.trail[t];
          const trailAlpha = pt.alpha * alpha * 0.4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.floor(trailAlpha * 255).toString(16).padStart(2, "0")}`;
          ctx.fill();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(alpha * 40).toString(16).padStart(2, "0")}`;
        ctx.fill();

        if (p.life <= 0) {
          particles.current.splice(i, 1);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [spawnRocket, explode]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
