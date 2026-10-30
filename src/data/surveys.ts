import type { DemoSurvey } from './types'

export const INITIAL_SURVEYS: DemoSurvey[] = [
  {
    id: 'baseline-2026',
    title: 'Survey engagement Golmar 2026 (archivio)',
    year: 2026,
    status: 'closed',
    questions: [
      {
        id: 'q1',
        text: 'Su una scala 0–10, quanto raccomanderesti Golmar come luogo di lavoro?',
        kpiId: 'engagement',
        scale: 'enps',
      },
      {
        id: 'q2',
        text: 'Ho gli strumenti e le risorse per lavorare efficacemente.',
        kpiId: 'enablement',
        scale: 'likert4',
      },
      {
        id: 'q3',
        text: 'La direzione comunica in modo chiaro la strategia.',
        kpiId: 'trust-central',
        scale: 'likert4',
      },
    ],
  },
  {
    id: 'wave-2027',
    title: 'Rilevazione 2027 — bozza KPI-aligned',
    year: 2027,
    status: 'open',
    questions: [
      {
        id: 'q1',
        text: 'Su una scala 0–10, quanto raccomanderesti Golmar come luogo di lavoro?',
        kpiId: 'engagement',
        scale: 'enps',
      },
      {
        id: 'q2',
        text: 'Il mio ruolo valorizza le mie competenze.',
        kpiId: 'enablement',
        scale: 'likert4',
      },
      {
        id: 'q3',
        text: 'L’ambiente di lavoro facilita la produttività.',
        kpiId: 'enablement',
        scale: 'likert4',
      },
      {
        id: 'q4',
        text: 'Nel team c’è supporto all’innovazione.',
        kpiId: 'innovation',
        scale: 'likert4',
      },
      {
        id: 'q5',
        text: 'Mi fido del management centrale.',
        kpiId: 'trust-central',
        scale: 'likert4',
      },
      {
        id: 'q6',
        text: 'Mi fido del mio responsabile diretto.',
        kpiId: 'trust-direct',
        scale: 'likert4',
      },
    ],
  },
]
