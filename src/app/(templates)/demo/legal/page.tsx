'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Building2,
  Plane,
  Home,
  Users,
  X,
  ChevronDown,
  ShieldCheck,
  Award,
  ArrowRight,
  Check,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap');
    .font-display { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'Source Sans 3', sans-serif; }
  `}</style>
);

type Practice = {
  id: string;
  name: string;
  icon: React.ElementType;
  summary: string;
  details: string[];
};

const PRACTICES: Practice[] = [
  {
    id: 'corporate',
    name: 'Corporate Law',
    icon: Building2,
    summary: 'Formation, contracts, M&A, and governance for growing companies.',
    details: ['Entity formation & structuring', 'Commercial contract drafting', 'Mergers & acquisitions', 'Corporate governance advisory'],
  },
  {
    id: 'immigration',
    name: 'Immigration & Visas',
    icon: Plane,
    summary: 'Work permits, residency, and citizenship pathways handled end to end.',
    details: ['Work & investor visas', 'Family reunification', 'Permanent residency applications', 'Citizenship by residence'],
  },
  {
    id: 'realestate',
    name: 'Real Estate Law',
    icon: Home,
    summary: 'Property transactions, leases, and disputes for buyers and landlords.',
    details: ['Purchase & sale due diligence', 'Commercial lease negotiation', 'Title and zoning review', 'Landlord-tenant disputes'],
  },
  {
    id: 'family',
    name: 'Family & Civil Law',
    icon: Users,
    summary: 'Measured, discreet counsel through separation, custody, and estates.',
    details: ['Divorce & separation', 'Child custody arrangements', 'Wills & estate planning', 'Civil litigation'],
  },
];

const CHECKLIST = [
  { id: 'c1', q: 'What documents should I bring to a first consultation?', a: 'Government ID, any contracts or correspondence related to your matter, and a written timeline of events if the case has been ongoing.' },
  { id: 'c2', q: 'How is the initial case review priced?', a: 'The first 30-minute review is complimentary. Beyond that, we quote either a fixed fee or hourly rate depending on the practice area.' },
  { id: 'c3', q: 'How long until I hear back after requesting a consultation?', a: 'A member of the team responds within one business day to schedule a call or in-person meeting.' },
  { id: 'c4', q: 'Do you handle cases outside Italy?', a: 'Immigration and corporate matters are handled for clients relocating to or investing in Italy from abroad, in English or Italian.' },
];

const ATTORNEYS = ['No preference', 'Avv. Marco Bellini — Corporate', 'Avv. Elena Rossi — Immigration', 'Avv. Giulia Conti — Real Estate', 'Avv. Paolo Ferraro — Family Law'];

export default function LegalPage() {
  const [activePractice, setActivePractice] = useState<string>(PRACTICES[0].id);
  const [openChecklist, setOpenChecklist] = useState<string | null>('c1');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', practice: PRACTICES[0].id, attorney: ATTORNEYS[0], description: '' });

  const practice = PRACTICES.find((p) => p.id === activePractice) ?? PRACTICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const openModal = () => {
    setSubmitted(false);
    setForm((f) => ({ ...f, practice: activePractice }));
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen font-body" style={{ background: '#0B1B33', color: '#F2EFE6' }}>
      <FontImport />

      {/* Nav */}
      <header className="border-b" style={{ borderColor: '#C9A24B33' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl">
            <Scale size={20} style={{ color: '#C9A24B' }} />
            Bellini &amp; Associati
          </div>
          <button onClick={openModal} className="rounded-sm px-5 py-2.5 text-sm font-medium" style={{ background: '#C9A24B', color: '#0B1B33' }}>
            Book a Consultation
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="uppercase tracking-[0.3em] text-xs mb-5" style={{ color: '#C9A24B' }}>
          Studio Legale · Milano
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.15] max-w-3xl mx-auto mb-6">
          Measured legal counsel for the decisions that matter most.
        </h1>
        <p className="opacity-60 max-w-xl mx-auto mb-8">
          Four practice areas, one point of contact. We take on a limited number of matters at a
          time so every client gets a partner's direct attention.
        </p>
        <div className="flex items-center justify-center gap-8 text-xs opacity-60">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} style={{ color: '#C9A24B' }} /> Ordine degli Avvocati di Milano</span>
          <span className="flex items-center gap-1.5"><Award size={14} style={{ color: '#C9A24B' }} /> 20+ years combined practice</span>
        </div>
      </section>

      {/* Practice area selector */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          {PRACTICES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePractice(p.id)}
              className="text-left p-4 rounded-lg border transition-colors"
              style={{
                borderColor: activePractice === p.id ? '#C9A24B' : '#F2EFE61A',
                background: activePractice === p.id ? '#C9A24B14' : 'transparent',
              }}
            >
              <p.icon size={18} style={{ color: '#C9A24B' }} className="mb-3" />
              <p className="text-sm font-medium">{p.name}</p>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={practice.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-lg p-8 grid md:grid-cols-2 gap-8"
            style={{ background: '#F2EFE60A', border: '1px solid #F2EFE61A' }}
          >
            <div>
              <h2 className="font-display text-2xl mb-3">{practice.name}</h2>
              <p className="opacity-70 leading-relaxed mb-6">{practice.summary}</p>
              <button onClick={openModal} className="text-sm font-medium flex items-center gap-2" style={{ color: '#C9A24B' }}>
                Discuss a {practice.name.toLowerCase()} matter <ArrowRight size={14} />
              </button>
            </div>
            <ul className="space-y-3">
              {practice.details.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm">
                  <Check size={15} className="mt-0.5 shrink-0" style={{ color: '#C9A24B' }} />
                  <span className="opacity-80">{d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Fee estimator / case review checklist */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t" style={{ borderColor: '#C9A24B33' }}>
        <h2 className="font-display text-3xl mb-8">Before your first call.</h2>
        <div className="space-y-3">
          {CHECKLIST.map((item) => {
            const open = openChecklist === item.id;
            return (
              <div key={item.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid #F2EFE61A' }}>
                <button
                  onClick={() => setOpenChecklist(open ? null : item.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium pr-4">{item.q}</span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#C9A24B' }} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm opacity-60 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Consultation modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: '#050D1acc' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
              style={{ background: '#0F2340', border: '1px solid #C9A24B33' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#C9A24B33' }}>
                <h3 className="font-display text-xl">Book a Consultation</h3>
                <button onClick={() => setModalOpen(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#C9A24B22' }}>
                    <Check size={22} style={{ color: '#C9A24B' }} />
                  </div>
                  <h4 className="font-display text-xl mb-2">Request received</h4>
                  <p className="text-sm opacity-60 mb-6">
                    A member of our team will reach out within one business day to schedule your consultation.
                  </p>
                  <button onClick={() => setModalOpen(false)} className="rounded-sm px-5 py-2.5 text-sm font-medium" style={{ background: '#C9A24B', color: '#0B1B33' }}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Full name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-sm px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#F2EFE60D', border: '1px solid #F2EFE61A' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-sm px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#F2EFE60D', border: '1px solid #F2EFE61A' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Practice area</label>
                    <select
                      value={form.practice}
                      onChange={(e) => setForm({ ...form, practice: e.target.value })}
                      className="w-full rounded-sm px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#0F2340', border: '1px solid #F2EFE61A' }}
                    >
                      {PRACTICES.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Attorney preference</label>
                    <select
                      value={form.attorney}
                      onChange={(e) => setForm({ ...form, attorney: e.target.value })}
                      className="w-full rounded-sm px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#0F2340', border: '1px solid #F2EFE61A' }}
                    >
                      {ATTORNEYS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Briefly describe your case</label>
                    <textarea
                      required
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-sm px-3 py-2.5 text-sm outline-none resize-none"
                      style={{ background: '#F2EFE60D', border: '1px solid #F2EFE61A' }}
                    />
                  </div>
                  <button type="submit" className="w-full rounded-sm py-3 text-sm font-semibold" style={{ background: '#C9A24B', color: '#0B1B33' }}>
                    Request Consultation
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
