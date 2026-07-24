"use client";

import { useState } from "react";

/* ============================================================================
   CULINARYX / BLACKTRUFFLE — High-End Fine Dining & Michelin Star Restaurant
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

interface Course {
  name: string;
  description: string;
  pairing: string;
}

const TASTING_MENUS: Record<string, Course[]> = {
  "The Truffle Journey": [
    { name: "Amuse-Bouche", description: "Black truffle custard, brioche crumb.", pairing: "Champagne Blanc de Blancs" },
    { name: "First Course", description: "Hand-cut tagliolini, shaved winter truffle.", pairing: "Barolo, Piedmont" },
    { name: "Main", description: "Dry-aged duck breast, truffle jus, root vegetables.", pairing: "Pinot Noir, Burgundy" },
    { name: "Dessert", description: "Dark chocolate ganache, truffle honey.", pairing: "Tawny Port" },
  ],
  "Ocean & Ember": [
    { name: "Amuse-Bouche", description: "Charred scallop, citrus foam.", pairing: "Chablis Grand Cru" },
    { name: "First Course", description: "Smoked lobster bisque, cognac cream.", pairing: "Sauternes" },
    { name: "Main", description: "Live-fire grilled turbot, brown butter.", pairing: "Assyrtiko, Santorini" },
    { name: "Dessert", description: "Yuzu tart, burnt meringue.", pairing: "Moscato d'Asti" },
  ],
};

const TIME_SLOTS = ["17:30", "18:00", "19:00", "19:30", "20:30", "21:00"];
const PARTY_SIZES = [2, 3, 4, 5, 6, 8];

export default function RestaurantDemoPage() {
  const [menuKey, setMenuKey] = useState<keyof typeof TASTING_MENUS>("The Truffle Journey");
  const [expanded, setExpanded] = useState<number | null>(0);
  const [date, setDate] = useState("2026-08-14");
  const [slot, setSlot] = useState<string | null>(null);
  const [party, setParty] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  function reserve() {
    if (slot) setConfirmed(true);
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0908] font-serif text-[#efe6d8] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[#2a2420] bg-[#0a0908]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-lg tracking-[0.15em]">
            CulinaryX <span className="text-[#c9974a]">/ Black Truffle</span>
          </span>
          <nav className="hidden gap-8 font-sans text-sm tracking-wide text-[#efe6d8]/60 md:flex">
            <a href="#menu" className="hover:text-[#c9974a]">Tasting Menu</a>
            <a href="#reserve" className="hover:text-[#c9974a]">Reservations</a>
          </nav>
          <a
            href="#reserve"
            className="rounded-full border border-[#c9974a]/40 px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#c9974a] transition hover:bg-[#c9974a]/10"
          >
            Reserve a Table
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600"
          alt="Moody fine dining table setting"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 text-center sm:px-8">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-[#c9974a]">
            Two Michelin Stars — Est. 2011
          </p>
          <h1 className="max-w-2xl text-5xl font-medium leading-tight sm:text-6xl">
            A tasting menu
            <br />
            <span className="italic text-[#c9974a]">worth the wait.</span>
          </h1>
        </div>
      </section>

      {/* Tasting menu tabs */}
      <section id="menu" className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#c9974a]">
            Chef&apos;s Tasting Menu
          </p>
          <h2 className="text-3xl font-medium">Four Courses, Perfectly Paired</h2>
        </div>

        <div className="mt-8 flex justify-center gap-2 font-sans">
          {Object.keys(TASTING_MENUS).map((key) => (
            <button
              key={key}
              onClick={() => {
                setMenuKey(key as keyof typeof TASTING_MENUS);
                setExpanded(0);
              }}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                menuKey === key
                  ? "bg-[#c9974a] text-[#0a0908]"
                  : "border border-[#2a2420] text-[#efe6d8]/60"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-10 space-y-3">
          {TASTING_MENUS[menuKey].map((course, i) => (
            <div key={course.name} className="overflow-hidden rounded-xl border border-[#2a2420]">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex w-full items-center justify-between bg-[#141210] px-5 py-4 text-left"
              >
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-[#c9974a]">
                  {course.name}
                </span>
                <span className="font-sans text-lg text-[#efe6d8]/40">
                  {expanded === i ? "−" : "+"}
                </span>
              </button>
              {expanded === i && (
                <div className="border-t border-[#2a2420] bg-[#0a0908] px-5 py-4">
                  <p className="text-lg">{course.description}</p>
                  <p className="mt-2 font-sans text-xs uppercase tracking-wide text-[#efe6d8]/40">
                    Wine Pairing — <span className="text-[#c9974a]">{course.pairing}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Reservation widget */}
      <section id="reserve" className="border-t border-[#2a2420] bg-[#141210] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#c9974a]">
              Reserve Your Table
            </p>
            <h2 className="text-3xl font-medium">Book an Evening</h2>
          </div>

          {confirmed ? (
            <div className="mt-8 rounded-2xl border border-[#c9974a]/30 bg-[#c9974a]/10 p-6 text-center font-sans">
              <p className="text-lg font-semibold text-[#c9974a]">Table Reserved</p>
              <p className="mt-2 text-sm text-[#efe6d8]/60">
                {date} at {slot} — Party of {party}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6 rounded-2xl border border-[#2a2420] bg-[#0a0908] p-6 font-sans">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#efe6d8]/50">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2420] bg-[#141210] px-3 py-2.5 text-sm outline-none focus:border-[#c9974a]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#efe6d8]/50">
                  Party Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {PARTY_SIZES.map((p) => (
                    <button
                      key={p}
                      onClick={() => setParty(p)}
                      className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                        party === p
                          ? "bg-[#c9974a] text-[#0a0908]"
                          : "border border-[#2a2420] text-[#efe6d8]/60"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#efe6d8]/50">
                  Available Times
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSlot(t)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        slot === t
                          ? "border-[#c9974a] bg-[#c9974a]/15 text-[#c9974a]"
                          : "border-[#2a2420] text-[#efe6d8]/60 hover:bg-white/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!slot}
                onClick={reserve}
                className="w-full rounded-full bg-[#c9974a] py-3 text-sm font-bold uppercase tracking-wide text-[#0a0908] transition disabled:cursor-not-allowed disabled:opacity-30"
              >
                Confirm Reservation
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
