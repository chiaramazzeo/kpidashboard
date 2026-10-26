import type { Driver } from '../data/types'
import { CountUp } from './CountUp'
import { DeltaBadge } from './DeltaBadge'
import { Reveal } from './Reveal'
import { ScoreBar } from './charts/ScoreBar'
import { YearLegend } from './YearLegend'

type Props = {
  indexLabel: string
  drivers: Driver[]
  year: number
  previousYear?: number
}

export function DriverBoxes({
  indexLabel,
  drivers,
  year,
  previousYear,
}: Props) {
  const cols =
    drivers.length === 3
      ? 'sm:grid-cols-3'
      : drivers.length === 4
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-2'

  return (
    <div>
      <div className="mb-4">
        <YearLegend year={year} previousYear={previousYear} />
      </div>
      <div className={`grid grid-cols-1 border border-ink ${cols}`}>
        {drivers.map((driver, i) => {
          const isLastCol =
            drivers.length === 3
              ? i % 3 === 2
              : drivers.length === 4
                ? i % 2 === 1
                : i % 2 === 1
          const needsBottom =
            drivers.length === 4
              ? i < 2
              : drivers.length === 3
                ? false
                : i < drivers.length - (drivers.length % 2 === 0 ? 2 : 1)

          return (
            <Reveal
              key={driver.label}
              delay={80 + i * 70}
              className={[
                'border-ink p-6',
                !isLastCol ? 'sm:border-r' : '',
                needsBottom ? 'sm:border-b' : '',
                i < drivers.length - 1 ? 'max-sm:border-b' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <p className="m-0 text-base font-semibold tracking-tight text-ink">
                {driver.label}
              </p>
              <p className="mt-3 mb-0 flex flex-wrap items-baseline gap-3 font-display text-[clamp(2.5rem,5.5vw,3.5rem)] font-bold leading-none tracking-[-0.02em]">
                <CountUp value={driver.score} duration={1200} />
                <DeltaBadge
                  current={driver.score}
                  previous={driver.previousScore}
                  previousYear={previousYear}
                />
              </p>
              <div className="mt-5">
                <ScoreBar
                  indexLabel={indexLabel}
                  label={driver.label}
                  value={driver.score}
                  previousValue={driver.previousScore}
                  year={year}
                  previousYear={previousYear}
                  showHeader={false}
                />
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
