import type { Ref } from 'react'
import { useCountUp } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'

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
    <div className="relative mx-auto aspect-[2/1] w-min min-w-0 max-w-full" style={{ width: 'min(220px, 100%)' }} ref={ref as Ref<HTMLDivElement>}>
      <svg className="h-full w-full overflow-visible" viewBox="0 0 200 110" aria-hidden>
        <path
          d={arc(Math.PI, 2 * Math.PI)}
          fill="none"
          stroke="var(--color-bg-warm)"
          strokeWidth="18"
          strokeLinecap="butt"
        />
        <path
          d={arc(start, end)}
          fill="none"
          stroke="var(--color-series-a)"
          strokeWidth="18"
          strokeLinecap="butt"
        />
        <path
          d={arc(Math.PI, 2 * Math.PI)}
          fill="none"
          stroke="var(--color-series-stroke)"
          strokeWidth="1"
          style={{ opacity: 0.35 }}
        />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-none tracking-[-0.03em]">
        {formatScore(animated)}
        <span className="text-[0.55em] font-medium text-muted">%</span>
      </div>
    </div>
  )
}
