import type { Project } from './types';

// This website. No live link is rendered for it (the visitor is already
// here), which avoids a circular "visit site" loop.
export const lankioDigitalSolutions: Project = {
  slug: 'lankio-digital-solutions',
  status: 'published',
  classification: 'independent',
  order: 40,
  featured: true,

  title: 'Lankio Digital Solutions',
  categories: ['branding', 'web'],
  discipline: {
    en: 'Brand identity · Web development · Creative portfolio',
    it: 'Brand identity · Sviluppo web · Portfolio creativo',
  },

  summary: {
    en: 'The studio’s own identity and website: a bilingual portfolio designed, written and engineered in-house.',
    it: 'L’identità e il sito dello studio: un portfolio bilingue progettato, scritto e sviluppato internamente.',
  },
  description: {
    en: [
      'Lankio is where my design, development and media work comes together, so its website has to show the craft rather than describe it.',
      'The site is a bilingual Next.js application. It has a typed content system for case studies, a motion system that respects reduced-motion preferences, and a project inquiry flow connected to transactional email.',
    ],
    it: [
      'Lankio è il punto d’incontro tra il mio lavoro di design, sviluppo e produzione media: per questo il suo sito deve dimostrare la qualità, non soltanto raccontarla.',
      'Il sito è un’applicazione Next.js bilingue. Include un sistema di contenuti tipizzato per i casi studio, animazioni che rispettano la preferenza per il movimento ridotto e un flusso di richiesta progetto collegato all’invio di email transazionali.',
    ],
  },
  role: {
    en: ['Brand identity', 'Art direction', 'UX and interface design', 'Development'],
    it: ['Brand identity', 'Art direction', 'UX e interface design', 'Sviluppo'],
  },
  technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'next-intl', 'Resend', 'Vercel'],
  highlights: {
    en: [
      {
        title: 'Bilingual by default',
        body: 'Every page, metadata field and form message exists in English and Italian, with localized URLs and hreflang alternates.',
      },
      {
        title: 'Content as data',
        body: 'Case studies are typed content files with publication states, so new work can be added without touching any layout.',
      },
      {
        title: 'Motion with restraint',
        body: 'Reveals, transitions and magnetic interactions are transform-based, skipped on touch screens where they add nothing, and turned off for reduced-motion users.',
      },
      {
        title: 'An inquiry flow that respects people',
        body: 'Labelled fields, inline validation and quiet spam protection, with a confirmation email in the visitor’s own language.',
      },
    ],
    it: [
      {
        title: 'Bilingue per scelta',
        body: 'Ogni pagina, metadato e messaggio del modulo esiste in inglese e in italiano, con URL localizzati e alternative hreflang.',
      },
      {
        title: 'Contenuti come dati',
        body: 'I casi studio sono file di contenuto tipizzati con uno stato di pubblicazione: si aggiungono nuovi lavori senza toccare il layout.',
      },
      {
        title: 'Movimento misurato',
        body: 'Rivelazioni, transizioni e interazioni magnetiche si basano su trasformazioni, vengono omesse sui touch screen dove non aggiungono nulla e si disattivano per chi preferisce ridurre il movimento.',
      },
      {
        title: 'Un contatto rispettoso',
        body: 'Campi etichettati, validazione immediata e protezione antispam discreta, con email di conferma nella lingua del visitatore.',
      },
    ],
  },

  tint: '#2c2470',
  cover: {
    src: '/projects/lankio-digital-solutions/cover.jpg',
    width: 1600,
    height: 1000,
    frame: 'desktop',
    alt: {
      en: 'Lankio Digital Solutions home page: the headline “Designing digital experiences. Building ideas into reality.” beside a portrait of Shehan.',
      it: 'Home page di Lankio Digital Solutions: il titolo «Progetto esperienze digitali. Trasformo le idee in realtà.» accanto al ritratto di Shehan.',
    },
  },
  gallery: [
    {
      src: '/projects/lankio-digital-solutions/desktop-2.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: 'The Selected Work gallery on lankio.it, with large project previews in an editorial layout.',
        it: 'La sezione dei lavori selezionati su lankio.it, con grandi anteprime dei progetti in un layout editoriale.',
      },
    },
    {
      src: '/projects/lankio-digital-solutions/mobile.jpg',
      width: 780,
      height: 1688,
      frame: 'mobile',
      alt: {
        en: 'The lankio.it home page on a phone.',
        it: 'La home page di lankio.it su smartphone.',
      },
    },
  ],
};
