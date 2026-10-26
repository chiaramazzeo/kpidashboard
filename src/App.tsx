/**
 * REVIEW / DESIGN INTENT (Golmar 2026 KPI)
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
import { useRef, useState } from 'react'
import { GroupedBars } from './components/charts/GroupedBars'
import { HorizontalBars } from './components/charts/HorizontalBars'
import { ParticipationStack } from './components/charts/ParticipationStack'
import { SlopeChart } from './components/charts/SlopeChart'
import { SmallMultiples } from './components/charts/SmallMultiples'
import { YoYBars } from './components/charts/YoYBars'
import { CountUp } from './components/CountUp'
import { DeltaBadge } from './components/DeltaBadge'
import { Header } from './components/Header'
import { KpiCard } from './components/KpiCard'
import { Reveal } from './components/Reveal'
import { SectionNav } from './components/SectionNav'
import { surveyData } from './data/kpis'
import { exportDashboardHtml } from './utils/exportHtml'
import { exportDashboardPdf } from './utils/exportPdf'

const data = surveyData
const { meta, responseRate, indices, splits } = data
const [engagement, enablement, innovation, trust] = indices

const sectionLabel =
  'm-0 mb-3 font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted'
const sectionHead =
  'mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3'
const sectionScore =
  'm-0 flex items-baseline gap-3 font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-none tracking-[-0.015em]'
const sectionClass =
  'section border-b border-line py-[44px] [scroll-margin-top:calc(var(--header-h)+var(--nav-h)+8px)]'

function App() {
  const reportRef = useRef<HTMLElement>(null)
  const [exporting] = useState(false)

  const handleExportPdf = () => {
    if (exporting) return
    exportDashboardPdf()
  }

  const handleExportHtml = () => {
    if (!reportRef.current || exporting) return
    try {
      exportDashboardHtml(
        reportRef.current,
        'Golmar-2026-KPI.html',
        meta.title,
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={exporting ? 'exporting' : undefined}>
      <Header
        title={meta.title}
        onExportPdf={handleExportPdf}
        onExportHtml={handleExportHtml}
        exporting={exporting}
      />
      <SectionNav />

      <main className="report mx-auto max-w-report px-5 pb-14" ref={reportRef}>
        <section className={`${sectionClass} pt-10`} id="response">
          <Reveal delay={0}>
            <p className={sectionLabel}>Response Rate</p>
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
            <p className="mt-4 mb-0 flex flex-col gap-[2px] font-mono text-[12.5px] text-muted">
              <span className="text-base text-ink">
                <CountUp value={meta.respondents} /> / <CountUp value={meta.invited} />
              </span>
              <span>rispondenti</span>
            </p>
          </Reveal>
          <Reveal delay={200} className="max-w-[36rem]">
            <ParticipationStack items={responseRate.byArea} />
          </Reveal>
        </section>

        <section className={sectionClass} id="overview">
          <Reveal>
            <p className={sectionLabel}>Overview</p>
          </Reveal>
          <div className="my-2 mb-8 grid grid-cols-4 border-y border-ink max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
            {indices.map((index, i) => (
              <KpiCard
                key={index.id}
                index={index}
                previousYear={meta.previousYear}
                href={`#${index.id}`}
                delay={80 + i * 70}
              />
            ))}
          </div>
          <Reveal delay={280} className="max-w-full">
            <YoYBars
              currentLabel={String(meta.year)}
              previousLabel={String(meta.previousYear)}
              items={indices.map((i) => ({
                label: i.shortLabel,
                current: i.score,
                previous: i.previousScore,
              }))}
            />
          </Reveal>
        </section>

        <section className={sectionClass} id="engagement">
          <Reveal className={sectionHead}>
            <p className={`${sectionLabel} mb-0`}>Engagement</p>
            <p className={sectionScore}>
              <CountUp value={engagement.score} />
              <DeltaBadge
                current={engagement.score}
                previous={engagement.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="max-w-full">
            <HorizontalBars
              color="var(--color-series-a)"
              items={engagement.drivers.map((d) => ({
                label: d.label,
                value: d.score,
              }))}
            />
          </Reveal>
        </section>

        <section className={sectionClass} id="enablement">
          <Reveal className={sectionHead}>
            <p className={`${sectionLabel} mb-0`}>Enablement</p>
            <p className={sectionScore}>
              <CountUp value={enablement.score} />
              <DeltaBadge
                current={enablement.score}
                previous={enablement.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="max-w-full">
            <GroupedBars
              currentLabel={String(meta.year)}
              previousLabel={String(meta.previousYear)}
              items={enablement.drivers.map((d) => ({
                label: d.label,
                current: d.score,
                previous: d.previousScore,
              }))}
            />
          </Reveal>
        </section>

        <section className={sectionClass} id="innovation">
          <Reveal className={sectionHead}>
            <p className={`${sectionLabel} mb-0`}>Innovation</p>
            <p className={sectionScore}>
              <CountUp value={innovation.score} />
              <DeltaBadge
                current={innovation.score}
                previous={innovation.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="max-w-full">
            <SmallMultiples
              year={meta.year}
              previousYear={meta.previousYear}
              items={innovation.drivers}
            />
          </Reveal>
        </section>

        <section className={sectionClass} id="trust">
          <Reveal className={sectionHead}>
            <p className={`${sectionLabel} mb-0`}>Trust</p>
            <p className={sectionScore}>
              <CountUp value={trust.score} />
              <DeltaBadge
                current={trust.score}
                previous={trust.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <div className="grid grid-cols-[minmax(12rem,16rem)_1fr] items-center gap-8 max-[900px]:grid-cols-1">
            <Reveal delay={100} className="max-w-full">
              <SlopeChart
                previousLabel={String(meta.previousYear)}
                currentLabel={String(meta.year)}
                previous={trust.previousScore}
                current={trust.score}
              />
            </Reveal>
            <Reveal delay={180} className="max-w-full">
              <HorizontalBars
                color="var(--color-series-b)"
                items={[...trust.drivers]
                  .sort((a, b) => b.score - a.score)
                  .map((d) => ({ label: d.label, value: d.score }))}
              />
            </Reveal>
          </div>
        </section>

        <section className={sectionClass} id="splits">
          <Reveal>
            <p className={sectionLabel}>Segmenti</p>
          </Reveal>
          <div className="mt-2 grid grid-cols-3 gap-x-6 gap-y-8 max-[900px]:grid-cols-1">
            <Reveal delay={80} className="max-w-full">
              <p className="mb-[14px] mt-0 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted">
                Area
              </p>
              <YoYBars
                currentLabel={String(meta.year)}
                previousLabel={String(meta.previousYear)}
                items={splits.engagementByArea.map((s) => ({
                  label: s.label,
                  current: s.score,
                  previous: s.previousScore ?? s.score,
                }))}
              />
            </Reveal>
            <Reveal delay={140} className="max-w-full">
              <p className="mb-[14px] mt-0 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted">
                Seniority
              </p>
              <HorizontalBars
                color="var(--color-series-b)"
                items={splits.trustBySeniority.map((s) => ({
                  label: s.label,
                  value: s.score,
                }))}
              />
            </Reveal>
            <Reveal delay={200} className="max-w-full">
              <p className="mb-[14px] mt-0 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted">
                Funzione
              </p>
              <GroupedBars
                currentLabel={String(meta.year)}
                previousLabel={String(meta.previousYear)}
                items={splits.enablementByFunction.map((s) => ({
                  label: s.label,
                  current: s.score,
                  previous: s.previousScore ?? s.score,
                }))}
              />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-report flex-wrap justify-between gap-3 px-5 pb-10 pt-6 font-mono text-[11.5px] text-muted">
        <span>
          {meta.company} · {meta.title}
        </span>
      </footer>
    </div>
  )
}

export default App
