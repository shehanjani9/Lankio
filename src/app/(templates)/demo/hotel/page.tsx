"use client";

import { useState } from "react";

/* ============================================================================
   AURA HAVEN — Boutique Luxury Resort & Wellness Spa (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

interface Suite {
  id: string;
  name: string;
  price: number;
  features: string[];
  image: string;
  description: string;
}

const SUITES: Suite[] = [
  {
    id: "s1",
    name: "The Horizon Villa",
    price: 1450,
    features: ["Private Infinity Pool", "Ocean View", "Butler Service"],
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    description:
      "A cliffside sanctuary with an edgeless pool that dissolves into the horizon, paired with round-the-clock butler service.",
  },
  {
    id: "s2",
    name: "Ember Garden Suite",
    price: 980,
    features: ["Private Terrace", "Garden View", "Outdoor Rain Shower"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    description:
      "Nestled among frangipani trees, this suite pairs warm timber interiors with an open-air rain shower under the canopy.",
  },
  {
    id: "s3",
    name: "The Lantern Penthouse",
    price: 2100,
    features: ["Private Infinity Pool", "Panoramic View", "Butler Service"],
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
    description:
      "Our signature penthouse — floor-to-ceiling glass, a rooftop plunge pool, and a dedicated butler from arrival to departure.",
  },
];

const DINING = [
  {
    name: "Ember & Salt",
    tag: "Gourmet Restaurant",
    desc: "Coastal fine dining built around the open hearth, with a tasting menu that changes with the tide.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Somm's Table",
    tag: "Gourmet Restaurant",
    desc: "An intimate 12-seat counter pairing rare vintages with a chef's improvised seven courses.",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
  },
];

const SPA = [
  {
    name: "The Salt Room",
    tag: "Wellness Treatment",
    desc: "A halotherapy ritual drawing on centuries-old salt cave traditions to restore and reset.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Moonlight Ritual Massage",
    tag: "Wellness Treatment",
    desc: "A ninety-minute full body ceremony performed by candlelight with warmed volcanic stones.",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HotelDemoPage() {
  const [checkIn, setCheckIn] = useState("2026-08-14");
  const [checkOut, setCheckOut] = useState("2026-08-18");
  const [guests, setGuests] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSuite, setActiveSuite] = useState<Suite | null>(null);
  const [tab, setTab] = useState<"dining" | "spa">("dining");

  function openSuite(s: Suite) {
    setActiveSuite(s);
  }

  return (
    <div className="min-h-screen w-full bg-[#120d0a] font-serif text-[#f3e9dd] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[#3a2b1e] bg-[#120d0a]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-lg font-semibold tracking-[0.15em]">
            AURA <span className="text-[#d9a066]">HAVEN</span>
          </span>
          <nav className="hidden gap-8 text-sm font-sans tracking-wide text-[#f3e9dd]/70 md:flex">
            <a href="#suites" className="hover:text-[#d9a066]">Suites</a>
            <a href="#dining" className="hover:text-[#d9a066]">Dining &amp; Spa</a>
            <a href="#booking" className="hover:text-[#d9a066]">Reservations</a>
          </nav>
          <a
            href="#booking"
            className="rounded-full border border-[#d9a066]/50 px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#d9a066] transition hover:bg-[#d9a066]/10"
          >
            Book a Stay
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop"
          alt="Aura Haven resort at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/40 to-[#120d0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120d0a]/50 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-40 sm:px-8">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-[#d9a066]">
            A Private Island Sanctuary
          </p>
          <h1 className="max-w-2xl text-5xl font-medium leading-tight sm:text-6xl">
            Where the ocean
            <br />
            <span className="italic text-[#d9a066]">breathes slower.</span>
          </h1>
        </div>

        {/* Floating booking bar */}
        <div className="absolute bottom-0 left-1/2 z-20 w-[94%] max-w-4xl -translate-x-1/2 translate-y-1/2 rounded-2xl border border-[#d9a066]/25 bg-[#1a130d]/90 p-5 font-sans shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:items-end">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[#f3e9dd]/50">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border border-[#d9a066]/20 bg-[#120d0a] px-3 py-2 text-sm text-[#f3e9dd] outline-none focus:border-[#d9a066]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[#f3e9dd]/50">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-[#d9a066]/20 bg-[#120d0a] px-3 py-2 text-sm text-[#f3e9dd] outline-none focus:border-[#d9a066]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[#f3e9dd]/50">
                Guests
              </label>
              <div className="flex items-center justify-between rounded-lg border border-[#d9a066]/20 bg-[#120d0a] px-3 py-2">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="text-[#d9a066]"
                >
                  −
                </button>
                <span className="text-sm">{guests} Guest{guests > 1 ? "s" : ""}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(8, g + 1))}
                  className="text-[#d9a066]"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-[#d9a066] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#120d0a] transition hover:brightness-110"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* Suites */}
      <section id="suites" className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#d9a066]">
            Accommodations
          </p>
          <h2 className="text-4xl font-medium">Our Suites &amp; Villas</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {SUITES.map((s) => (
            <div
              key={s.id}
              className="group overflow-hidden rounded-2xl border border-[#3a2b1e] bg-[#1a130d]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a130d] to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-[#120d0a]/70 px-3 py-1 font-sans text-xs font-semibold text-[#d9a066] backdrop-blur">
                  ${s.price}/night
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">{s.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2 font-sans">
                  {s.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-[#d9a066]/25 px-2.5 py-1 text-[11px] text-[#d9a066]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => openSuite(s)}
                  className="mt-5 font-sans text-xs font-semibold uppercase tracking-wide text-[#f3e9dd]/70 underline decoration-[#d9a066]/40 underline-offset-4 transition hover:text-[#d9a066]"
                >
                  Explore Suite →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dining & Spa tabs */}
      <section id="dining" className="border-t border-[#3a2b1e] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#d9a066]">
            Experiences
          </p>
          <h2 className="text-4xl font-medium">Fine Dining &amp; Wellness</h2>

          <div className="mt-8 inline-flex gap-1 rounded-full border border-[#3a2b1e] bg-[#1a130d] p-1 font-sans">
            <button
              onClick={() => setTab("dining")}
              className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                tab === "dining" ? "bg-[#d9a066] text-[#120d0a]" : "text-[#f3e9dd]/60"
              }`}
            >
              Gourmet Restaurants
            </button>
            <button
              onClick={() => setTab("spa")}
              className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                tab === "spa" ? "bg-[#d9a066] text-[#120d0a]" : "text-[#f3e9dd]/60"
              }`}
            >
              Wellness Treatments
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
          {(tab === "dining" ? DINING : SPA).map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-2xl border border-[#3a2b1e] bg-[#1a130d]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#d9a066]">
                  {item.tag}
                </p>
                <h3 className="mt-1 text-xl font-medium">{item.name}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#f3e9dd]/60">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suite modal */}
      {activeSuite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#3a2b1e] bg-[#1a130d]">
            <button
              onClick={() => setActiveSuite(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#120d0a]/70 p-2 font-sans text-sm text-[#f3e9dd] backdrop-blur"
            >
              ✕
            </button>
            <img
              src={activeSuite.image}
              alt={activeSuite.name}
              className="h-72 w-full object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-medium">{activeSuite.name}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#f3e9dd]/60">
                {activeSuite.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-sans">
                {activeSuite.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-[#d9a066]/25 px-3 py-1 text-xs text-[#d9a066]"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#3a2b1e] pt-6">
                <span className="font-sans text-lg font-semibold text-[#d9a066]">
                  ${activeSuite.price} / night
                </span>
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setActiveSuite(null);
                  }}
                  className="rounded-full bg-[#d9a066] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-[#120d0a] transition hover:brightness-110"
                >
                  Reserve This Suite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability modal */}
      {modalOpen && (
        <div
          id="booking"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#3a2b1e] bg-[#1a130d] p-8 text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-[#d9a066]">
              Availability Confirmed
            </p>
            <h3 className="mt-3 text-2xl font-medium">
              {checkIn} → {checkOut}
            </h3>
            <p className="mt-2 font-sans text-sm text-[#f3e9dd]/60">
              {guests} guest{guests > 1 ? "s" : ""} · Suites available for your dates
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-full bg-[#d9a066] py-3 font-sans text-sm font-semibold uppercase tracking-wide text-[#120d0a] transition hover:brightness-110"
            >
              Continue to Reservation
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-3 font-sans text-xs text-[#f3e9dd]/40 hover:text-[#f3e9dd]/70"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
