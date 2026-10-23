export function formatScore(n: number, decimals = 0) {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function delta(current: number, previous: number) {
  return Number((current - previous).toFixed(1))
}

export function deltaLabel(current: number, previous: number) {
  const d = delta(current, previous)
  if (d === 0) return 'stabile'
  const sign = d > 0 ? '+' : ''
  return `${sign}${formatScore(d, Math.abs(d) % 1 === 0 ? 0 : 1)}`
}
