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
    <Reveal
      delay={delay}
      className="kpi-strip-item border-r border-line last:border-r-0 max-[900px]:odd:border-r-0 max-[900px]:[&:nth-child(-n+2)]:border-b max-[900px]:[&:nth-child(-n+2)]:border-line max-[520px]:border-r-0 max-[520px]:border-b max-[520px]:border-line max-[520px]:last:border-b-0"
      as="div"
    >
      <a
        className="block px-4 py-5 text-inherit no-underline transition-colors duration-200 ease-[var(--ease-out)] hover:bg-accent-soft"
        href={href}
      >
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
          {index.shortLabel}
        </p>
        <p className="mt-2 mb-1 font-display text-[clamp(2.2rem,4vw,3rem)] font-bold leading-none tracking-[-0.015em]">
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
