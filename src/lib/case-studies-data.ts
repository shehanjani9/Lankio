export type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  problem: string;
  solution: string;
  resultLabel: string;
  resultValue: string;
  accentHue: number;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-01',
    client: 'Trattoria Del Porto',
    industry: 'restaurant',
    problem: 'caseStudies.case01.problem',
    solution: 'caseStudies.case01.solution',
    resultLabel: 'caseStudies.case01.resultLabel',
    resultValue: '+230%',
    accentHue: 20,
  },
  {
    id: 'case-02',
    client: 'Marchetti & Associates',
    industry: 'lawFirm',
    problem: 'caseStudies.case02.problem',
    solution: 'caseStudies.case02.solution',
    resultLabel: 'caseStudies.case02.resultLabel',
    resultValue: '+118%',
    accentHue: 250,
  },
  {
    id: 'case-03',
    client: 'Clarus Dental Studio',
    industry: 'medical',
    problem: 'caseStudies.case03.problem',
    solution: 'caseStudies.case03.solution',
    resultLabel: 'caseStudies.case03.resultLabel',
    resultValue: '+64%',
    accentHue: 200,
  },
];
