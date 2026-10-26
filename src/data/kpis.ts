import type { SurveyData } from './types'

/**
 * Nomi e definizioni fedeli a «KPI richiesti.docx»:
 * Response Rate, Engagement Index, Performance Enablement Index,
 * Innovation Index, Trust in Management Index.
 * Non usare abbreviazioni (Enablement, Trust, …) in UI o export.
 */

const survey2028: SurveyData = {
  meta: {
    title: 'Golmar 2028 KPI',
    company: 'Golmar',
    year: 2028,
    previousYear: 2027,
    invited: 420,
    respondents: 336,
    note: 'Dati illustrativi a scopo dimostrativo. Sostituire i valori in src/data/kpis.ts con i risultati reali della survey.',
  },
  responseRate: {
    value: 80,
    previousValue: 72,
    definition:
      'Percentuale di partecipazione alla survey (numero rispondenti sul totale degli invitati).',
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
      definition:
        "Livello di coinvolgimento e appartenenza all'azienda (soddisfazione nel lavorare in Golmar, propensione a raccomandare l'azienda, ecc.).",
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
      definition:
        "Percezione del supporto fornito dall'azienda nel raggiungimento dei risultati (strumenti di lavoro, formazione, supporto manageriale, ecc.).",
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
      definition:
        "Percezione della capacità dell'azienda di innovare e adattarsi al mercato (nuovi prodotti, canali di vendita, processi, ecc.).",
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
      definition:
        'Livello di fiducia nei confronti del management e delle strategie aziendali (comunicazione, capacità di guida del cambiamento, credibilità delle iniziative, ecc.).',
      score: 70,
      previousScore: 73,
      target: 75,
      drivers: [
        { label: 'Comunicazione', score: 72, previousScore: 74 },
        { label: 'Capacità di guida del cambiamento', score: 66, previousScore: 71 },
        { label: 'Credibilità delle iniziative', score: 72, previousScore: 74 },
      ],
    },
  ],
}

/** 2026: solo valori assoluti, senza confronto YoY. */
const survey2026: SurveyData = {
  meta: {
    title: 'Golmar 2026 KPI',
    company: 'Golmar',
    year: 2026,
    invited: 400,
    respondents: 272,
    note: 'Dati illustrativi a scopo dimostrativo. Sostituire i valori in src/data/kpis.ts con i risultati reali della survey.',
  },
  responseRate: {
    value: 68,
    definition:
      'Percentuale di partecipazione alla survey (numero rispondenti sul totale degli invitati).',
    byArea: [
      { label: 'HQ / Corporate', rate: 78, invited: 86, respondents: 67 },
      { label: 'Vendite', rate: 66, invited: 116, respondents: 77 },
      { label: 'Operations', rate: 70, invited: 106, respondents: 74 },
      { label: 'R&D / Prodotto', rate: 74, invited: 56, respondents: 41 },
      { label: 'Supporto', rate: 54, invited: 36, respondents: 19 },
    ],
  },
  indices: [
    {
      id: 'engagement',
      label: 'Engagement Index',
      definition:
        "Livello di coinvolgimento e appartenenza all'azienda (soddisfazione nel lavorare in Golmar, propensione a raccomandare l'azienda, ecc.).",
      score: 65,
      target: 72,
      drivers: [
        { label: 'Soddisfazione in Golmar', score: 67 },
        { label: 'Propensione a raccomandare', score: 62 },
        { label: 'Senso di appartenenza', score: 66 },
      ],
    },
    {
      id: 'enablement',
      label: 'Performance Enablement Index',
      definition:
        "Percezione del supporto fornito dall'azienda nel raggiungimento dei risultati (strumenti di lavoro, formazione, supporto manageriale, ecc.).",
      score: 61,
      target: 70,
      drivers: [
        { label: 'Strumenti di lavoro', score: 64 },
        { label: 'Formazione', score: 55 },
        { label: 'Supporto manageriale', score: 63 },
      ],
    },
    {
      id: 'innovation',
      label: 'Innovation Index',
      definition:
        "Percezione della capacità dell'azienda di innovare e adattarsi al mercato (nuovi prodotti, canali di vendita, processi, ecc.).",
      score: 55,
      target: 65,
      drivers: [
        { label: 'Nuovi prodotti', score: 57 },
        { label: 'Canali di vendita', score: 52 },
        { label: 'Processi interni', score: 56 },
      ],
    },
    {
      id: 'trust',
      label: 'Trust in Management Index',
      definition:
        'Livello di fiducia nei confronti del management e delle strategie aziendali (comunicazione, capacità di guida del cambiamento, credibilità delle iniziative, ecc.).',
      score: 70,
      target: 75,
      drivers: [
        { label: 'Comunicazione', score: 71 },
        { label: 'Capacità di guida del cambiamento', score: 68 },
        { label: 'Credibilità delle iniziative', score: 71 },
      ],
    },
  ],
}

