import type { IndexKpi } from '../data/types'
import { CountUp } from './CountUp'
import { DeltaBadge } from './DeltaBadge'
import { Reveal } from './Reveal'
import { YearLegend } from './YearLegend'
import { ScoreBar } from './charts/ScoreBar'

type Props = {
  indices: IndexKpi[]
  year: number
  previousYear?: number
  scaleNote: string
}

export function IndicesSection({
  indices,
  year,
  previousYear,
  scaleNote,
}: Props) {
  return (
    <section
      className="section border-t border-ink py-12 md:py-16"
      id="indici"
      style={{ scrollMarginTop: 'calc(var(--chrome-h) + 8px)' }}
    >
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="m-0 font-display text-2xl font-bold tracking-tight md:text-3xl">
          Indici
        </h2>
        <p className="m-0 font-mono text-xs uppercase tracking-[var(--tracking-label)] text-muted">
          Media delle voci · {scaleNote}
        </p>
      </Reveal>

      <Reveal delay={60} className="mb-6">
        <YearLegend year={year} previousYear={previousYear} />
      </Reveal>

      <div className="grid grid-cols-1 border border-ink sm:grid-cols-2 xl:grid-cols-4">
        {indices.map((index, i) => (
          <Reveal
            key={index.id}
            delay={80 + i * 70}
            className={[
              'border-ink p-6',
              'border-b xl:border-b-0',
              i < indices.length - 1 ? 'max-sm:border-b' : 'max-sm:border-b-0',
              'sm:border-r sm:[&:nth-child(2n)]:border-r-0',
              'xl:border-r xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(4n)]:border-r-0',
              'sm:[&:nth-child(-n+2)]:border-b xl:[&:nth-child(-n+2)]:border-b-0',
            ].join(' ')}
          >
            <p className="m-0 text-lg font-semibold text-ink">{index.label}</p>
            <p className="mt-2 mb-0 text-sm text-muted">{index.definition}</p>
            <p className="mt-4 mb-0 flex flex-wrap items-baseline gap-3 font-display text-6xl font-bold tracking-tight">
              <CountUp value={index.score} duration={1300} />
              <DeltaBadge
                current={index.score}
                previous={index.previousScore}
                previousYear={previousYear}
              />
            </p>
            <div className="mt-6 grid gap-5">
              {index.drivers.map((driver) => (
                <ScoreBar
                  key={driver.label}
                  indexLabel={index.label}
                  label={driver.label}
                  value={driver.score}
                  previousValue={driver.previousScore}
                  year={year}
                  previousYear={previousYear}
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
