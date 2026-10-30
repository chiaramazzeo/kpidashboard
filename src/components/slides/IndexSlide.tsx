/**
 * Slide singolo indice Annex (engagement, trust, …).
 * Gate: sezione presente in `sectionsForLevel` (L1+ per gli indici baseline).
 */
import { CountUp } from '../CountUp'
import { DeltaBadge } from '../DeltaBadge'
import { Reveal } from '../Reveal'
import { ExpandableCard, ExpandHint } from '../icons/AnimatedIcon'
import type { IndexKpi } from '../../data/types'
import { formatKpiValue, scaleUnitLabel } from '../../utils/format'
import { metaLabel, scoreHeroKpi, tileOpen } from '@/lib/ui'
import { SlideTitle } from './SlideTitle'

type Props = {
  index: IndexKpi
  active: boolean
  multi: boolean
  year: number
  prevYear?: number
  prevScore?: number
  onOpen: () => void
}

export function IndexSlide({
  index,
  active,
  multi,
  year,
  prevYear,
  prevScore,
  onOpen,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Reveal force className="flex h-full min-h-0 flex-col">
        <SlideTitle
          title={index.label}
          definition={index.definition}
          glossaryId={index.id}
          showYearFilter={multi}
        />
        <ExpandableCard
          className={`${tileOpen} flex min-h-0 flex-1 flex-col justify-center gap-3`}
          aria-haspopup="dialog"
          aria-label={`Apri dettaglio ${index.label}`}
          onClick={onOpen}
        >
          <ExpandHint />
          {year > 2026 ? (
            <p className={metaLabel}>Serie demo (non risultati ufficiali)</p>
          ) : null}
          <div className="flex w-full flex-wrap items-end justify-between gap-4">
            <div>
              <p className={scoreHeroKpi}>
                <CountUp
                  value={index.score}
                  active={active}
                  signed={index.scale === 'enps'}
                  decimals={Number.isInteger(index.score) ? 0 : 1}
                />
                {index.scale === 'index0_100' ? (
                  <span className="ml-[0.06em] font-extrabold tracking-[-0.02em] text-ink">
                    /100
                  </span>
                ) : scaleUnitLabel(index.scale) ? (
                  <span
                    className="ml-[0.14em] align-super text-[0.28em] font-bold tracking-normal text-muted"
                    title="Employee Net Promoter Score (−100…+100)"
                  >
                    {scaleUnitLabel(index.scale)}
                  </span>
                ) : null}
              </p>
              {typeof index.target === 'number' ? (
                <p className="mt-2 mb-0 font-mono text-xs text-muted">
                  Target {formatKpiValue(index.target, index.scale)}
                </p>
              ) : null}
            </div>
            {multi ? (
              <DeltaBadge
                current={index.score}
                previous={prevScore}
                previousYear={prevYear}
              />
            ) : null}
          </div>
        </ExpandableCard>
      </Reveal>
    </div>
  )
}
