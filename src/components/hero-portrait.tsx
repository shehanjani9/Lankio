'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const PARTICLE_RGB = '109, 93, 252';
const LINK_DISTANCE = 110;
const MOUSE_RADIUS = 150;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseVx: number;
  baseVy: number;
};

/* ------------------------------------------------------------------ */
/*  ParticleField — Interactive Background Canvas                     */
/* ------------------------------------------------------------------ */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId: number | null = null;

    let mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const count = Math.min(90, Math.max(30, Math.round((width * height) / 12000)));
      particles = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.4;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          r: Math.random() * 1.8 + 0.8,
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const tick = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.8;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        if (Math.abs(p.vx) < 0.1) p.vx += p.baseVx * 0.1;
        if (Math.abs(p.vy) < 0.1) p.vy += p.baseVy * 0.1;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${PARTICLE_RGB}, ${0.25 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (mouse.active) {
        for (const p of particles) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${PARTICLE_RGB}, ${0.35 * (1 - dist / MOUSE_RADIUS)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_RGB}, 0.75)`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  HeroPortrait — Circular Backing Frame with Connected Badge         */
/* ------------------------------------------------------------------ */
export function HeroPortrait({ alt }: { alt: string }) {
  const reduceMotion = useReducedMotion();

  // Floating animation for the ENTIRE container (Circle + Connected Badge)
  const floatAnimation = reduceMotion ? {} : {
    animate: {
      y: [0, -8, 0],
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div 
      className="relative mx-auto flex items-center justify-center w-full max-w-[500px]"
      {...floatAnimation} // Applying float to entire structure
    >
      {/* 
        Main Circle Portrait Container.
        We keep 'overflow-hidden' on the Image layer only, 
        so the connected badge can overflow outwards.
      */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[color:var(--glass-border)] bg-slate-900/50 backdrop-blur-md shadow-2xl">
        
        {/* Glowing Background Radial Core */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(109,93,252,0.45) 0%, rgba(109,93,252,0.1) 60%, transparent 80%)',
          }}
        />

        {/* 
          Image Display Layer (must be absolute to be contained in the circle)
          Overflow-hidden here keeps image cut properly.
        */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="relative w-full h-full scale-110 translate-y-3">
            <Image
              src="/hero-person.png"
              alt={alt}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 500px, 420px"
              className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
            />

            {/* Smooth Bottom Arc Blend for Cutoff Edge */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[color:var(--bg-primary,rgba(15,23,42,0.95))] via-[color:var(--bg-primary,rgba(15,23,42,0.6))] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 
          Connected Floating 50+ Projects Glass Card.
          This is nested INSIDE the main circle element but absolute positioned
          relative to the circle, to appear integrated and connected.
        */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          // Connected Position: right-0, bottom-0 and translate-y pushes it out
          className="absolute right-0 bottom-0 z-20 translate-x-4 translate-y-6 max-w-[280px] sm:max-w-[320px] rounded-2xl border border-[color:var(--glass-border)] bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold text-white">50+</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Successful Projects
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--text-secondary)]">
                We’ve completed 50+ projects across industries, delivering quality websites that drive results and elevate brands.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}