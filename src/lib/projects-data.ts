export interface Project {
  id: string;
  name: string;
  categoryKey: string;
  techStack: string[];
  liveUrl: string;
  image: string;
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'wildscape',
    name: 'Wildscape Sri Lanka',
    categoryKey: 'tourism',
    techStack: ['WordPress', 'Elementor', 'Tailwind CSS'],
    liveUrl: 'https://wildscapesrilanka.com',
    image: '/portfolio/wildscape.png', // public/portfolio/wildscape.jpg එකට Image එක දාන්න
  },
  {
    id: 'demo-template-1',
    name: 'Modern Corporate Business',
    categoryKey: 'business',
    techStack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://lankio.it/demo/portfolio', // හෝ ඔයාගේ Live Template Hub URL එක
    image: '/portfolio/template-1.png',
  },
  {
    id: 'demo-template-2',
    name: 'Luxury Villa & Resort',
    categoryKey: 'hospitality',
    techStack: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://www.lankio.it/demo/restaurant', // හෝ ඔයාගේ Live Template Hub URL එක
    image: '/portfolio/template-2.png',
  },
];