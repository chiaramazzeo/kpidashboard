import type { ScoreScale } from '../data/types'

export function formatScore(n: number, decimals = 0) {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Unità / scala accanto al numero (breve). Indici 0–100: niente label — usare `n/100` in formatKpiValue. */
export function scaleUnitLabel(scale: ScoreScale): string {
  if (scale === 'enps') return 'eNPS'
  if (scale === 'percent') return '%'
  return ''
}

/** Cosa misura il numero (etichetta leggibile sotto/accanto allo score). */
export function scaleCaption(scale: ScoreScale): string {
  if (scale === 'enps') return 'eNPS (−100…+100), non una %'
  if (scale === 'index0_100') return 'punteggio indice 0–100 (non una % di persone)'
  if (scale === 'percent') return 'percentuale'
  if (scale === 'count') return 'conteggio'
  return ''
}

export function formatKpiValue(n: number, scale: ScoreScale) {
  if (scale === 'enps') {
    const sign = n > 0 ? '+' : ''
    return `${sign}${formatScore(n, Number.isInteger(n) ? 0 : 1)} eNPS`
  }
  if (scale === 'percent') return `${formatScore(n)}%`
  if (scale === 'count') return formatScore(n)
  if (scale === 'index0_100') {
    return `${formatScore(n, Number.isInteger(n) ? 0 : 1)}/100`
  }
  return formatScore(n, Number.isInteger(n) ? 0 : 1)
}

export function delta(current: number, previous: number) {
  return Number((current - previous).toFixed(1))
}

/** Es. ▲ +4 / ▼ -3 / — stabile. Mai solo colore. */
export function deltaLabel(current: number, previous: number) {
  const d = delta(current, previous)
  if (d === 0) return '— stabile'
  const decimals = Math.abs(d) % 1 === 0 ? 0 : 1
  if (d > 0) return `▲ +${formatScore(d, decimals)}`
  return `▼ ${formatScore(d, decimals)}`
}

export function deltaToneClass(current: number, previous: number) {
  const d = delta(current, previous)
  if (d > 0) return 'text-positive'
  if (d < 0) return 'text-negative'
  return 'text-muted'
}
