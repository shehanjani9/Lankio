import type { Project } from './types';

// Facts verified against the live app (analyzer.lankio.it) on 2026-10-15:
// supported document types, upload formats and size limit, three output
// languages, the on-page data-handling statement, Next.js on Vercel.
// The AI provider is not named publicly, so it is not named here either.
export const lankioAnalyzer: Project = {
  slug: 'lankio-ai-document-analyzer',
  status: 'published',
  classification: 'independent',
  order: 30,
  featured: true,

  title: 'Lankio AI Document Analyzer',
  categories: ['apps', 'web'],
  discipline: {
    en: 'AI · SaaS · Web application',
    it: 'AI · SaaS · Web application',
  },

  summary: {
    en: 'An AI tool that reads Italian administrative documents (payslips, contracts, residence permits, utility bills) and explains them in Sinhala, English or Tamil.',
    it: 'Uno strumento di intelligenza artificiale che legge i documenti amministrativi italiani (buste paga, contratti, permessi di soggiorno, bollette) e li spiega in singalese, inglese o tamil.',
  },
  description: {
    en: [
      'For many people who move to Italy, paperwork is one of the hardest parts of settling in. A busta paga or a permesso di soggiorno is dense, formal and written entirely in Italian.',
      'Lankio Analyzer lets someone upload a document as a PDF or a photo. It recognises what kind of document it is and returns a full analysis in the language they choose. The whole flow lives on a single screen: pick a language, add a file, read the result.',
    ],
    it: [
      'Per molte persone che si trasferiscono in Italia, la burocrazia è uno degli ostacoli più difficili. Una busta paga o un permesso di soggiorno sono documenti densi, formali e scritti interamente in italiano.',
      'Lankio Analyzer permette di caricare un documento in PDF o in foto, ne riconosce la tipologia e restituisce un’analisi completa nella lingua scelta. L’intero flusso sta in un’unica schermata: si sceglie la lingua, si carica il file, si legge il risultato.',
    ],
  },
  role: {
    en: ['Product concept', 'UX and interface design', 'Full-stack development', 'AI integration'],
    it: ['Concept di prodotto', 'UX e interface design', 'Sviluppo full-stack', 'Integrazione AI'],
  },
  technologies: ['Next.js', 'React', 'Vercel'],
  highlights: {
    en: [
      {
        title: 'Six document types',
        body: 'Recognises payslips (busta paga), CUD tax statements, residence permits, residence certificates, employment contracts and utility bills.',
      },
      {
        title: 'Three output languages',
        body: 'Analyses are returned in Sinhala, English or Tamil, the languages of the community the tool was built for.',
      },
      {
        title: 'Privacy-conscious by design',
        body: 'The interface states plainly that document data is not stored on the server, right where people decide whether to upload.',
      },
      {
        title: 'One screen, three steps',
        body: 'Choose a language, add a PDF, JPG, PNG or WEBP file up to 15 MB, and read the analysis.',
      },
    ],
    it: [
      {
        title: 'Sei tipologie di documento',
        body: 'Riconosce buste paga, CUD, permessi di soggiorno, certificati di residenza, contratti di lavoro e bollette.',
      },
      {
        title: 'Tre lingue di risposta',
        body: 'L’analisi viene restituita in singalese, inglese o tamil, le lingue della comunità per cui lo strumento è nato.',
      },
      {
        title: 'Attenzione alla privacy',
        body: 'L’interfaccia dichiara chiaramente che i dati dei documenti non vengono conservati sul server, proprio nel punto in cui si decide se caricarli.',
      },
      {
        title: 'Una schermata, tre passaggi',
        body: 'Si sceglie la lingua, si carica un file PDF, JPG, PNG o WEBP fino a 15 MB e si legge l’analisi.',
      },
    ],
  },
  approach: {
    en: [
      'Reduce the task to the fewest possible decisions for someone who may be anxious about the document in front of them.',
      'Be explicit about data handling at the moment of upload, where people need the reassurance.',
      'Write the interface in the user’s language first, keeping Italian only for the official document names people will recognise.',
    ],
    it: [
      'Ridurre il compito al minor numero di scelte possibile per chi potrebbe essere in ansia davanti al documento.',
      'Essere espliciti sul trattamento dei dati nel momento del caricamento, quando serve rassicurare.',
      'Scrivere l’interfaccia prima di tutto nella lingua dell’utente, mantenendo in italiano solo i nomi ufficiali dei documenti che le persone riconoscono.',
    ],
  },

  tint: '#0f4a4f',
  cover: {
    src: '/projects/lankio-analyzer/cover.jpg',
    width: 1600,
    height: 1000,
    frame: 'desktop',
    alt: {
      en: 'Lankio Analyzer interface: output-language buttons for Sinhala, English and Tamil above a drag-and-drop upload area for PDF, JPG, PNG and WEBP files.',
      it: 'Interfaccia di Lankio Analyzer: pulsanti per la lingua di risposta (singalese, inglese, tamil) sopra un’area di caricamento per file PDF, JPG, PNG e WEBP.',
    },
  },
  gallery: [
    {
      src: '/projects/lankio-analyzer/mobile.jpg',
      width: 780,
      height: 1688,
      frame: 'mobile',
      alt: {
        en: 'Lankio Analyzer on a phone, with the language selector and upload area stacked vertically.',
        it: 'Lankio Analyzer su smartphone, con selettore della lingua e area di caricamento in verticale.',
      },
    },
  ],

  liveUrl: 'https://analyzer.lankio.it/',
};
