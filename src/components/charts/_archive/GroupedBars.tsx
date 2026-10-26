import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import { yearBgClass, yearCssVar } from '../../utils/yearColors'

type Item = {
  label: string
  current: number
  previous: number
}

type Props = {
  items: Item[]
  currentLabel: string
  previousLabel: string
  year: number
  previousYear: number
  max?: number
}

export function GroupedBars({
  items,
  currentLabel,
  previousLabel,
  year,
  previousYear,
  max = 100,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref}>
      <ul className="mb-4 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-mono text-xs text-ink-soft">
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 border border-ink ${yearBgClass(year)}`}
          />
          {currentLabel}
        </li>
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 border border-ink ${yearBgClass(previousYear)}`}
          />
          {previousLabel}
        </li>
      </ul>
      <div className="grid gap-[18px]">
        {items.map((item) => (
          <div className="grid gap-[6px]" key={item.label}>
            <div className="text-[14.5px] text-ink-soft">{item.label}</div>
            <div className="flex h-28 items-end gap-[6px] border-b border-line pt-2">
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.previous)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-ink${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.previous / max) * 100}%`,
                    background: yearCssVar(previousYear),
                  }}
                />
              </div>
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.current)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-ink${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.current / max) * 100}%`,
                    background: yearCssVar(year),
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
