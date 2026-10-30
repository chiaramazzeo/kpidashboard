/**
 * Chip multi-select anni di confronto (L2+) — filtri globali via DemoContext.
 */
import { availableYears, type AvailableYear } from '../data/kpis'
import { useDemo } from '../context/DemoContext'
import { yearBgClass } from '../utils/yearColors'

type Props = {
  className?: string
}

export function YearFilterChips({ className = '' }: Props) {
  const { compareYears, toggleCompareYear, feature } = useDemo()
  if (!feature('multiYear')) return null

  return (
    <div
      className={`flex shrink-0 items-center gap-2 ${className}`}
      role="group"
      aria-label="Anni nel confronto"
    >
      <span
        className="hidden font-mono text-[0.625rem] uppercase tracking-[0.06em] text-muted sm:inline"
        title="Anni da includere nei confronti e nei grafici; lo score in evidenza dipende dall’anno report in header"
      >
        Anni confronto
      </span>
      <div className="flex h-9 overflow-hidden rounded-sm border border-ink">
      {availableYears.map((y, i) => {
        const on = compareYears.includes(y as AvailableYear)
        const alone = on && compareYears.length <= 1
        return (
          <button
            key={y}
            type="button"
            className={`h-full px-2 font-mono text-[0.6875rem] tabular-nums ${
              i > 0 ? 'border-l border-ink' : ''
            } ${
              on
                ? 'text-ink'
                : 'bg-bg-elevated text-muted hover:bg-bg-warm'
            }`}
            style={
              on
                ? {
                    background: `color-mix(in srgb, var(--color-year-${y}) 35%, white)`,
                  }
                : undefined
            }
            aria-pressed={on}
            disabled={alone}
            title={
              alone
                ? 'Almeno un anno deve restare selezionato'
                : on
                  ? `Escludi ${y} dal confronto`
                  : `Includi ${y} nel confronto`
            }
            onClick={() => toggleCompareYear(y as AvailableYear)}
          >
            <span
              className={`mr-1 inline-block h-1.5 w-1.5 border border-ink ${yearBgClass(y)}`}
              aria-hidden
            />
            {y}
          </button>
        )
      })}
      </div>
    </div>
  )
}
