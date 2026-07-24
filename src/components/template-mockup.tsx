'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TemplateCategory } from '@/lib/templates-data';

const STROKE = '#8B5CF6';
const STROKE_SECONDARY = '#3B82F6';
const STROKE_TERTIARY = '#06B6D4';

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="198" height="138" rx="8" fill="#0d0e14" stroke="rgba(255,255,255,0.09)" />
      <rect x="1" y="1" width="198" height="18" rx="8" fill="#12131a" stroke="rgba(255,255,255,0.09)" />
      <circle cx="12" cy="10" r="2.5" fill={STROKE_TERTIARY} opacity="0.7" />
      <circle cx="20" cy="10" r="2.5" fill={STROKE_SECONDARY} opacity="0.7" />
      <circle cx="28" cy="10" r="2.5" fill={STROKE} opacity="0.7" />
      {children}
    </svg>
  );
}

function EcommerceMockup() {
  return (
    <BrowserFrame>
      {[0, 1, 2, 3].map((i) => {
        const x = 12 + (i % 2) * 90;
        const y = 30 + Math.floor(i / 2) * 50;
        return (
          <g key={i}>
            <rect x={x} y={y} width="78" height="34" rx="4" fill="none" stroke={STROKE_SECONDARY} opacity="0.6" />
            <line x1={x + 8} y1={y + 42} x2={x + 45} y2={y + 42} stroke={STROKE_TERTIARY} strokeWidth="2" opacity="0.8" />
            <line x1={x + 8} y1={y + 47} x2={x + 30} y2={y + 47} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          </g>
        );
      })}
    </BrowserFrame>
  );
}

function SaasMockup() {
  return (
    <BrowserFrame>
      <rect x="10" y="28" width="34" height="98" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="16" y1={40 + i * 14} x2="38" y2={40 + i * 14} stroke={STROKE} strokeWidth="2" opacity="0.5" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={54 + i * 32}
          y={90 - i * 14}
          width="20"
          height={14 + i * 14}
          fill={i % 2 === 0 ? STROKE : STROKE_TERTIARY}
          opacity="0.55"
        />
      ))}
      <polyline points="54,55 74,45 94,50 114,32 134,40" fill="none" stroke={STROKE_SECONDARY} strokeWidth="2" opacity="0.8" />
    </BrowserFrame>
  );
}

function PortfolioMockup() {
  return (
    <BrowserFrame>
      <rect x="12" y="28" width="176" height="70" rx="4" fill="none" stroke={STROKE} opacity="0.5" />
      <line x1="12" y1="112" x2="90" y2="112" stroke={STROKE_TERTIARY} strokeWidth="3" opacity="0.8" />
      <line x1="12" y1="122" x2="150" y2="122" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    </BrowserFrame>
  );
}

function RestaurantHotelMockup() {
  return (
    <BrowserFrame>
      <rect x="12" y="28" width="100" height="98" rx="4" fill="none" stroke={STROKE_SECONDARY} opacity="0.5" />
      <rect x="122" y="28" width="66" height="98" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="130"
          y1={42 + i * 20}
          x2="180"
          y2={42 + i * 20}
          stroke={i === 0 ? STROKE_TERTIARY : 'rgba(255,255,255,0.25)'}
          strokeWidth="2"
        />
      ))}
    </BrowserFrame>
  );
}

export function TemplateMockup({ category }: { category: TemplateCategory }) {
  switch (category) {
    case 'ecommerce':
      return <EcommerceMockup />;
    case 'saas':
      return <SaasMockup />;
    case 'portfolio':
      return <PortfolioMockup />;
    case 'restaurantHotel':
      return <RestaurantHotelMockup />;
  }
}

// Real screenshot with hover-zoom, falling back to the SVG mockup above if
// the image is missing (404) or fails to load for any other reason -- this
// is what lets the Template Hub work today with placeholder art and later
// with real screenshots dropped into /public/templates, with no code change.
export function TemplatePreviewImage({
  src,
  alt,
  category,
  priority = false,
}: {
  src: string;
  alt: string;
  category: TemplateCategory;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="h-full w-full p-3">
        <TemplateMockup category={category} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
