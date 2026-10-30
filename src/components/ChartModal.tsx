/**
 * Modal drill-down KPI (CSV, popolazioni, chat, confronto anni L2+).
 *
 * SHADCN: prima `createPortal` + Escape/overflow manuali.
 * Ora `Dialog` controllato (`open` / `onOpenChange`).
 * - `showCloseButton={false}`: usiamo IconAction Animate UI (coerenti col resto).
 * - `no-print` + `chart-modal`: esclusi da PDF/print.
 * - Layout largo (`max-w-4xl`) via className su DialogContent.
 */
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { useDemo } from '../context/DemoContext'
import { downloadCsv, parseCsvPreview } from '../utils/chartCsv'
import { formatKpiValue } from '../utils/format'
import type { ScoreScale } from '../data/types'
import type { YearScore } from '../utils/yearCompare'
import { previousAmong } from '../utils/yearCompare'
import { YearCompare } from './YearCompare'
import { DeltaBadge } from './DeltaBadge'
import { LabeledTerm } from './InfoTip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  ChartIcon,
  CloseIcon,
  DownloadIcon,
  IconAction,
  MessageIcon,
  TableIcon,
} from './icons/AnimatedIcon'

type Breakdown = {
  label: string
  score: number
  scale?: ScoreScale
  /** Confronto multi-anno (L2+); sostituisce previousScore. */
  yearScores?: YearScore[]
  previousScore?: number
  detail?: { label: string; value: number }[]
  detailByYear?: { label: string; byYear: YearScore[] }[]
}

type Props = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  csv: string
  csvName: string
  children?: ReactNode
  breakdowns?: Breakdown[]
  /** Score totale per anni filtrati (header). */
  yearScores?: YearScore[]
  target?: number
  scale?: ScoreScale
}

export function ChartModal({
  open,
  onClose,
  title,
  subtitle,
  csv,
  csvName,
  children,
  breakdowns = [],
  yearScores,
  target,
  scale,
}: Props) {
  const { feature, year, compareYears, setChatContextLabel, setChatPeek } =
    useDemo()
  const [showCsv, setShowCsv] = useState(false)
  const rows = parseCsvPreview(csv)
  const prevYear = feature('multiYear')
    ? previousAmong(compareYears, year)
    : undefined

  useEffect(() => {
    if (!open) setShowCsv(false)
  }, [open])

  /** Mini-composer contestuale: il modal KPI resta aperto sotto. */
  const openChatPeek = (e: MouseEvent<HTMLButtonElement>) => {
    setChatContextLabel(title)
    setChatPeek({
      x: e.clientX,
      y: e.clientY,
      seed: `Approfondisci i dati di «${title}»${csv ? ' partendo dal CSV del grafico.' : '.'}`,
    })
  }

  const showYears = feature('multiYear') && yearScores && yearScores.length > 1

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="chart-modal no-print flex max-h-[calc(100dvh-4rem)] w-full max-w-[calc(100%-3rem)] flex-col gap-0 overflow-hidden border-ink bg-bg p-0 sm:max-w-[min(56rem,calc(100%-4rem))]"
      >
        <DialogHeader className="space-y-0 border-b border-line px-5 py-4 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="font-display text-2xl font-bold tracking-tight">
                {title}
              </DialogTitle>
              {subtitle ? (
                <DialogDescription className="mt-1 text-muted">
                  {subtitle}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  Dettaglio KPI {title}
                </DialogDescription>
              )}
              {typeof target === 'number' && scale ? (
                <p className="mt-1 mb-0 font-mono text-xs text-muted">
                  Target {formatKpiValue(target, scale)}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <IconAction
                label={showCsv ? 'Torna al grafico' : 'Mostra CSV'}
                active={showCsv}
                onClick={() => setShowCsv((v) => !v)}
              >
                {showCsv ? (
                  <ChartIcon animateOnHover size={18} />
                ) : (
                  <TableIcon animateOnHover size={18} />
                )}
              </IconAction>
              <IconAction
                label="Scarica CSV"
                onClick={() => downloadCsv(csvName, csv)}
              >
                <DownloadIcon animateOnHover size={18} />
              </IconAction>
              {feature('chat') ? (
                <IconAction label="Chiedi in chat" onClick={openChatPeek}>
                  <MessageIcon animateOnHover size={18} />
                </IconAction>
              ) : null}
              <IconAction label="Chiudi" onClick={onClose}>
                <CloseIcon animateOnHover size={18} />
              </IconAction>
            </div>
          </div>
          {showYears ? (
            <div className="mt-4 flex w-full justify-center">
              <YearCompare
                items={yearScores!}
                focusYear={year}
                label={`Andamento ${title}`}
              />
            </div>
          ) : null}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-5">
          {showCsv ? (
            <div>
              <p className="m-0 mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                Dati CSV · {csvName}
              </p>
              <div className="overflow-auto border border-ink">
                <table className="w-full border-collapse font-mono text-xs">
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={i === 0 ? 'bg-bg-warm font-semibold' : ''}
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="border border-line px-2 py-1.5"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {children}

              {breakdowns.length > 0 ? (
                <div className="mt-8">
                  <p className="m-0 mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    Popolazioni
                  </p>
                  <Separator className="mb-4" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {breakdowns.map((b) => (
                      <div
                        key={b.label}
                        className="border border-ink bg-bg-elevated p-4"
                      >
                        <p className="m-0 text-sm font-semibold">
                          <LabeledTerm label={b.label} />
                        </p>
                        <div className="mt-2 flex flex-wrap items-end gap-3">
                          <p className="m-0 font-display text-3xl font-bold tracking-tight">
                            {formatKpiValue(
                              b.score,
                              b.scale ??
                                b.yearScores?.[0]?.scale ??
                                'index0_100',
                            )}
                          </p>
                          {!(b.yearScores && b.yearScores.length > 1) ? (
                            <DeltaBadge
                              current={b.score}
                              previous={b.previousScore}
                              previousYear={prevYear}
                            />
                          ) : null}
                        </div>
                        {b.yearScores && b.yearScores.length > 1 ? (
                          <div className="mt-3 flex justify-center">
                            <YearCompare
                              items={b.yearScores}
                              focusYear={year}
                              label={`Andamento ${b.label}`}
                            />
                          </div>
                        ) : null}
                        {b.detailByYear && b.detailByYear.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            {b.detailByYear.map((d) =>
                              d.byYear.length > 1 ? (
                                <div key={d.label}>
                                  <p className="m-0 mb-1.5 text-xs text-muted">
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
                              ) : null,
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
