/**
 * Slide Overview — griglia score (L1+) o trend linee (L2+, overviewMode=compare).
 */
import { EvolutionLines } from '../charts/EvolutionLines'
import { NewFeatureBadge } from '../NewFeatureBadge'
import { Reveal } from '../Reveal'
import { ExpandableCard, ExpandHint } from '../icons/AnimatedIcon'
import type { OverviewMode } from '../../context/DemoContext'
import type { IndexKpi } from '../../data/types'
import { formatKpiValue } from '../../utils/format'
import { metaLabel, scoreCard, tileOpenCard } from '@/lib/ui'
import { OverviewModeToggle } from './OverviewModeToggle'
import { SlideTitle } from './SlideTitle'

type Props = {
  active: boolean
  multi: boolean
  year: number
  overviewMode: OverviewMode
  setOverviewMode: (mode: OverviewMode) => void
  indices: IndexKpi[]
  compareYears: number[]
  showEvolutionNew: boolean
  onOpenIndex: (index: IndexKpi) => void
}

export function OverviewSlide({
  active: _active,
  multi,
  year,
  overviewMode,
  setOverviewMode,
  indices,
  compareYears,
  showEvolutionNew,
  onOpenIndex,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <Reveal force>
        <SlideTitle
          title="Overview"
          showYearFilter={multi}
          definition={
            multi && overviewMode === 'compare'
              ? 'Trend negli anni selezionati (eNPS e indici su scale separate).'
              : 'Un punteggio per KPI. Apri una card per il dettaglio.'
          }
          trailing={
            multi ? (
              <OverviewModeToggle
                value={overviewMode}
                onChange={setOverviewMode}
              />
            ) : null
          }
        />
      </Reveal>
      {multi && overviewMode === 'compare' ? (
        <Reveal force delay={80} className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
            {showEvolutionNew ? <NewFeatureBadge level={2} /> : null}
            {compareYears.some((y) => y > 2026) ? (
              <p className={metaLabel}>
                Serie demo su 2027–2028 (non risultati ufficiali)
              </p>
            ) : null}
            <div className="min-h-0 flex-1 overflow-hidden">
              <EvolutionLines multiYear compact />
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {year > 2026 ? (
            <p className={`col-span-full ${metaLabel}`}>
              Serie demo (non risultati ufficiali)
            </p>
          ) : null}
          {indices.map((index) => (
            <ExpandableCard
              key={index.id}
              className={`${tileOpenCard} min-h-0 p-3.5 pr-10`}
              aria-haspopup="dialog"
              aria-label={`Apri dettaglio ${index.label}`}
              onClick={() => onOpenIndex(index)}
            >
              <ExpandHint className="top-2 right-2 h-7 w-7" />
              <p className="m-0 truncate text-sm font-semibold tracking-tight">
                {index.label}
              </p>
              <p className={`${scoreCard} mt-2`}>
                {formatKpiValue(index.score, index.scale)}
              </p>
              {typeof index.target === 'number' ? (
                <p className="mt-1.5 mb-0 font-mono text-meta text-muted">
                  Target {formatKpiValue(index.target, index.scale)}
                </p>
              ) : null}
            </ExpandableCard>
          ))}
        </div>
      )}
    </div>
  )
}
