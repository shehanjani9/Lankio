"use client";

import { useMemo, useState } from "react";

/* ============================================================================
   APEXESTATE / HORIZON — Ultra-Luxury Real Estate & Villa Rentals (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  image: string;
  floorPlans: { label: string; image: string }[];
}

const PROPERTIES: Property[] = [
  {
    id: "pr1",
    name: "Villa Meridian",
    location: "Amalfi Coast",
    price: 4200000,
    bedrooms: 5,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200",
    floorPlans: [
      { label: "Ground Floor", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200" },
      { label: "Upper Floor", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200" },
    ],
  },
  {
    id: "pr2",
    name: "The Dune House",
    location: "Malibu, CA",
    price: 6850000,
    bedrooms: 6,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200",
    floorPlans: [
      { label: "Ground Floor", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200" },
      { label: "Upper Floor", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200" },
    ],
  },
  {
    id: "pr3",
    name: "Casa Serenata",
    location: "Lake Como",
    price: 3100000,
    bedrooms: 4,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200",
    floorPlans: [
      { label: "Ground Floor", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200" },
      { label: "Upper Floor", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200" },
    ],
  },
  {
    id: "pr4",
    name: "Horizon Penthouse",
    location: "Dubai Marina",
    price: 5400000,
    bedrooms: 3,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200",
    floorPlans: [
      { label: "Main Level", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200" },
      { label: "Rooftop", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200" },
    ],
  },
];

const LOCATIONS = ["All Locations", ...Array.from(new Set(PROPERTIES.map((p) => p.location)))];

export default function RealEstateDemoPage() {
  const [location, setLocation] = useState("All Locations");
  const [maxPrice, setMaxPrice] = useState(7000000);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);
  const [floorPlanProperty, setFloorPlanProperty] = useState<Property | null>(null);
  const [activeFloor, setActiveFloor] = useState(0);

  const filtered = useMemo(() => {
    return PROPERTIES.filter(
      (p) =>
        (location === "All Locations" || p.location === location) &&
        p.price <= maxPrice &&
        p.bedrooms >= minBedrooms
    );
  }, [location, maxPrice, minBedrooms]);

  function openFloorPlans(p: Property) {
    setFloorPlanProperty(p);
    setActiveFloor(0);
  }

  return (
    <div className="min-h-screen w-full bg-[#0f0d0a] text-[#f1ece2] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[#3a2f1f] bg-[#0f0d0a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-sm font-semibold tracking-[0.2em]">
            APEXESTATE <span className="text-[#c9a15b]">/ HORIZON</span>
          </span>
          <nav className="hidden gap-8 text-sm text-[#f1ece2]/60 md:flex">
            <a href="#properties" className="hover:text-[#f1ece2]">Properties</a>
            <a href="#" className="hover:text-[#f1ece2]">Agents</a>
            <a href="#" className="hover:text-[#f1ece2]">Contact</a>
          </nav>
          <a
            href="#properties"
            className="rounded-full border border-[#c9a15b]/40 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#c9a15b] transition hover:bg-[#c9a15b]/10"
          >
            View Listings
          </a>
        </div>
      </header>

      {/* Cinematic hero */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600"
          alt="Cinematic luxury villa exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/30 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a15b]">
            Curated Global Portfolio
          </p>
          <h1 className="max-w-2xl text-5xl font-light leading-tight sm:text-6xl">
            Homes built for
            <br />
            <span className="italic text-[#c9a15b]">horizons, not houses.</span>
          </h1>
        </div>
      </section>

      {/* Search filter */}
      <section id="properties" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 grid gap-6 rounded-2xl border border-[#3a2f1f] bg-[#171310] p-6 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#f1ece2]/50">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#3a2f1f] bg-[#0f0d0a] px-3 py-2.5 text-sm outline-none focus:border-[#c9a15b]"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#f1ece2]/50">
              Max Price: ${maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={1000000}
              max={7000000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#c9a15b]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#f1ece2]/50">
              Min Bedrooms: {minBedrooms === 0 ? "Any" : minBedrooms}
            </label>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(Number(e.target.value))}
              className="w-full accent-[#c9a15b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-[#3a2f1f] bg-[#171310]">
              <div className="relative h-64">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                <button
                  onClick={() => setTourProperty(p)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-[#0f0d0a]/70 px-4 py-2 text-xs font-semibold backdrop-blur transition hover:bg-[#0f0d0a]"
                >
                  ▶ 360° Virtual Tour
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-medium">{p.name}</h3>
                    <p className="text-sm text-[#f1ece2]/50">{p.location}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#c9a15b]">
                    ${(p.price / 1000000).toFixed(1)}M
                  </p>
                </div>
                <p className="mt-2 text-xs text-[#f1ece2]/50">{p.bedrooms} Bedrooms</p>
                <button
                  onClick={() => openFloorPlans(p)}
                  className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#c9a15b] underline decoration-[#c9a15b]/40 underline-offset-4 hover:text-[#e2bc7e]"
                >
                  View Floor Plans →
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-12 text-center text-sm text-[#f1ece2]/40">
              No properties match your filters — try widening your search.
            </p>
          )}
        </div>
      </section>

      {/* 360 tour modal */}
      {tourProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[#3a2f1f] bg-[#171310]">
            <button
              onClick={() => setTourProperty(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-sm backdrop-blur"
            >
              ✕
            </button>
            <img
              src={tourProperty.image}
              alt={tourProperty.name}
              className="h-96 w-full object-cover"
            />
            <div className="flex items-center justify-center gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a15b] text-[#0f0d0a]">
                ▶
              </div>
              <div>
                <p className="text-sm font-semibold">{tourProperty.name} — 360° Walkthrough</p>
                <p className="text-xs text-[#f1ece2]/40">
                  Interactive tour preview (demo placeholder)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor plan modal */}
      {floorPlanProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#3a2f1f] bg-[#171310] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{floorPlanProperty.name} — Floor Plans</h3>
              <button
                onClick={() => setFloorPlanProperty(null)}
                className="rounded-full p-1.5 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 flex gap-2">
              {floorPlanProperty.floorPlans.map((fp, i) => (
                <button
                  key={fp.label}
                  onClick={() => setActiveFloor(i)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeFloor === i
                      ? "bg-[#c9a15b] text-[#0f0d0a]"
                      : "border border-[#3a2f1f] text-[#f1ece2]/60"
                  }`}
                >
                  {fp.label}
                </button>
              ))}
            </div>
            <img
              src={floorPlanProperty.floorPlans[activeFloor].image}
              alt={floorPlanProperty.floorPlans[activeFloor].label}
              className="h-72 w-full rounded-xl object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
