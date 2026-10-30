import type { IndexKpi, SurveyData } from './types'

/**
 * Dati riallineati all’Annex KPI (bozza 23.10.2026) per la baseline 2026.
 * 2027–2028 sono serie demo sintetiche (Livello 2+).
 * Inviti 2026: placeholder espliciti (non noti dalla survey).
 */

/** Definizioni plain-language (il gergo tecnico sta nei tooltip «i»). */
const DEF = {
  response:
    'Quante persone hanno completato la survey rispetto a chi poteva rispondere.',
  engagement:
    'Quanto le persone raccomanderebbero Golmar come luogo di lavoro (promotori meno detrattori).',
  enablement:
    'Quanto ruoli e ambiente di lavoro aiutano le persone a fare bene il proprio lavoro.',
  innovation:
    'Quanto il clima di lavoro favorisce idee e innovazione (direzione chiara e libertà di proporre).',
  trustCentral:
    'Fiducia nel management centrale: comunicazione e trasparenza sulla strategia.',
  trustDirect:
    'Fiducia nei responsabili diretti: competenza, supporto e integrità nella quotidianità.',
} as const

function indexDefs2026(): IndexKpi[] {
  return [
    {
      id: 'engagement',
      label: 'eNPS (Engagement)',
      definition: DEF.engagement,
      scale: 'enps',
      reliability: 'full',
      reliabilityNote: 'Copertura piena come eNPS. Non include Clima/Collaborazione (spostati in Enablement).',
      score: -15,
      target: 10,
      drivers: [
        { label: 'eNPS dipendenti', score: -24 },
        { label: 'eNPS agenti', score: -10 },
      ],
      byPopulation: {
        employees: {
          score: -24,
          respondents: 103,
          drivers: [{ label: 'eNPS', score: -24 }],
        },
        agents: {
          score: -10,
          respondents: 220,
          drivers: [{ label: 'eNPS', score: -10 }],
        },
      },
    },
    {
      id: 'enablement',
      label: 'Performance Enablement Index',
      definition: DEF.enablement,
      scale: 'index0_100',
      reliability: 'good',
      reliabilityNote: 'Performance Enablement Index — blocchi ruoli e ambiente di supporto (Hay Group).',
      score: 64,
      target: 72,
      drivers: [
        { label: 'Organizzazione', score: 65.2, block: 'roles' },
        { label: 'Sviluppo professionale', score: 52.9, block: 'roles' },
        { label: 'Condizioni di lavoro', score: 70.0, block: 'support' },
        { label: 'Clima', score: 66.4, block: 'support' },
        { label: 'Collaborazione', score: 73.4, block: 'support' },
      ],
      byPopulation: {
        employees: {
          score: 64.5,
          respondents: 103,
          drivers: [
            { label: 'Ruoli ottimizzati', score: 59.1, block: 'roles' },
            { label: 'Ambiente di supporto', score: 69.9, block: 'support' },
          ],
        },
        agents: {
          score: 62,
          respondents: 220,
          drivers: [
            { label: 'Back office', score: 60, block: 'support' },
            { label: 'Vicinanza', score: 64, block: 'support' },
          ],
        },
      },
    },
    {
      id: 'innovation',
      label: 'Innovation Index',
      definition: DEF.innovation,
      scale: 'index0_100',
      reliability: 'good',
      reliabilityNote: 'Innovation Index su Vision e Participative safety (TCI).',
      score: 60,
      target: 70,
      drivers: [
        { label: 'Identità e strategia (Vision)', score: 61.5 },
        { label: 'Comunicazione (Participative safety)', score: 59.3 },
      ],
      byPopulation: {
        employees: {
          score: 60.4,
          respondents: 103,
          drivers: [
            { label: 'Identità e strategia', score: 61.5 },
            { label: 'Comunicazione', score: 59.3 },
          ],
        },
        agents: {
          score: 55,
          respondents: 220,
          drivers: [
            { label: 'Identità e strategia (proxy)', score: 55 },
          ],
        },
      },
    },
    {
      id: 'trust-central',
      label: 'Trust in Management — Centrale',
      definition: DEF.trustCentral,
      scale: 'index0_100',
      reliability: 'good',
      reliabilityNote: 'Trust nel management centrale, distinto dai responsabili diretti.',
      score: 58,
      target: 70,
      drivers: [
        { label: 'Comunicazione strategica', score: 57 },
        { label: 'Trasparenza della strategia', score: 59 },
      ],
      byPopulation: {
        employees: {
          score: 58,
          respondents: 103,
          drivers: [
            { label: 'Comunicazione strategica', score: 57 },
            { label: 'Trasparenza', score: 59 },
          ],
        },
        agents: {
          score: 56,
          respondents: 220,
          drivers: [{ label: 'Comunicazione strategica', score: 56 }],
        },
      },
    },
    {
      id: 'trust-direct',
      label: 'Trust in Management — Diretti',
      definition: DEF.trustDirect,
      scale: 'index0_100',
      reliability: 'good',
      reliabilityNote: 'Trust nei responsabili diretti / leadership di prossimità.',
      score: 68,
      target: 75,
      drivers: [
        { label: 'Leadership', score: 69 },
        { label: 'Supporto del responsabile', score: 67 },
      ],
      byPopulation: {
        employees: {
          score: 69,
          respondents: 103,
          drivers: [
            { label: 'Leadership', score: 70 },
            { label: 'Supporto del responsabile', score: 68 },
          ],
        },
        agents: {
          score: 66,
          respondents: 220,
          drivers: [{ label: 'Responsabile d’area', score: 66 }],
        },
      },
    },
  ]
}

