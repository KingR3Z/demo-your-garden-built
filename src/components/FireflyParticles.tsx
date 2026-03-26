"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  glowPhase: number;
}

export default function FireflyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = window.innerWidth <= 768 ? 15 : 35;
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.1,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.6,
      opacitySpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      glowPhase: Math.random() * Math.PI * 2,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        // Gentle drift
        p.x += p.vx;
        p.y += p.vy;

        // Subtle mouse repulsion (very gentle)
        if (mouseRef.current.x > 0) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.15;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Pulsing glow
        p.glowPhase += 0.02;
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.7 || p.opacity < 0.05) {
          p.opacitySpeed *= -1;
        }

        // Wrap around edges
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        // Draw glow
        const glowSize = p.size * (3 + Math.sin(p.glowPhase) * 1.5);
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowSize * 4
        );
        gradient.addColorStop(0, `rgba(212, 184, 122, ${p.opacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(212, 184, 122, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(212, 184, 122, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        pointerEvents: "none",
        zIndex: 5,
        opacity: 0.6,
      }}
    />
  );
}
