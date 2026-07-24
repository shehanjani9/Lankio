'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Plane,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Users,
  Briefcase,
  ShieldCheck,
  Star,
  Phone,
  ArrowRight,
  Wine,
  Gauge,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Fonts (self-contained import so the page reads distinctly from Tailwind defaults)
// ---------------------------------------------------------------------------
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body { font-family: 'Manrope', sans-serif; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type Route = {
  id: string;
  label: string;
  basePrice: { sedan: number; van: number; suv: number };
  km: number;
};

const ROUTES: Route[] = [
  { id: 'linate', label: 'Aeroporto Linate → Centro Milano', basePrice: { sedan: 65, van: 85, suv: 95 }, km: 12 },
  { id: 'malpensa', label: 'Aeroporto Malpensa → Centro Milano', basePrice: { sedan: 120, van: 150, suv: 165 }, km: 48 },
  { id: 'orio', label: 'Aeroporto Orio al Serio → Milano', basePrice: { sedan: 145, van: 175, suv: 190 }, km: 55 },
  { id: 'city', label: 'Tratta Urbana (entro Milano)', basePrice: { sedan: 45, van: 60, suv: 70 }, km: 8 },
  { id: 'como', label: 'Milano → Lago di Como (tour giornata)', basePrice: { sedan: 380, van: 450, suv: 490 }, km: 110 },
];

type CarClass = {
  id: 'sedan' | 'van' | 'suv';
  name: string;
  model: string;
  seats: number;
  luggage: number;
  desc: string;
  img: string;
};

const CAR_CLASSES: CarClass[] = [
  {
    id: 'sedan',
    name: 'Business Sedan',
    model: 'Mercedes-Benz Classe E',
    seats: 3,
    luggage: 3,
    desc: 'Il compromesso perfetto tra eleganza e praticità per transfer aeroportuali e spostamenti in città.',
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200',
  },
  {
    id: 'van',
    name: 'Luxury Van',
    model: 'Mercedes-Benz Classe V',
    seats: 7,
    luggage: 6,
    desc: 'Spazio generoso per gruppi e famiglie, senza rinunciare alla finitura premium degli interni.',
    img: 'https://images.unsplash.com/photo-1617469767053-8f35aaa39fbc?auto=format&fit=crop&w=1200',
  },
  {
    id: 'suv',
    name: 'Executive SUV',
    model: 'Mercedes-Benz GLE / S-Class',
    seats: 3,
    luggage: 4,
    desc: 'La nostra selezione top di gamma per clienti corporate ed eventi di rappresentanza.',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200',
  },
];

const FLEET_SPECS = [
  { label: 'Autista professionista NCC', icon: ShieldCheck },
  { label: 'Acqua e Wi-Fi a bordo', icon: Wine },
  { label: 'Monitoraggio voli in tempo reale', icon: Plane },
  { label: 'Veicoli con meno di 2 anni', icon: Gauge },
];

const TESTIMONIALS = [
  { name: 'Alessandro F.', role: 'Cliente Business', text: 'Puntualità assoluta, auto impeccabile. Il mio autista mi aspettava già con il cartello nonostante il volo in ritardo.' },
  { name: 'Giulia R.', role: 'Transfer Aeroportuale', text: 'Servizio elegante e discreto, perfetto per gli spostamenti di lavoro dei nostri clienti internazionali.' },
  { name: 'Marco T.', role: 'Tour Lago di Como', text: 'Un\u2019esperienza superiore alla media: comfort, silenzio e un autista che conosceva ogni scorcio del lago.' },
];

// ---------------------------------------------------------------------------
// Small UI atoms
// ---------------------------------------------------------------------------
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-[#C9A876]" />
      <span className="font-body text-[11px] tracking-[0.3em] uppercase text-[#C9A876]">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking Modal
// ---------------------------------------------------------------------------
function BookingModal({
  open,
  onClose,
  presetRoute,
  presetClass,
}: {
  open: boolean;
  onClose: () => void;
  presetRoute?: string;
  presetClass?: string;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    route: presetRoute || ROUTES[0].id,
    carClass: presetClass || 'sedan',
    date: '',
    time: '',
    flight: '',
    passengers: '1',
    name: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setForm((f) => ({ ...f, route: presetRoute || f.route, carClass: presetClass || f.carClass }));
    }
  }, [open, presetRoute, presetClass]);

  if (!open) return null;

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-[#111214] border border-[#2A2C30] rounded-2xl p-8 font-body text-[#EDEAE3] shadow-2xl"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#8A8A8A] hover:text-[#C9A876] transition-colors"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#C9A876]/15 flex items-center justify-center mb-5">
                <Check className="text-[#C9A876]" size={26} />
              </div>
              <h3 className="font-display text-2xl mb-2">Richiesta inviata</h3>
              <p className="text-[#9C9C9C] text-sm">
                Grazie, {form.name || 'gentile cliente'}. Il nostro team di prenotazioni ti confermerà la corsa entro 30 minuti.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#C9A876] text-[#111214] text-sm font-medium hover:bg-[#dbb989] transition-colors"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                {[1, 2].map((s) => (
                  <span
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#C9A876]' : 'bg-[#2A2C30]'}`}
                  />
                ))}
              </div>
              <p className="font-body text-[11px] tracking-widest uppercase text-[#8A8A8A] mt-2 mb-1">
                Passo {step} di 2
              </p>
              <h3 className="font-display text-3xl mb-6">Richiedi la tua corsa</h3>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Tratta</label>
                    <select
                      value={form.route}
                      onChange={(e) => update('route', e.target.value)}
                      className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876]"
                    >
                      {ROUTES.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Classe Auto</label>
                    <div className="grid grid-cols-3 gap-2">
                      {CAR_CLASSES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => update('carClass', c.id)}
                          className={`rounded-lg border py-2.5 text-xs transition-colors ${
                            form.carClass === c.id
                              ? 'border-[#C9A876] bg-[#C9A876]/10 text-[#C9A876]'
                              : 'border-[#2A2C30] text-[#9C9C9C] hover:border-[#454750]'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Data</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update('date', e.target.value)}
                        className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Ora</label>
                      <input
                        type="time"
                        value={form.time}
                        onChange={(e) => update('time', e.target.value)}
                        className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">N. Volo (opz.)</label>
                      <input
                        type="text"
                        placeholder="AZ 1234"
                        value={form.flight}
                        onChange={(e) => update('flight', e.target.value)}
                        className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876] placeholder:text-[#5C5C5C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Passeggeri</label>
                      <select
                        value={form.passengers}
                        onChange={(e) => update('passengers', e.target.value)}
                        className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876]"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors"
                  >
                    Continua <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Nome e Cognome</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Mario Rossi"
                      className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876] placeholder:text-[#5C5C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] mb-2">Telefono</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+39 333 123 4567"
                      className="w-full bg-[#1A1B1E] border border-[#2A2C30] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A876] placeholder:text-[#5C5C5C]"
                    />
                  </div>
                  <div className="rounded-lg bg-[#1A1B1E] border border-[#2A2C30] p-4 text-sm text-[#9C9C9C]">
                    <div className="flex justify-between mb-1">
                      <span>Tratta</span>
                      <span className="text-[#EDEAE3]">{ROUTES.find((r) => r.id === form.route)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Classe</span>
                      <span className="text-[#EDEAE3]">{CAR_CLASSES.find((c) => c.id === form.carClass)?.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 rounded-full border border-[#2A2C30] text-sm text-[#9C9C9C] hover:border-[#454750] transition-colors"
                    >
                      Indietro
                    </button>
                    <button
                      onClick={() => setSubmitted(true)}
                      disabled={!form.name || !form.phone}
                      className="flex-1 py-3.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Conferma Richiesta
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function NCCPage() {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [carClassId, setCarClassId] = useState<'sedan' | 'van' | 'suv'>('sedan');
  const [modalOpen, setModalOpen] = useState(false);

  const route = ROUTES.find((r) => r.id === routeId)!;
  const price = useMemo(() => route.basePrice[carClassId], [route, carClassId]);

  return (
    <div className="bg-[#0B0B0D] text-[#EDEAE3] min-h-screen font-body">
      <FontImport />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0B0B0D]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display text-2xl tracking-wide">
            Aurea<span className="text-[#C9A876]">NCC</span>
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#B8B8B8]">
            <a href="#flotta" className="hover:text-[#C9A876] transition-colors">Flotta</a>
            <a href="#preventivo" className="hover:text-[#C9A876] transition-colors">Preventivo</a>
            <a href="#recensioni" className="hover:text-[#C9A876] transition-colors">Recensioni</a>
          </nav>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-5 py-2.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors"
          >
            Prenota Ora
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1610647752706-3bb12232b3ea?auto=format&fit=crop&w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/40 via-[#0B0B0D] to-[#0B0B0D]" />
        <div className="relative max-w-6xl mx-auto">
          <Eyebrow>Noleggio Con Conducente — Milano · Roma · Laghi</Eyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl"
          >
            L{'\u2019'}eleganza non chiede scusa per essere puntuale.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-[#B8B8B8] max-w-xl text-lg"
          >
            Transfer aeroportuali, spostamenti business e tour privati sui laghi — con autisti professionisti
            e una flotta Mercedes-Benz rinnovata ogni due anni.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors"
            >
              Prenota una Corsa <ArrowRight size={16} />
            </button>
            <a
              href="#preventivo"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-[#EDEAE3] hover:border-[#C9A876] transition-colors"
            >
              Calcola il Prezzo
            </a>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
            {[
              ['12+', 'Anni di attività'],
              ['4.9/5', 'Valutazione media'],
              ['24/7', 'Disponibilità'],
              ['100%', 'Auto Mercedes-Benz'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-3xl text-[#C9A876]">{num}</p>
                <p className="text-xs text-[#8A8A8A] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE ESTIMATOR */}
      <section id="preventivo" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>Preventivo Immediato</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Calcola la tua tratta</h2>
          <p className="text-[#9C9C9C] max-w-lg mb-12">
            Seleziona il percorso e la classe di veicolo: il prezzo stimato si aggiorna in tempo reale.
          </p>

          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3 space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-[#C9A876]" /> Seleziona Tratta
                </p>
                <div className="space-y-2">
                  {ROUTES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRouteId(r.id)}
                      className={`w-full text-left px-5 py-4 rounded-xl border flex items-center justify-between transition-all ${
                        routeId === r.id
                          ? 'border-[#C9A876] bg-[#C9A876]/[0.07]'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className="text-sm">{r.label}</span>
                      <span className="text-xs text-[#7A7A7A]">{r.km} km circa</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3 flex items-center gap-2">
                  <Car size={14} className="text-[#C9A876]" /> Seleziona Classe
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {CAR_CLASSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCarClassId(c.id)}
                      className={`px-3 py-4 rounded-xl border text-center transition-all ${
                        carClassId === c.id
                          ? 'border-[#C9A876] bg-[#C9A876]/[0.07]'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-[11px] text-[#7A7A7A] mt-1">{c.seats} posti</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl border border-[#C9A876]/30 bg-gradient-to-b from-[#17130C] to-[#0B0B0D] p-8 sticky top-28">
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">Prezzo Stimato</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={price}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-6xl text-[#C9A876]"
                  >
                    €{price}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-[#7A7A7A] mt-2">Tariffa fissa, nessun costo nascosto</p>

                <div className="h-px bg-white/10 my-6" />

                <ul className="space-y-3 text-sm text-[#B8B8B8]">
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#C9A876]" /> {route.label}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#C9A876]" /> {CAR_CLASSES.find((c) => c.id === carClassId)?.name}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#C9A876]" /> Monitoraggio volo incluso
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#C9A876]" /> Attesa gratuita 60 minuti
                  </li>
                </ul>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors"
                >
                  Prenota questa Tratta <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="flotta" className="px-6 py-24 border-t border-white/5 bg-[#0E0F11]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>La Flotta</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl mb-12">Tre classi, uno standard.</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {CAR_CLASSES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-[#111214] hover:border-[#C9A876]/40 transition-colors"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-[#C9A876] mb-1">{c.name}</p>
                  <h3 className="font-display text-2xl mb-3">{c.model}</h3>
                  <p className="text-sm text-[#9C9C9C] mb-4">{c.desc}</p>
                  <div className="flex items-center gap-5 text-xs text-[#7A7A7A]">
                    <span className="flex items-center gap-1.5"><Users size={13} /> {c.seats} passeggeri</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={13} /> {c.luggage} bagagli</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14">
            {FLEET_SPECS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 text-sm text-[#B8B8B8]">
                <s.icon size={18} className="text-[#C9A876] shrink-0" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="recensioni" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>Recensioni</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl mb-12">La parola ai clienti.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/10 p-7 bg-[#111214]">
                <div className="flex gap-1 mb-4 text-[#C9A876]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-[#B8B8B8] mb-5 leading-relaxed">{'\u201C'}{t.text}{'\u201D'}</p>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-[#7A7A7A]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/5 bg-gradient-to-b from-[#0E0F11] to-[#0B0B0D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-5">Pronto a partire?</h2>
          <p className="text-[#9C9C9C] mb-9 max-w-lg mx-auto">
            Richiedi la tua corsa in meno di due minuti, oppure chiamaci direttamente per esigenze particolari.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C9A876] text-[#111214] font-medium hover:bg-[#dbb989] transition-colors"
            >
              Prenota Ora <ArrowRight size={16} />
            </button>
            <a
              href="tel:+390212345678"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 hover:border-[#C9A876] transition-colors"
            >
              <Phone size={16} /> +39 02 1234 5678
            </a>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-[#5C5C5C]">
        © {new Date().getFullYear()} AureaNCC — Servizio Noleggio Con Conducente. Milano, Italia.
      </footer>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} presetRoute={routeId} presetClass={carClassId} />
    </div>
  );
}
