'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Leaf,
  WheatOff,
  Flame,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  MapPin,
  Phone,
  Wheat,
  Droplet,
  ThermometerSun,
  type LucideIcon,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'Nunito Sans', sans-serif; }
  `}</style>
);

type MenuTab = 'classiche' | 'speciali' | 'dolci';

type Dish = {
  id: string;
  tab: MenuTab;
  name: string;
  desc: string;
  price: number;
  tags: ('vegano' | 'senzaGlutine')[];
};

const MENU: Dish[] = [
  { id: 'p1', tab: 'classiche', name: 'Margherita DOP', desc: 'Pomodoro San Marzano, fior di latte, basilico fresco, olio EVO', price: 8, tags: [] },
  { id: 'p2', tab: 'classiche', name: 'Marinara', desc: 'Pomodoro San Marzano, aglio, origano, olio EVO', price: 6.5, tags: ['vegano'] },
  { id: 'p3', tab: 'classiche', name: 'Capricciosa', desc: 'Pomodoro, mozzarella, carciofi, funghi, prosciutto cotto, olive', price: 10.5, tags: [] },
  { id: 'p4', tab: 'classiche', name: 'Diavola', desc: 'Pomodoro, mozzarella, salame piccante calabrese', price: 9.5, tags: [] },
  { id: 'p5', tab: 'speciali', name: 'Tartufo e Porcini', desc: 'Crema di tartufo nero, funghi porcini, fontina, scaglie di grana', price: 15, tags: [] },
  { id: 'p6', tab: 'speciali', name: 'Vegana di Stagione', desc: 'Verdure grigliate, crema di ceci, rucola, pomodorini confit', price: 12, tags: ['vegano', 'senzaGlutine'] },
  { id: 'p7', tab: 'speciali', name: 'Nduja e Burrata', desc: 'Nduja calabrese, burrata pugliese, miele di castagno', price: 13.5, tags: [] },
  { id: 'p8', tab: 'speciali', name: 'Senza Glutine Bufala', desc: 'Impasto certificato senza glutine, pomodoro, bufala DOP', price: 11.5, tags: ['senzaGlutine'] },
  { id: 'p9', tab: 'dolci', name: 'Tiramisù della Casa', desc: 'Mascarpone, savoiardi, caffè, cacao amaro', price: 6, tags: [] },
  { id: 'p10', tab: 'dolci', name: 'Panna Cotta ai Frutti di Bosco', desc: 'Panna fresca, coulis di frutti di bosco', price: 5.5, tags: ['senzaGlutine'] },
  { id: 'p11', tab: 'dolci', name: 'Calice di Lambrusco', desc: 'Lambrusco secco dell\u2019Emilia, servito fresco', price: 5, tags: ['vegano', 'senzaGlutine'] },
  { id: 'p12', tab: 'dolci', name: 'Birra Artigianale', desc: 'Selezione di birre artigianali italiane alla spina', price: 6, tags: ['vegano'] },
];

const TABS: { id: MenuTab; label: string }[] = [
  { id: 'classiche', label: 'Pizze Classiche' },
  { id: 'speciali', label: 'Pizze Speciali' },
  { id: 'dolci', label: 'Dolci & Bevande' },
];

const QUALITY_TABS = [
  {
    id: 'lievitazione',
    label: 'Lievitazione 48 Ore',
    icon: ThermometerSun,
    text: 'Il nostro impasto riposa 48 ore a temperatura controllata, per una digeribilità superiore e una crosta leggera e alveolata, croccante fuori e morbida dentro.',
  },
  {
    id: 'farine',
    label: 'Farine Biologiche',
    icon: Wheat,
    text: 'Utilizziamo esclusivamente farine biologiche macinate a pietra da un mulino delle Marche, selezionate per il loro contenuto proteico e la loro purezza.',
  },
  {
    id: 'acqua',
    label: 'Acqua e Sale Marino',
    icon: Droplet,
    text: 'L\u2019impasto nasce solo da farina, acqua, sale marino integrale e lievito madre: quattro ingredienti, nessuna scorciatoia, nessun additivo.',
  },
  {
    id: 'forno',
    label: 'Forno a Legna 480°C',
    icon: Flame,
    text: 'Cotta in 90 secondi nel nostro forno a legna in refrattario, alimentato con legna di faggio, per una cottura uniforme e un profumo inconfondibile.',
  },
];

const TAG_STYLE: Record<string, { label: string; icon: LucideIcon; className: string }> = {
  vegano: { label: 'Vegano', icon: Leaf, className: 'bg-[#6B7A4F]/15 text-[#4C5936] border-[#6B7A4F]/30' },
  senzaGlutine: { label: 'Senza Glutine', icon: WheatOff, className: 'bg-[#C1502E]/10 text-[#8C3A20] border-[#C1502E]/25' },
};

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'tavolo' | 'asporto'>('tavolo');
  const [form, setForm] = useState({ name: '', phone: '', people: '2', time: '19:30', date: '' });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  if (!open) return null;

  const slots = ['12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A1B12]/75 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-[#FBF3E4] rounded-3xl p-8 font-body text-[#3A2A1D] shadow-2xl border-4 border-[#C1502E]/10"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[#8C6A50] hover:text-[#C1502E]">
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#6B7A4F]/15 flex items-center justify-center mb-5">
                <Check className="text-[#6B7A4F]" size={26} />
              </div>
              <h3 className="font-display text-2xl mb-2">
                {mode === 'tavolo' ? 'Tavolo prenotato!' : 'Ordine ricevuto!'}
              </h3>
              <p className="text-sm text-[#6B543F]">
                {mode === 'tavolo'
                  ? `Ti aspettiamo alle ${form.time} per ${form.people} persone.`
                  : 'Il tuo ordine da asporto sarà pronto tra 25 minuti circa.'}
              </p>
              <button onClick={onClose} className="mt-7 px-6 py-2.5 rounded-full bg-[#C1502E] text-white text-sm hover:bg-[#a8452a] transition-colors">
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6 bg-[#EFE2CB] rounded-full p-1">
                {(['tavolo', 'asporto'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      mode === m ? 'bg-[#C1502E] text-white' : 'text-[#6B543F]'
                    }`}
                  >
                    {m === 'tavolo' ? 'Prenota un Tavolo' : 'Ordina da Asporto'}
                  </button>
                ))}
              </div>

              <h3 className="font-display text-2xl mb-5">
                {mode === 'tavolo' ? 'Prenota il tuo tavolo' : 'Il tuo ordine da asporto'}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#8C6A50] mb-2">Data</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-white border border-[#E3D2AF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1502E]"
                    />
                  </div>
                  {mode === 'tavolo' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-[#8C6A50] mb-2">Persone</label>
                      <select
                        value={form.people}
                        onChange={(e) => setForm({ ...form, people: e.target.value })}
                        className="w-full bg-white border border-[#E3D2AF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1502E]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'persone'}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-[#8C6A50] mb-2">Orario</label>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, time: s })}
                        className={`py-2 rounded-lg text-xs border transition-colors ${
                          form.time === s ? 'bg-[#C1502E] text-white border-[#C1502E]' : 'border-[#E3D2AF] text-[#6B543F]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-[#8C6A50] mb-2">Nome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Il tuo nome"
                    className="w-full bg-white border border-[#E3D2AF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1502E] placeholder:text-[#B8A583]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-[#8C6A50] mb-2">Telefono</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+39 333 123 4567"
                    className="w-full bg-white border border-[#E3D2AF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1502E] placeholder:text-[#B8A583]"
                  />
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!form.name || !form.phone || !form.date}
                  className="w-full mt-2 py-3.5 rounded-full bg-[#C1502E] text-white font-semibold hover:bg-[#a8452a] transition-colors disabled:opacity-40"
                >
                  {mode === 'tavolo' ? 'Conferma Prenotazione' : 'Conferma Ordine'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PizzeriaPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('classiche');
  const [activeQuality, setActiveQuality] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const dishes = MENU.filter((d) => d.tab === activeTab);

  return (
    <div className="bg-[#FBF3E4] text-[#3A2A1D] min-h-screen font-body">
      <FontImport />

      <header className="fixed top-0 inset-x-0 z-50 bg-[#3A2A1D] text-[#FBF3E4]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display text-2xl">Forno & Fuoco</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#E3D2AF]">
            <a href="#menu" className="hover:text-white transition-colors">Menù</a>
            <a href="#qualita" className="hover:text-white transition-colors">La Qualità</a>
            <a href="#dove" className="hover:text-white transition-colors">Dove Siamo</a>
          </nav>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-5 py-2.5 rounded-full bg-[#C1502E] hover:bg-[#a8452a] transition-colors"
          >
            Prenota / Ordina
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF3E4]/40 via-[#FBF3E4] to-[#FBF3E4]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C1502E] mb-5">Pizzeria & Panificio Artigianale — Bologna</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl mx-auto">
            Impasto lento, fuoco vero, gusto onesto.
          </h1>
          <p className="mt-6 text-[#6B543F] max-w-lg mx-auto text-lg">
            Lievitazione di 48 ore, farine biologiche e forno a legna: la nostra pizza nasce dalla pazienza,
            non dalla fretta.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C1502E] text-white font-semibold hover:bg-[#a8452a] transition-colors"
            >
              Prenota un Tavolo <ArrowRight size={16} />
            </button>
            <a
              href="#menu"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#3A2A1D]/20 hover:border-[#3A2A1D] transition-colors"
            >
              Guarda il Menù
            </a>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="px-6 py-24 border-t border-[#3A2A1D]/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C1502E] mb-4 text-center">Il Menù</p>
          <h2 className="font-display text-4xl md:text-5xl mb-10 text-center">Dalla tradizione, con rispetto.</h2>

          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold border-2 transition-colors ${
                  activeTab === t.id
                    ? 'bg-[#3A2A1D] text-[#FBF3E4] border-[#3A2A1D]'
                    : 'border-[#3A2A1D]/15 text-[#6B543F] hover:border-[#3A2A1D]/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {dishes.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-[#3A2A1D]/8 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl">{d.name}</h3>
                    <span className="font-display text-xl text-[#C1502E] shrink-0">€{d.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-[#6B543F] mt-2 mb-3 leading-relaxed">{d.desc}</p>
                  {d.tags.length > 0 && (
                    <div className="flex gap-2">
                      {d.tags.map((tag) => {
                        const t = TAG_STYLE[tag];
                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${t.className}`}
                          >
                            <t.icon size={12} /> {t.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* QUALITY */}
      <section id="qualita" className="px-6 py-24 border-t border-[#3A2A1D]/10 bg-[#3A2A1D] text-[#FBF3E4]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#E39D6F] mb-4">La Nostra Qualità</p>
            <h2 className="font-display text-4xl mb-8">Quattro ingredienti, zero scorciatoie.</h2>
            <div className="space-y-2">
              {QUALITY_TABS.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuality(i)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-colors ${
                    activeQuality === i ? 'bg-[#C1502E]' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <q.icon size={20} className="shrink-0" />
                  <span className="text-sm font-semibold">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuality}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              <p className="text-lg leading-relaxed text-[#E3D2AF]">{QUALITY_TABS[activeQuality].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* LOCATION / CTA */}
      <section id="dove" className="px-6 py-24 border-t border-[#3A2A1D]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-5">Vi aspettiamo al forno.</h2>
          <p className="text-[#6B543F] mb-9 max-w-lg mx-auto">
            Via dell{'\u2019'}Indipendenza 42, Bologna — aperti tutti i giorni dalle 12:00 alle 23:00.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C1502E] text-white font-semibold hover:bg-[#a8452a] transition-colors"
            >
              <Calendar size={16} /> Prenota / Ordina
            </button>
            <a href="tel:+390512345678" className="flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#3A2A1D]/20 hover:border-[#3A2A1D] transition-colors">
              <Phone size={16} /> +39 051 234 5678
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6B543F]">
            <MapPin size={14} /> Via dell{'\u2019'}Indipendenza 42, 40121 Bologna
          </p>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-[#3A2A1D]/10 text-center text-xs text-[#8C6A50]">
        © {new Date().getFullYear()} Forno & Fuoco — Pizzeria e Panificio Artigianale, Bologna
      </footer>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
