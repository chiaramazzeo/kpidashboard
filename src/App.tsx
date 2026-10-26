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
import './App.css'

const data = surveyData
const { meta, responseRate, indices, splits } = data
const [engagement, enablement, innovation, trust] = indices

function App() {
  const reportRef = useRef<HTMLElement>(null)
  const [exporting, setExporting] = useState(false)

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

      <main className="report" ref={reportRef}>
        <section className="section section--hero" id="response">
          <Reveal delay={0}>
            <p className="section__label">Response Rate</p>
          </Reveal>
          <Reveal delay={80} className="hero-block">
            <p className="hero-number">
              <CountUp value={responseRate.value} duration={1400} />
              <span className="hero-number__unit">%</span>
            </p>
            <DeltaBadge
              current={responseRate.value}
              previous={responseRate.previousValue}
              previousYear={meta.previousYear}
            />
            <p className="hero-meta">
              <span>
                <CountUp value={meta.respondents} /> / <CountUp value={meta.invited} />
              </span>
              <span>rispondenti</span>
            </p>
          </Reveal>
          <Reveal delay={200} className="hero-chart">
            <ParticipationStack items={responseRate.byArea} />
          </Reveal>
        </section>

        <section className="section" id="overview">
          <Reveal>
            <p className="section__label">Overview</p>
          </Reveal>
          <div className="kpi-strip">
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
          <Reveal delay={280} className="block-chart">
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

        <section className="section" id="engagement">
          <Reveal className="section__head">
            <p className="section__label">Engagement</p>
            <p className="section__score">
              <CountUp value={engagement.score} />
              <DeltaBadge
                current={engagement.score}
                previous={engagement.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="block-chart">
            <HorizontalBars
              color="var(--series-a)"
              items={engagement.drivers.map((d) => ({
                label: d.label,
                value: d.score,
              }))}
            />
          </Reveal>
        </section>

        <section className="section" id="enablement">
          <Reveal className="section__head">
            <p className="section__label">Enablement</p>
            <p className="section__score">
              <CountUp value={enablement.score} />
              <DeltaBadge
                current={enablement.score}
                previous={enablement.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="block-chart">
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

        <section className="section" id="innovation">
          <Reveal className="section__head">
            <p className="section__label">Innovation</p>
            <p className="section__score">
              <CountUp value={innovation.score} />
              <DeltaBadge
                current={innovation.score}
                previous={innovation.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <Reveal delay={120} className="block-chart">
            <SmallMultiples
              year={meta.year}
              previousYear={meta.previousYear}
              items={innovation.drivers}
            />
          </Reveal>
        </section>

        <section className="section" id="trust">
          <Reveal className="section__head">
            <p className="section__label">Trust</p>
            <p className="section__score">
              <CountUp value={trust.score} />
              <DeltaBadge
                current={trust.score}
                previous={trust.previousScore}
                previousYear={meta.previousYear}
              />
            </p>
          </Reveal>
          <div className="trust-grid">
            <Reveal delay={100} className="block-chart">
              <SlopeChart
                previousLabel={String(meta.previousYear)}
                currentLabel={String(meta.year)}
                previous={trust.previousScore}
                current={trust.score}
              />
            </Reveal>
            <Reveal delay={180} className="block-chart">
              <HorizontalBars
                color="var(--series-b)"
                items={[...trust.drivers]
                  .sort((a, b) => b.score - a.score)
                  .map((d) => ({ label: d.label, value: d.score }))}
              />
            </Reveal>
          </div>
        </section>

        <section className="section" id="splits">
          <Reveal>
            <p className="section__label">Segmenti</p>
          </Reveal>
          <div className="splits-grid">
            <Reveal delay={80} className="block-chart">
              <p className="block-chart__title">Area</p>
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
            <Reveal delay={140} className="block-chart">
              <p className="block-chart__title">Seniority</p>
              <HorizontalBars
                color="var(--series-b)"
                items={splits.trustBySeniority.map((s) => ({
                  label: s.label,
                  value: s.score,
                }))}
              />
            </Reveal>
            <Reveal delay={200} className="block-chart">
              <p className="block-chart__title">Funzione</p>
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

      <footer className="footer">
        <span>
          {meta.company} · {meta.title}
        </span>
      </footer>
    </div>
  )
}

export default App
