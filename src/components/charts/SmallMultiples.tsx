import { useInView } from '../../hooks/useCountUp'
import { deltaLabel, formatScore } from '../../utils/format'
import './charts.css'

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
    <div className="small-multiples" ref={ref}>
      {items.map((item) => {
        const d = item.score - item.previousScore
        return (
          <div className="small-multiples__card" key={item.label}>
            <p className="small-multiples__title">{item.label}</p>
            <div className="gbar__bars" style={{ height: '5.5rem' }}>
              <div className="gbar__col">
                <span className="gbar__val">{formatScore(item.previousScore)}</span>
                <div
                  className={`gbar__bar${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${item.previousScore}%`,
                    background: 'var(--series-c)',
                  }}
                  title={`${previousYear}`}
                />
              </div>
              <div className="gbar__col">
                <span className="gbar__val">{formatScore(item.score)}</span>
                <div
                  className={`gbar__bar${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${item.score}%`,
                    background: 'var(--series-b)',
                  }}
                  title={`${year}`}
                />
              </div>
            </div>
            <p
              className={`delta ${d > 0 ? 'delta--up' : d < 0 ? 'delta--down' : 'delta--flat'}`}
              style={{ margin: '0.5rem 0 0' }}
            >
              {deltaLabel(item.score, item.previousScore)} vs {previousYear}
            </p>
          </div>
        )
      })}
    </div>
  )
}
