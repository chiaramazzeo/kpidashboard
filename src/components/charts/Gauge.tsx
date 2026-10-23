import type { Ref } from 'react'
import { useCountUp } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'
import './charts.css'

type Props = {
  value: number
  max?: number
}

export function Gauge({ value, max = 100 }: Props) {
  const { ref, value: animated } = useCountUp(value)
  const ratio = Math.min(1, Math.max(0, value / max))
  const r = 80
  const cx = 100
  const cy = 100
  const start = Math.PI
  const end = Math.PI + Math.PI * ratio

  const arc = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from)
    const y1 = cy + r * Math.sin(from)
    const x2 = cx + r * Math.cos(to)
    const y2 = cy + r * Math.sin(to)
    const large = to - from > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <div className="gauge" ref={ref as Ref<HTMLDivElement>}>
      <svg viewBox="0 0 200 110" aria-hidden>
        <path
          d={arc(Math.PI, 2 * Math.PI)}
          fill="none"
          stroke="var(--bg-warm)"
          strokeWidth="18"
          strokeLinecap="butt"
        />
        <path
          d={arc(start, end)}
          fill="none"
          stroke="var(--series-a)"
          strokeWidth="18"
          strokeLinecap="butt"
        />
        <path
          d={arc(Math.PI, 2 * Math.PI)}
          fill="none"
          stroke="var(--series-stroke)"
          strokeWidth="1"
          transform="translate(0 0)"
          style={{ opacity: 0.35 }}
        />
      </svg>
      <div className="gauge__value">
        {formatScore(animated)}
        <span className="gauge__unit">%</span>
      </div>
    </div>
  )
}
