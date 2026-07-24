"use client";

import { useState } from "react";

/* ============================================================================
   SKILLFORGE / EDUSTREAM — Next-Gen Tech Academy & LMS Platform (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

interface Lesson {
  title: string;
  duration: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

const CURRICULUM: Module[] = [
  {
    title: "Foundations of Modern Web Dev",
    lessons: [
      { title: "The Component Mental Model", duration: "12 min" },
      { title: "State vs. Derived State", duration: "18 min" },
      { title: "Styling Systems at Scale", duration: "15 min" },
    ],
  },
  {
    title: "Building with AI-Native Tooling",
    lessons: [
      { title: "Prompting for Production Code", duration: "20 min" },
      { title: "Agentic Workflows in Practice", duration: "24 min" },
    ],
  },
  {
    title: "Shipping & Scaling",
    lessons: [
      { title: "CI/CD for Small Teams", duration: "16 min" },
      { title: "Observability Basics", duration: "14 min" },
      { title: "Cost-Aware Architecture", duration: "19 min" },
    ],
  },
];

interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
  students: string;
}

const INSTRUCTORS: Instructor[] = [
  {
    id: "i1",
    name: "Dr. Amara Osei",
    role: "Lead AI Engineer, ex-Google",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200",
    students: "24,800",
  },
  {
    id: "i2",
    name: "Ravi Chandran",
    role: "Staff Frontend Engineer",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=1200",
    students: "18,200",
  },
  {
    id: "i3",
    name: "Lena Fischer",
    role: "Platform Architect",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200",
    students: "12,450",
  },
];

export default function EducationDemoPage() {
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0a0a14] text-white antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400" />
            <span className="text-sm font-bold tracking-wide">
              SkillForge <span className="text-emerald-300">/ EduStream</span>
            </span>
          </div>
          <nav className="hidden gap-8 text-sm text-white/60 md:flex">
            <a href="#curriculum" className="hover:text-white">Curriculum</a>
            <a href="#instructors" className="hover:text-white">Instructors</a>
            <a href="#preview" className="hover:text-white">Preview</a>
          </nav>
          <button
            onClick={() => setCheckoutOpen(true)}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 px-5 py-2 text-xs font-bold text-[#0a0a14] transition hover:brightness-110"
          >
            Enroll Now
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-[140px]" />
          <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-emerald-400/15 blur-[140px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200">
              Cohort #14 Enrolling Now
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Learn to build with
              <br />
              <span className="bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                AI-native tools.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-white/60">
              A 12-week intensive from engineers who ship. Live cohorts, real
              projects, career support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 px-7 py-3 text-sm font-bold text-[#0a0a14] transition hover:brightness-110"
              >
                Enroll — $1,490
              </button>
              <a
                href="#preview"
                className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                Watch Preview
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="grid grid-cols-2 gap-3">
              {INSTRUCTORS.slice(0, 2).map((i) => (
                <div key={i.id} className="overflow-hidden rounded-2xl border border-white/10">
                  <img src={i.image} alt={i.name} className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200"
                alt="Students collaborating"
                className="h-40 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum accordion */}
      <section id="curriculum" className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <h2 className="text-2xl font-bold">Course Curriculum</h2>
        <p className="mt-2 text-sm text-white/50">3 modules · 8 lessons · 138 minutes</p>
        <div className="mt-8 space-y-3">
          {CURRICULUM.map((mod, i) => (
            <div
              key={mod.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <button
                onClick={() => setOpenModule(openModule === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold">
                  {String(i + 1).padStart(2, "0")}. {mod.title}
                </span>
                <span className="text-white/40">{openModule === i ? "−" : "+"}</span>
              </button>
              {openModule === i && (
                <div className="divide-y divide-white/5 border-t border-white/10">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.title}
                      className="flex items-center justify-between px-5 py-3 text-sm text-white/70"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {lesson.title}
                      </span>
                      <span className="text-xs text-white/40">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section id="instructors" className="border-t border-white/10 bg-white/[0.02] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold">Learn from Industry Engineers</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {INSTRUCTORS.map((i) => (
              <div
                key={i.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <img src={i.image} alt={i.name} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{i.name}</h3>
                  <p className="text-xs text-white/50">{i.role}</p>
                  <p className="mt-2 text-xs text-emerald-300">{i.students} students taught</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video preview player mockup */}
      <section id="preview" className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <h2 className="text-2xl font-bold">Lesson Preview</h2>
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200"
            alt="Video lesson preview thumbnail"
            className={`h-96 w-full object-cover transition ${playing ? "opacity-30" : "opacity-100"}`}
          />
          <button
            onClick={() => setPlaying((p) => !p)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-black transition hover:scale-105">
              {playing ? "❚❚" : "▶"}
            </span>
          </button>
          {playing && (
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/60 px-4 py-2 text-xs text-white/80 backdrop-blur">
              Playing: Prompting for Production Code — 20:14 / 24:00 (preview mockup)
            </div>
          )}
        </div>
      </section>

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f1c] p-6">
            {!enrolled ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Enroll in SkillForge</h3>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    className="rounded-full p-1.5 hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>AI-Native Web Development — Cohort #14</span>
                    <span className="font-semibold">$1,490</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                    <span>Early enrollment discount</span>
                    <span className="text-emerald-300">-$200</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm font-bold">
                    <span>Total due today</span>
                    <span>$1,290</span>
                  </div>
                </div>
                <button
                  onClick={() => setEnrolled(true)}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 py-3 text-sm font-bold text-[#0a0a14] transition hover:brightness-110"
                >
                  Complete Enrollment
                </button>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">
                  ✓
                </div>
                <h3 className="text-lg font-bold">You&apos;re Enrolled!</h3>
                <p className="mt-2 text-sm text-white/50">
                  Welcome to Cohort #14 — check your inbox for onboarding details.
                </p>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="mt-6 w-full rounded-full border border-white/15 py-3 text-sm font-medium hover:bg-white/5"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
