import type { DemoLevel } from './types'

export type LevelTheme = {
  level: DemoLevel
  label: string
  short: string
  bg: string
  bgWarm: string
  accent: string
  accentSoft: string
  description: string
}

export const LEVEL_THEMES: Record<DemoLevel, LevelTheme> = {
  1: {
    level: 1,
    label: 'Proposta L1 — Report baseline 2026',
    short: 'Proposta L1',
    bg: '#fbfbf9',
    bgWarm: '#f3f1ef',
    accent: '#e10600',
    accentSoft: '#ffe0de',
    description:
      'Pacchetto commerciale (non un livello aziendale): report KPI baseline 2026 ed export.',
  },
  2: {
    level: 2,
    label: 'Proposta L2 — Autonomia operativa',
    short: 'Proposta L2',
    bg: '#f3f6ff',
    bgWarm: '#e8eefc',
    accent: '#4a6fd6',
    accentSoft: '#d4e0ff',
    description:
      'Pacchetto commerciale: survey in piattaforma, storico multi-anno e chat.',
  },
  3: {
    level: 3,
    label: 'Proposta L3 — Adattività dei KPI',
    short: 'Proposta L3',
    bg: '#fff6f5',
    bgWarm: '#ffe8e6',
    accent: '#e10600',
    accentSoft: '#ffd0cd',
    description:
      'Pacchetto commerciale: gestione KPI e generazione questionario.',
  },
}

/** Feature flags: un livello include tutto ciò che ha minLevel <= current. */
export const FEATURES = {
  baselineScorecard: 1,
  csvImport: 1,
  export: 1,
  expandDrilldown: 1,
  multiYear: 2,
  evolutionChart: 2,
  surveyAdmin: 2,
  chat: 2,
  kpiCrud: 3,
} as const

export type FeatureKey = keyof typeof FEATURES

export function hasFeature(level: DemoLevel, feature: FeatureKey) {
  return level >= FEATURES[feature]
}

export function isFeatureNew(level: DemoLevel, feature: FeatureKey) {
  return FEATURES[feature] === level
}
