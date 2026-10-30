/**
 * Score anno ↔ Trend anni (Overview L2+).
 * Stesso pattern segmentato dei chip livello Header (`segmentGroup`).
 */
import type { OverviewMode } from '../../context/DemoContext'
import {
  segmentGroup,
  segmentItem,
  segmentItemOff,
  segmentItemOn,
} from '@/lib/ui'
import { cn } from '@/lib/utils'

export function OverviewModeToggle({
  value,
  onChange,
}: {
  value: OverviewMode
  onChange: (mode: OverviewMode) => void
}) {
  const modes: { id: OverviewMode; label: string }[] = [
    { id: 'year', label: 'Score anno' },
    { id: 'compare', label: 'Trend anni' },
  ]
  return (
    <div className={segmentGroup} role="group" aria-label="Vista Overview">
      {modes.map((m, i) => {
        const on = value === m.id
        return (
          <button
            key={m.id}
            type="button"
            className={cn(
              segmentItem,
              i > 0 && 'border-l border-ink',
              on ? segmentItemOn : segmentItemOff,
            )}
            aria-pressed={on}
            onClick={() => onChange(m.id)}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
