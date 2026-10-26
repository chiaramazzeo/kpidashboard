import { formatScore } from '../../utils/format'
import { yearCssVar } from '../../utils/yearColors'

type Props = {
  previousLabel: string
  currentLabel: string
  previous: number
  current: number
  previousYear: number
  year: number
  max?: number
}

/**
 * Testo in HTML (text-xs / text-sm) — non scala con la larghezza.
 * Solo la linea riempie lo spazio; altezza fissa così non diventa un “cartellone”.
 */
export function SlopeChart({
  previousLabel,
  currentLabel,
  previous,
  current,
  previousYear,
  year,
  max = 100,
}: Props) {
  const yPct = (v: number) =>
    `${Math.min(100, Math.max(0, (1 - v / max) * 100))}%`
  const up = current >= previous
  const prevColor = yearCssVar(previousYear)
  const curColor = yearCssVar(year)
  const lineStroke = up ? curColor : 'var(--color-accent)'
  const tip = `${previousLabel}: ${formatScore(previous)} → ${currentLabel}: ${formatScore(current)}`

  return (
    <div className="w-full" role="img" aria-label={`Trend annuale. ${tip}`}>
      <div className="mb-2 flex justify-between gap-4 font-mono text-xs text-muted">
        <span>{previousLabel}</span>
        <span>{currentLabel}</span>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-2">
        <div className="relative min-w-8">
          <span
            className="absolute right-0 -translate-y-1/2 font-mono text-sm tabular-nums text-ink"
            style={{ top: yPct(previous) }}
          >
            {formatScore(previous)}
          </span>
        </div>

        <div className="relative min-h-32 w-full">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1="0"
              y1={(1 - previous / max) * 100}
              x2="100"
              y2={(1 - current / max) * 100}
              stroke={lineStroke}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            className="absolute left-0 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink"
            style={{ top: yPct(previous), background: prevColor }}
            aria-hidden
          />
          <span
            className="absolute right-0 z-10 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border border-ink"
            style={{
              top: yPct(current),
              background: up ? curColor : 'var(--color-accent)',
            }}
            aria-hidden
          />
        </div>

        <div className="relative min-w-8">
          <span
            className="absolute left-0 -translate-y-1/2 font-mono text-sm tabular-nums text-ink"
            style={{ top: yPct(current) }}
          >
            {formatScore(current)}
          </span>
        </div>
      </div>
    </div>
  )
}
