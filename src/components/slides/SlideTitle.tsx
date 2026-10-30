/**
 * Titolo + definizione + glossario «i» + filtri anno (L2+).
 * Tipografia: `slideTitle` da `src/lib/ui.ts` / token `--text-slide`.
 */
import type { ReactNode } from 'react'
import { GLOSSARY, SLIDE_GLOSSARY } from '../../data/glossary'
import { slideTitle } from '@/lib/ui'
import { InfoTip } from '../InfoTip'
import { YearFilterChips } from '../YearFilterChips'

export function SlideTitle({
  title,
  definition,
  glossaryId,
  showYearFilter = false,
  trailing,
}: {
  title: string
  definition?: string
  /** Id KPI/sezione per i termini «i» del glossario. */
  glossaryId?: string
  showYearFilter?: boolean
  trailing?: ReactNode
}) {
  const terms = glossaryId ? (SLIDE_GLOSSARY[glossaryId] ?? []) : []
  return (
    <div className="mb-3 shrink-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className={slideTitle}>{title}</h2>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {trailing}
          {showYearFilter ? <YearFilterChips /> : null}
        </div>
      </div>
      {definition ? (
        <p className="mt-1.5 mb-0 flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-snug text-muted">
          <span>{definition}</span>
          {terms.length > 0 ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              {terms.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 font-mono text-meta uppercase tracking-[0.06em] text-muted"
                >
                  {GLOSSARY[key].label}
                  <InfoTip term={key} />
                </span>
              ))}
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
