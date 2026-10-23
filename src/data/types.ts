export type Driver = {
  label: string
  score: number
  previousScore: number
}

export type IndexKpi = {
  id: string
  label: string
  shortLabel: string
  definition: string
  score: number
  previousScore: number
  target: number
  drivers: Driver[]
}

export type SplitItem = {
  label: string
  score: number
  previousScore?: number
}

export type SurveyData = {
  meta: {
    title: string
    company: string
    year: number
    previousYear: number
    invited: number
    respondents: number
    note: string
  }
  responseRate: {
    value: number
    previousValue: number
    byArea: { label: string; rate: number; invited: number; respondents: number }[]
  }
  indices: IndexKpi[]
  splits: {
    engagementByArea: SplitItem[]
    trustBySeniority: SplitItem[]
    enablementByFunction: SplitItem[]
  }
}
