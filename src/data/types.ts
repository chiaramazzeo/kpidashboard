export type Driver = {
  label: string
  score: number
  /** Assente se il report non ha confronto YoY (es. 2026). */
  previousScore?: number
}

export type IndexKpi = {
  id: string
  /** Nome ufficiale dal documento «KPI richiesti» — mai abbreviare in UI. */
  label: string
  definition: string
  score: number
  previousScore?: number
  target: number
  drivers: Driver[]
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
    note: string
  }
  responseRate: {
    value: number
    previousValue?: number
    /** Definizione ufficiale dal documento KPI. */
    definition: string
    byArea: { label: string; rate: number; invited: number; respondents: number }[]
  }
  indices: IndexKpi[]
}
