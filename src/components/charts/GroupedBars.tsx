import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'

type Item = {
  label: string
  current: number
  previous: number
}

type Props = {
  items: Item[]
  currentLabel: string
  previousLabel: string
  max?: number
}

export function GroupedBars({
  items,
  currentLabel,
  previousLabel,
  max = 100,
}: Props) {
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
      <div className="grid gap-[18px]">
        {items.map((item) => (
          <div className="grid gap-[6px]" key={item.label}>
            <div className="text-[14.5px] text-ink-soft">{item.label}</div>
            <div className="flex h-28 items-end gap-[6px] border-b border-line pt-2">
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.previous)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-series-stroke${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.previous / max) * 100}%`,
                    background: 'var(--color-series-c)',
                  }}
                />
              </div>
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.current)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-series-stroke${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.current / max) * 100}%`,
                    background: 'var(--color-series-a)',
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