const survey2026: SurveyData = {
  meta: {
    title: 'Golmar 2026 KPI',
    company: 'Golmar',
    year: 2026,
    invited: 580,
    respondents: 323,
    invitedIsPlaceholder: true,
    note: 'Baseline Annex KPI 2026.',
  },
  responseRate: {
    value: 56,
    definition: DEF.response,
    reliability: 'good',
    reliabilityNote: 'Response rate AAPOR RR1 sulla baseline 2026.',
    invitedIsPlaceholder: true,
    byArea: [
      { label: 'Dipendenti (totale)', rate: 57, invited: 180, respondents: 103, invitedIsPlaceholder: true },
      { label: 'Agenti (totale)', rate: 55, invited: 400, respondents: 220, invitedIsPlaceholder: true },
    ],
    byPopulation: {
      employees: {
        score: 57,
        respondents: 103,
        invited: 180,
        invitedIsPlaceholder: true,
      },
      agents: {
        score: 55,
        respondents: 220,
        invited: 400,
        invitedIsPlaceholder: true,
      },
    },
  },
  indices: indexDefs2026(),
}

/** 2027 demo: miglioramento progressivo + YoY. */
const survey2027: SurveyData = {
  meta: {
    title: 'Golmar 2027 KPI',
    company: 'Golmar',
    year: 2027,
    previousYear: 2026,
    invited: 600,
    respondents: 360,
    invitedIsPlaceholder: true,
    note: 'Serie demo Livello 2+ (storicizzazione).',
  },
  responseRate: {
    value: 60,
    previousValue: 56,
    definition: DEF.response,
    reliability: 'good',
    reliabilityNote: 'Survey in piattaforma (demo L2): invitati noti in simulazione.',
    invitedIsPlaceholder: true,
    byArea: [
      { label: 'Dipendenti (totale)', rate: 62, invited: 190, respondents: 118, invitedIsPlaceholder: true },
      { label: 'Agenti (totale)', rate: 59, invited: 410, respondents: 242, invitedIsPlaceholder: true },
    ],
    byPopulation: {
      employees: { score: 62, previousScore: 57, respondents: 118, invited: 190, invitedIsPlaceholder: true },
      agents: { score: 59, previousScore: 55, respondents: 242, invited: 400, invitedIsPlaceholder: true },
    },
  },
  indices: [
    {
      ...indexDefs2026()[0],
      score: -8,
      previousScore: -15,
      target: 5,
      drivers: [
        { label: 'eNPS dipendenti', score: -12, previousScore: -24 },
        { label: 'eNPS agenti', score: -4, previousScore: -10 },
      ],
      byPopulation: {
        employees: { score: -12, previousScore: -24, respondents: 118, drivers: [{ label: 'eNPS', score: -12, previousScore: -24 }] },
        agents: { score: -4, previousScore: -10, respondents: 242, drivers: [{ label: 'eNPS', score: -4, previousScore: -10 }] },
      },
    },
    {
      ...indexDefs2026()[1],
      score: 67,
      previousScore: 64,
      target: 74,
      drivers: indexDefs2026()[1].drivers.map((d) => ({
        ...d,
        score: Math.min(100, Number((d.score + 2.5).toFixed(1))),
        previousScore: d.score,
      })),
      byPopulation: {
        employees: {
          score: 67,
          previousScore: 64.5,
          respondents: 118,
          drivers: [
            { label: 'Ruoli ottimizzati', score: 62, previousScore: 59.1, block: 'roles' },
            { label: 'Ambiente di supporto', score: 72, previousScore: 69.9, block: 'support' },
          ],
        },
        agents: {
          score: 65,
          previousScore: 62,
          respondents: 242,
          drivers: [
            { label: 'Back office', score: 63, previousScore: 60, block: 'support' },
            { label: 'Vicinanza', score: 67, previousScore: 64, block: 'support' },
          ],
        },
      },
    },
    {
      ...indexDefs2026()[2],
      score: 64,
      previousScore: 60,
      reliability: 'good',
      reliabilityNote: 'Survey aggiornata (demo L2): copertura TCI ampliata.',
      target: 72,
      drivers: [
        { label: 'Identità e strategia (Vision)', score: 65, previousScore: 61.5 },
        { label: 'Comunicazione (Participative safety)', score: 63, previousScore: 59.3 },
        { label: 'Support for innovation', score: 62 },
        { label: 'Task orientation', score: 66 },
      ],
      byPopulation: {
        employees: {
          score: 64,
          previousScore: 60.4,
          respondents: 118,
          drivers: [
            { label: 'Vision', score: 65, previousScore: 61.5 },
            { label: 'Participative safety', score: 63, previousScore: 59.3 },
          ],
        },
        agents: {
          score: 60,
          previousScore: 55,
          respondents: 242,
          drivers: [{ label: 'Vision (proxy)', score: 60, previousScore: 55 }],
        },
      },
    },
    {
      ...indexDefs2026()[3],
      score: 62,
      previousScore: 58,
      target: 72,
      drivers: [
        { label: 'Comunicazione strategica', score: 61, previousScore: 57 },
        { label: 'Trasparenza della strategia', score: 63, previousScore: 59 },
      ],
      byPopulation: {
        employees: {
          score: 62,
          previousScore: 58,
          respondents: 118,
          drivers: [
            { label: 'Comunicazione strategica', score: 61, previousScore: 57 },
            { label: 'Trasparenza', score: 63, previousScore: 59 },
          ],
        },
        agents: {
          score: 60,
          previousScore: 56,
          respondents: 242,
          drivers: [{ label: 'Comunicazione strategica', score: 60, previousScore: 56 }],
        },
      },
    },
    {
      ...indexDefs2026()[4],
      score: 71,
      previousScore: 68,
      target: 76,
      drivers: [
        { label: 'Leadership', score: 72, previousScore: 69 },
        { label: 'Supporto del responsabile', score: 70, previousScore: 67 },
      ],
      byPopulation: {
        employees: {
          score: 72,
          previousScore: 69,
          respondents: 118,
          drivers: [
            { label: 'Leadership', score: 73, previousScore: 70 },
            { label: 'Supporto', score: 71, previousScore: 68 },
          ],
        },
        agents: {
          score: 69,
          previousScore: 66,
          respondents: 242,
          drivers: [{ label: 'Responsabile d’area', score: 69, previousScore: 66 }],
        },
      },
    },
  ],
}

