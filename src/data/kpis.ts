import type { SurveyData } from './types'

/** Dati illustrativi — sostituire con i valori reali della survey. */
export const surveyData: SurveyData = {
  meta: {
    title: 'Golmar 2026 KPI',
    company: 'Golmar',
    year: 2026,
    previousYear: 2025,
    invited: 420,
    respondents: 336,
    note: 'Dati illustrativi a scopo dimostrativo. Sostituire i valori in src/data/kpis.ts con i risultati reali della survey.',
  },
  responseRate: {
    value: 80,
    previousValue: 72,
    byArea: [
      { label: 'HQ / Corporate', rate: 88, invited: 90, respondents: 79 },
      { label: 'Vendite', rate: 76, invited: 120, respondents: 91 },
      { label: 'Operations', rate: 81, invited: 110, respondents: 89 },
      { label: 'R&D / Prodotto', rate: 85, invited: 60, respondents: 51 },
      { label: 'Supporto', rate: 65, invited: 40, respondents: 26 },
    ],
  },
  indices: [
    {
      id: 'engagement',
      label: 'Engagement Index',
      shortLabel: 'Engagement',
      definition:
        'Livello di coinvolgimento e appartenenza all’azienda: soddisfazione nel lavorare in Golmar, propensione a raccomandare l’azienda e senso di appartenenza.',
      score: 74,
      previousScore: 69,
      target: 78,
      drivers: [
        { label: 'Soddisfazione in Golmar', score: 76, previousScore: 71 },
        { label: 'Propensione a raccomandare', score: 71, previousScore: 66 },
        { label: 'Senso di appartenenza', score: 75, previousScore: 70 },
      ],
    },
    {
      id: 'enablement',
      label: 'Performance Enablement Index',
      shortLabel: 'Enablement',
      definition:
        'Percezione del supporto fornito dall’azienda nel raggiungimento dei risultati: strumenti di lavoro, formazione e supporto manageriale.',
      score: 68,
      previousScore: 64,
      target: 75,
      drivers: [
        { label: 'Strumenti di lavoro', score: 72, previousScore: 68 },
        { label: 'Formazione', score: 63, previousScore: 58 },
        { label: 'Supporto manageriale', score: 69, previousScore: 66 },
      ],
    },
    {
      id: 'innovation',
      label: 'Innovation Index',
      shortLabel: 'Innovation',
      definition:
        'Percezione della capacità dell’azienda di innovare e adattarsi al mercato: nuovi prodotti, canali di vendita e processi interni.',
      score: 61,
      previousScore: 58,
      target: 70,
      drivers: [
        { label: 'Nuovi prodotti', score: 64, previousScore: 60 },
        { label: 'Canali di vendita', score: 57, previousScore: 55 },
        { label: 'Processi interni', score: 62, previousScore: 59 },
      ],
    },
    {
      id: 'trust',
      label: 'Trust in Management Index',
      shortLabel: 'Trust',
      definition:
        'Livello di fiducia nei confronti del management e delle strategie aziendali: comunicazione, capacità di guida del cambiamento e credibilità delle iniziative.',
      score: 70,
      previousScore: 73,
      target: 75,
      drivers: [
        { label: 'Comunicazione', score: 72, previousScore: 74 },
        { label: 'Guida al cambiamento', score: 66, previousScore: 71 },
        { label: 'Credibilità delle iniziative', score: 72, previousScore: 74 },
      ],
    },
  ],
  splits: {
    engagementByArea: [
      { label: 'HQ / Corporate', score: 79, previousScore: 74 },
      { label: 'Vendite', score: 71, previousScore: 67 },
      { label: 'Operations', score: 73, previousScore: 70 },
      { label: 'R&D / Prodotto', score: 78, previousScore: 72 },
      { label: 'Supporto', score: 66, previousScore: 63 },
    ],
    trustBySeniority: [
      { label: 'Leadership', score: 82, previousScore: 84 },
      { label: 'Middle management', score: 71, previousScore: 75 },
      { label: 'Individual contributor', score: 66, previousScore: 69 },
      { label: 'Junior / early career', score: 68, previousScore: 70 },
    ],
    enablementByFunction: [
      { label: 'Vendite', score: 65, previousScore: 61 },
      { label: 'Operations', score: 70, previousScore: 66 },
      { label: 'Prodotto / R&D', score: 73, previousScore: 69 },
      { label: 'Funzioni di staff', score: 67, previousScore: 63 },
    ],
  },
}
