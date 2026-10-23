import { useInView } from '../../hooks/useCountUp'
import { deltaLabel, formatScore } from '../../utils/format'
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
}

export function YoYBars({ items, currentLabel, previousLabel }: Props) {
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
      <div className="hbar">
        {items.map((item) => (
          <div key={item.label} style={{ display: 'grid', gap: '0.35rem' }}>
            <div className="hbar__row">
              <span className="hbar__label">{item.label}</span>
              <div className="hbar__track" style={{ height: 'auto', padding: '0.2rem', display: 'grid', gap: '0.2rem' }}>
                <div
                  className={`hbar__fill${inView ? ' is-visible' : ''}`}
                  style={{
                    width: `${item.previous}%`,
                    height: '0.55rem',
                    background: 'var(--series-c)',
                    borderRight: '1px solid var(--series-stroke)',
                  }}
                />
                <div
                  className={`hbar__fill${inView ? ' is-visible' : ''}`}
                  style={{
                    width: `${item.current}%`,
                    height: '0.55rem',
                    background: 'var(--series-a)',
                    borderRight: '1px solid var(--series-stroke)',
                  }}
                />
              </div>
              <span className="hbar__value">
                {formatScore(item.current)}
                <br />
                <span
                  className={`delta ${
                    item.current > item.previous
                      ? 'delta--up'
                      : item.current < item.previous
                        ? 'delta--down'
                        : 'delta--flat'
                  }`}
                >
                  {deltaLabel(item.current, item.previous)}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
