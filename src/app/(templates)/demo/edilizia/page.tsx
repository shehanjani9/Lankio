'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  Award,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  HardHat,
  Zap,
  Bath,
  ChefHat,
  type LucideIcon,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&display=swap');
    .font-display { font-family: 'Archivo Black', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

type ProjectType = 'bagno' | 'cucina' | 'elettrico';

const PROJECT_TYPES: { id: ProjectType; label: string; icon: LucideIcon; perSqm: [number, number] }[] = [
  { id: 'bagno', label: 'Ristrutturazione Bagno', icon: Bath, perSqm: [450, 700] },
  { id: 'cucina', label: 'Ristrutturazione Cucina', icon: ChefHat, perSqm: [380, 620] },
  { id: 'elettrico', label: 'Impianto Elettrico', icon: Zap, perSqm: [80, 140] },
];

const PORTFOLIO = [
  {
    id: 'portfolio-1',
    title: 'Bagno Moderno — Bergamo',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200',
    after: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200',
  },
  {
    id: 'portfolio-2',
    title: 'Cucina a Isola — Brescia',
    before: 'https://images.unsplash.com/photo-1595514535215-8a029a8e2b6d?auto=format&fit=crop&w=1200',
    after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200',
  },
  {
    id: 'portfolio-3',
    title: 'Open Space — Milano',
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200',
    after: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200',
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Garanzia decennale sui lavori' },
  { icon: Award, label: 'Certificazione CasaClima' },
  { icon: HardHat, label: 'Squadre interne, nessun subappalto' },
  { icon: Wrench, label: 'Sopralluogo tecnico gratuito' },
];

function InspectionModal({ open, onClose, presetType }: { open: boolean; onClose: () => void; presetType?: ProjectType }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', type: presetType || 'bagno', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setForm((f) => ({ ...f, type: presetType || f.type }));
    }
  }, [open, presetType]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1E30]/80 backdrop-blur-sm p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 font-body text-[#1E2A3A] shadow-2xl my-8"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[#8A93A0] hover:text-[#1E3A5F]">
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#E8A33D]/15 flex items-center justify-center mb-5">
                <Check className="text-[#E8A33D]" size={26} />
              </div>
              <h3 className="font-display text-xl mb-2 uppercase">Richiesta Inviata</h3>
              <p className="text-sm text-[#5A6472]">
                Un nostro tecnico ti contatterà entro 24 ore per fissare il sopralluogo gratuito.
              </p>
              <button onClick={onClose} className="mt-7 px-7 py-3 rounded-lg bg-[#1E3A5F] text-white text-sm font-semibold hover:bg-[#16293f] transition-colors">
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E8A33D] font-semibold mb-2">Sopralluogo Gratuito</p>
              <h3 className="font-display text-2xl mb-6 uppercase leading-tight">Richiedi il Sopralluogo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5A6472] mb-2 font-medium">Tipo di Progetto</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}
                    className="w-full bg-[#F4F6F8] border border-[#E1E6EC] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A5F]"
                  >
                    {PROJECT_TYPES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5A6472] mb-2 font-medium">Nome e Cognome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Mario Rossi"
                    className="w-full bg-[#F4F6F8] border border-[#E1E6EC] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A5F] placeholder:text-[#B0B8C2]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A6472] mb-2 font-medium">Telefono</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+39 333 123 4567"
                      className="w-full bg-[#F4F6F8] border border-[#E1E6EC] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A5F] placeholder:text-[#B0B8C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A6472] mb-2 font-medium">Città</label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Milano"
                      className="w-full bg-[#F4F6F8] border border-[#E1E6EC] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A5F] placeholder:text-[#B0B8C2]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5A6472] mb-2 font-medium">Note (opzionale)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Descrivi brevemente il progetto..."
                    rows={3}
                    className="w-full bg-[#F4F6F8] border border-[#E1E6EC] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A5F] placeholder:text-[#B0B8C2] resize-none"
                  />
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!form.name || !form.phone || !form.address}
                  className="w-full mt-2 py-3.5 rounded-lg bg-[#E8A33D] text-[#1E2A3A] font-semibold hover:bg-[#d8933a] transition-colors disabled:opacity-40"
                >
                  Richiedi Sopralluogo Gratuito
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EdiliziaPage() {
  const [projectType, setProjectType] = useState<ProjectType>('bagno');
  const [sqm, setSqm] = useState(15);
  const [modalOpen, setModalOpen] = useState(false);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [revealAmount, setRevealAmount] = useState(50);

  const selected = PROJECT_TYPES.find((p) => p.id === projectType)!;
  const [minPrice, maxPrice] = useMemo(
    () => [Math.round(selected.perSqm[0] * sqm), Math.round(selected.perSqm[1] * sqm)],
    [selected, sqm]
  );

  const activeProject = PORTFOLIO[portfolioIndex];

  return (
    <div className="bg-[#F4F6F8] text-[#1E2A3A] min-h-screen font-body">
      <FontImport />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#1E3A5F] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display text-xl tracking-tight uppercase">Costruire<span className="text-[#E8A33D]">.</span></span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#C2CEDB] font-medium">
            <a href="#preventivo" className="hover:text-white transition-colors">Preventivo</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#garanzie" className="hover:text-white transition-colors">Garanzie</a>
          </nav>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-5 py-2.5 rounded-lg bg-[#E8A33D] text-[#1E2A3A] font-semibold hover:bg-[#d8933a] transition-colors"
          >
            Sopralluogo Gratis
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 overflow-hidden bg-[#1E3A5F] text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E8A33D] font-semibold mb-4">Edilizia & Ristrutturazioni — Lombardia</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl leading-[1.1] max-w-3xl uppercase">
            Ristrutturazioni chiavi in mano, senza sorprese.
          </h1>
          <p className="mt-6 text-[#C2CEDB] max-w-xl text-base md:text-lg">
            Bagni, cucine e impianti elettrici: squadre interne, tempi certi e un preventivo
            chiaro prima ancora di iniziare i lavori.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#E8A33D] text-[#1E2A3A] font-semibold hover:bg-[#d8933a] transition-colors"
            >
              Richiedi Sopralluogo Gratuito <ArrowRight size={16} />
            </button>
            <a
              href="#preventivo"
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/25 hover:border-white/50 transition-colors"
            >
              Calcola il Preventivo
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
            {[
              ['420+', 'Cantieri completati'],
              ['18', 'Anni di esperienza'],
              ['10', 'Anni di garanzia'],
              ['0', 'Subappalti'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-2xl md:text-3xl text-[#E8A33D]">{num}</p>
                <p className="text-xs text-[#C2CEDB] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTIMATOR */}
      <section id="preventivo" className="px-6 py-20 md:py-24 border-t border-[#E1E6EC]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E8A33D] font-semibold mb-3">Preventivo Rapido</p>
          <h2 className="font-display text-2xl md:text-4xl mb-4 uppercase">Stima il costo del tuo progetto</h2>
          <p className="text-[#5A6472] max-w-lg mb-10">
            Seleziona il tipo di intervento e i metri quadri: otterrai subito una fascia di prezzo indicativa.
          </p>

          <div className="grid md:grid-cols-5 gap-8 md:gap-10">
            <div className="md:col-span-3 space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#5A6472] font-semibold mb-3">Tipo di Progetto</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PROJECT_TYPES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProjectType(p.id)}
                      className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 transition-colors ${
                        projectType === p.id ? 'border-[#1E3A5F] bg-[#1E3A5F]/5' : 'border-[#E1E6EC] hover:border-[#B0B8C2] bg-white'
                      }`}
                    >
                      <p.icon size={22} className={projectType === p.id ? 'text-[#1E3A5F]' : 'text-[#8A93A0]'} />
                      <span className="text-sm font-medium text-center">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-[#5A6472] font-semibold">Metri Quadri</p>
                  <span className="font-display text-xl text-[#1E3A5F]">{sqm} m²</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={60}
                  value={sqm}
                  onChange={(e) => setSqm(Number(e.target.value))}
                  className="w-full accent-[#1E3A5F] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#8A93A0] mt-1">
                  <span>4 m²</span>
                  <span>60 m²</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl border-2 border-[#1E3A5F]/15 bg-white p-6 md:p-8 sticky top-28 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-[#5A6472] font-semibold mb-2">Fascia di Prezzo Stimata</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${minPrice}-${maxPrice}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1E3A5F] leading-tight"
                  >
                    €{minPrice.toLocaleString('it-IT')} – €{maxPrice.toLocaleString('it-IT')}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-[#8A93A0] mt-2">Stima indicativa, il preventivo definitivo segue il sopralluogo</p>

                <div className="h-px bg-[#E1E6EC] my-6" />

                <ul className="space-y-3 text-sm text-[#5A6472]">
                  <li className="flex items-center gap-2"><Check size={15} className="text-[#E8A33D] shrink-0" /> {selected.label}</li>
                  <li className="flex items-center gap-2"><Check size={15} className="text-[#E8A33D] shrink-0" /> Materiali di media/alta gamma inclusi</li>
                  <li className="flex items-center gap-2"><Check size={15} className="text-[#E8A33D] shrink-0" /> Manodopera e smaltimento inclusi</li>
                  <li className="flex items-center gap-2"><Check size={15} className="text-[#E8A33D] shrink-0" /> Sopralluogo tecnico gratuito</li>
                </ul>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#E8A33D] text-[#1E2A3A] font-semibold hover:bg-[#d8933a] transition-colors"
                >
                  Richiedi Sopralluogo Gratuito <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="px-6 py-20 md:py-24 border-t border-[#E1E6EC] bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E8A33D] font-semibold mb-3">Prima e Dopo</p>
          <h2 className="font-display text-2xl md:text-4xl mb-8 md:mb-10 uppercase">{activeProject.title}</h2>

          <div className="relative rounded-2xl overflow-hidden shadow-xl select-none bg-gray-100" style={{ aspectRatio: '16/10' }}>
            <img src={activeProject.after} alt="Dopo" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${revealAmount}%` }}>
              <img
                src={activeProject.before}
                alt="Prima"
                className="h-full object-cover max-w-none"
                style={{ width: `${(100 / revealAmount) * 100}%` }}
              />
            </div>
            <div className="absolute inset-y-0" style={{ left: `${revealAmount}%` }}>
              <div className="w-0.5 h-full bg-white shadow" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#E8A33D] shadow-lg flex items-center justify-center">
                <ChevronLeft size={14} className="text-[#1E2A3A] -mr-1" />
                <ChevronRight size={14} className="text-[#1E2A3A] -ml-1" />
              </div>
            </div>
            <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wide bg-[#1E3A5F] text-white px-3 py-1 rounded">Prima</span>
            <span className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wide bg-[#E8A33D] text-[#1E2A3A] px-3 py-1 rounded">Dopo</span>
          </div>

          <input
            type="range"
            min={5}
            max={95}
            value={revealAmount}
            onChange={(e) => setRevealAmount(Number(e.target.value))}
            className="w-full mt-6 accent-[#1E3A5F] cursor-pointer"
          />

          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {PORTFOLIO.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setPortfolioIndex(i); setRevealAmount(50); }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  portfolioIndex === i ? 'bg-[#1E3A5F] text-white' : 'bg-[#F4F6F8] text-[#5A6472] hover:bg-gray-200'
                }`}
              >
                Cantiere {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section id="garanzie" className="px-6 py-20 md:py-24 border-t border-[#E1E6EC]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E8A33D] font-semibold mb-3 text-center">Perché Sceglierci</p>
          <h2 className="font-display text-2xl md:text-4xl mb-12 uppercase text-center">Trasparenza dal primo giorno.</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="bg-white rounded-xl border border-[#E1E6EC] p-6 text-center shadow-sm">
                <b.icon size={26} className="text-[#1E3A5F] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#1E2A3A]">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-24 border-t border-[#E1E6EC] bg-[#1E3A5F] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-4xl mb-4 uppercase">Parliamo del tuo progetto.</h2>
          <p className="text-[#C2CEDB] mb-8 max-w-lg mx-auto text-sm md:text-base">
            Un nostro tecnico verrà a valutare il cantiere gratuitamente, senza impegno.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#E8A33D] text-[#1E2A3A] font-semibold hover:bg-[#d8933a] transition-colors"
            >
              <Calendar size={16} /> Richiedi Sopralluogo Gratuito
            </button>
            <a href="tel:+390301234567" className="flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/25 hover:border-white/50 transition-colors">
              <Phone size={16} /> +39 030 123 4567
            </a>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-[#E1E6EC] text-center text-xs text-[#8A93A0]">
        © Costruire — Edilizia e Ristrutturazioni, Lombardia
      </footer>

      <InspectionModal open={modalOpen} onClose={() => setModalOpen(false)} presetType={projectType} />
    </div>
  );
}