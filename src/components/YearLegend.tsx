import { yearBgClass, yearBorderClass } from '../utils/yearColors'

type Props = {
  year: number
  previousYear?: number
  /** `paired`: due solidi (dual-bar Evoluzione). Default: corrente solido + precedente dashed. */
  variant?: 'default' | 'paired'
  className?: string
}

export function YearLegend({
  year,
  previousYear,
  variant = 'default',
  className = '',
}: Props) {
  const paired = variant === 'paired'

  return (
    <ul
      className={`m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 font-mono text-xs text-ink-soft${className ? ` ${className}` : ''}`}
    >
      {paired && previousYear !== undefined && (
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 border border-ink ${yearBgClass(previousYear)}`}
          />
          {previousYear}
        </li>
      )}
      <li className="flex items-center gap-2">
        <span
          className={`inline-block h-3 w-3 border border-ink ${yearBgClass(year)}`}
        />
        {year}
      </li>
      {!paired && previousYear !== undefined && (
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-4 w-0 border-l border-dashed ${yearBorderClass(previousYear)}`}
            aria-hidden
          />
          {previousYear}
        </li>
      )}
    </ul>
  )
}
