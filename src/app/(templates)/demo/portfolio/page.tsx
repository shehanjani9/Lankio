"use client";

import { useState, type FormEvent } from "react";

/* ============================================================================
   VANGUARD STUDIO — Bold Editorial High-Concept Agency (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

type ProjectCategory = "3D & WebGL" | "Brand Systems" | "E-Commerce" | "Mobile Apps";
type FilterCategory = "All" | ProjectCategory;

interface Project {
  id: string;
  client: string;
  title: string;
  category: ProjectCategory;
  award?: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: "pr1",
    client: "Solace Audio",
    title: "Spatial Sound Experience",
    category: "3D & WebGL",
    award: "Awwwards SOTD",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pr2",
    client: "Marrow & Co.",
    title: "Identity for a New Bakery Empire",
    category: "Brand Systems",
    award: "CSS Design Awards",
    image:
      "https://images.unsplash.com/photo-1634942536790-15a4d1a4c9f4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pr3",
    client: "Fernweh",
    title: "Luggage, Reimagined Online",
    category: "E-Commerce",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pr4",
    client: "Orbital Health",
    title: "A Companion App for Recovery",
    category: "Mobile Apps",
    award: "FWA",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pr5",
    client: "Kinetic Motors",
    title: "Configurator in Real-Time 3D",
    category: "3D & WebGL",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pr6",
    client: "Verre Studio",
    title: "Glassware Brand from Scratch",
    category: "Brand Systems",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
  },
];

const FILTERS: FilterCategory[] = [
  "All",
  "3D & WebGL",
  "Brand Systems",
  "E-Commerce",
  "Mobile Apps",
];

const AWARDS = [
  { label: "Awwwards Site of the Day", count: "07" },
  { label: "FWA", count: "12" },
  { label: "CSS Design Awards", count: "05" },
];

export default function PortfolioDemoPage() {
  const [filter, setFilter] = useState<FilterCategory>("All");
  const [budget, setBudget] = useState<string>("$50k–100k");
  const [hovered, setHovered] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const visible =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const budgets = ["<$25k", "$25k–50k", "$50k–100k", "$100k+"];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen w-full bg-[#f2f0ea] text-[#0d0d0d] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f2f0ea]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-sm font-black uppercase tracking-[0.25em]">
            Vanguard Studio
          </span>
          <nav className="hidden gap-8 text-sm font-medium uppercase tracking-wide md:flex">
            <a href="#work" className="hover:opacity-60">Work</a>
            <a href="#awards" className="hover:opacity-60">Awards</a>
            <a href="#contact" className="hover:opacity-60">Inquire</a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-[#0d0d0d] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#f2f0ea] transition hover:bg-[#c94b2c]"
          >
            Start a Project
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-8">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#c94b2c]">
          Est. 2016 — Global Digital Studio
        </p>
        <h1 className="max-w-5xl text-[13vw] font-black uppercase leading-[0.9] tracking-tighter sm:text-[8rem] lg:text-[9rem]">
          We build
          <br />
          digital
          <br />
          <span className="italic text-[#c94b2c]">monuments.</span>
        </h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-black/60">
          Vanguard Studio partners with ambitious brands to design and build
          experiences that outlast the trend cycle. No templates. No
          shortcuts. Just work worth remembering.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROJECTS.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              className={`overflow-hidden rounded-lg border border-black/10 ${
                i % 2 === 0 ? "translate-y-0" : "translate-y-6"
              }`}
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-40 w-full object-cover grayscale transition duration-500 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Awards bar */}
      <section id="awards" className="border-y border-black/10 bg-[#0d0d0d] text-[#f2f0ea]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {AWARDS.map((a) => (
            <div key={a.label} className="flex items-center justify-between px-8 py-6">
              <span className="text-sm uppercase tracking-wide text-white/60">
                {a.label}
              </span>
              <span className="text-3xl font-black text-[#c94b2c]">{a.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Project showcase */}
      <section id="work" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl font-black uppercase tracking-tight">Selected Work</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  filter === f
                    ? "border-[#0d0d0d] bg-[#0d0d0d] text-[#f2f0ea]"
                    : "border-black/15 text-black/50 hover:border-black/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-black/10"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6 text-[#f2f0ea] transition-opacity duration-300 ${
                  hovered === p.id ? "opacity-100" : "opacity-90"
                }`}
              >
                {p.award && (
                  <span className="mb-2 inline-block w-fit rounded-full bg-[#c94b2c] px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                    {p.award}
                  </span>
                )}
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {p.client} — {p.category}
                </p>
                <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry form */}
      <section id="contact" className="border-t border-black/10 bg-[#0d0d0d] px-5 py-24 text-[#f2f0ea] sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Let&apos;s build something monumental.
          </h2>
          <p className="mt-4 text-white/50">
            Tell us about your project. We reply within one business day.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-xl border border-[#c94b2c]/40 bg-[#c94b2c]/10 p-6">
              <p className="font-semibold text-[#c94b2c]">Inquiry received.</p>
              <p className="mt-1 text-sm text-white/60">
                Our studio director will reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/50">
                    Name
                  </label>
                  <input
                    required
                    className="w-full border-b border-white/20 bg-transparent pb-3 text-lg outline-none focus:border-[#c94b2c]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/50">
                    Company
                  </label>
                  <input
                    className="w-full border-b border-white/20 bg-transparent pb-3 text-lg outline-none focus:border-[#c94b2c]"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/50">
                  Estimated Budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgets.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        budget === b
                          ? "border-[#c94b2c] bg-[#c94b2c] text-white"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/50">
                  Project Details
                </label>
                <textarea
                  rows={4}
                  className="w-full border-b border-white/20 bg-transparent pb-3 text-lg outline-none focus:border-[#c94b2c]"
                  placeholder="What are you building?"
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#c94b2c] px-8 py-3 text-sm font-bold uppercase tracking-wide transition hover:brightness-110"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
