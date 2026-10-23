import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import './charts.css'

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
    <div className="bullet" ref={ref}>
      <div className="bullet__track">
        <div className="bullet__range" style={{ width: `${(target / max) * 100}%` }} />
        <div
          className={`bullet__fill${inView ? ' is-visible' : ''}`}
          style={{
            width: `${(score / max) * 100}%`,
            background: 'var(--series-a)',
          }}
        />
      </div>
      <div className="bullet__meta">
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
