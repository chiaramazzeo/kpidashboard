import { useInView } from '../../hooks/useCountUp'
import { deltaLabel, formatScore } from '../../utils/format'
import { yearBgClass, yearBorderClass, yearTextClass } from '../../utils/yearColors'

type Props = {
  label: string
  indexLabel: string
  value: number
  previousValue?: number
  year?: number
  previousYear?: number
  max?: number
  /** Nasconde riga label/valore (utile se già mostrati fuori). */
  showHeader?: boolean
}

function tooltipText(
  indexLabel: string,
  label: string,
  value: number,
  year: number,
  previousValue?: number,
  previousYear?: number,
) {
  const parts = [indexLabel, label, `${year}: ${formatScore(value)}`]
  if (previousValue !== undefined && previousYear !== undefined) {
    parts.push(`${previousYear}: ${formatScore(previousValue)}`)
    parts.push(`Δ ${deltaLabel(value, previousValue)}`)
  }
  return parts.join(' / ')
}

export function ScoreBar({
  label,
  indexLabel,
  value,
  previousValue,
  year = 2028,
  previousYear,
  max = 100,
  showHeader = true,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const showPrev =
    previousValue !== undefined && previousYear !== undefined
  const prevPct = showPrev
    ? Math.min(100, Math.max(0, (previousValue / max) * 100))
    : undefined
  const tip = tooltipText(
    indexLabel,
    label,
    value,
    year,
    showPrev ? previousValue : undefined,
    showPrev ? previousYear : undefined,
  )

  return (
    <div className="grid gap-1" ref={ref}>
      {showHeader && (
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-ink-soft">{label}</span>
          <span className="shrink-0 font-mono text-sm text-ink">
            {formatScore(value)}
          </span>
        </div>
      )}
      <div className={`relative${showPrev ? ' pt-4' : ''}`}>
        {showPrev && prevPct !== undefined && previousYear !== undefined && (
          <span
            className={`pointer-events-none absolute top-0 z-10 -translate-x-1/2 font-mono text-xs leading-none ${yearTextClass(previousYear)}`}
            style={{ left: `${prevPct}%` }}
            aria-hidden
          >
            {previousYear}
          </span>
        )}
        <div
          className="group relative h-4 border border-ink bg-bg-warm"
          role="img"
          aria-label={tip}
          title={tip}
        >
          <div
            className={`hbar-fill absolute inset-y-0 left-0 ${yearBgClass(year)}${inView ? ' is-visible' : ''}`}
            style={{ width: `${pct}%` }}
          />
          {showPrev && prevPct !== undefined && previousYear !== undefined && (
            <span
              className={`pointer-events-none absolute top-[-2px] bottom-[-2px] z-10 w-0 -translate-x-1/2 border-l border-dashed ${yearBorderClass(previousYear)}`}
              style={{ left: `${prevPct}%` }}
              aria-hidden
              title={`${previousYear}: ${formatScore(previousValue!)}`}
            />
          )}
          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-max max-w-64 -translate-x-1/2 bg-ink p-2 font-mono text-xs whitespace-nowrap text-white group-hover:block group-focus-within:block">
            {tip}
          </span>
        </div>
      </div>
    </div>
  )
}
