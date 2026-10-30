import {
  availableYears,
  surveysByYear,
  type AvailableYear,
} from '../data/kpis'
import type { ScoreScale } from '../data/types'

export type YearScore = {
  year: AvailableYear
  score: number
  scale?: ScoreScale
}

function sortedYears(years: readonly AvailableYear[]): AvailableYear[] {
  return [...years].sort((a, b) => a - b)
}

/** Anni di confronto: focus sempre incluso, ordinati. */
export function effectiveCompareYears(
  compareYears: readonly AvailableYear[],
  focusYear: AvailableYear,
): AvailableYear[] {
  const set = new Set<AvailableYear>(compareYears)
  set.add(focusYear)
  return sortedYears([...set])
}

/** Anno immediatamente precedente al focus tra quelli selezionati. */
export function previousAmong(
  compareYears: readonly AvailableYear[],
  focusYear: AvailableYear,
): AvailableYear | undefined {
  const years = effectiveCompareYears(compareYears, focusYear)
  const i = years.indexOf(focusYear)
  return i > 0 ? years[i - 1] : undefined
}

export function getIndexAcrossYears(
  indexId: string,
  years: readonly AvailableYear[],
): YearScore[] {
  return sortedYears(years as AvailableYear[]).map((year) => {
    const idx = surveysByYear[year].indices.find((i) => i.id === indexId)
    return {
      year,
      score: idx?.score ?? 0,
      scale: idx?.scale,
    }
  })
}

export function getResponseAcrossYears(
  years: readonly AvailableYear[],
): YearScore[] {
  return sortedYears(years as AvailableYear[]).map((year) => ({
    year,
    score: surveysByYear[year].responseRate.value,
    scale: 'percent' as const,
  }))
}

export function getDriversAcrossYears(
  indexId: string,
  years: readonly AvailableYear[],
): { label: string; byYear: YearScore[] }[] {
  const ordered = sortedYears(years as AvailableYear[])
  const labels = new Set<string>()
  for (const year of ordered) {
    const idx = surveysByYear[year].indices.find((i) => i.id === indexId)
    idx?.drivers.forEach((d) => labels.add(d.label))
  }
  return [...labels].map((label) => ({
    label,
    byYear: ordered.map((year) => {
      const idx = surveysByYear[year].indices.find((i) => i.id === indexId)
      const driver = idx?.drivers.find((d) => d.label === label)
      return { year, score: driver?.score ?? 0, scale: idx?.scale }
    }),
  }))
}

export function getPopulationAcrossYears(
  indexId: string | 'response',
  population: 'employees' | 'agents',
  years: readonly AvailableYear[],
): YearScore[] {
  return sortedYears(years as AvailableYear[]).map((year) => {
    if (indexId === 'response') {
      const slice = surveysByYear[year].responseRate.byPopulation[population]
      return { year, score: slice.score, scale: 'percent' as const }
    }
    const idx = surveysByYear[year].indices.find((i) => i.id === indexId)
    const slice = idx?.byPopulation[population]
    return {
      year,
      score: slice?.score ?? 0,
      scale: idx?.scale,
    }
  })
}

export function getResponseAreasAcrossYears(
  years: readonly AvailableYear[],
): { year: AvailableYear; items: { label: string; rate: number }[] }[] {
  return sortedYears(years as AvailableYear[]).map((year) => ({
    year,
    items: surveysByYear[year].responseRate.byArea.map((a) => ({
      label: a.label,
      rate: a.rate,
    })),
  }))
}

export function scoreInYear(
  indexId: string,
  year: AvailableYear,
): number | undefined {
  return surveysByYear[year].indices.find((i) => i.id === indexId)?.score
}

export function responseInYear(year: AvailableYear): number {
  return surveysByYear[year].responseRate.value
}

export { availableYears }
