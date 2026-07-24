'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Ruler,
  Scissors,
  Sparkles,
  AtSign,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Jost:wght@300;400;500&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'Jost', sans-serif; }
  `}</style>
);

type LookCategory = 'autunno' | 'sposa' | 'sartoria';

type Look = {
  id: string;
  category: LookCategory;
  name: string;
  price: string;
  img: string;
};

const LOOKS: Look[] = [
  { id: 'l1', category: 'autunno', name: 'Cappotto Cammello Doppiopetto', price: '\u20ac 890', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200' },
  { id: 'l2', category: 'autunno', name: 'Abito Lana Merino', price: '\u20ac 520', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200' },
  { id: 'l3', category: 'autunno', name: 'Blazer Principe di Galles', price: '\u20ac 640', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200' },
  { id: 'l4', category: 'sposa', name: 'Abito Seta Mikado', price: '\u20ac 3.200', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200' },
  { id: 'l5', category: 'sposa', name: 'Abito Pizzo Chantilly', price: '\u20ac 2.850', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200' },
  { id: 'l6', category: 'sposa', name: 'Veste da Sposo Classica', price: '\u20ac 1.450', img: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1200' },
  { id: 'l7', category: 'sartoria', name: 'Abito Tre Pezzi Fresco Lana', price: '\u20ac 1.680', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200' },
  { id: 'l8', category: 'sartoria', name: 'Giacca Sartoriale Su Misura', price: '\u20ac 980', img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200' },
  { id: 'l9', category: 'sartoria', name: 'Camicia Cotone Egiziano', price: '\u20ac 210', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200' },
];

const CATEGORIES: { id: LookCategory; label: string }[] = [
  { id: 'autunno', label: 'Collezione Autunno' },
  { id: 'sposa', label: 'Sposa' },
  { id: 'sartoria', label: 'Sartoria Uomo' },
];

const SIZE_GUIDE = [
  {
    title: 'Guida alle Taglie',
    icon: Ruler,
    content:
      'Le nostre taglie seguono la vestibilità italiana classica. Consigliamo un appuntamento di misurazione in atelier per la sartoria su misura e per gli abiti da sposa: ogni capo viene poi rifinito con almeno due prove.',
  },
  {
    title: 'Tessuti e Materiali',
    icon: Scissors,
    content:
      'Selezioniamo lane Vitale Barberis Canonico, sete Mikado italiane e cotoni egiziani a fibra lunga. Ogni tessuto viene mostrato in atelier prima della scelta finale, così puoi valutarne peso e caduta dal vivo.',
  },
  {
    title: 'Personalizzazioni',
    icon: Sparkles,
    content:
      'Monogrammi ricamati a mano, fodere a contrasto, bottoni in madreperla o corno naturale: ogni dettaglio sartoriale può essere discusso e definito insieme al nostro maestro sarto durante la prima prova.',
  },
];

function FittingModal({ open, onClose, presetLook }: { open: boolean; onClose: () => void; presetLook?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', notes: '', category: presetLook || 'autunno' });

  React.useEffect(() => {
    if (open) {
      setSubmitted(false);
      setForm((f) => ({ ...f, category: presetLook || f.category }));
    }
  }, [open, presetLook]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2B2825]/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-none p-10 font-body text-[#2B2825] shadow-2xl border border-[#2B2825]/10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[#2B2825]/50 hover:text-[#2B2825]">
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-10 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#A9895E] mb-4">Richiesta Ricevuta</p>
              <h3 className="font-display text-3xl mb-3">A presto in atelier.</h3>
              <p className="text-sm text-[#5B564F]">
                Ti contatteremo entro 24 ore per confermare data e ora della tua prova privata.
              </p>
              <button onClick={onClose} className="mt-8 px-8 py-3 border border-[#2B2825] text-sm hover:bg-[#2B2825] hover:text-[#FAF7F2] transition-colors">
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.25em] text-[#A9895E] mb-3">Appuntamento Privato</p>
              <h3 className="font-display text-3xl mb-7">Prenota una Prova</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5B564F] mb-2">Collezione di interesse</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-transparent border border-[#2B2825]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#2B2825]"
                  >
                    <option value="autunno">Collezione Autunno</option>
                    <option value="sposa">Sposa</option>
                    <option value="sartoria">Sartoria Uomo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5B564F] mb-2">Nome e Cognome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Il tuo nome"
                    className="w-full bg-transparent border border-[#2B2825]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#2B2825] placeholder:text-[#2B2825]/35"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5B564F] mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nome@esempio.it"
                    className="w-full bg-transparent border border-[#2B2825]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#2B2825] placeholder:text-[#2B2825]/35"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5B564F] mb-2">Data preferita</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-transparent border border-[#2B2825]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#2B2825]"
                  />
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!form.name || !form.email}
                  className="w-full mt-2 py-4 bg-[#2B2825] text-[#FAF7F2] text-sm tracking-wide hover:bg-[#443F38] transition-colors disabled:opacity-40"
                >
                  Richiedi Appuntamento
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function FashionPage() {
  const [activeCategory, setActiveCategory] = useState<LookCategory>('autunno');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredLooks = LOOKS.filter((l) => l.category === activeCategory);

  return (
    <div className="bg-[#FAF7F2] text-[#2B2825] min-h-screen font-body">
      <FontImport />

      <header className="fixed top-0 inset-x-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#2B2825]/10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-display text-2xl tracking-widest">SARTORIA VALLE</span>
          <nav className="hidden md:flex items-center gap-9 text-xs uppercase tracking-[0.2em] text-[#5B564F]">
            <a href="#lookbook" className="hover:text-[#2B2825] transition-colors">Lookbook</a>
            <a href="#guida" className="hover:text-[#2B2825] transition-colors">Guida</a>
            <a href="#atelier" className="hover:text-[#2B2825] transition-colors">Atelier</a>
          </nav>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs uppercase tracking-[0.2em] px-6 py-3 border border-[#2B2825] hover:bg-[#2B2825] hover:text-[#FAF7F2] transition-colors"
          >
            Prenota una Prova
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A9895E] mb-5">Made in Italy — Dal 1987</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.08] mb-6">
              Ogni cucitura racconta chi la indossa.
            </h1>
            <p className="text-[#5B564F] leading-relaxed max-w-md mb-9">
              Atelier di alta sartoria a Firenze: abiti su misura, collezioni sposa e capi pronti,
              realizzati a mano con tessuti selezionati direttamente dai lanifici italiani.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#2B2825] text-[#FAF7F2] text-sm tracking-wide hover:bg-[#443F38] transition-colors"
              >
                Prenota una Prova <ArrowRight size={15} />
              </button>
              <a href="#lookbook" className="flex items-center gap-2 px-7 py-3.5 border border-[#2B2825]/30 text-sm tracking-wide hover:border-[#2B2825] transition-colors">
                Sfoglia il Lookbook
              </a>
            </div>
          </div>
          <div className="relative h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1200"
              alt="Sartoria"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#2B2825] text-[#FAF7F2] px-6 py-5 hidden sm:block">
              <p className="font-display text-3xl">37</p>
              <p className="text-[10px] uppercase tracking-widest text-[#C9BCA6] mt-1">Anni di Sartoria</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section id="lookbook" className="px-6 py-24 border-t border-[#2B2825]/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A9895E] mb-4">Lookbook</p>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <h2 className="font-display text-4xl md:text-5xl">Le collezioni</h2>
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
                    activeCategory === c.id
                      ? 'bg-[#2B2825] text-[#FAF7F2] border-[#2B2825]'
                      : 'border-[#2B2825]/25 text-[#5B564F] hover:border-[#2B2825]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredLooks.map((look) => (
                <motion.div
                  key={look.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="group cursor-pointer"
                  onClick={() => setModalOpen(true)}
                >
                  <div className="overflow-hidden aspect-[3/4] mb-4">
                    <img
                      src={look.img}
                      alt={look.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg">{look.name}</h3>
                      <p className="text-xs text-[#5B564F] mt-1">{look.price}</p>
                    </div>
                    <ChevronRight size={16} className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* SIZE & FABRIC GUIDE */}
      <section id="guida" className="px-6 py-24 border-t border-[#2B2825]/10 bg-[#F1ECE2]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A9895E] mb-4">Sapere Prima di Scegliere</p>
          <h2 className="font-display text-4xl md:text-5xl mb-12">Guida a taglie e tessuti</h2>

          <div className="divide-y divide-[#2B2825]/15">
            {SIZE_GUIDE.map((item, i) => (
              <div key={item.title}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className="flex items-center gap-4">
                    <item.icon size={18} className="text-[#A9895E]" />
                    <span className="font-display text-xl">{item.title}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${openAccordion === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm text-[#5B564F] leading-relaxed max-w-xl">{item.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER / CTA */}
      <section id="atelier" className="px-6 py-24 border-t border-[#2B2825]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200"
            alt="Atelier"
            className="w-full h-[420px] object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A9895E] mb-4">L{'\u2019'}Atelier</p>
            <h2 className="font-display text-4xl mb-6">Firenze, Via de{'\u2019'} Tornabuoni</h2>
            <p className="text-[#5B564F] leading-relaxed mb-8 max-w-md">
              Ogni prova avviene su appuntamento nel nostro atelier storico, dove tre generazioni di sarti
              hanno vestito clienti da tutto il mondo. Portiamo pazienza, precisione e un occhio per ciò
              che davvero valorizza chi lo indossa.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3.5 bg-[#2B2825] text-[#FAF7F2] text-sm tracking-wide hover:bg-[#443F38] transition-colors"
            >
              Prenota una Prova <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-[#2B2825]/10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto text-xs text-[#5B564F]">
        <span>© {new Date().getFullYear()} Sartoria Valle — Firenze, Italia</span>
        <span className="flex items-center gap-2"><AtSign size={14} /> sartoriavalle</span>
      </footer>

      <FittingModal open={modalOpen} onClose={() => setModalOpen(false)} presetLook={activeCategory} />
    </div>
  );
}
