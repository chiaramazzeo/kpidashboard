/**
 * Shell Golmar KPI — chrome, carousel, modal, export, chat.
 * Contenuto slide: `src/components/slides/*`.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { ParticipationStack } from './components/charts/ParticipationStack'
import { Carousel, CarouselSlide } from './components/Carousel'
import { ChartModal } from './components/ChartModal'
import {
  ChatBar,
  ChatFloat,
  ChatPanel,
  ChatPeek,
  ChatReplyBridge,
} from './components/ChatDock'
import { CsvImportDialog } from './components/CsvImportDialog'
import { Header } from './components/Header'
import { KpiAdminPanel } from './components/KpiAdminPanel'
import { LabeledTerm } from './components/InfoTip'
import { PrimaryNav } from './components/PrimaryNav'
import { SectionNav } from './components/SectionNav'
import { SiteChrome } from './components/SiteChrome'
import { SurveyPanel } from './components/SurveyPanel'
import { YearCompare } from './components/YearCompare'
import { IndexSlide } from './components/slides/IndexSlide'
import { OverviewSlide } from './components/slides/OverviewSlide'
import { ResponseSlide } from './components/slides/ResponseSlide'
import { DemoProvider, useDemo } from './context/DemoContext'
import { LEVEL_THEMES } from './data/levels'
import { sectionsForLevel } from './data/nav'
import { surveysByYear, type AvailableYear } from './data/kpis'
import type { IndexKpi, SurveyData } from './data/types'
import { indexToCsv, responseToCsv } from './utils/chartCsv'
import {
  loadStoredSurveys,
  saveStoredSurvey,
} from './utils/csvSurvey'
import { exportDashboardHtml } from './utils/exportHtml'
import { exportDashboardPdf } from './utils/exportPdf'
import { formatKpiValue } from './utils/format'
import {
  getDriversAcrossYears,
  getIndexAcrossYears,
  getPopulationAcrossYears,
  getResponseAcrossYears,
  getResponseAreasAcrossYears,
  previousAmong,
  responseInYear,
  scoreInYear,
} from './utils/yearCompare'

type ModalState =
  | { kind: 'response' }
  | { kind: 'index'; id: string }
  | { kind: 'overview'; id: string }
  | null

function AppShell() {
  const reportRef = useRef<HTMLElement>(null)
  const {
    level,
    year,
    area,
    feature,
    featureNew,
    chatOpen,
    chatPeek,
    compareYears,
    overviewMode,
    setOverviewMode,
    setYear,
    pendingSection,
    clearPendingSection,
  } = useDemo()
  const multi = feature('multiYear')
  const prevYear = multi ? previousAmong(compareYears, year) : undefined
  const [exporting, setExporting] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [overrides, setOverrides] = useState<
    Partial<Record<AvailableYear, SurveyData>>
  >({})
  const [slide, setSlide] = useState(0)
  const [modal, setModal] = useState<ModalState>(null)
  const [csvContext, setCsvContext] = useState<string | null>(null)
  const [chatBusy, setChatBusy] = useState(false)

  const sections = useMemo(
    () => sectionsForLevel(level, area),
    [level, area],
  )

  useEffect(() => {
    setOverrides(loadStoredSurveys())
  }, [])

  useEffect(() => {
    setSlide(0)
    setModal(null)
  }, [level, area])

  useEffect(() => {
    if (chatOpen || chatPeek) setModal(null)
  }, [chatOpen, chatPeek])

  useEffect(() => {
    if (slide >= sections.length) setSlide(Math.max(0, sections.length - 1))
  }, [sections, slide])

  useEffect(() => {
    if (!pendingSection) return
    const i = sections.findIndex((s) => s.id === pendingSection)
    if (i >= 0) setSlide(i)
    clearPendingSection()
  }, [pendingSection, sections, clearPendingSection])

  const data = useMemo(
    () => overrides[year] ?? surveysByYear[year],
    [overrides, year],
  )
  const { meta, responseRate, indices } = data
  const activeId = sections[slide]?.id ?? 'response'

  useEffect(() => {
    document.title = meta.title
  }, [meta.title])

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

  const openIndexModal = (index: IndexKpi, kind: 'index' | 'overview') => {
    setCsvContext(indexToCsv(index, meta.year))
    setModal({ kind, id: index.id })
  }

  const responseBreakdowns = [
    {
      label: 'Dipendenti',
      score: responseRate.byPopulation.employees.score,
      scale: 'percent' as const,
      yearScores: multi
        ? getPopulationAcrossYears('response', 'employees', compareYears)
        : undefined,
      previousScore: responseRate.byPopulation.employees.previousScore,
    },
    {
      label: 'Agenti',
      score: responseRate.byPopulation.agents.score,
      scale: 'percent' as const,
      yearScores: multi
        ? getPopulationAcrossYears('response', 'agents', compareYears)
        : undefined,
      previousScore: responseRate.byPopulation.agents.previousScore,
    },
  ]

  const indexBreakdowns = (index: IndexKpi) =>
    (['employees', 'agents'] as const).map((pop) => {
      const slice = index.byPopulation[pop]
      const label = pop === 'employees' ? 'Dipendenti' : 'Agenti'
      return {
        label,
        score: slice.score,
        scale: index.scale,
        yearScores: multi
          ? getPopulationAcrossYears(index.id, pop, compareYears)
          : undefined,
        previousScore: slice.previousScore,
        detailByYear: multi
          ? (slice.drivers ?? []).map((d) => ({
              label: d.label,
              byYear: compareYears.map((y) => {
                const src = surveysByYear[y].indices.find(
                  (i) => i.id === index.id,
                )
                const hit = src?.byPopulation[pop].drivers?.find(
                  (x) => x.label === d.label,
                )
                return { year: y, score: hit?.score ?? 0 }
              }),
            }))
          : undefined,
      }
    })

  const modalIndex =
    modal?.kind === 'index' || modal?.kind === 'overview'
      ? indices.find((i) => i.id === modal.id)
      : null

  return (
    <div
      className={`flex min-h-dvh flex-col ${exporting ? 'exporting' : ''}`}
    >
      <SiteChrome>
        <Header
          title={meta.title}
          onExportPdf={handleExportPdf}
          onExportHtml={handleExportHtml}
          onImportCsv={() => setCsvOpen(true)}
          exporting={exporting}
        />
        <PrimaryNav />
        <SectionNav
          activeId={activeId}
          onSelect={(id) => {
            const i = sections.findIndex((s) => s.id === id)
            if (i >= 0) {
              setSlide(i)
              setModal(null)
            }
          }}
        />
      </SiteChrome>

      <CsvImportDialog
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onImported={(importedYear, imported) => {
          setOverrides((prev) => saveStoredSurvey(importedYear, imported, prev))
          setYear(importedYear)
        }}
      />

      <div
        className="flex min-h-0 w-full flex-1"
        style={{
          height: 'calc(100dvh - var(--chrome-h, 8rem))',
          maxHeight: 'calc(100dvh - var(--chrome-h, 8rem))',
        }}
      >
        <main
          className={`report mx-auto flex min-h-0 min-w-0 w-full max-w-report flex-1 flex-col overflow-hidden px-5 pt-4 ${
            feature('chat') && !chatOpen ? 'pb-20' : 'pb-2'
          }`}
          ref={reportRef}
        >
          <Carousel
            index={slide}
            onIndexChange={(i) => {
              setSlide(i)
              setModal(null)
            }}
            count={sections.length}
            labels={sections.map((s) => s.label)}
          >
            {sections.map((section) => {
              const active = section.id === activeId
              return (
                <CarouselSlide key={section.id} id={section.id} active={active}>
                  {section.id === 'response' ? (
                    <ResponseSlide
                      active={active}
                      multi={multi}
                      year={year}
                      data={data}
                      prevYear={prevYear}
                      prevValue={
                        prevYear !== undefined
                          ? responseInYear(prevYear)
                          : undefined
                      }
                      onOpen={() => {
                        setCsvContext(responseToCsv(responseRate, data))
                        setModal({ kind: 'response' })
                      }}
                    />
                  ) : null}

                  {section.id === 'overview' ? (
                    <OverviewSlide
                      active={active}
                      multi={multi}
                      year={year}
                      overviewMode={overviewMode}
                      setOverviewMode={setOverviewMode}
                      indices={indices}
                      compareYears={compareYears}
                      showEvolutionNew={featureNew('evolutionChart')}
                      onOpenIndex={(index) => openIndexModal(index, 'overview')}
                    />
                  ) : null}

                  {indices.map((index) =>
                    section.id === index.id ? (
                      <IndexSlide
                        key={index.id}
                        index={index}
                        active={active}
                        multi={multi}
                        year={year}
                        prevYear={prevYear}
                        prevScore={
                          prevYear !== undefined
                            ? scoreInYear(index.id, prevYear)
                            : undefined
                        }
                        onOpen={() => openIndexModal(index, 'index')}
                      />
                    ) : null,
                  )}

                  {section.id === 'survey' ? <SurveyPanel /> : null}
                  {section.id === 'kpi-admin' ? <KpiAdminPanel /> : null}
                </CarouselSlide>
              )
            })}
          </Carousel>

          <footer className="no-print shrink-0 pt-2 pb-1 font-mono text-xs text-muted">
            {meta.title}
            {' · '}
            {meta.note ??
              (year > 2026
                ? 'Serie demo (non risultati ufficiali).'
                : 'Baseline Annex KPI.')}
            {` · ${LEVEL_THEMES[level].short}`}
          </footer>
        </main>

        <ChatPanel busy={chatBusy} />
      </div>

      <ChatReplyBridge csvContext={csvContext} onBusy={setChatBusy} />

      <ChartModal
        open={modal?.kind === 'response'}
        onClose={() => setModal(null)}
        title="Response Rate"
        subtitle={responseRate.definition}
        csv={responseToCsv(responseRate, data)}
        csvName={`response-${meta.year}.csv`}
        breakdowns={responseBreakdowns}
        yearScores={
          multi ? getResponseAcrossYears(compareYears) : undefined
        }
      >
        {multi && compareYears.length > 1 ? (
          <div className="space-y-5">
            {getResponseAreasAcrossYears(compareYears).map(
              ({ year: y, items }) => (
                <div key={y}>
                  <p className="m-0 mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    Aree · {y}
                  </p>
                  <ParticipationStack items={items} year={y} />
                </div>
              ),
            )}
          </div>
        ) : (
          <ParticipationStack items={responseRate.byArea} year={meta.year} />
        )}
      </ChartModal>

      {modalIndex ? (
        <ChartModal
          open
          onClose={() => setModal(null)}
          title={modalIndex.label}
          subtitle={modalIndex.definition}
          csv={indexToCsv(modalIndex, meta.year)}
          csvName={`${modalIndex.id}-${meta.year}.csv`}
          breakdowns={indexBreakdowns(modalIndex)}
          target={modalIndex.target}
          scale={modalIndex.scale}
          yearScores={
            multi
              ? getIndexAcrossYears(modalIndex.id, compareYears)
              : undefined
          }
        >
          {multi && compareYears.length > 1 ? (
            <div className="space-y-4">
              <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                Driver nel tempo
              </p>
              {getDriversAcrossYears(modalIndex.id, compareYears).map((d) => (
                <div key={d.label}>
                  <p className="m-0 mb-1.5 text-center text-sm font-medium">
                    <LabeledTerm label={d.label} />
                  </p>
                  <div className="flex justify-center">
                    <YearCompare
                      items={d.byYear}
                      focusYear={year}
                      label={`Andamento ${d.label}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {modalIndex.drivers.map((d) => (
                <div
                  key={d.label}
                  className="flex items-baseline justify-between gap-3 border-b border-line py-2"
                >
                  <p className="m-0 text-sm font-medium">
                    <LabeledTerm label={d.label} />
                  </p>
                  <p className="m-0 font-mono text-sm tabular-nums">
                    {formatKpiValue(d.score, modalIndex.scale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ChartModal>
      ) : null}

      <ChatPeek />
      <ChatFloat busy={chatBusy} />
      <ChatBar />
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <AppShell />
    </DemoProvider>
  )
}
