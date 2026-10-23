import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import './charts.css'

type Item = { label: string; value: number; color?: string }

type Props = {
  items: Item[]
  max?: number
  color?: string
}

export function HorizontalBars({ items, max = 100, color = 'var(--series-a)' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div className="hbar" ref={ref}>
      {items.map((item) => (
        <div className="hbar__row" key={item.label}>
          <span className="hbar__label">{item.label}</span>
          <div className="hbar__track">
            <div
              className={`hbar__fill${inView ? ' is-visible' : ''}`}
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color ?? color,
              }}
            />
          </div>
          <span className="hbar__value">{formatScore(item.value)}</span>
        </div>
      ))}
    </div>
  )
}
