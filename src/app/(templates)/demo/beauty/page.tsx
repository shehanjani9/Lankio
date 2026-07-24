'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  Star,
  User,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap');
    .font-display { font-family: 'Cormorant', serif; }
    .font-body { font-family: 'Poppins', sans-serif; }
  `}</style>
);

type Treatment = {
  id: string;
  category: string;
  name: string;
  duration: number;
  price: number;
  desc: string;
};

const TREATMENTS: Treatment[] = [
  { id: 't1', category: 'Viso', name: 'Pulizia Viso Profonda', duration: 50, price: 55, desc: 'Detersione, esfoliazione ed estrazione con maschera lenitiva finale.' },
  { id: 't2', category: 'Viso', name: 'Trattamento Anti-Età Oro', duration: 70, price: 95, desc: 'Massaggio viso con siero alla vitamina C e maschera con particelle d\u2019oro 24k.' },
  { id: 't3', category: 'Viso', name: 'Idratazione Intensiva', duration: 45, price: 65, desc: 'Maschera in tessuto all\u2019acido ialuronico e massaggio drenante.' },
  { id: 't4', category: 'Corpo', name: 'Massaggio Rilassante', duration: 60, price: 70, desc: 'Massaggio con oli essenziali su tutto il corpo per un rilassamento profondo.' },
  { id: 't5', category: 'Corpo', name: 'Scrub Corpo al Sale Rosa', duration: 50, price: 60, desc: 'Esfoliazione corpo con sale rosa dell\u2019Himalaya e olio di mandorle.' },
  { id: 't6', category: 'Unghie', name: 'Manicure Semipermanente', duration: 45, price: 35, desc: 'Manicure completa con smalto semipermanente e cura delle cuticole.' },
  { id: 't7', category: 'Unghie', name: 'Pedicure Spa', duration: 55, price: 45, desc: 'Pedicure completa con scrub, massaggio e smalto a scelta.' },
  { id: 't8', category: 'Capelli', name: 'Piega e Styling', duration: 40, price: 30, desc: 'Lavaggio, piega e styling personalizzato per ogni occasione.' },
  { id: 't9', category: 'Capelli', name: 'Trattamento Ricostruttivo', duration: 60, price: 75, desc: 'Trattamento intensivo con cheratina per capelli danneggiati o sfibrati.' },
];

const CATEGORIES = ['Viso', 'Corpo', 'Unghie', 'Capelli'];

const OPERATORS = [
  { id: 'op1', name: 'Sofia', role: 'Estetista Senior' },
  { id: 'op2', name: 'Chiara', role: 'Massoterapista' },
  { id: 'op3', name: 'Valentina', role: 'Hair Stylist' },
  { id: 'any', name: 'Nessuna preferenza', role: 'Prima disponibile' },
];

const RESULTS = [
  {
    label: 'Trattamento Anti-Età',
    before: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200',
    after: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200',
  },
  {
    label: 'Trattamento Idratante',
    before: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1200',
    after: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200',
  },
];

function BookingModal({ open, onClose, presetTreatment }: { open: boolean; onClose: () => void; presetTreatment?: Treatment }) {
  const [operator, setOperator] = useState('any');
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '10:00' });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  if (!open) return null;

  const slots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#4A3A38]/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-[28px] p-8 font-body text-[#4A3A38] shadow-2xl"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[#B79A94] hover:text-[#C89A8E]">
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#F2E4DE] flex items-center justify-center mb-5">
                <Sparkles className="text-[#C89A8E]" size={24} />
              </div>
              <h3 className="font-display text-3xl mb-2">Prenotazione confermata</h3>
              <p className="text-sm text-[#8A7570]">
                Ti aspettiamo il {form.date || 'giorno scelto'} alle {form.time} per {presetTreatment?.name || 'il tuo trattamento'}.
              </p>
              <button onClick={onClose} className="mt-7 px-7 py-3 rounded-full bg-[#C89A8E] text-white text-sm hover:bg-[#b6857a] transition-colors">
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C89A8E] mb-2">Prenota Trattamento</p>
              <h3 className="font-display text-3xl mb-1">{presetTreatment?.name || 'Nuovo Appuntamento'}</h3>
              {presetTreatment && (
                <p className="text-sm text-[#8A7570] mb-6">
                  {presetTreatment.duration} min · €{presetTreatment.price}
                </p>
              )}
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A7570] mb-2">Operatrice</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OPERATORS.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setOperator(op.id)}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs transition-colors ${
                          operator === op.id ? 'border-[#C89A8E] bg-[#FBF3F0]' : 'border-[#EFE0DB]'
                        }`}
                      >
                        <p className="font-medium">{op.name}</p>
                        <p className="text-[10px] text-[#B79A94]">{op.role}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A7570] mb-2">Data</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-[#FBF3F0] border border-[#EFE0DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C89A8E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A7570] mb-2">Nome</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Il tuo nome"
                      className="w-full bg-[#FBF3F0] border border-[#EFE0DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C89A8E] placeholder:text-[#D9C5BF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A7570] mb-2">Orario</label>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, time: s })}
                        className={`py-2 rounded-lg text-xs border transition-colors ${
                          form.time === s ? 'bg-[#C89A8E] text-white border-[#C89A8E]' : 'border-[#EFE0DB] text-[#8A7570]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A7570] mb-2">Telefono</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+39 333 123 4567"
                    className="w-full bg-[#FBF3F0] border border-[#EFE0DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C89A8E] placeholder:text-[#D9C5BF]"
                  />
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!form.name || !form.phone || !form.date}
                  className="w-full mt-2 py-3.5 rounded-full bg-[#C89A8E] text-white font-medium hover:bg-[#b6857a] transition-colors disabled:opacity-40"
                >
                  Conferma Prenotazione
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BeautyPage() {
  const [activeCategory, setActiveCategory] = useState('Viso');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [revealAmount, setRevealAmount] = useState(50);

  const treatments = TREATMENTS.filter((t) => t.category === activeCategory);
  const activeResult = RESULTS[sliderIndex];

  const openBooking = (t: Treatment) => {
    setSelectedTreatment(t);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#FDF8F5] text-[#4A3A38] min-h-screen font-body">
      <FontImport />

      <header className="fixed top-0 inset-x-0 z-50 bg-[#FDF8F5]/85 backdrop-blur-md border-b border-[#EFE0DB]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display text-2xl tracking-wide">Bellezza & Bloom</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#8A7570]">
            <a href="#trattamenti" className="hover:text-[#C89A8E] transition-colors">Trattamenti</a>
            <a href="#risultati" className="hover:text-[#C89A8E] transition-colors">Risultati</a>
            <a href="#recensioni" className="hover:text-[#C89A8E] transition-colors">Recensioni</a>
          </nav>
          <button
            onClick={() => { setSelectedTreatment(null); setModalOpen(true); }}
            className="text-sm px-5 py-2.5 rounded-full bg-[#C89A8E] text-white hover:bg-[#b6857a] transition-colors"
          >
            Prenota Ora
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#F2E4DE] rounded-full blur-3xl opacity-60" />
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#C89A8E] mb-5">Centro Estetico & Hair Style — Torino</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.1] mb-6">
              Prenditi cura di te, senza fretta.
            </h1>
            <p className="text-[#8A7570] max-w-md mb-9 text-lg">
              Trattamenti viso, corpo, unghie e capelli in un ambiente curato nei minimi dettagli,
              pensato per farti uscire più bella e più leggera.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => { setSelectedTreatment(null); setModalOpen(true); }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C89A8E] text-white font-medium hover:bg-[#b6857a] transition-colors"
              >
                Prenota un Trattamento <ArrowRight size={16} />
              </button>
              <a href="#trattamenti" className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#E3CFC7] hover:border-[#C89A8E] transition-colors">
                Scopri i Trattamenti
              </a>
            </div>
          </div>
          <div className="relative h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200"
              alt="Centro Estetico"
              className="w-full h-full object-cover rounded-[32px] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* TREATMENT SELECTOR */}
      <section id="trattamenti" className="px-6 py-24 border-t border-[#EFE0DB]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C89A8E] mb-4">I Nostri Trattamenti</p>
          <h2 className="font-display text-4xl md:text-5xl mb-10">Scegli, confronta, prenota.</h2>

          <div className="flex gap-2 mb-10 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === c ? 'bg-[#4A3A38] text-white' : 'bg-white text-[#8A7570] border border-[#EFE0DB]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {treatments.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#F2E4DE] flex flex-col"
                >
                  <h3 className="font-display text-xl mb-2">{t.name}</h3>
                  <p className="text-sm text-[#8A7570] mb-4 flex-1 leading-relaxed">{t.desc}</p>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="flex items-center gap-1.5 text-[#B79A94]">
                      <Clock size={14} /> {t.duration} min
                    </span>
                    <span className="font-display text-2xl text-[#C89A8E]">€{t.price}</span>
                  </div>
                  <button
                    onClick={() => openBooking(t)}
                    className="w-full py-2.5 rounded-full border border-[#C89A8E] text-[#C89A8E] text-sm font-medium hover:bg-[#C89A8E] hover:text-white transition-colors"
                  >
                    Prenota
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section id="risultati" className="px-6 py-24 border-t border-[#EFE0DB] bg-[#FBF3F0]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C89A8E] mb-4">Risultati Reali</p>
          <h2 className="font-display text-4xl md:text-5xl mb-10">{activeResult.label}</h2>

          <div className="relative rounded-[28px] overflow-hidden shadow-xl select-none" style={{ aspectRatio: '4/3' }}>
            <img src={activeResult.after} alt="Dopo" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${revealAmount}%` }}>
              <img src={activeResult.before} alt="Prima" className="w-full h-full object-cover" style={{ width: `${10000 / revealAmount}%`, maxWidth: 'none' }} />
            </div>
            <div className="absolute inset-y-0" style={{ left: `${revealAmount}%` }}>
              <div className="w-0.5 h-full bg-white" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ChevronLeft size={14} className="text-[#4A3A38] -mr-1" />
                <ChevronRight size={14} className="text-[#4A3A38] -ml-1" />
              </div>
            </div>
            <span className="absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wide bg-black/40 text-white px-3 py-1 rounded-full">Prima</span>
            <span className="absolute top-4 right-4 text-[11px] font-semibold uppercase tracking-wide bg-black/40 text-white px-3 py-1 rounded-full">Dopo</span>
          </div>

          <input
            type="range"
            min={5}
            max={95}
            value={revealAmount}
            onChange={(e) => setRevealAmount(Number(e.target.value))}
            className="w-full mt-6 accent-[#C89A8E]"
          />

          <div className="flex justify-center gap-2 mt-6">
            {RESULTS.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setSliderIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${sliderIndex === i ? 'bg-[#C89A8E]' : 'bg-[#E3CFC7]'}`}
                aria-label={r.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="recensioni" className="px-6 py-24 border-t border-[#EFE0DB]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C89A8E] mb-4 text-center">Recensioni</p>
          <h2 className="font-display text-4xl md:text-5xl mb-12 text-center">Chi ci ha già scelto.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Elena B.', text: 'Ambiente elegante e personale davvero preparato. Il trattamento anti-età mi ha lasciato la pelle luminosa.' },
              { name: 'Martina C.', text: 'Prenotare online è semplicissimo e il salone rispetta sempre gli orari. Consigliatissimo.' },
              { name: 'Federica L.', text: 'La piega di Valentina è sempre perfetta, e il centro è pulitissimo e curato in ogni dettaglio.' },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-7 border border-[#F2E4DE] shadow-sm">
                <div className="flex gap-1 mb-4 text-[#C89A8E]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-[#8A7570] mb-5 leading-relaxed">{r.text}</p>
                <p className="text-sm font-medium flex items-center gap-2"><User size={14} /> {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-[#EFE0DB] bg-[#FBF3F0]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-5">Il tuo momento di bellezza ti aspetta.</h2>
          <button
            onClick={() => { setSelectedTreatment(null); setModalOpen(true); }}
            className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C89A8E] text-white font-medium hover:bg-[#b6857a] transition-colors"
          >
            Prenota Trattamento <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-[#EFE0DB] text-center text-xs text-[#B79A94]">
        © {new Date().getFullYear()} Bellezza & Bloom — Centro Estetico e Hair Style, Torino
      </footer>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} presetTreatment={selectedTreatment || undefined} />
    </div>
  );
}
