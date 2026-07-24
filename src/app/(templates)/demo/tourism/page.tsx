'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Minus,
  Plus,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sailboat,
  Wine,
  Sparkles,
  Sun,
  Cloud,
  CloudRain,
  Compass,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'Manrope', sans-serif; }
    .glass { background: rgba(255,255,255,0.10); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.18); }
    .glass-solid { background: rgba(253,250,244,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  `}</style>
);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type Experience = { id: string; name: string; location: string; price: number; img: string; tag: string };

const EXPERIENCES: Experience[] = [
  { id: 'exp1', name: 'Amalfi Coastal Villa', location: 'Amalfi Coast', price: 420, img: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200', tag: 'Private Villa' },
  { id: 'exp2', name: 'Chianti Wine Tasting Lodge', location: 'Tuscany', price: 280, img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200', tag: 'Vineyard Stay' },
  { id: 'exp3', name: 'Aeolian Islands Sail & Stay', location: 'Sicily', price: 340, img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200', tag: 'Coastal Escape' },
  { id: 'exp4', name: 'Cinque Terre Cliffside Suite', location: 'Liguria', price: 310, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200', tag: 'Boutique Suite' },
];

type Extra = { id: string; label: string; price: number; icon: React.ElementType };

const EXTRAS: Extra[] = [
  { id: 'boat', label: 'Private Boat Tour', price: 180, icon: Sailboat },
  { id: 'transfer', label: 'Airport Transfer', price: 65, icon: Compass },
  { id: 'spa', label: 'Spa Day Pass', price: 90, icon: Sparkles },
  { id: 'wine', label: 'Sommelier Wine Pairing', price: 55, icon: Wine },
];

const SEASONS = [
  { id: 'spring', label: 'Spring (Apr–Jun)', icon: Sun, temp: '18–24°C', note: 'Wildflowers in bloom, coastal towns quiet before peak season.' },
  { id: 'summer', label: 'Summer (Jul–Aug)', icon: Sun, temp: '26–32°C', note: 'Warmest seas of the year — book villas 3+ months ahead.' },
  { id: 'autumn', label: 'Autumn (Sep–Oct)', icon: Cloud, temp: '20–26°C', note: 'Grape harvest season; our top pick for wine-region stays.' },
  { id: 'winter', label: 'Winter (Nov–Mar)', icon: CloudRain, temp: '9–15°C', note: 'Quiet, misty, and ideal for lodge stays with fewer crowds.' },
];

const ACTIVITIES = [
  { id: 'a1', title: 'Sunset Sail, Positano', img: 'https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?auto=format&fit=crop&w=900' },
  { id: 'a2', title: 'Vineyard Walk, Chianti', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900' },
  { id: 'a3', title: 'Cliffside Trail, Cinque Terre', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900' },
  { id: 'a4', title: 'Island Hopping, Aeolian', img: 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f1?auto=format&fit=crop&w=900' },
];

type Step = 1 | 2 | 3 | 4;

export default function TourismPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [experienceId, setExperienceId] = useState<string>(EXPERIENCES[0].id);
  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-14');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [extras, setExtras] = useState<string[]>([]);
  const [seasonTab, setSeasonTab] = useState('summer');

  const experience = EXPERIENCES.find((e) => e.id === experienceId) ?? EXPERIENCES[0];

  const nights = useMemo(() => {
    const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const extrasTotal = extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  const stayTotal = experience.price * nights;
  const total = stayTotal + extrasTotal;

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const openBooking = () => {
    setStep(1);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen font-body" style={{ background: '#0F2E24', color: '#FDFAF4' }}>
      <FontImport />

      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-display text-2xl">Terra & Mare</span>
          <button
            onClick={openBooking}
            className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Check Availability
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[560px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?auto=format&fit=crop&w=1600"
          alt="Amalfi coast at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0F2E2440 0%, #0F2E24 92%)' }} />
        <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-4" style={{ color: '#E4C97A' }}>
            Curated Italian Escapes
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl mb-6">
            Stays that feel like the coastline invited you personally.
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={openBooking} className="rounded-full px-7 py-3.5 text-sm font-semibold flex items-center gap-2" style={{ background: '#E4C97A', color: '#0F2E24' }}>
              Start Your Booking <ArrowRight size={16} />
            </button>
            <span className="text-sm opacity-70">4 signature stays · from €280/night</span>
          </div>
        </div>
      </section>

      {/* Experiences grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl max-w-md">Choose your escape.</h2>
          <p className="text-sm opacity-60 hidden md:block max-w-xs text-right">
            Every stay is bookable directly below — no third-party fees, no surprises.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden group h-72"
            >
              <img src={exp.img} alt={exp.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, #0F2E24ee 100%)' }} />
              <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs">{exp.tag}</div>
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-xl mb-1">{exp.name}</h3>
                  <p className="text-xs opacity-70 flex items-center gap-1.5">
                    <MapPin size={12} /> {exp.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl">€{exp.price}</p>
                  <p className="text-xs opacity-60">/ night</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seasonal activities */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: '#FDFAF41A' }}>
        <h2 className="font-display text-3xl mb-8">This month's activities.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACTIVITIES.map((a) => (
            <div key={a.id} className="relative rounded-xl overflow-hidden h-44 group">
              <img src={a.img} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, #0F2E24dd 100%)' }} />
              <p className="absolute bottom-3 left-3 right-3 text-sm font-medium">{a.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weather / best time to visit tabs */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: '#FDFAF41A' }}>
        <h2 className="font-display text-3xl mb-8">Best time to visit.</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeasonTab(s.id)}
              className="px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors"
              style={seasonTab === s.id ? { background: '#E4C97A', color: '#0F2E24' } : { background: '#FDFAF414', color: '#FDFAF4' }}
            >
              <s.icon size={14} /> {s.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {SEASONS.filter((s) => s.id === seasonTab).map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass rounded-2xl p-8 max-w-2xl"
            >
              <p className="font-display text-2xl mb-2">{s.temp} average</p>
              <p className="opacity-70 leading-relaxed">{s.note}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Booking CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl p-10 md:p-14 text-center" style={{ background: '#E4C97A', color: '#0F2E24' }}>
          <h2 className="font-display text-3xl md:text-4xl mb-4">Ready to see the coastline yourself?</h2>
          <button onClick={openBooking} className="rounded-full px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2" style={{ background: '#0F2E24', color: '#FDFAF4' }}>
            Start Your Booking <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Booking Engine Modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: '#0B1F18cc' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="glass-solid rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              style={{ color: '#0F2E24' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#0F2E2422' }}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className="w-2 h-2 rounded-full"
                      style={{ background: n <= step ? '#0F2E24' : '#0F2E2433' }}
                    />
                  ))}
                  <span className="text-xs opacity-50 ml-2">Step {step} of 4</span>
                </div>
                <button onClick={() => setBookingOpen(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {step === 1 && (
                  <div>
                    <h3 className="font-display text-2xl mb-4">Choose your stay</h3>
                    <div className="space-y-3">
                      {EXPERIENCES.map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => setExperienceId(exp.id)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-colors"
                          style={{ borderColor: experienceId === exp.id ? '#0F2E24' : '#0F2E2422', background: experienceId === exp.id ? '#0F2E240D' : 'transparent' }}
                        >
                          <img src={exp.img} alt={exp.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{exp.name}</p>
                            <p className="text-xs opacity-50">{exp.location}</p>
                          </div>
                          <p className="font-display text-lg">€{exp.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="font-display text-2xl mb-4">Dates &amp; guests</h3>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <label className="flex flex-col gap-1.5 text-xs uppercase tracking-widest opacity-50">
                        Check-in
                        <span className="flex items-center gap-2 text-sm normal-case tracking-normal opacity-100">
                          <Calendar size={14} />
                          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent outline-none w-full border-b pb-1" style={{ borderColor: '#0F2E2422' }} />
                        </span>
                      </label>
                      <label className="flex flex-col gap-1.5 text-xs uppercase tracking-widest opacity-50">
                        Check-out
                        <span className="flex items-center gap-2 text-sm normal-case tracking-normal opacity-100">
                          <Calendar size={14} />
                          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent outline-none w-full border-b pb-1" style={{ borderColor: '#0F2E2422' }} />
                        </span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Adults', value: adults, set: setAdults, min: 1 },
                        { label: 'Children', value: children, set: setChildren, min: 0 },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#0F2E240A' }}>
                          <span className="text-sm flex items-center gap-2">
                            <Users size={14} /> {row.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => row.set(Math.max(row.min, row.value - 1))} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: '#0F2E2433' }}>
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center text-sm">{row.value}</span>
                            <button onClick={() => row.set(row.value + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: '#0F2E2433' }}>
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-display text-2xl mb-4">Add extras</h3>
                    <div className="space-y-3">
                      {EXTRAS.map((ex) => {
                        const active = extras.includes(ex.id);
                        return (
                          <button
                            key={ex.id}
                            onClick={() => toggleExtra(ex.id)}
                            className="w-full flex items-center justify-between p-3 rounded-xl border transition-colors"
                            style={{ borderColor: active ? '#0F2E24' : '#0F2E2422', background: active ? '#0F2E240D' : 'transparent' }}
                          >
                            <span className="flex items-center gap-3 text-sm">
                              <ex.icon size={16} />
                              {ex.label}
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="text-sm opacity-60">+€{ex.price}</span>
                              <span
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{ borderColor: '#0F2E2444', background: active ? '#0F2E24' : 'transparent' }}
                              >
                                {active && <Check size={12} color="#FDFAF4" />}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h3 className="font-display text-2xl mb-4">Confirm your booking</h3>
                    <div className="rounded-xl p-4 mb-4 space-y-2 text-sm" style={{ background: '#0F2E240A' }}>
                      <div className="flex justify-between"><span className="opacity-60">Stay</span><span>{experience.name}</span></div>
                      <div className="flex justify-between"><span className="opacity-60">Dates</span><span>{checkIn} → {checkOut} ({nights}n)</span></div>
                      <div className="flex justify-between"><span className="opacity-60">Guests</span><span>{adults} adults, {children} children</span></div>
                      <div className="flex justify-between"><span className="opacity-60">Stay subtotal</span><span>€{stayTotal}</span></div>
                      {extras.length > 0 && (
                        <div className="flex justify-between"><span className="opacity-60">Extras</span><span>€{extrasTotal}</span></div>
                      )}
                      <div className="flex justify-between font-display text-lg pt-2 border-t" style={{ borderColor: '#0F2E2422' }}>
                        <span>Total</span><span>€{total}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-50">You won't be charged yet — this confirms your request and a concierge will follow up within a few hours.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-5 border-t" style={{ borderColor: '#0F2E2422' }}>
                <button
                  onClick={() => (step === 1 ? setBookingOpen(false) : setStep((s) => (s - 1) as Step))}
                  className="text-sm flex items-center gap-1.5 opacity-70"
                >
                  <ArrowLeft size={14} /> {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    className="rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
                    style={{ background: '#0F2E24', color: '#FDFAF4' }}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => setBookingOpen(false)}
                    className="rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
                    style={{ background: '#E4C97A', color: '#0F2E24' }}
                  >
                    Confirm Request <Check size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
