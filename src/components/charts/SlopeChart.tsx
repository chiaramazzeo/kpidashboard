import { formatScore } from '../../utils/format'
import './charts.css'

type Props = {
  previousLabel: string
  currentLabel: string
  previous: number
  current: number
  max?: number
}

export function SlopeChart({
  previousLabel,
  currentLabel,
  previous,
  current,
  max = 100,
}: Props) {
  const h = 160
  const w = 260
  const pad = 28
  const x1 = 70
  const x2 = w - 40
  const y = (v: number) => pad + (1 - v / max) * (h - pad * 2)
  const up = current >= previous

  return (
    <div className="slope">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Trend annuale">
        <text x={x1} y={14} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--muted)">
          {previousLabel}
        </text>
        <text x={x2} y={14} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--muted)">
          {currentLabel}
        </text>
        <line
          x1={x1}
          y1={y(previous)}
          x2={x2}
          y2={y(current)}
          stroke={up ? 'var(--series-a)' : 'var(--accent)'}
          strokeWidth="2.5"
        />
        <circle cx={x1} cy={y(previous)} r="5" fill="var(--series-c)" stroke="var(--series-stroke)" />
        <circle
          cx={x2}
          cy={y(current)}
          r="5"
          fill={up ? 'var(--series-a)' : 'var(--accent)'}
          stroke="var(--series-stroke)"
        />
        <text
          x={x1 - 12}
          y={y(previous) + 4}
          textAnchor="end"
          fontSize="12"
          fontFamily="var(--mono)"
          fill="var(--ink)"
        >
          {formatScore(previous)}
        </text>
        <text
          x={x2 + 12}
          y={y(current) + 4}
          textAnchor="start"
          fontSize="12"
          fontFamily="var(--mono)"
          fill="var(--ink)"
        >
          {formatScore(current)}
        </text>
      </svg>
    </div>
  )
}
