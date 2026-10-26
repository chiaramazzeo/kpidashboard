/** REVIEW: barre blu (#80a7ff) + verdi; nessun bordo destro sul fill */
import { useInView } from '../../hooks/useCountUp'
import { deltaLabel, formatScore } from '../../utils/format'

type Item = {
  label: string
  current: number
  previous: number
}

type Props = {
  items: Item[]
  currentLabel: string
  previousLabel: string
}

export function YoYBars({ items, currentLabel, previousLabel }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref}>
      <ul className="mb-4 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-mono text-xs text-ink-soft">
        <li>
          <span className="mr-[6px] inline-block h-3 w-3 border border-series-stroke bg-series-a align-[-1px]" />
          {currentLabel}
        </li>
        <li>
          <span className="mr-[6px] inline-block h-3 w-3 border border-series-stroke bg-series-c align-[-1px]" />
          {previousLabel}
        </li>
      </ul>
      <div className="grid gap-[14px]">
        {items.map((item) => {
          const tone =
            item.current > item.previous
              ? 'text-delta-up'
              : item.current < item.previous
                ? 'text-negative'
                : 'text-muted'
          return (
            <div key={item.label} className="grid gap-1">
              <div className="grid grid-cols-[minmax(8rem,11rem)_1fr_auto] items-center gap-3 max-sm:grid-cols-1 max-sm:gap-1">
                <span className="text-[14.5px] text-ink-soft">{item.label}</span>
                <div className="relative grid gap-[3px] overflow-hidden border border-series-stroke bg-bg-warm p-[3px]">
                  <div
                    className={`hbar-fill h-[9px]${inView ? ' is-visible' : ''}`}
                    style={{
                      width: `${item.previous}%`,
                      background: 'var(--color-series-c)',
                    }}
                  />
                  <div
                    className={`hbar-fill h-[9px]${inView ? ' is-visible' : ''}`}
                    style={{
                      width: `${item.current}%`,
                      background: 'var(--color-series-a)',
                    }}
                  />
                </div>
                <span className="min-w-10 text-right font-mono text-[13px]">
                  {formatScore(item.current)}
                  <br />
                  <span className={tone}>{deltaLabel(item.current, item.previous)}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
