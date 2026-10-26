import type { IndexKpi } from '../data/types'
import { useInView } from '../hooks/useCountUp'
import { delta, deltaLabel, deltaToneClass, formatScore } from '../utils/format'
import { evolutionInsights } from '../utils/insights'
import { yearBgClass } from '../utils/yearColors'
import { InsightBox } from './InsightBox'
import { Reveal } from './Reveal'
import { YearLegend } from './YearLegend'

type Props = {
  indices: IndexKpi[]
  year: number
  previousYear?: number
}

export function EvolutionSection({ indices, year, previousYear }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  const max = 100
  const chartH = 200
  const ticks = [100, 75, 50, 25, 0]
  const hasYoY = previousYear !== undefined
  const ranked = hasYoY
    ? [...indices].sort(
        (a, b) =>
          delta(b.score, b.previousScore ?? b.score) -
          delta(a.score, a.previousScore ?? a.score),
      )
    : [...indices].sort((a, b) => b.score - a.score)
  const insights = evolutionInsights(indices, year, previousYear)

  return (
    <section
      className="section border-b border-line py-11 [scroll-margin-top:calc(var(--chrome-h,var(--header-h))+var(--sticky-gap,8px))]"
      id="evoluzione"
    >
      <Reveal className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 className="m-0 font-display text-2xl font-bold tracking-tight md:text-3xl">
          Evoluzione
        </h2>
        <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {hasYoY
            ? `Gli indici del ${year} a confronto con il ${previousYear}`
            : `Gli indici del ${year}`}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="border border-ink bg-bg-elevated">
          <div className="p-6" ref={ref}>
            <YearLegend
              className="mb-5"
              year={year}
              previousYear={previousYear}
              variant="paired"
            />

            <div
              className="hidden sm:grid grid-cols-[2rem_1fr] gap-3"
              role="img"
              aria-label={
                hasYoY
                  ? `Confronto ${previousYear}–${year} per i quattro indici`
                  : `Indici ${year}`
              }
            >
              <div
                className="relative flex flex-col justify-between font-mono text-xs text-muted"
                style={{ height: chartH }}
                aria-hidden
              >
                {ticks.map((t) => (
                  <span key={t} className="leading-none">
                    {t}
                  </span>
                ))}
              </div>

              <div className="relative" style={{ height: chartH + 72 }}>
                <div
                  className="relative border-b border-ink"
                  style={{ height: chartH }}
                >
                  {ticks.slice(0, -1).map((t) => (
                    <span
                      key={t}
                      className="pointer-events-none absolute right-0 left-0 border-t border-ink/10"
                      style={{ bottom: `${(t / max) * 100}%` }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-end gap-4 px-2">
                    {indices.map((index, groupIdx) => {
                      const bars = hasYoY
                        ? ([
                            {
                              value: index.previousScore ?? 0,
                              yearLabel: previousYear,
                              fill: yearBgClass(previousYear),
                              delay: groupIdx * 90,
                            },
                            {
                              value: index.score,
                              yearLabel: year,
                              fill: yearBgClass(year),
                              delay: groupIdx * 90 + 60,
                            },
                          ] as const)
                        : ([
                            {
                              value: index.score,
                              yearLabel: year,
                              fill: yearBgClass(year),
                              delay: groupIdx * 90,
                            },
                          ] as const)

                      return (
                        <div
                          key={index.id}
                          className="flex min-w-0 flex-1 flex-col items-center"
                        >
                          <div
                            className="flex w-full items-end justify-center gap-1.5"
                            style={{ height: chartH }}
                          >
                            {bars.map((bar) => (
                              <div
                                key={bar.yearLabel}
                                className="relative flex w-9 items-end self-stretch"
                              >
                                <span
                                  className="absolute left-1/2 z-10 -translate-x-1/2 font-mono text-xs tabular-nums"
                                  style={{
                                    bottom: `calc(${(bar.value / max) * 100}% + 4px)`,
                                  }}
                                >
                                  {formatScore(bar.value)}
                                </span>
                                <div
                                  className={`gbar-bar w-full border border-ink ${bar.fill}${inView ? ' is-visible' : ''}`}
                                  style={{
                                    height: `${(bar.value / max) * 100}%`,
                                    transitionDelay: inView
                                      ? `${bar.delay}ms`
                                      : undefined,
                                  }}
                                  title={`${index.label} / ${bar.yearLabel}: ${formatScore(bar.value)}`}
                                />
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 mb-0 w-full text-center text-xs leading-none font-medium whitespace-nowrap text-ink">
                            {index.label}
                          </p>
                          {hasYoY && index.previousScore !== undefined && (
                            <p
                              className={`mt-2 mb-0 h-4 font-mono text-xs font-medium leading-none ${deltaToneClass(index.score, index.previousScore)}`}
                            >
                              {deltaLabel(index.score, index.previousScore)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="grid gap-5 sm:hidden"
              role="img"
              aria-label={
                hasYoY
                  ? `Confronto ${previousYear}–${year} per i quattro indici`
                  : `Indici ${year}`
              }
            >
              {indices.map((index, groupIdx) => (
                <div key={index.id} className="grid gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="m-0 text-sm font-semibold text-ink">
                      {index.label}
                    </p>
                    {hasYoY && index.previousScore !== undefined && (
                      <p
                        className={`m-0 shrink-0 font-mono text-xs font-medium ${deltaToneClass(index.score, index.previousScore)}`}
                      >
                        {deltaLabel(index.score, index.previousScore)}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1.5">
                    {hasYoY && index.previousScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="w-10 shrink-0 font-mono text-xs text-muted">
                          {previousYear}
                        </span>
                        <div className="relative h-4 flex-1 border border-ink bg-bg-warm">
                          <div
                            className={`hbar-fill absolute inset-y-0 left-0 ${yearBgClass(previousYear)}${inView ? ' is-visible' : ''}`}
                            style={{
                              width: `${index.previousScore}%`,
                              transitionDelay: inView
                                ? `${groupIdx * 90}ms`
                                : undefined,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono text-xs tabular-nums">
                          {formatScore(index.previousScore)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-10 shrink-0 font-mono text-xs text-muted">
                        {year}
                      </span>
                      <div className="relative h-4 flex-1 border border-ink bg-bg-warm">
                        <div
                          className={`hbar-fill absolute inset-y-0 left-0 ${yearBgClass(year)}${inView ? ' is-visible' : ''}`}
                          style={{
                            width: `${index.score}%`,
                            transitionDelay: inView
                              ? `${groupIdx * 90 + (hasYoY ? 60 : 0)}ms`
                              : undefined,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs tabular-nums">
                        {formatScore(index.score)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-ink p-6">
            <p className="m-0 mb-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {hasYoY ? `Variazione vs ${previousYear}` : `Classifica ${year}`}
            </p>
            <ul className="m-0 grid list-none gap-0 p-0">
              {ranked.map((index, i) => (
                <li
                  key={index.id}
                  className={`flex items-center justify-between gap-4 py-3 ${
                    i < ranked.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <span className="text-sm text-ink">{index.label}</span>
                  {hasYoY && index.previousScore !== undefined ? (
                    <span
                      className={`shrink-0 font-mono text-sm font-medium ${deltaToneClass(index.score, index.previousScore)}`}
                    >
                      {deltaLabel(index.score, index.previousScore)}
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono text-sm font-medium text-ink">
                      {formatScore(index.score)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {insights.length > 0 && (
              <div className="mt-5 grid gap-3">
                {insights.map((text) => (
                  <InsightBox key={text}>{text}</InsightBox>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
