/**
 * Affidabilità KPI esplicita (full / good / partial / gap).
 */
import type { Reliability } from '../data/types'

const LABELS: Record<Reliability, string> = {
  full: 'Affidabilità piena',
  good: 'Affidabilità buona',
  partial: 'Affidabilità parziale',
  gap: 'Copertura incompleta',
}

type Props = {
  reliability: Reliability
  note?: string
  /** Solo chip + tooltip (niente nota a fianco). */
  compact?: boolean
  className?: string
}

export function ReliabilityBadge({
  reliability,
  note,
  compact = false,
  className = '',
}: Props) {
  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[0.625rem] uppercase tracking-[0.06em] text-muted ${className}`}
      title={note}
    >
      <span className="rounded-sm border border-line px-1.5 py-0.5 text-ink">
        {LABELS[reliability]}
      </span>
      {!compact && note ? (
        <span className="normal-case tracking-normal text-muted">{note}</span>
      ) : null}
    </span>
  )
}
