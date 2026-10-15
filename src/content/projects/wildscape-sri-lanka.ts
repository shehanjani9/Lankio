import type { Project } from './types';

// Facts verified against the live site (www.wildscapesrilanka.com) on 2026-10-15.
// The site's own name is "Wildscape Sri Lanka" (singular), used here as-is.
// page structure, tour categories, enquiry flow, and Next.js/Vercel headers.
export const wildscapeSriLanka: Project = {
  slug: 'wildscape-sri-lanka',
  status: 'published',
  classification: 'professional',
  order: 10,
  featured: true,

  title: 'Wildscape Sri Lanka',
  categories: ['web'],
  discipline: {
    en: 'Web design · Development · Tourism',
    it: 'Web design · Sviluppo · Turismo',
  },

  summary: {
    en: 'A calm, image-led website for a Sri Lankan wildlife tour operator, built to help travellers picture the journey and start planning it.',
    it: 'Un sito sobrio e guidato dalle immagini per un tour operator naturalistico dello Sri Lanka, pensato per aiutare i viaggiatori a immaginare il viaggio e a iniziare a pianificarlo.',
  },
  description: {
    en: [
      "Wildscape Sri Lanka plans tailor-made trips around the island's wildlife: leopard and elephant safaris, birdwatching, cultural journeys and adventure travel.",
      "The website turns that offer into a few clear paths. Four tour categories, the company story, a gallery and a blog of field guides all lead to one conversation, “Plan your trip”, rather than a rigid booking checkout.",
    ],
    it: [
      "Wildscape Sri Lanka organizza viaggi su misura dedicati alla fauna dell'isola: safari tra leopardi ed elefanti, birdwatching, itinerari culturali e viaggi d'avventura.",
      "Il sito traduce questa offerta in pochi percorsi chiari. Quattro categorie di tour, la storia dell'azienda, una galleria e un blog di guide pratiche conducono tutti a un'unica conversazione, «Plan your trip», anziché a un checkout di prenotazione rigido.",
    ],
  },
  role: {
    en: ['Web design', 'UX and content structure', 'Front-end development', 'Responsive implementation'],
    it: ['Web design', 'UX e struttura dei contenuti', 'Sviluppo front-end', 'Implementazione responsive'],
  },
  technologies: ['Next.js', 'React', 'Vercel'],
  highlights: {
    en: [
      {
        title: 'Wildlife first',
        body: 'Full-bleed photography and an editorial serif type system put the landscapes and animals ahead of interface chrome.',
      },
      {
        title: 'Four clear journeys',
        body: 'Wildlife, Cultural & Heritage, Adventure and Bird Watching tours each have a dedicated page, one step from the main navigation.',
      },
      {
        title: 'Planning, not checkout',
        body: "Tailor-made trips don't fit a shopping cart, so every page leads to a trip-planning enquiry or a WhatsApp conversation.",
      },
      {
        title: 'Content that builds trust',
        body: 'Field-guide articles, a gallery, guest testimonials and an FAQ answer the questions travellers ask before they get in touch.',
      },
    ],
    it: [
      {
        title: 'Prima la natura',
        body: "Fotografie a tutto schermo e una tipografia editoriale con grazie mettono paesaggi e animali in primo piano rispetto all'interfaccia.",
      },
      {
        title: 'Quattro percorsi chiari',
        body: 'I tour naturalistici, culturali, d’avventura e di birdwatching hanno ciascuno una pagina dedicata, a un clic dal menu principale.',
      },
      {
        title: 'Pianificare, non acquistare',
        body: 'Un viaggio su misura non si mette nel carrello: ogni pagina porta a una richiesta di pianificazione o a una conversazione su WhatsApp.',
      },
      {
        title: 'Contenuti che creano fiducia',
        body: 'Articoli di approfondimento, galleria, testimonianze degli ospiti e FAQ rispondono alle domande che i viaggiatori si pongono prima di scrivere.',
      },
    ],
  },
  approach: {
    en: [
      "Start from the traveller's questions (where, when, what will I see) and let the page structure answer them in that order.",
      'Keep the palette natural and restrained so the photography carries the emotion.',
      'Design the mobile layouts alongside desktop rather than after it.',
    ],
    it: [
      'Partire dalle domande del viaggiatore (dove, quando, cosa vedrò) e lasciare che la struttura delle pagine risponda in quest’ordine.',
      'Mantenere una palette naturale e misurata, affidando l’emozione alla fotografia.',
      'Progettare le versioni mobile insieme a quelle desktop, non dopo.',
    ],
  },

  tint: '#1f4a37',
  cover: {
    src: '/projects/wildscape-sri-lanka/cover.jpg',
    width: 1600,
    height: 1000,
    frame: 'desktop',
    alt: {
      en: 'Wildscape Sri Lanka home page: a leopard resting on a tree branch beneath the headline “Encounter Sri Lanka’s Wild Side”.',
      it: 'Home page di Wildscape Sri Lanka: un leopardo su un ramo sotto il titolo «Encounter Sri Lanka’s Wild Side».',
    },
  },
  gallery: [
    {
      src: '/projects/wildscape-sri-lanka/desktop-2.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: 'Signature tour categories: wildlife, cultural and heritage, and adventure tours shown as photographic cards.',
        it: 'Categorie di tour: naturalistici, culturali e d’avventura presentati come schede fotografiche.',
      },
    },
    {
      src: '/projects/wildscape-sri-lanka/desktop-3.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: '“Why travel with Wildscape” section with four editorial value statements, followed by a wildlife photograph.',
        it: 'Sezione «Why travel with Wildscape» con quattro punti di valore, seguita da una fotografia naturalistica.',
      },
    },
    {
      src: '/projects/wildscape-sri-lanka/mobile.jpg',
      width: 780,
      height: 1688,
      frame: 'mobile',
      alt: {
        en: 'Wildscape Sri Lanka home page on a phone.',
        it: 'Home page di Wildscape Sri Lanka su smartphone.',
      },
    },
  ],

  liveUrl: 'https://www.wildscapesrilanka.com/',
};
