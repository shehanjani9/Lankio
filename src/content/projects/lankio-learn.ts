import type { Project } from './types';

// Facts verified against the live platform (learn.lankio.it) on 2026-10-15:
// dictionary, A1 lessons, quizzes, flashcards, XP/streak/badge progress,
// optional accounts, premium tier, Next.js (x-powered-by) on Vercel.
// Content counts and prices are intentionally not quoted: they change.
export const lankioLearn: Project = {
  slug: 'lankio-learn',
  status: 'published',
  classification: 'independent',
  order: 20,
  featured: true,

  title: 'Lankio Learn',
  categories: ['apps', 'web'],
  discipline: {
    en: 'EdTech · Web application · UI/UX',
    it: 'EdTech · Web application · UI/UX',
  },

  summary: {
    en: 'A Sinhala-first platform for learning practical Italian, designed for Sri Lankans building a life in Italy.',
    it: 'Una piattaforma in singalese per imparare l’italiano pratico, pensata per chi dallo Sri Lanka costruisce la propria vita in Italia.',
  },
  description: {
    en: [
      'Textbook Italian rarely covers what newcomers actually face: a job interview, a rental contract, an appointment at the comune. Lankio Learn focuses on exactly those situations, with every explanation written in Sinhala.',
      'The platform brings a Sinhala–Italian dictionary, structured lessons, quizzes and flashcards into one learning loop, with progress tracking that gives people a reason to come back. Learners can start without an account, and a premium tier extends the curriculum.',
    ],
    it: [
      'L’italiano dei manuali raramente copre ciò che un nuovo arrivato deve affrontare davvero: un colloquio di lavoro, un contratto d’affitto, una pratica in comune. Lankio Learn si concentra proprio su queste situazioni, con tutte le spiegazioni in singalese.',
      'La piattaforma riunisce in un unico percorso un dizionario singalese–italiano, lezioni strutturate, quiz e flashcard, con un sistema di progressi che invoglia a tornare. Si può iniziare senza account, e un livello premium amplia il programma.',
    ],
  },
  role: {
    en: ['Product concept', 'UX and interface design', 'Full-stack development', 'Content structure'],
    it: ['Concept di prodotto', 'UX e interface design', 'Sviluppo full-stack', 'Struttura dei contenuti'],
  },
  technologies: ['Next.js', 'React', 'Vercel'],
  highlights: {
    en: [
      {
        title: 'Sinhala-first explanations',
        body: 'Lessons, examples and pronunciation notes are explained in Sinhala, so beginners are not learning Italian through a third language.',
      },
      {
        title: 'A connected learning loop',
        body: 'Look up a word, open the lesson it belongs to, practise it in a quiz and keep it in flashcards. Each feature leads into the next.',
      },
      {
        title: 'Built around real life in Italy',
        body: 'Content is organised around everyday situations: work, renting a home, doctors and pharmacies, the post office and the comune.',
      },
      {
        title: 'Motivation built in',
        body: 'XP, streaks and badges give learners a visible sense of progress between sessions.',
      },
    ],
    it: [
      {
        title: 'Spiegazioni in singalese',
        body: 'Lezioni, esempi e note di pronuncia sono spiegati in singalese, così chi inizia non deve passare da una terza lingua.',
      },
      {
        title: 'Un percorso connesso',
        body: 'Si cerca una parola, si apre la lezione a cui appartiene, la si ripassa con un quiz e la si conserva nelle flashcard. Ogni funzione porta alla successiva.',
      },
      {
        title: 'La vita reale in Italia',
        body: 'I contenuti seguono situazioni quotidiane: lavoro, affitto di casa, medico e farmacia, ufficio postale e comune.',
      },
      {
        title: 'Motivazione integrata',
        body: 'Punti XP, serie di giorni consecutivi e badge rendono visibili i progressi tra una sessione e l’altra.',
      },
    ],
  },
  approach: {
    en: [
      'Design for the learner’s real context: short sessions, phone screens and two writing systems on the same page.',
      'Pair Sinhala and Latin scripts carefully so both stay readable side by side.',
      'Let anyone start learning immediately; ask for an account only when it adds value, such as saving progress.',
    ],
    it: [
      'Progettare per il contesto reale di chi impara: sessioni brevi, schermi di smartphone e due alfabeti sulla stessa pagina.',
      'Accostare con cura la scrittura singalese e quella latina, perché restino leggibili fianco a fianco.',
      'Permettere a chiunque di iniziare subito, chiedendo un account solo quando serve, ad esempio per salvare i progressi.',
    ],
  },

  tint: '#16284d',
  cover: {
    src: '/projects/lankio-learn/cover.jpg',
    width: 1600,
    height: 1000,
    frame: 'desktop',
    alt: {
      en: 'Lankio Learn home page with the headline “Learn Italian. Live Confidently in Italy.” and topic chips such as Work, Renting a home and Post office.',
      it: 'Home page di Lankio Learn con il titolo «Learn Italian. Live Confidently in Italy.» e argomenti come lavoro, affitto e ufficio postale.',
    },
  },
  gallery: [
    {
      src: '/projects/lankio-learn/dictionary.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: 'Italian–Sinhala dictionary with a search bar and word cards showing translation, pronunciation, an example sentence and listen/save actions.',
        it: 'Dizionario italiano–singalese con barra di ricerca e schede che mostrano traduzione, pronuncia, frase d’esempio e azioni per ascoltare e salvare.',
      },
    },
    {
      src: '/projects/lankio-learn/lessons.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: 'Lesson index grouped by level, with each A1 lesson showing its Italian title, Sinhala subtitle and XP reward.',
        it: 'Indice delle lezioni per livello: ogni lezione A1 mostra il titolo italiano, il sottotitolo in singalese e i punti XP.',
      },
    },
    {
      src: '/projects/lankio-learn/practice.jpg',
      width: 1600,
      height: 1000,
      frame: 'desktop',
      alt: {
        en: 'Practice page with a flip flashcard for “arrivederci” above a list of lesson quizzes.',
        it: 'Pagina di esercizio con una flashcard per «arrivederci» sopra l’elenco dei quiz delle lezioni.',
      },
    },
    {
      src: '/projects/lankio-learn/mobile.jpg',
      width: 780,
      height: 1688,
      frame: 'mobile',
      alt: {
        en: 'Lankio Learn on a phone, with a bottom tab bar for Home, Learn, Dictionary, Practice and Account.',
        it: 'Lankio Learn su smartphone, con barra di navigazione inferiore: Home, Learn, Dictionary, Practice e Account.',
      },
    },
  ],

  liveUrl: 'https://learn.lankio.it/',
};
