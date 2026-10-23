import type { IndexKpi } from '../data/types'
import { CountUp } from './CountUp'
import { DeltaBadge } from './DeltaBadge'
import { Reveal } from './Reveal'

type Props = {
  index: IndexKpi
  previousYear: number
  href: string
  delay?: number
}

export function KpiCard({ index, previousYear, href, delay = 0 }: Props) {
  return (
    <Reveal delay={delay} className="kpi-strip__item" as="div">
      <a className="kpi-strip__link" href={href}>
        <p className="kpi-strip__label">{index.shortLabel}</p>
        <p className="kpi-strip__score">
          <CountUp value={index.score} />
        </p>
        <DeltaBadge
          current={index.score}
          previous={index.previousScore}
          previousYear={previousYear}
        />
      </a>
    </Reveal>
  )
}
