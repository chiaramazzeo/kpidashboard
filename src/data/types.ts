export type Reliability = 'full' | 'good' | 'partial' | 'gap'

export type ScoreScale = 'percent' | 'enps' | 'index0_100' | 'count'

export type DemoLevel = 1 | 2 | 3

export type DemoRole = 'admin' | 'user'

export type Driver = {
  label: string
  score: number
  /** Assente se il report non ha confronto YoY (es. 2026). */
  previousScore?: number
  /** Blocco Hay per enablement. */
  block?: 'roles' | 'support'
}

export type PopulationSlice = {
  score: number
  previousScore?: number
  respondents?: number
  invited?: number
  /** true = invitati demo / stima, non dato survey. */
  invitedIsPlaceholder?: boolean
  drivers?: Driver[]
}

export type IndexKpi = {
  id: string
  /** Nome ufficiale — mai abbreviare in UI. */
  label: string
  definition: string
  scale: ScoreScale
  reliability: Reliability
  reliabilityNote?: string
  /** Vista totale (aggregato). */
  score: number
  previousScore?: number
  target: number
  drivers: Driver[]
  byPopulation: {
    employees: PopulationSlice
    agents: PopulationSlice
  }
}

export type ResponseRate = {
  value: number
  previousValue?: number
  definition: string
  reliability: Reliability
  reliabilityNote?: string
  invitedIsPlaceholder?: boolean
  byArea: {
    label: string
    rate: number
    invited: number
    respondents: number
    invitedIsPlaceholder?: boolean
  }[]
  byPopulation: {
    employees: PopulationSlice
    agents: PopulationSlice
  }
}

export type SurveyData = {
  meta: {
    title: string
    company: string
    year: number
    /** Se assente, UI senza confronti vs anno precedente (es. 2026). */
    previousYear?: number
    invited: number
    respondents: number
    invitedIsPlaceholder?: boolean
    note: string
  }
  responseRate: ResponseRate
  indices: IndexKpi[]
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
}

export type SurveyQuestion = {
  id: string
  text: string
  kpiId?: string
  scale: 'likert4' | 'enps' | 'yesno'
}

export type DemoSurvey = {
  id: string
  title: string
  year: number
  status: 'draft' | 'open' | 'closed'
  questions: SurveyQuestion[]
}
