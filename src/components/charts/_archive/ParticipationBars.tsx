import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import { yearBgClass } from '../../utils/yearColors'

type Item = {
  label: string
  rate: number
}

type Props = {
  items: Item[]
  indexLabel: string
  year: number
}

export function ParticipationBars({ items, indexLabel, year }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)

  return (
    <div className="grid gap-4" ref={ref}>
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 font-mono text-xs text-ink-soft">
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 border border-ink ${yearBgClass(year)}`}
          />
          Ha risposto
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 border border-ink bg-bg-warm" />
          Non ha risposto
        </li>
      </ul>
      {items.map((item) => {
        const tip = `${indexLabel} / ${item.label}: ${formatScore(item.rate)}%`
        return (
          <div className="grid gap-1" key={item.label}>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="font-mono text-sm">{formatScore(item.rate)}%</span>
            </div>
            <div
              className="group relative flex h-4 overflow-hidden border border-ink"
              role="img"
              aria-label={tip}
              title={tip}
            >
              <div
                className={`hbar-fill h-full border-r border-ink ${yearBgClass(year)}${inView ? ' is-visible' : ''}`}
                style={{ width: `${item.rate}%` }}
              />
              <div className="h-full flex-1 bg-bg-warm" />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-max max-w-64 -translate-x-1/2 bg-ink p-2 font-mono text-xs whitespace-nowrap text-white group-hover:block">
                {tip}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
