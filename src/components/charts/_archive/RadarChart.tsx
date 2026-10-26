import { useInView } from '../../hooks/useCountUp'

type Series = {
  label: string
  values: number[]
  color: string
}

type Props = {
  axes: string[]
  series: Series[]
  max?: number
}

export function RadarChart({ axes, series, max = 100 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const size = 320
  const cx = size / 2
  const cy = size / 2
  const radius = 110
  const levels = [0.25, 0.5, 0.75, 1]

  const point = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (index / axes.length) * Math.PI * 2
    const r = (value / max) * radius
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const polygon = (values: number[]) =>
    values
      .map((v, i) => {
        const p = point(i, v)
        return `${p.x},${p.y}`
      })
      .join(' ')

  return (
    <div className="mx-auto aspect-square w-full max-w-[360px]" ref={ref}>
      <ul className="mb-4 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-mono text-xs text-ink-soft">
        {series.map((s) => (
          <li key={s.label}>
            <span
              className="mr-[6px] inline-block h-3 w-3 border border-series-stroke align-[-1px]"
              style={{ background: s.color }}
            />
            {s.label}
          </li>
        ))}
      </ul>
      <svg className="h-full w-full" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Confronto indici radar">
        {levels.map((level) => (
          <polygon
            key={level}
            points={polygon(axes.map(() => max * level))}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        ))}
        {axes.map((axis, i) => {
          const tip = point(i, max)
          const labelR = radius + 28
          const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
          const lx = cx + labelR * Math.cos(angle)
          const ly = cy + labelR * Math.sin(angle)
          return (
            <g key={axis}>
              <line
                x1={cx}
                y1={cy}
                x2={tip.x}
                y2={tip.y}
                stroke="var(--color-line)"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--color-ink-soft)"
              >
                {axis}
              </text>
            </g>
          )
        })}
        {series.map((s) => (
          <polygon
            key={s.label}
            points={polygon(s.values)}
            fill={s.color}
            fillOpacity={inView ? 0.22 : 0}
            stroke={s.color}
            strokeWidth="2"
            style={{
              transition: 'fill-opacity 0.6s var(--ease-out)',
            }}
          />
        ))}
        {series.map((s) =>
          s.values.map((v, i) => {
            const p = point(i, v)
            return (
              <circle
                key={`${s.label}-${i}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill={s.color}
                stroke="var(--color-series-stroke)"
                strokeWidth="1"
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}