/** 2028 demo. */
const survey2028: SurveyData = {
  meta: {
    title: 'Golmar 2028 KPI',
    company: 'Golmar',
    year: 2028,
    previousYear: 2027,
    invited: 620,
    respondents: 403,
    invitedIsPlaceholder: true,
    note: 'Serie demo Livello 2+ (storicizzazione).',
  },
  responseRate: {
    value: 65,
    previousValue: 60,
    definition: DEF.response,
    reliability: 'full',
    invitedIsPlaceholder: true,
    byArea: [
      { label: 'Dipendenti (totale)', rate: 68, invited: 200, respondents: 136, invitedIsPlaceholder: true },
      { label: 'Agenti (totale)', rate: 63, invited: 420, respondents: 267, invitedIsPlaceholder: true },
    ],
    byPopulation: {
      employees: { score: 68, previousScore: 62, respondents: 136, invited: 200, invitedIsPlaceholder: true },
      agents: { score: 63, previousScore: 59, respondents: 267, invited: 420, invitedIsPlaceholder: true },
    },
  },
  indices: [
    {
      ...survey2027.indices[0],
      score: 2,
      previousScore: -8,
      target: 15,
      drivers: [
        { label: 'eNPS dipendenti', score: -2, previousScore: -12 },
        { label: 'eNPS agenti', score: 6, previousScore: -4 },
      ],
      byPopulation: {
        employees: { score: -2, previousScore: -12, respondents: 136, drivers: [{ label: 'eNPS', score: -2, previousScore: -12 }] },
        agents: { score: 6, previousScore: -4, respondents: 267, drivers: [{ label: 'eNPS', score: 6, previousScore: -4 }] },
      },
    },
    {
      ...survey2027.indices[1],
      score: 71,
      previousScore: 67,
      target: 76,
      drivers: survey2027.indices[1].drivers.map((d) => ({
        ...d,
        previousScore: d.score,
        score: Math.min(100, Number((d.score + 3).toFixed(1))),
      })),
      byPopulation: {
        employees: {
          score: 71,
          previousScore: 67,
          respondents: 136,
          drivers: [
            { label: 'Ruoli ottimizzati', score: 66, previousScore: 62, block: 'roles' },
            { label: 'Ambiente di supporto', score: 75, previousScore: 72, block: 'support' },
          ],
        },
        agents: {
          score: 69,
          previousScore: 65,
          respondents: 267,
          drivers: [
            { label: 'Back office', score: 67, previousScore: 63, block: 'support' },
            { label: 'Vicinanza', score: 71, previousScore: 67, block: 'support' },
          ],
        },
      },
    },
    {
      ...survey2027.indices[2],
      score: 68,
      previousScore: 64,
      target: 74,
      drivers: survey2027.indices[2].drivers.map((d) => ({
        ...d,
        previousScore: d.score,
        score: Math.min(100, d.score + 3),
      })),
      byPopulation: {
        employees: {
          score: 68,
          previousScore: 64,
          respondents: 136,
          drivers: [
            { label: 'Vision', score: 69, previousScore: 65 },
            { label: 'Participative safety', score: 67, previousScore: 63 },
          ],
        },
        agents: {
          score: 64,
          previousScore: 60,
          respondents: 267,
          drivers: [{ label: 'Vision (proxy)', score: 64, previousScore: 60 }],
        },
      },
    },
    {
      ...survey2027.indices[3],
      score: 66,
      previousScore: 62,
      target: 74,
      drivers: [
        { label: 'Comunicazione strategica', score: 65, previousScore: 61 },
        { label: 'Trasparenza della strategia', score: 67, previousScore: 63 },
      ],
      byPopulation: {
        employees: {
          score: 66,
          previousScore: 62,
          respondents: 136,
          drivers: [
            { label: 'Comunicazione strategica', score: 65, previousScore: 61 },
            { label: 'Trasparenza', score: 67, previousScore: 63 },
          ],
        },
        agents: {
          score: 64,
          previousScore: 60,
          respondents: 267,
          drivers: [{ label: 'Comunicazione strategica', score: 64, previousScore: 60 }],
        },
      },
    },
    {
      ...survey2027.indices[4],
      score: 74,
      previousScore: 71,
      target: 78,
      drivers: [
        { label: 'Leadership', score: 75, previousScore: 72 },
        { label: 'Supporto del responsabile', score: 73, previousScore: 70 },
      ],
      byPopulation: {
        employees: {
          score: 75,
          previousScore: 72,
          respondents: 136,
          drivers: [
            { label: 'Leadership', score: 76, previousScore: 73 },
            { label: 'Supporto', score: 74, previousScore: 71 },
          ],
        },
        agents: {
          score: 72,
          previousScore: 69,
          respondents: 267,
          drivers: [{ label: 'Responsabile d’area', score: 72, previousScore: 69 }],
        },
      },
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

/** Default: baseline reale (L1) o anno più recente in L2+. */
export const surveyData = survey2026

export function evolutionSeries() {
  const years = availableYears
  const ids = survey2026.indices.map((i) => i.id)
  return ids.map((id) => {
    const label = surveysByYear[2028].indices.find((i) => i.id === id)?.label ?? id
    return {
      id,
      label,
      points: years.map((year) => {
        const idx = surveysByYear[year].indices.find((i) => i.id === id)
        return { year, score: idx?.score ?? 0, scale: idx?.scale ?? 'index0_100' }
      }),
    }
  })
}
