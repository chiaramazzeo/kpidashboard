import { formatScore } from '../../utils/format'
import './charts.css'

type Item = {
  label: string
  rate: number
}

type Props = {
  items: Item[]
}

export function ParticipationStack({ items }: Props) {
  return (
    <div className="part-stack">
      <ul className="chart-legend">
        <li>
          <span className="chart-legend__swatch" style={{ background: 'var(--series-a)' }} />
          Ha risposto
        </li>
        <li>
          <span className="chart-legend__swatch" style={{ background: 'var(--bg-warm)' }} />
          Non ha risposto
        </li>
      </ul>
      {items.map((item) => (
        <div className="part-stack__row" key={item.label}>
          <div className="part-stack__label">
            <span>{item.label}</span>
            <span className="delta">{formatScore(item.rate)}%</span>
          </div>
          <div className="part-stack__bar">
            <div
              className="part-stack__seg"
              style={{ flexGrow: item.rate, background: 'var(--series-a)' }}
            />
            <div
              className="part-stack__seg"
              style={{ flexGrow: 100 - item.rate, background: 'var(--bg-warm)' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
