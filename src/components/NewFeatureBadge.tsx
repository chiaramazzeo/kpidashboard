/**
 * Badge “Nuovo in Livello N”.
 *
 * SHADCN: usa `Badge` + override colori da `--level-accent*`
 * (impostati runtime da DemoContext in base al livello attivo).
 * Non usare `variant="default"` (rosso primary fisso): il punto è il colore
 * del livello in cui la feature è nuova.
 */
import type { DemoLevel } from '../data/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function NewFeatureBadge({
  level,
  compact = false,
}: {
  level: DemoLevel
  compact?: boolean
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'new-feature-badge font-mono uppercase tracking-[0.08em]',
        compact
          ? 'px-1.5 py-0 text-[0.5625rem]'
          : 'px-2 py-0.5 text-[0.625rem]',
      )}
      style={{
        borderColor: 'var(--level-accent)',
        color: 'var(--level-accent)',
        background: 'var(--level-accent-soft)',
      }}
    >
      {compact ? `Nuovo L${level}` : `Nuovo in L${level}`}
    </Badge>
  )
}
