import type { Project } from './types';

/**
 * Unpublished, self-initiated creative projects.
 *
 * These are templates for work in progress. They are never rendered,
 * listed in the sitemap or given metadata while `status` is 'draft'.
 *
 * To publish one:
 *   1. Add the real, finished assets under /public/projects/<slug>/
 *      (cover.jpg 1600x1000 or similar, gallery images, video + poster).
 *   2. Fill in `cover`, `gallery` and/or `videos` with true dimensions and
 *      alt text in both languages.
 *   3. Review every sentence: describe what was actually made, nothing more.
 *   4. Change `status` to 'published'. The build validator will refuse to
 *      publish a project without a cover or with incomplete alt text.
 *
 * Attribution: classification 'concept' renders as "Creative concept" /
 * "Concept creativo" on the project page. Never present these as client
 * commissions.
 */
export const draftProjects: Project[] = [
  {
    slug: 'luxury-hotel-digital-experience',
    status: 'draft',
    classification: 'concept',
    order: 100,
    title: 'Luxury Hotel Digital Experience',
    categories: ['web'],
    discipline: {
      en: 'Website design · Next.js development · Interaction design',
      it: 'Web design · Sviluppo Next.js · Interaction design',
    },
    summary: {
      en: 'A self-initiated concept for a boutique hotel website that sells atmosphere first and rooms second.',
      it: 'Un concept personale per il sito di un boutique hotel che racconta prima l’atmosfera e poi le camere.',
    },
    description: {
      en: ['Write once the concept is complete. Describe the design intent, the structure and the interactions actually built.'],
      it: ['Da scrivere a concept completato. Descrivere intento progettuale, struttura e interazioni effettivamente realizzate.'],
    },
    role: {
      en: ['Concept', 'UI/UX design', 'Next.js development', 'Motion'],
      it: ['Concept', 'UI/UX design', 'Sviluppo Next.js', 'Motion'],
    },
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Motion'],
    notes:
      'An earlier template exists at /demo/hotel but uses Unsplash stock photography. Replace with original or properly licensed, credited imagery before publishing.',
  },
  {
    slug: 'premium-restaurant-web-experience',
    status: 'draft',
    classification: 'concept',
    order: 110,
    title: 'Premium Restaurant Web Experience',
    categories: ['web', 'branding'],
    discipline: {
      en: 'Restaurant branding · Website design · Mobile UX',
      it: 'Branding per la ristorazione · Web design · UX mobile',
    },
    summary: {
      en: 'A self-initiated concept pairing a restaurant identity with a menu-first, mobile-first website.',
      it: 'Un concept personale che unisce l’identità di un ristorante a un sito pensato per il menu e per lo smartphone.',
    },
    description: {
      en: ['Write once complete: identity rationale, menu presentation, reservation flow, motion details.'],
      it: ['Da scrivere a lavoro completato: logica dell’identità, presentazione del menu, flusso di prenotazione, dettagli di motion.'],
    },
    role: {
      en: ['Brand identity', 'Web design', 'Development', 'Motion'],
      it: ['Brand identity', 'Web design', 'Sviluppo', 'Motion'],
    },
    notes: 'An earlier template exists at /demo/restaurant (stock imagery). Same caveat as the hotel concept.',
  },
  {
    slug: 'automotive-creative-campaign',
    status: 'draft',
    classification: 'concept',
    order: 120,
    title: 'Automotive Creative Campaign',
    categories: ['motion', 'branding'],
    discipline: {
      en: 'Advertising design · Creative direction · Motion graphics · Social',
      it: 'Advertising · Direzione creativa · Motion graphics · Social',
    },
    summary: {
      en: 'A self-initiated campaign concept across key visual, motion spots and social formats.',
      it: 'Un concept di campagna personale tra key visual, spot animati e formati social.',
    },
    description: {
      en: ['Write once complete: campaign idea, key visual, formats produced.'],
      it: ['Da scrivere a lavoro completato: idea di campagna, key visual, formati prodotti.'],
    },
    role: {
      en: ['Creative direction', 'Art direction', 'Motion design', 'Social media design'],
      it: ['Direzione creativa', 'Art direction', 'Motion design', 'Social media design'],
    },
    notes: 'Do not use real manufacturer logos or trademarks unless licensed; use an invented brand.',
  },
  {
    slug: 'multi-color-flowers-recruitment-ad',
    status: 'draft',
    classification: 'concept',
    order: 130,
    title: 'Multi Color Flowers — Recruitment Advertisement',
    categories: ['motion'],
    discipline: {
      en: 'Remotion · 2D animation · Motion design · Advertising',
      it: 'Remotion · Animazione 2D · Motion design · Advertising',
    },
    summary: {
      en: 'A 35-second vertical recruitment commercial in Dutch, animated in code with Remotion.',
      it: 'Uno spot di recruiting verticale di 35 secondi in olandese, animato via codice con Remotion.',
    },
    description: {
      en: ['Write once rendered: the brief you set yourself, the story structure, the animation system in Remotion, typography and pacing decisions.'],
      it: ['Da scrivere dopo il render: il brief, la struttura narrativa, il sistema di animazione in Remotion, le scelte di tipografia e ritmo.'],
    },
    role: {
      en: ['Concept and script', '2D animation', 'Motion design', 'Remotion development', 'Editing'],
      it: ['Concept e sceneggiatura', 'Animazione 2D', 'Motion design', 'Sviluppo Remotion', 'Montaggio'],
    },
    technologies: ['Remotion', 'React', 'TypeScript'],
    videos: [
      {
        src: '/projects/multi-color-flowers-recruitment-ad/ad.mp4',
        poster: '/projects/multi-color-flowers-recruitment-ad/poster.jpg',
        aspectRatio: '9:16',
        title: {
          en: 'Multi Color Flowers recruitment advertisement (Dutch)',
          it: 'Spot di recruiting Multi Color Flowers (in olandese)',
        },
        specs: { durationSeconds: 35, width: 1080, height: 1920, fps: 30, frames: 1050, tool: 'Remotion' },
      },
    ],
    notes:
      'Confirm the relationship with Multi Color Flowers before publishing. If the company did not commission or approve the ad, keep the "Creative concept" attribution and add a line making clear it is not an official advertisement. Add Dutch subtitles/English captions as WebVTT for accessibility.',
  },
  {
    slug: 'luxury-product-motion-commercial',
    status: 'draft',
    classification: 'concept',
    order: 140,
    title: 'Luxury Product Motion Commercial',
    categories: ['motion', 'photo-video'],
    discipline: {
      en: 'Motion graphics · Video editing · Product advertising',
      it: 'Motion graphics · Montaggio video · Pubblicità di prodotto',
    },
    summary: {
      en: 'A self-initiated cinematic product spot exploring light, material and pace.',
      it: 'Uno spot di prodotto cinematografico personale, tra luce, materia e ritmo.',
    },
    description: {
      en: ['Write once complete.'],
      it: ['Da scrivere a lavoro completato.'],
    },
    role: {
      en: ['Direction', 'Motion design', 'Editing', 'Colour grading'],
      it: ['Regia', 'Motion design', 'Montaggio', 'Color grading'],
    },
  },
  {
    slug: 'brand-identity-collection',
    status: 'draft',
    classification: 'concept',
    order: 150,
    title: 'Brand Identity Collection',
    categories: ['branding'],
    discipline: {
      en: 'Logo design · Typography · Colour systems · Brand guidelines',
      it: 'Logo design · Tipografia · Sistemi cromatici · Linee guida di marca',
    },
    summary: {
      en: 'A collection of self-initiated identity systems, from mark to guidelines to real-world applications.',
      it: 'Una raccolta di identità visive personali: dal marchio alle linee guida, fino alle applicazioni reali.',
    },
    description: {
      en: ['Write once complete.'],
      it: ['Da scrivere a lavoro completato.'],
    },
    role: {
      en: ['Brand strategy', 'Logo design', 'Visual identity'],
      it: ['Brand strategy', 'Logo design', 'Identità visiva'],
    },
    notes: 'Only include identities created as personal work. Client identities stay confidential.',
  },
  {
    slug: 'social-media-campaign-collection',
    status: 'draft',
    classification: 'concept',
    order: 160,
    title: 'Social Media Campaign Collection',
    categories: ['branding', 'motion'],
    discipline: {
      en: 'Social media design · Marketing creative · Campaign systems',
      it: 'Social media design · Creatività per il marketing · Sistemi di campagna',
    },
    summary: {
      en: 'Self-initiated campaign systems designed to stay consistent across feeds, stories and ads.',
      it: 'Sistemi di campagna personali progettati per restare coerenti tra feed, storie e annunci.',
    },
    description: {
      en: ['Write once complete.'],
      it: ['Da scrivere a lavoro completato.'],
    },
    role: {
      en: ['Art direction', 'Social media design', 'Copywriting'],
      it: ['Art direction', 'Social media design', 'Copywriting'],
    },
  },
  {
    slug: 'cinematic-photography-collection',
    status: 'draft',
    classification: 'independent',
    order: 170,
    title: 'Cinematic Photography Collection',
    categories: ['photo-video'],
    discipline: {
      en: 'Photography · Composition · Colour grading · Visual storytelling',
      it: 'Fotografia · Composizione · Color grading · Visual storytelling',
    },
    summary: {
      en: 'A personal photography series focused on light, composition and colour.',
      it: 'Una serie fotografica personale incentrata su luce, composizione e colore.',
    },
    description: {
      en: ['Write once the series is selected and graded.'],
      it: ['Da scrivere dopo la selezione e la post-produzione della serie.'],
    },
    role: {
      en: ['Photography', 'Colour grading', 'Editing'],
      it: ['Fotografia', 'Color grading', 'Editing'],
    },
    notes: 'Only personal work. Do not include private client or event photography (e.g. weddings) without written consent.',
  },
];
