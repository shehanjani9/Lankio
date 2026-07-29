'use client';

import {
  SiNextdotjs,
  SiReact,
  SiWordpress,
  SiLaravel,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiVuedotjs,
  SiPython,
  SiDocker,
  SiPostgresql,
  SiGraphql,
  SiFigma,
  SiShopify,
} from 'react-icons/si';

const TECH_STACK = [
  { name: 'Next.js', icon: SiNextdotjs, color: 'hover:text-white' },
  { name: 'React', icon: SiReact, color: 'hover:text-[#61DAFB]' },
  { name: 'WordPress', icon: SiWordpress, color: 'hover:text-[#21759B]' },
  { name: 'Laravel', icon: SiLaravel, color: 'hover:text-[#FF2D20]' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'hover:text-[#06B6D4]' },
  { name: 'TypeScript', icon: SiTypescript, color: 'hover:text-[#3178C6]' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'hover:text-[#5FA04E]' },
  { name: 'Vue.js', icon: SiVuedotjs, color: 'hover:text-[#4FC08D]' },
  { name: 'Python', icon: SiPython, color: 'hover:text-[#3776AB]' },
  { name: 'Docker', icon: SiDocker, color: 'hover:text-[#2496ED]' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'hover:text-[#4169E1]' },
  { name: 'GraphQL', icon: SiGraphql, color: 'hover:text-[#E10098]' },
  { name: 'Shopify', icon: SiShopify, color: 'hover:text-[#95BF47]' },
  { name: 'Figma', icon: SiFigma, color: 'hover:text-[#F24E1E]' },
];

export function TechMarquee() {
  // Seamless continuous loop එකක් සඳහා items ප්‍රමාණය 4 ගුණයක් කරමු
  const quadTech = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

  return (
    <div className="relative w-full overflow-hidden border-y border-[color:var(--glass-border)] bg-slate-950/70 py-4 backdrop-blur-md">
      {/* Both Sides Gradient Blur Edge Mask */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[color:var(--bg-primary,#020617)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[color:var(--bg-primary,#020617)] to-transparent" />

      {/* Track */}
      <div className="tech-marquee-track flex w-max items-center">
        {quadTech.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`group mx-3 flex items-center gap-3 rounded-full border border-[color:var(--glass-border)] bg-slate-900/40 px-5 py-2.5 text-xs font-medium text-[color:var(--text-secondary)] shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-slate-800/80 ${item.color}`}
            >
              <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="whitespace-nowrap font-mono tracking-wide transition-colors group-hover:text-white">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pure Smooth CSS Infinite Keyframes */}
      <style jsx>{`
        .tech-marquee-track {
          animation: marquee-scroll 35s linear infinite;
          will-change: transform;
        }
        .tech-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}