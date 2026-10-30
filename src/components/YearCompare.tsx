/**
 * Storicizzazione: grafico a linee (asse X = anni, linea = andamento).
 */
import { formatKpiValue } from '../utils/format'
import type { ScoreScale } from '../data/types'
import type { YearScore } from '../utils/yearCompare'
import { yearCssVar } from '../utils/yearColors'

type Props = {
  items: YearScore[]
  /** Evidenzia l’anno focus sul punto. */
  focusYear?: number
  compact?: boolean
  className?: string
  /** Etichetta accessibile. */
  label?: string
}

export function YearCompare({
  items,
  focusYear,
  compact = false,
  className = '',
  label = 'Andamento negli anni',
}: Props) {
  const sorted = [...items].sort((a, b) => a.year - b.year)
  if (sorted.length === 0) return null

  const scale = sorted[0]?.scale
  const scores = sorted.map((p) => p.score)
  const { minY, maxY } = yDomain(scores, scale)

  const width = compact ? 160 : 320
  const height = compact ? 56 : 112
  const pad = compact
    ? { t: 8, r: 8, b: 18, l: 8 }
    : { t: 12, r: 12, b: 24, l: 36 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const span = maxY - minY || 1

  const xAt = (i: number) =>
    pad.l +
    (sorted.length <= 1 ? innerW / 2 : (i / (sorted.length - 1)) * innerW)
  const yAt = (v: number) => pad.t + ((maxY - v) / span) * innerH

  const path = sorted
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(p.score)}`)
    .join(' ')

  const ticks = yTicks(minY, maxY, scale)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`block h-auto max-w-full ${compact ? 'w-40' : 'w-full max-w-md'} ${className}`}
      role="img"
      aria-label={label}
    >
      {!compact
        ? ticks.map((tick) => {
            const y = yAt(tick)
            return (
              <g key={tick}>
                <line
                  x1={pad.l}
                  x2={width - pad.r}
                  y1={y}
                  y2={y}
                  stroke="var(--color-line)"
                />
                <text
                  x={pad.l - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--color-muted)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {tick}
                </text>
              </g>
            )
          })
        : null}

      {sorted.length === 1 ? null : (
        <path
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={compact ? 1.75 : 2.25}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {sorted.map((p, i) => {
        const focus = focusYear === p.year
        return (
          <g key={p.year}>
            <circle
              cx={xAt(i)}
              cy={yAt(p.score)}
              r={focus ? (compact ? 4.5 : 5.5) : compact ? 3.5 : 4.5}
              fill={yearCssVar(p.year)}
              stroke="var(--color-ink)"
              strokeWidth={focus ? 1.5 : 1}
            />
            <title>
              {p.year}:{' '}
              {formatKpiValue(p.score, p.scale ?? scale ?? 'index0_100')}
            </title>
            <text
              x={xAt(i)}
              y={height - 4}
              textAnchor="middle"
              fill={focus ? 'var(--color-ink)' : 'var(--color-muted)'}
              fontSize={compact ? 8 : 10}
              fontFamily="var(--font-mono)"
              fontWeight={focus ? 700 : 400}
            >
              {p.year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function yDomain(scores: number[], scale?: ScoreScale) {
  if (scale === 'enps') {
    const min = Math.min(-40, ...scores)
    const max = Math.max(40, ...scores)
    return { minY: min, maxY: max }
  }
  if (scale === 'percent' || scale === 'index0_100') {
    const min = Math.min(0, ...scores)
    const max = Math.max(100, ...scores)
    return { minY: min, maxY: max }
  }
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const pad = (max - min) * 0.1 || 1
  return { minY: min - pad, maxY: max + pad }
}

function yTicks(minY: number, maxY: number, scale?: ScoreScale): number[] {
  if (scale === 'enps') {
    return [minY, 0, maxY].filter(
      (v, i, a) => a.indexOf(v) === i && v >= minY && v <= maxY,
    )
  }
  if (scale === 'percent' || scale === 'index0_100') {
    return [0, 50, 100].filter((v) => v >= minY - 0.01 && v <= maxY + 0.01)
  }
  return [minY, maxY]
}
