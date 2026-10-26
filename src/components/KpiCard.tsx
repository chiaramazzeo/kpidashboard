import type { IndexKpi } from '../data/types'
import { CountUp } from './CountUp'
import { DeltaBadge } from './DeltaBadge'
import { Reveal } from './Reveal'
import { ScoreBar } from './charts/ScoreBar'

type Props = {
  index: IndexKpi
  year: number
  previousYear?: number
  href: string
  delay?: number
  className?: string
}

export function KpiCard({
  index,
  year,
  previousYear,
  href,
  delay = 0,
  className = '',
}: Props) {
  return (
    <Reveal delay={delay} className={className} as="div">
      <a
        className="block h-full p-6 text-inherit no-underline transition-colors duration-200 ease-[var(--ease-out)] hover:bg-bg-elevated"
        href={href}
      >
        <p className="m-0 text-lg font-semibold tracking-tight text-ink">
          {index.label}
        </p>
        <p className="mt-3 mb-0 flex flex-wrap items-baseline gap-3 font-display text-[clamp(2.5rem,5.5vw,3.5rem)] font-bold leading-none tracking-[-0.02em]">
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
      </a>
    </Reveal>
  )
}
