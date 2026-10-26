export function formatScore(n: number, decimals = 0) {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
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
