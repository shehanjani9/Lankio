'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Dumbbell,
  Timer,
  Users,
  X,
  Check,
  ArrowRight,
  Zap,
  Activity,
} from 'lucide-react';

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Archivo Black', sans-serif; font-style: italic; }
    .font-body { font-family: 'Inter', sans-serif; }
    .neon-green { color: #39FF88; }
    .neon-cyan { color: #22D3EE; }
    .glow-green { box-shadow: 0 0 24px rgba(57,255,136,0.25); }
  `}</style>
);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type ClassType = 'HIIT' | 'Yoga' | 'Crossfit' | 'Personal Training';
const TYPES: ClassType[] = ['HIIT', 'Yoga', 'Crossfit', 'Personal Training'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Session = { id: string; day: string; type: ClassType; time: string; coach: string; spots: number };

const SESSIONS: Session[] = [
  { id: 's1', day: 'Mon', type: 'HIIT', time: '06:30', coach: 'Coach Rico', spots: 4 },
  { id: 's2', day: 'Mon', type: 'Yoga', time: '18:00', coach: 'Coach Amara', spots: 8 },
  { id: 's3', day: 'Tue', type: 'Crossfit', time: '07:00', coach: 'Coach Dario', spots: 2 },
  { id: 's4', day: 'Tue', type: 'Personal Training', time: '19:00', coach: 'Coach Rico', spots: 1 },
  { id: 's5', day: 'Wed', type: 'HIIT', time: '18:30', coach: 'Coach Amara', spots: 6 },
  { id: 's6', day: 'Wed', type: 'Yoga', time: '07:30', coach: 'Coach Lena', spots: 10 },
  { id: 's7', day: 'Thu', type: 'Crossfit', time: '18:00', coach: 'Coach Dario', spots: 3 },
  { id: 's8', day: 'Fri', type: 'HIIT', time: '06:30', coach: 'Coach Rico', spots: 5 },
  { id: 's9', day: 'Fri', type: 'Personal Training', time: '17:00', coach: 'Coach Lena', spots: 1 },
  { id: 's10', day: 'Sat', type: 'Crossfit', time: '09:00', coach: 'Coach Dario', spots: 7 },
  { id: 's11', day: 'Sat', type: 'Yoga', time: '10:30', coach: 'Coach Amara', spots: 9 },
  { id: 's12', day: 'Sun', type: 'HIIT', time: '09:30', coach: 'Coach Rico', spots: 6 },
];

const TYPE_COLOR: Record<ClassType, string> = {
  HIIT: '#39FF88',
  Yoga: '#22D3EE',
  Crossfit: '#39FF88',
  'Personal Training': '#22D3EE',
};

const TIME_SLOTS = ['06:30 AM', '09:00 AM', '12:00 PM', '05:00 PM', '06:30 PM', '07:30 PM'];

export default function FitnessPage() {
  const [dayFilter, setDayFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<ClassType | 'All'>('All');

  // BMI / calorie calculator
  const [weight, setWeight] = useState(75); // kg
  const [height, setHeight] = useState(175); // cm
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.375); // multiplier

  const [trialOpen, setTrialOpen] = useState(false);
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [trialForm, setTrialForm] = useState({ name: '', email: '', slot: TIME_SLOTS[0] });

  const filteredSessions = useMemo(() => {
    return SESSIONS.filter((s) => (dayFilter === 'All' || s.day === dayFilter) && (typeFilter === 'All' || s.type === typeFilter));
  }, [dayFilter, typeFilter]);

  const bmi = useMemo(() => {
    const h = height / 100;
    return weight / (h * h);
  }, [weight, height]);

  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Above range' : 'High range';

  const bmr = useMemo(() => {
    // Mifflin-St Jeor
    return sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  }, [weight, height, age, sex]);

  const calories = Math.round(bmr * activity);

  const submitTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialSubmitted(true);
  };

  return (
    <div className="min-h-screen font-body" style={{ background: '#0B0E11', color: '#F5F7F6' }}>
      <FontImport />

      {/* Nav */}
      <header className="border-b" style={{ borderColor: '#39FF8822' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="neon-green" />
            <span className="font-display text-lg not-italic">FORZA</span>
          </div>
          <button
            onClick={() => { setTrialSubmitted(false); setTrialOpen(true); }}
            className="rounded-full px-5 py-2.5 text-sm font-semibold glow-green"
            style={{ background: '#39FF88', color: '#0B0E11' }}
          >
            Claim Free Trial
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600"
          alt="Athlete training"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0B0E1130 0%, #0B0E11 95%)' }} />
        <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 neon-cyan">Milano · Open 24/7</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl mb-6 not-italic">
            <span className="italic">Train</span> like the clock is always running out.
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => { setTrialSubmitted(false); setTrialOpen(true); }}
              className="rounded-full px-7 py-3.5 text-sm font-bold flex items-center gap-2 glow-green"
              style={{ background: '#39FF88', color: '#0B0E11' }}
            >
              Claim Your Free 1-Day Pass <ArrowRight size={16} />
            </button>
            <span className="text-sm opacity-60">HIIT · Yoga · Crossfit · 1-on-1 coaching</span>
          </div>
        </div>
      </section>

      {/* Class schedule */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl md:text-3xl mb-8 not-italic">
          <span className="italic">This week's</span> schedule.
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDayFilter('All')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={dayFilter === 'All' ? { background: '#F5F7F6', color: '#0B0E11' } : { background: '#F5F7F60D', color: '#F5F7F699' }}
          >
            All Days
          </button>
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={dayFilter === d ? { background: '#F5F7F6', color: '#0B0E11' } : { background: '#F5F7F60D', color: '#F5F7F699' }}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setTypeFilter('All')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={typeFilter === 'All' ? { borderColor: '#39FF88', color: '#39FF88' } : { borderColor: '#F5F7F633', color: '#F5F7F699' }}
          >
            All Types
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={typeFilter === t ? { borderColor: TYPE_COLOR[t], color: TYPE_COLOR[t] } : { borderColor: '#F5F7F633', color: '#F5F7F699' }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {filteredSessions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: '#F5F7F60A', border: `1px solid ${TYPE_COLOR[s.type]}33` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: `${TYPE_COLOR[s.type]}1A` }}>
                  {s.type === 'Yoga' ? <Activity size={18} style={{ color: TYPE_COLOR[s.type] }} /> : <Dumbbell size={18} style={{ color: TYPE_COLOR[s.type] }} />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.type} <span className="opacity-40 font-normal">· {s.day} {s.time}</span></p>
                  <p className="text-xs opacity-50">{s.coach}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-50 flex items-center gap-1 justify-end"><Users size={11} /> {s.spots} spots</p>
              </div>
            </motion.div>
          ))}
          {filteredSessions.length === 0 && (
            <p className="col-span-full text-center opacity-40 py-12">No sessions match these filters.</p>
          )}
        </div>
      </section>

      {/* BMI / Calorie Calculator */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: '#39FF8822' }}>
        <h2 className="font-display text-2xl md:text-3xl mb-8 not-italic">
          <span className="italic">Know your</span> numbers.
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: '#F5F7F60A', border: '1px solid #F5F7F61A' }}>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="opacity-70">Weight</span>
                <span className="font-semibold">{weight} kg</span>
              </div>
              <input type="range" min={40} max={150} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-[#39FF88]" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="opacity-70">Height</span>
                <span className="font-semibold">{height} cm</span>
              </div>
              <input type="range" min={140} max={210} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-[#39FF88]" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="opacity-70">Age</span>
                <span className="font-semibold">{age}</span>
              </div>
              <input type="range" min={16} max={80} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-[#39FF88]" />
            </div>
            <div className="flex gap-3">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className="flex-1 py-2 rounded-lg text-sm capitalize transition-colors"
                  style={sex === s ? { background: '#39FF88', color: '#0B0E11' } : { background: '#F5F7F60D', color: '#F5F7F699' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1.5">Activity level</p>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: '#0B0E11', border: '1px solid #F5F7F61A' }}
              >
                <option value={1.2}>Sedentary (little/no exercise)</option>
                <option value={1.375}>Light exercise (1–3 days/wk)</option>
                <option value={1.55}>Moderate exercise (3–5 days/wk)</option>
                <option value={1.725}>Heavy exercise (6–7 days/wk)</option>
                <option value={1.9}>Athlete (2x/day training)</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl p-6 flex flex-col justify-center gap-6" style={{ background: '#F5F7F60A', border: '1px solid #F5F7F61A' }}>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-2 flex items-center gap-1.5"><Activity size={13} /> Body Mass Index</p>
              <p className="font-display text-4xl not-italic neon-green">{bmi.toFixed(1)}</p>
              <p className="text-sm opacity-60 mt-1">{bmiLabel}</p>
            </div>
            <div className="h-px" style={{ background: '#F5F7F61A' }} />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-2 flex items-center gap-1.5"><Flame size={13} /> Estimated daily calories</p>
              <p className="font-display text-4xl not-italic neon-cyan">{calories.toLocaleString()} <span className="text-lg opacity-50 font-body">kcal</span></p>
              <p className="text-sm opacity-60 mt-1">To maintain your current weight at this activity level.</p>
            </div>
            <p className="text-[11px] opacity-40 leading-relaxed">
              Estimate only — based on the Mifflin-St Jeor formula. Not a substitute for medical or nutritional advice.
            </p>
          </div>
        </div>
      </section>

      {/* Trial pass modal */}
      <AnimatePresence>
        {trialOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: '#000000cc' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="rounded-2xl w-full max-w-sm"
              style={{ background: '#12161A', border: '1px solid #39FF8833' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#39FF8822' }}>
                <h3 className="font-display text-lg not-italic flex items-center gap-2">
                  <Timer size={18} className="neon-green" /> Free Trial Pass
                </h3>
                <button onClick={() => setTrialOpen(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              {trialSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#39FF8822' }}>
                    <Check size={22} className="neon-green" />
                  </div>
                  <h4 className="font-display text-lg not-italic mb-2">Pass reserved</h4>
                  <p className="text-sm opacity-60 mb-6">
                    Show this confirmation at the front desk for your {trialForm.slot} session — bring shoes and water.
                  </p>
                  <button onClick={() => setTrialOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: '#39FF88', color: '#0B0E11' }}>
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submitTrial} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Name</label>
                    <input
                      required
                      value={trialForm.name}
                      onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#0B0E11', border: '1px solid #F5F7F61A' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Email</label>
                    <input
                      required
                      type="email"
                      value={trialForm.email}
                      onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })}
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ background: '#0B0E11', border: '1px solid #F5F7F61A' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-50 block mb-1.5">Preferred time slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setTrialForm({ ...trialForm, slot })}
                          className="py-2 rounded-lg text-xs font-medium transition-colors"
                          style={trialForm.slot === slot ? { background: '#39FF88', color: '#0B0E11' } : { background: '#F5F7F60D', color: '#F5F7F699' }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full rounded-full py-3 text-sm font-bold glow-green" style={{ background: '#39FF88', color: '#0B0E11' }}>
                    Claim My Free Pass
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
