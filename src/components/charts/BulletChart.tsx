import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'

type Props = {
  score: number
  target: number
  previous: number
  max?: number
  year: number
  previousYear: number
}

export function BulletChart({
  score,
  target,
  previous,
  max = 100,
  year,
  previousYear,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div className="grid gap-2" ref={ref}>
      <div className="relative h-[26px] border border-series-stroke bg-bg-warm">
        <div
          className="absolute inset-y-0 left-0 border-r border-dashed border-series-stroke bg-series-a/25"
          style={{ width: `${(target / max) * 100}%` }}
        />
        <div
          className={`bullet-fill absolute top-1 bottom-1 left-0 border border-series-stroke${inView ? ' is-visible' : ''}`}
          style={{
            width: `${(score / max) * 100}%`,
            background: 'var(--color-series-a)',
          }}
        />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs text-ink-soft">
        <span>
          Score {year}: <strong>{formatScore(score)}</strong>
        </span>
        <span>
          Target: <strong>{formatScore(target)}</strong>
        </span>
        <span>
          {previousYear}: <strong>{formatScore(previous)}</strong>
        </span>
      </div>
    </div>
  )
}
