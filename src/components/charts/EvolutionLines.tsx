import { useMemo, useState } from 'react'
import { useDemo } from '../../context/DemoContext'
import { evolutionSeries, type AvailableYear } from '../../data/kpis'
import type { ScoreScale } from '../../data/types'
import { formatKpiValue } from '../../utils/format'

const COLORS = [
  'var(--color-accent)',
  'var(--color-series-c)',
  'var(--color-year-2026)',
  'var(--color-series-a)',
  'var(--color-series-b)',
]

type Props = {
  /** Se false, mostra solo 2026 come punto. */
  multiYear: boolean
  /** Layout più basso per slide a altezza fissa. */
  compact?: boolean
}

type Series = ReturnType<typeof evolutionSeries>[number]

/** Due pannelli: eNPS e indici 0–100 non condividono lo stesso asse Y. */
export function EvolutionLines({ multiYear, compact = false }: Props) {
  const { compareYears, year } = useDemo()
  const series = useMemo(() => evolutionSeries(), [])
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(series.map((s) => [s.id, true])),
  )

  const years: AvailableYear[] = multiYear
    ? (compareYears as AvailableYear[])
    : [2026]

  const enpsSeries = series.filter((s) => s.points[0]?.scale === 'enps')
  const indexSeries = series.filter((s) => s.points[0]?.scale !== 'enps')

  return (
    <div className={compact ? 'flex h-full min-h-0 flex-col gap-2' : 'space-y-6'}>
      <div className={`flex flex-wrap gap-1.5 ${compact ? 'shrink-0' : 'mb-2 gap-2'}`}>
        {series.map((s, i) => {
          const on = enabled[s.id]
          return (
            <button
              key={s.id}
              type="button"
              className={`rounded-sm border text-sm ${
                compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5'
              } ${
                on ? 'border-ink bg-bg-elevated' : 'border-line text-muted'
              }`}
              aria-pressed={on}
              onClick={() =>
                setEnabled((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
              }
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-sm"
                style={{ background: on ? COLORS[i % COLORS.length] : '#ccc' }}
              />
              {s.label}
            </button>
          )
        })}
      </div>

      <div
        className={
          compact
            ? 'grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2'
            : 'space-y-6'
        }
      >
        <ScalePanel
          title="eNPS (−100…+100)"
          series={enpsSeries.filter((s) => enabled[s.id])}
          allSeries={series}
          years={years}
          focusYear={year}
          scale="enps"
          compact={compact}
        />
        <ScalePanel
          title="Indici 0–100"
          series={indexSeries.filter((s) => enabled[s.id])}
          allSeries={series}
          years={years}
          focusYear={year}
          scale="index0_100"
          compact={compact}
        />
      </div>
    </div>
  )
}

function ScalePanel({
  title,
  series,
  allSeries,
  years,
  focusYear,
  scale,
  compact = false,
}: {
  title: string
  series: Series[]
  allSeries: Series[]
  years: AvailableYear[]
  focusYear: number
  scale: ScoreScale
  compact?: boolean
}) {
  if (series.length === 0) return null

  const width = 640
  const height = compact ? 148 : 220
  const pad = compact
    ? { t: 12, r: 12, b: 28, l: 36 }
    : { t: 20, r: 16, b: 36, l: 44 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  const allScores = series.flatMap((s) =>
    s.points
      .filter((p) => years.includes(p.year as AvailableYear))
      .map((p) => p.score),
  )

  const minY =
    scale === 'enps' ? Math.min(-40, ...allScores, 0) : Math.min(0, ...allScores)
  const maxY =
    scale === 'enps'
      ? Math.max(40, ...allScores)
      : Math.max(100, ...allScores)
  const yAt = (v: number) =>
    pad.t + ((maxY - v) / (maxY - minY || 1)) * innerH
  const xAt = (i: number) =>
    pad.l + (years.length <= 1 ? innerW / 2 : (i / (years.length - 1)) * innerW)

  const ticks =
    scale === 'enps'
      ? [-40, -20, 0, 20, 40].filter((t) => t >= minY - 1 && t <= maxY + 1)
      : [0, 25, 50, 75, 100]

  return (
    <div className={compact ? 'flex min-h-0 flex-col' : undefined}>
      <p
        className={`m-0 font-mono uppercase tracking-[0.08em] text-muted ${
          compact ? 'mb-1 text-[0.625rem]' : 'mb-2 text-xs'
        }`}
      >
        {title}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full border border-ink bg-bg-elevated ${
          compact ? 'min-h-0 flex-1' : 'h-auto'
        }`}
        role="img"
        aria-label={title}
        preserveAspectRatio="xMidYMid meet"
      >
        {ticks.map((tick) => {
          if (tick < minY - 0.01 || tick > maxY + 0.01) return null
          const y = yAt(tick)
          return (
            <g key={tick}>
              <line
                x1={pad.l}
                x2={width - pad.r}
                y1={y}
                y2={y}
                stroke="var(--color-line)"
              />
              <text
                x={pad.l - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {series.map((s) => {
          const color =
            COLORS[allSeries.findIndex((x) => x.id === s.id) % COLORS.length]
          const pts = years.map((y) => {
            const hit = s.points.find((p) => p.year === y)
            return {
              year: y,
              score: hit?.score ?? 0,
              scale: (hit?.scale ?? scale) as ScoreScale,
            }
          })
          const d = pts
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(p.score)}`)
            .join(' ')
          return (
            <g key={s.id}>
              <path d={d} fill="none" stroke={color} strokeWidth="2.25" />
              {pts.map((p, i) => (
                <g key={p.year}>
                  <circle
                    cx={xAt(i)}
                    cy={yAt(p.score)}
                    r={p.year === focusYear ? 6 : 5}
                    fill={color}
                    stroke="var(--color-ink)"
                    strokeWidth={p.year === focusYear ? 1.5 : 1}
                  />
                  <title>
                    {s.label} {p.year}: {formatKpiValue(p.score, p.scale)}
                  </title>
                </g>
              ))}
            </g>
          )
        })}

        {years.map((y, i) => (
          <text
            key={y}
            x={xAt(i)}
            y={height - 10}
            textAnchor="middle"
            className="fill-ink"
            fontSize="12"
            fontFamily="var(--font-mono)"
            fontWeight={y === focusYear ? 700 : 400}
          >
            {y}
          </text>
        ))}
      </svg>
    </div>
  )
}
