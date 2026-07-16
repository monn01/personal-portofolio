"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const PARTICLE_COUNT = 55;
const CONNECTION_DISTANCE = 130;
const MOUSE_REPEL_RADIUS = 110;
const MOUSE_REPEL_STRENGTH = 0.8;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

/**
 * Thin, low-opacity dot-and-line network — the site-wide "tech" backdrop
 * that replaced the blurred gradient blobs. Colors are read from the
 * active theme's CSS custom properties at mount/theme-change time (canvas
 * can't reference `var(--accent)` directly), so it stays correct across
 * dark/light and doesn't need its own hardcoded palette.
 */
export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function readColor(varName: string) {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      const match = /^#([0-9a-f]{6})$/i.exec(hex);
      if (!match) return "148, 163, 184";
      const value = match[1];
      const r = parseInt(value.slice(0, 2), 16);
      const g = parseInt(value.slice(2, 4), 16);
      const b = parseInt(value.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }

    let dotColor = readColor("--accent");
    let lineColor = readColor("--accent-secondary");

    const themeObserver = new MutationObserver(() => {
      dotColor = readColor("--accent");
      lineColor = readColor("--accent-secondary");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const particlesRef: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf: number;
    let lastFrameTime = 0;

    function initParticles(width: number, height: number) {
      particlesRef.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.4 + 0.8,
        });
      }
    }

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
      initParticles(width, height);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    function animate(timestamp: number) {
      raf = requestAnimationFrame(animate);
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx!.clearRect(0, 0, width, height);

      const particles = particlesRef;

      for (const p of particles) {
        if (!prefersReducedMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
            const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
            p.vx += (dx / dist) * force * MOUSE_REPEL_STRENGTH;
            p.vy += (dy / dist) * force * MOUSE_REPEL_STRENGTH;
          }

          p.vx *= 0.97;
          p.vy *= 0.97;

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed < 0.08) {
            p.vx += (Math.random() - 0.5) * 0.05;
            p.vy += (Math.random() - 0.5) * 0.05;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor}, 0.35)`;
        ctx!.fill();
      }

      if (!prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DISTANCE) {
              const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.14;
              ctx!.beginPath();
              ctx!.moveTo(particles[i].x, particles[i].y);
              ctx!.lineTo(particles[j].x, particles[j].y);
              ctx!.strokeStyle = `rgba(${lineColor}, ${opacity})`;
              ctx!.lineWidth = 0.5;
              ctx!.stroke();
            }
          }
        }
      }
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
