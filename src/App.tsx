/**
 * REVIEW / DESIGN INTENT (Golmar 2028 KPI)
 * Criteri utente da verificare in revisione completa — vedi anche `.cursor/rules/golmar-kpi-review.mdc`.
 *
 * - Tailwind v4, spacing base 4px; niente ritorno a CSS BEM legacy.
 * - Header: GOALmar + KPI maiuscolo; porta 3D rossa senza box; hero→compact allo scroll;
 *   fondo opaco; --header-h misurato dal DOM così la nav non viene coperta.
 * - Nav: chip con stroke rosso se attiva (no fill pieno, no underline); lock al click
 *   durante smooth scroll; padding verticale simmetrico.
 * - Colori: accent #e10600, secondary #f87874, series-c #80a7ff; no border-right sulle hbar.
 * - Export: PDF via print (testo/vettori); HTML con nav ancore cliccabili.
 * - Copy: solo “rispondenti” in hero; niente “Dati illustrativi” in footer.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { HorizontalBars } from './components/charts/HorizontalBars'
import { ParticipationStack } from './components/charts/ParticipationStack'
import { SlopeChart } from './components/charts/SlopeChart'
import { CountUp } from './components/CountUp'
import { CsvImportDialog } from './components/CsvImportDialog'
import { DeltaBadge } from './components/DeltaBadge'
import { DriverBoxes } from './components/DriverBoxes'
import { EvolutionSection } from './components/EvolutionSection'
import { Header } from './components/Header'
import { InsightBox } from './components/InsightBox'
import { KpiCard } from './components/KpiCard'
import { Reveal } from './components/Reveal'
import { SectionNav } from './components/SectionNav'
import { SiteChrome } from './components/SiteChrome'
import { YearLegend } from './components/YearLegend'
import {
  availableYears,
  surveysByYear,
  type AvailableYear,
} from './data/kpis'
import type { SurveyData } from './data/types'
import { exportDashboardHtml } from './utils/exportHtml'
import { exportDashboardPdf } from './utils/exportPdf'
import {
  loadStoredSurveys,
  saveStoredSurvey,
} from './utils/csvSurvey'
import { indexInsight, responseInsight } from './utils/insights'
import { yearCssVar } from './utils/yearColors'

const sectionLabel =
  'm-0 mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted'
const sectionHead =
  'mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3'
const sectionScore =
  'm-0 flex items-baseline gap-3 font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-none tracking-[-0.015em]'
const sectionClass =
  'section border-b border-line py-11 [scroll-margin-top:calc(var(--chrome-h,var(--header-h))+var(--sticky-gap,8px))]'

function App() {
  const reportRef = useRef<HTMLElement>(null)
  const [exporting, setExporting] = useState(false)
  const [year, setYear] = useState<AvailableYear>(2028)
  const [csvOpen, setCsvOpen] = useState(false)
  const [overrides, setOverrides] = useState<
    Partial<Record<AvailableYear, SurveyData>>
  >({})

  useEffect(() => {
    setOverrides(loadStoredSurveys())
  }, [])

  const data = useMemo(
    () => overrides[year] ?? surveysByYear[year],
    [overrides, year],
  )
  const { meta, responseRate, indices } = data
  const [engagement, enablement, innovation, trust] = indices

  const handleExportPdf = () => {
    if (exporting) return
    setExporting(true)
    try {
      exportDashboardPdf()
    } finally {
      window.setTimeout(() => setExporting(false), 600)
    }
  }

  const handleExportHtml = () => {
    if (!reportRef.current || exporting) return
    setExporting(true)
    try {
      exportDashboardHtml(
        reportRef.current,
        `Golmar-${meta.year}-KPI.html`,
        meta.title,
      )
    } catch (err) {
      console.error(err)
    } finally {
      window.setTimeout(() => setExporting(false), 400)
    }
  }

  return (
    <div className={exporting ? 'exporting' : undefined}>
      <SiteChrome>
        <Header
          title={meta.title}
          year={year}
          availableYears={availableYears}
          onYearChange={(next) => {
            if ((availableYears as readonly number[]).includes(next)) {
              setYear(next as AvailableYear)
            }
          }}
          onExportPdf={handleExportPdf}
          onExportHtml={handleExportHtml}
          onImportCsv={() => setCsvOpen(true)}
          exporting={exporting}
        />
        <SectionNav />
      </SiteChrome>

      <CsvImportDialog
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onImported={(importedYear, imported) => {
          setOverrides((prev) => saveStoredSurvey(importedYear, imported, prev))
          setYear(importedYear)
        }}
      />

      <main className="report mx-auto max-w-report px-5 pb-14" ref={reportRef}>
        <section className={`${sectionClass} pt-10`} id="response">
          <Reveal delay={0}>
            <p className={sectionLabel}>Response Rate</p>
            <p className="mt-2 mb-0 max-w-3xl text-sm text-muted">
              {responseRate.definition}
            </p>
          </Reveal>
          <Reveal delay={80} className="mb-8">
            <p className="m-0 font-display text-[clamp(5rem,18vw,10rem)] font-extrabold leading-[0.92] tracking-[-0.02em]">
              <CountUp value={responseRate.value} duration={1400} />
              <span className="ml-[0.05em] align-super text-[0.35em] font-bold text-muted">
                %
              </span>
            </p>
            <DeltaBadge
              current={responseRate.value}
              previous={responseRate.previousValue}
              previousYear={meta.previousYear}
            />
            <p className="mt-4 mb-0 flex flex-col gap-1 font-mono text-xs text-muted">
              <span className="text-base text-ink">
                <CountUp value={meta.respondents} /> / <CountUp value={meta.invited} />
              </span>
              <span>rispondenti</span>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ParticipationStack items={responseRate.byArea} year={meta.year} />
          </Reveal>
          <Reveal delay={200} className="mt-6">
            <InsightBox>{responseInsight(responseRate.byArea)}</InsightBox>
          </Reveal>
        </section>

        <section className={sectionClass} id="overview">
          <Reveal className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <p className={`${sectionLabel} mb-0`}>Overview</p>
            <YearLegend year={meta.year} previousYear={meta.previousYear} />
          </Reveal>
          <div className="my-2 grid grid-cols-1 border border-ink sm:grid-cols-2">
            {indices.map((index, i) => (
              <KpiCard
                key={index.id}
                index={index}
                year={meta.year}
                previousYear={meta.previousYear}
                href={`#${index.id}`}
                delay={80 + i * 70}
                className={[
                  'border-ink',
                  i < 2 ? 'sm:border-b' : '',
                  i % 2 === 0 ? 'sm:border-r' : '',
                  i < indices.length - 1 ? 'max-sm:border-b' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
        </section>

        <EvolutionSection
          indices={indices}
          year={meta.year}
          previousYear={meta.previousYear}
        />

        <section className={sectionClass} id="engagement">
          <Reveal>
            <div className={sectionHead}>
              <p className={`${sectionLabel} mb-0`}>Engagement Index</p>
              <p className={sectionScore}>
                <CountUp value={engagement.score} />
                <DeltaBadge
                  current={engagement.score}
                  previous={engagement.previousScore}
                  previousYear={meta.previousYear}
                />
              </p>
            </div>
            <p className="mt-0 mb-6 max-w-3xl text-sm text-muted">
              {engagement.definition}
            </p>
          </Reveal>
          <Reveal delay={80} className="max-w-full">
            <HorizontalBars
              color={yearCssVar(meta.year)}
              items={engagement.drivers.map((d) => ({
                label: d.label,
                value: d.score,
              }))}
            />
          </Reveal>
          <Reveal delay={200} className="mt-6">
            <InsightBox>
              {indexInsight(engagement, meta.previousYear)}
            </InsightBox>
          </Reveal>
        </section>

        <section className={sectionClass} id="enablement">
          <Reveal>
            <div className={sectionHead}>
              <p className={`${sectionLabel} mb-0`}>Performance Enablement Index</p>
              <p className={sectionScore}>
                <CountUp value={enablement.score} />
                <DeltaBadge
                  current={enablement.score}
                  previous={enablement.previousScore}
                  previousYear={meta.previousYear}
                />
              </p>
            </div>
            <p className="mt-0 mb-6 max-w-3xl text-sm text-muted">
              {enablement.definition}
            </p>
          </Reveal>
          <DriverBoxes
            indexLabel={enablement.label}
            drivers={enablement.drivers}
            year={meta.year}
            previousYear={meta.previousYear}
          />
          <Reveal delay={200} className="mt-6">
            <InsightBox>
              {indexInsight(enablement, meta.previousYear)}
            </InsightBox>
          </Reveal>
        </section>

        <section className={sectionClass} id="innovation">
          <Reveal>
            <div className={sectionHead}>
              <p className={`${sectionLabel} mb-0`}>Innovation Index</p>
              <p className={sectionScore}>
                <CountUp value={innovation.score} />
                <DeltaBadge
                  current={innovation.score}
                  previous={innovation.previousScore}
                  previousYear={meta.previousYear}
                />
              </p>
            </div>
            <p className="mt-0 mb-6 max-w-3xl text-sm text-muted">
              {innovation.definition}
            </p>
          </Reveal>
          <DriverBoxes
            indexLabel={innovation.label}
            drivers={innovation.drivers}
            year={meta.year}
            previousYear={meta.previousYear}
          />
          <Reveal delay={200} className="mt-6">
            <InsightBox>
              {indexInsight(innovation, meta.previousYear)}
            </InsightBox>
          </Reveal>
        </section>

        <section className={sectionClass} id="trust">
          <Reveal>
            <div className={sectionHead}>
              <p className={`${sectionLabel} mb-0`}>Trust in Management Index</p>
              <p className={sectionScore}>
                <CountUp value={trust.score} />
                <DeltaBadge
                  current={trust.score}
                  previous={trust.previousScore}
                  previousYear={meta.previousYear}
                />
              </p>
            </div>
            <p className="mt-0 mb-6 max-w-3xl text-sm text-muted">
              {trust.definition}
            </p>
          </Reveal>
          <div
            className={
              meta.previousYear !== undefined &&
              trust.previousScore !== undefined
                ? 'grid grid-cols-[minmax(12rem,16rem)_1fr] items-center gap-8 max-[900px]:grid-cols-1'
                : 'grid grid-cols-1'
            }
          >
            {meta.previousYear !== undefined &&
              trust.previousScore !== undefined && (
                <Reveal delay={80} className="max-w-full">
                  <SlopeChart
                    previousLabel={String(meta.previousYear)}
                    currentLabel={String(meta.year)}
                    previous={trust.previousScore}
                    current={trust.score}
                    previousYear={meta.previousYear}
                    year={meta.year}
                  />
                </Reveal>
              )}
            <Reveal delay={80} className="max-w-full">
              <HorizontalBars
                color={yearCssVar(meta.year)}
                items={[...trust.drivers]
                  .sort((a, b) => b.score - a.score)
                  .map((d) => ({ label: d.label, value: d.score }))}
              />
            </Reveal>
          </div>
          <Reveal delay={200} className="mt-6">
            <InsightBox>{indexInsight(trust, meta.previousYear)}</InsightBox>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto flex max-w-report flex-wrap justify-between gap-3 px-5 pb-10 pt-6 font-mono text-xs text-muted">
        <span>
          {meta.company} · {meta.title}
        </span>
      </footer>
    </div>
  )
}

export default App
