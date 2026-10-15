'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Portrait cut-out that rises out of its frame. A light scroll parallax
 * moves the figure slower than the page (transform only); reduced-motion
 * users get a static image via the global MotionConfig.
 */
export function HeroPortrait({
  alt,
  captionTop,
  captionBottom,
}: {
  alt: string;
  captionTop: string;
  captionBottom: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <div ref={ref} className="enter-fade relative mx-auto aspect-[4/5] w-full max-w-[30rem]" style={{ '--d': '0.35s' } as React.CSSProperties}>
      {/* Frame */}
      <div className="absolute inset-x-0 bottom-0 top-[18%] overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 30% 100%, rgb(139 125 255 / 0.32), transparent 70%), radial-gradient(60% 50% at 90% 85%, rgb(77 163 255 / 0.22), transparent 70%)',
          }}
        />
        <div aria-hidden="true" className="bg-grain absolute inset-0 opacity-60" />
      </div>

      {/* Figure: clipped only at the rounded bottom so the head can rise above the frame. */}
      <div className="absolute inset-0 [clip-path:inset(-20%_0_0_0_round_0_0_2rem_2rem)]">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="/hero-person.png"
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 30rem, (min-width: 640px) 26rem, 90vw"
            className="object-cover object-bottom"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-canvas/70 to-transparent"
        />
      </div>

      {/* Caption */}
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-[0.8rem] leading-snug">
        <p className="rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
          <span className="block text-fg">{captionTop}</span>
          <span className="block text-fg-muted">{captionBottom}</span>
        </p>
      </div>
    </div>
  );
}
