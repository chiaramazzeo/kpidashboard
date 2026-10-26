import type { Driver, IndexKpi } from '../data/types'
import { delta, formatScore } from './format'

type Area = { label: string; rate: number }

function fmtDelta(d: number) {
  const decimals = Math.abs(d) % 1 === 0 ? 0 : 1
  if (d > 0) return `+${formatScore(d, decimals)}`
  return formatScore(d, decimals)
}

export function responseInsight(areas: Area[]): string {
  if (areas.length === 0) return 'Nessuna area disponibile.'
  const sorted = [...areas].sort((a, b) => b.rate - a.rate)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  if (top.label === bottom.label) {
    return `Partecipazione uniforme: ${top.label} al ${formatScore(top.rate)}%.`
  }
  return `Partecipazione più alta in ${top.label} (${formatScore(top.rate)}%); la più bassa è ${bottom.label} (${formatScore(bottom.rate)}%).`
}

export function declineInsight(
  indices: IndexKpi[],
  previousYear: number,
): string {
  const declining = indices.filter(
    (i) =>
      i.previousScore !== undefined && delta(i.score, i.previousScore) < 0,
  )
  if (declining.length === 0) {
    return `Nessun indice in calo rispetto al ${previousYear}.`
  }
  if (declining.length === 1) {
    const i = declining[0]
    const d = delta(i.score, i.previousScore!)
    return `${i.label} è l’unico indice in calo (${fmtDelta(d)}).`
  }
  const worst = [...declining].sort(
    (a, b) =>
      delta(a.score, a.previousScore!) - delta(b.score, b.previousScore!),
  )[0]
  return `Gli indici in calo sono ${declining.map((i) => i.label).join(', ')}; il più negativo è ${worst.label}.`
}

export function bestImprovementInsight(
  indices: IndexKpi[],
  previousYear: number,
): string | null {
  const withPrev = indices.filter((i) => i.previousScore !== undefined)
  if (withPrev.length === 0) return null
  const best = [...withPrev].sort(
    (a, b) =>
      delta(b.score, b.previousScore!) - delta(a.score, a.previousScore!),
  )[0]
  const d = delta(best.score, best.previousScore!)
  if (d <= 0) {
    return `Nessun indice in crescita rispetto al ${previousYear}.`
  }
  return `Il miglioramento più marcato è ${best.label} (${fmtDelta(d)} vs ${previousYear}).`
}

export function absoluteRankingInsight(indices: IndexKpi[], year: number): string {
  if (indices.length === 0) return `Nessun indice disponibile per il ${year}.`
  const sorted = [...indices].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  if (top.id === bottom.id) {
    return `Nel ${year} l’unico indice misurato è ${top.label} (${formatScore(top.score)}).`
  }
  return `Nel ${year} l’indice più alto è ${top.label} (${formatScore(top.score)}); il più basso è ${bottom.label} (${formatScore(bottom.score)}).`
}

export function evolutionInsights(
  indices: IndexKpi[],
  year: number,
  previousYear?: number,
): string[] {
  if (previousYear === undefined) {
    return [absoluteRankingInsight(indices, year)]
  }
  const out = [declineInsight(indices, previousYear)]
  const best = bestImprovementInsight(indices, previousYear)
  if (best) out.push(best)
  return out
}

function weakestDriver(drivers: Driver[]): Driver | null {
  if (drivers.length === 0) return null
  return [...drivers].sort((a, b) => a.score - b.score)[0]
}

function driverWithExtremeDelta(
  drivers: Driver[],
  prefer: 'up' | 'down',
): { driver: Driver; d: number } | null {
  const withPrev = drivers.filter((d) => d.previousScore !== undefined)
  if (withPrev.length === 0) return null
  const ranked = [...withPrev].sort((a, b) => {
    const da = delta(a.score, a.previousScore!)
    const db = delta(b.score, b.previousScore!)
    return prefer === 'up' ? db - da : da - db
  })
  const driver = ranked[0]
  const d = delta(driver.score, driver.previousScore!)
  if (prefer === 'up' && d <= 0) return null
  if (prefer === 'down' && d >= 0) return null
  return { driver, d }
}

/** Una frase sul driver più debole; con YoY aggiunge crescita o calo più marcato. */
export function indexInsight(
  index: IndexKpi,
  previousYear?: number,
): string {
  const weak = weakestDriver(index.drivers)
  const parts: string[] = []
  if (weak) {
    parts.push(
      `Il driver più debole è ${weak.label} (${formatScore(weak.score)}).`,
    )
  }
  if (previousYear !== undefined) {
    const up = driverWithExtremeDelta(index.drivers, 'up')
    const down = driverWithExtremeDelta(index.drivers, 'down')
    if (up) {
      parts.push(
        `La crescita più forte è ${up.driver.label} (${fmtDelta(up.d)} vs ${previousYear}).`,
      )
    }
    if (down) {
      parts.push(
        `Il calo più marcato è ${down.driver.label} (${fmtDelta(down.d)} vs ${previousYear}).`,
      )
    }
  }
  if (parts.length === 0) {
    return `${index.label}: nessun driver disponibile.`
  }
  return parts.join(' ')
}
