import { useInView } from '../../hooks/useCountUp'
import { deltaLabel, formatScore } from '../../utils/format'

type Item = {
  label: string
  score: number
  previousScore: number
}

type Props = {
  items: Item[]
  year: number
  previousYear: number
}

export function SmallMultiples({ items, year, previousYear }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1" ref={ref}>
      {items.map((item) => {
        const d = item.score - item.previousScore
        const tone = d > 0 ? 'text-delta-up' : d < 0 ? 'text-negative' : 'text-muted'
        return (
          <div className="border-t border-ink pb-2 pt-1" key={item.label}>
            <p className="mb-3 mt-0 text-[13.5px] font-medium text-ink-soft">{item.label}</p>
            <div className="flex h-[88px] items-end gap-[6px] border-b border-line pt-2">
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.previousScore)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-series-stroke${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${item.previousScore}%`,
                    background: 'var(--color-series-c)',
                  }}
                  title={`${previousYear}`}
                />
              </div>
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px]">{formatScore(item.score)}</span>
                <div
                  className={`gbar-bar w-full max-w-10 border border-series-stroke${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${item.score}%`,
                    background: 'var(--color-series-b)',
                  }}
                  title={`${year}`}
                />
              </div>
            </div>
            <p className={`mt-2 mb-0 font-mono text-[13px] ${tone}`}>
              {deltaLabel(item.score, item.previousScore)} vs {previousYear}
            </p>
          </div>
        )
      })}
    </div>
  )
}
