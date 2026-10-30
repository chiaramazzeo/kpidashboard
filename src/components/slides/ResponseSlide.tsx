/**
 * Slide Response Rate — baseline L1+; multi-anno da L2 (`showYearFilter`).
 * Tile full-bleed → ChartModal (non Button shadcn: è una card-hero).
 */
import { CountUp } from '../CountUp'
import { DeltaBadge } from '../DeltaBadge'
import { Reveal } from '../Reveal'
import { ExpandableCard, ExpandHint } from '../icons/AnimatedIcon'
import { metaLabel, scoreHero, tileOpen } from '@/lib/ui'
import type { SurveyData } from '../../data/types'
import { SlideTitle } from './SlideTitle'

type Props = {
  active: boolean
  multi: boolean
  year: number
  data: SurveyData
  prevYear?: number
  prevValue?: number
  onOpen: () => void
}

export function ResponseSlide({
  active,
  multi,
  year,
  data,
  prevYear,
  prevValue,
  onOpen,
}: Props) {
  const { meta, responseRate } = data
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <Reveal force delay={0}>
        <SlideTitle
          title="Response Rate"
          definition={responseRate.definition}
          glossaryId="response"
          showYearFilter={multi}
        />
      </Reveal>
      <Reveal force delay={80} className="min-h-0 flex-1">
        <ExpandableCard
          className={`${tileOpen} flex h-full min-h-0 flex-col justify-center`}
          aria-haspopup="dialog"
          aria-label="Dettaglio Response Rate"
          onClick={onOpen}
        >
          <ExpandHint />
          {year > 2026 ? (
            <p className={`${metaLabel} mb-2`}>
              Serie demo (non risultati ufficiali)
            </p>
          ) : null}
          <p className={scoreHero}>
            <CountUp
              value={responseRate.value}
              duration={1400}
              active={active}
            />
            <span className="ml-[0.05em] align-super text-[0.35em] font-bold text-muted">
              %
            </span>
          </p>
          {multi ? (
            <div className="mt-2">
              <DeltaBadge
                current={responseRate.value}
                previous={prevValue}
                previousYear={prevYear}
              />
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-xs text-muted">
            <p className="m-0">
              <span className="text-base text-ink tabular-nums">
                <CountUp value={meta.respondents} active={active} />
              </span>{' '}
              rispondenti
            </p>
            <p className="m-0">
              <span className="text-ink tabular-nums">
                {meta.invited.toLocaleString('it-IT')}
              </span>{' '}
              invitati
              {meta.invitedIsPlaceholder ? (
                <span className="text-muted"> (stima demo)</span>
              ) : null}
            </p>
          </div>
        </ExpandableCard>
      </Reveal>
    </div>
  )
}