/** 2027: score = previous del 2028; confronti vs 2026 illustrativi. */
const survey2027: SurveyData = {
  meta: {
    title: 'Golmar 2027 KPI',
    company: 'Golmar',
    year: 2027,
    previousYear: 2026,
    invited: 410,
    respondents: 295,
    note: 'Dati illustrativi a scopo dimostrativo. Sostituire i valori in src/data/kpis.ts con i risultati reali della survey.',
  },
  responseRate: {
    value: 72,
    previousValue: 68,
    definition:
      'Percentuale di partecipazione alla survey (numero rispondenti sul totale degli invitati).',
    byArea: [
      { label: 'HQ / Corporate', rate: 82, invited: 88, respondents: 72 },
      { label: 'Vendite', rate: 70, invited: 118, respondents: 83 },
      { label: 'Operations', rate: 74, invited: 108, respondents: 80 },
      { label: 'R&D / Prodotto', rate: 78, invited: 58, respondents: 45 },
      { label: 'Supporto', rate: 58, invited: 38, respondents: 22 },
    ],
  },
  indices: [
    {
      id: 'engagement',
      label: 'Engagement Index',
      definition:
        "Livello di coinvolgimento e appartenenza all'azienda (soddisfazione nel lavorare in Golmar, propensione a raccomandare l'azienda, ecc.).",
      score: 69,
      previousScore: 65,
      target: 75,
      drivers: [
        { label: 'Soddisfazione in Golmar', score: 71, previousScore: 67 },
        { label: 'Propensione a raccomandare', score: 66, previousScore: 62 },
        { label: 'Senso di appartenenza', score: 70, previousScore: 66 },
      ],
    },
    {
      id: 'enablement',
      label: 'Performance Enablement Index',
      definition:
        "Percezione del supporto fornito dall'azienda nel raggiungimento dei risultati (strumenti di lavoro, formazione, supporto manageriale, ecc.).",
      score: 64,
      previousScore: 61,
      target: 72,
      drivers: [
        { label: 'Strumenti di lavoro', score: 68, previousScore: 64 },
        { label: 'Formazione', score: 58, previousScore: 55 },
        { label: 'Supporto manageriale', score: 66, previousScore: 63 },
      ],
    },
    {
      id: 'innovation',
      label: 'Innovation Index',
      definition:
        "Percezione della capacità dell'azienda di innovare e adattarsi al mercato (nuovi prodotti, canali di vendita, processi, ecc.).",
      score: 58,
      previousScore: 55,
      target: 68,
      drivers: [
        { label: 'Nuovi prodotti', score: 60, previousScore: 57 },
        { label: 'Canali di vendita', score: 55, previousScore: 52 },
        { label: 'Processi interni', score: 59, previousScore: 56 },
      ],
    },
    {
      id: 'trust',
      label: 'Trust in Management Index',
      definition:
        'Livello di fiducia nei confronti del management e delle strategie aziendali (comunicazione, capacità di guida del cambiamento, credibilità delle iniziative, ecc.).',
      score: 73,
      previousScore: 70,
      target: 75,
      drivers: [
        { label: 'Comunicazione', score: 74, previousScore: 71 },
        { label: 'Capacità di guida del cambiamento', score: 71, previousScore: 68 },
        { label: 'Credibilità delle iniziative', score: 74, previousScore: 71 },
      ],
    },
  ],
}

export const availableYears = [2026, 2027, 2028] as const
export type AvailableYear = (typeof availableYears)[number]

export const surveysByYear: Record<AvailableYear, SurveyData> = {
  2026: survey2026,
  2027: survey2027,
  2028: survey2028,
}

/** Default: anno più recente. */
export const surveyData = survey2028
