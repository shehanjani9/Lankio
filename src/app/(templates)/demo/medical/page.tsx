"use client";

import { useMemo, useState } from "react";

/* ============================================================================
   MEDCARE / HEALTHPULSE — Modern Medical & AI Healthcare Clinic (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  image: string;
  rating: number;
}

const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Elena Marsh",
    specialization: "Cardiology",
    bio: "15 years treating complex cardiac cases with a preventive-first approach.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200",
    rating: 4.9,
  },
  {
    id: "d2",
    name: "Dr. Naveen Kapoor",
    specialization: "Neurology",
    bio: "Specialist in neurodegenerative disorders and cognitive diagnostics.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200",
    rating: 4.8,
  },
  {
    id: "d3",
    name: "Dr. Sofia Alvarez",
    specialization: "Pediatrics",
    bio: "Gentle, family-centered care for infants through adolescence.",
    image:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=1200",
    rating: 5.0,
  },
  {
    id: "d4",
    name: "Dr. Michael Owusu",
    specialization: "Dermatology",
    bio: "Advanced diagnostics for skin conditions using AI-assisted imaging.",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200",
    rating: 4.7,
  },
];

const SPECIALIZATIONS = Array.from(new Set(DOCTORS.map((d) => d.specialization)));

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const SYMPTOM_OPTIONS = [
  "Headache",
  "Fever",
  "Fatigue",
  "Chest pain",
  "Shortness of breath",
  "Joint pain",
];

function symptomAssessment(selected: string[]): { level: string; note: string; color: string } {
  if (selected.length === 0) {
    return { level: "—", note: "Select symptoms to preview an AI-guided assessment.", color: "text-white/40" };
  }
  if (selected.includes("Chest pain") || selected.includes("Shortness of breath")) {
    return {
      level: "Seek care promptly",
      note: "These symptoms warrant a same-day consultation with a physician.",
      color: "text-rose-300",
    };
  }
  if (selected.length >= 3) {
    return {
      level: "Schedule a visit",
      note: "Multiple symptoms detected — booking a general consultation is recommended.",
      color: "text-amber-300",
    };
  }
  return {
    level: "Monitor at home",
    note: "Mild presentation. Rest and hydration advised; check back if symptoms persist.",
    color: "text-teal-300",
  };
}

export default function MedicalDemoPage() {
  const [activeSpec, setActiveSpec] = useState<string>(SPECIALIZATIONS[0]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const visibleDoctors = DOCTORS.filter((d) => d.specialization === activeSpec);
  const assessment = useMemo(() => symptomAssessment(symptoms), [symptoms]);

  function toggleSymptom(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function openBooking(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setBookingConfirmed(false);
    setBookingOpen(true);
  }

  function confirmBooking() {
    if (selectedSlot) setBookingConfirmed(true);
  }

  return (
    <div className="min-h-screen w-full bg-[#061012] text-white antialiased">
      {/* Emergency hotline banner */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-center text-xs font-semibold text-[#061012]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#061012]/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#061012]" />
        </span>
        24/7 Emergency Hotline: (+1) 555-0142 — Immediate physician response
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-teal-400/10 bg-[#061012]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500" />
            <span className="text-sm font-bold tracking-wide">
              MedCare <span className="text-teal-300">/ HealthPulse</span>
            </span>
          </div>
          <nav className="hidden gap-8 text-sm text-white/60 md:flex">
            <a href="#doctors" className="hover:text-white">Doctors</a>
            <a href="#symptom-checker" className="hover:text-white">AI Symptom Checker</a>
            <a href="#booking" className="hover:text-white">Appointments</a>
          </nav>
          <button
            onClick={() => openBooking(DOCTORS[0])}
            className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 text-xs font-bold text-[#061012] transition hover:brightness-110"
          >
            Book Appointment
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[130px]" />
          <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-200">
              AI-Assisted Diagnostics, Human-Led Care
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Precision medicine,
              <br />
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                delivered with care.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-white/60">
              HealthPulse pairs board-certified specialists with AI-assisted
              triage to get you the right care, faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#booking"
                className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-7 py-3 text-sm font-bold text-[#061012] transition hover:brightness-110"
              >
                Book a Consultation
              </a>
              <a
                href="#symptom-checker"
                className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                Try Symptom Checker
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-teal-400/15">
            <img
              src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200"
              alt="Modern clinic interior"
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-[#061012]/70 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Live vitals monitoring</p>
                  <p className="text-xs text-white/50">Connected across 12 clinics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor specialization switcher */}
      <section id="doctors" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <h2 className="mb-6 text-2xl font-bold">Find a Specialist</h2>
        <div className="mb-8 flex flex-wrap gap-2">
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSpec(s)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeSpec === s
                  ? "bg-teal-400 text-[#061012]"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleDoctors.map((doc) => (
            <div
              key={doc.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <img src={doc.image} alt={doc.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-teal-300">
                  {doc.specialization}
                </p>
                <h3 className="mt-1 font-semibold">{doc.name}</h3>
                <p className="mt-2 text-xs text-white/50">{doc.bio}</p>
                <button
                  onClick={() => openBooking(doc)}
                  className="mt-4 w-full rounded-lg border border-teal-400/30 py-2 text-xs font-semibold text-teal-300 transition hover:bg-teal-400/10"
                >
                  Book with {doc.name.split(" ")[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Symptom Checker */}
      <section id="symptom-checker" className="border-t border-white/10 bg-white/[0.02] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">AI Symptom Checker (Preview)</h2>
          <p className="mt-2 text-sm text-white/50">
            Select what you&apos;re experiencing for an instant, non-diagnostic guidance preview.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  symptoms.includes(s)
                    ? "border-teal-400 bg-teal-400/15 text-teal-200"
                    : "border-white/10 text-white/60 hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#061012] p-5">
            <p className={`text-sm font-semibold ${assessment.color}`}>{assessment.level}</p>
            <p className="mt-1 text-xs text-white/50">{assessment.note}</p>
            <p className="mt-3 text-[11px] text-white/30">
              This preview is for demonstration only and is not medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Booking modal */}
      {bookingOpen && selectedDoctor && (
        <div id="booking" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1a1d] p-6">
            {!bookingConfirmed ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Book Appointment</h3>
                  <button
                    onClick={() => setBookingOpen(false)}
                    className="rounded-full p-1.5 hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{selectedDoctor.name}</p>
                    <p className="text-xs text-teal-300">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-white/50">
                  Available Today
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        selectedSlot === slot
                          ? "border-teal-400 bg-teal-400/15 text-teal-200"
                          : "border-white/10 text-white/60 hover:bg-white/5"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedSlot}
                  onClick={confirmBooking}
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 py-3 text-sm font-bold text-[#061012] transition disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Confirm Booking
                </button>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/15 text-2xl text-teal-300">
                  ✓
                </div>
                <h3 className="text-lg font-bold">Appointment Confirmed</h3>
                <p className="mt-2 text-sm text-white/50">
                  {selectedDoctor.name} — Today at {selectedSlot}
                </p>
                <button
                  onClick={() => setBookingOpen(false)}
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
