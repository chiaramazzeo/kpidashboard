import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import './charts.css'

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
      <ul className="chart-legend">
        <li>
          <span className="chart-legend__swatch" style={{ background: 'var(--series-a)' }} />
          {currentLabel}
        </li>
        <li>
          <span className="chart-legend__swatch" style={{ background: 'var(--series-c)' }} />
          {previousLabel}
        </li>
      </ul>
      <div className="gbar">
        {items.map((item) => (
          <div className="gbar__row" key={item.label}>
            <div className="gbar__label">{item.label}</div>
            <div className="gbar__bars">
              <div className="gbar__col">
                <span className="gbar__val">{formatScore(item.previous)}</span>
                <div
                  className={`gbar__bar${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.previous / max) * 100}%`,
                    background: 'var(--series-c)',
                  }}
                />
              </div>
              <div className="gbar__col">
                <span className="gbar__val">{formatScore(item.current)}</span>
                <div
                  className={`gbar__bar${inView ? ' is-visible' : ''}`}
                  style={{
                    height: `${(item.current / max) * 100}%`,
                    background: 'var(--series-a)',
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
