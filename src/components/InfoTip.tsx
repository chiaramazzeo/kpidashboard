/**
 * Simbolo «i»: in hover/focus mostra una definizione semplice.
 *
 * SHADCN: prima CSS `.info-tip__panel` (hover puro).
 * Ora `Tooltip` Radix (focus keyboard, delay da TooltipProvider in main.tsx).
 * Il bottone «i» mantiene le classi CSS `.info-tip__btn` per il look cerchio;
 * il pannello è TooltipContent (niente più `.info-tip__panel` obbligatorio).
 */
import { GLOSSARY, type GlossaryKey } from '../data/glossary'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  tip?: string
  term?: GlossaryKey
  /** Accessible name; default da glossary o “Info”. */
  label?: string
  className?: string
}

export function InfoTip({ tip, term, label, className = '' }: Props) {
  const fromGlossary = term ? GLOSSARY[term] : undefined
  const text = tip ?? fromGlossary?.tip
  const aria = label ?? fromGlossary?.label ?? 'Info'
  if (!text) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn('info-tip__btn', className)}
          aria-label={`Info: ${aria}`}
        >
          i
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="max-w-64 rounded-sm border border-ink bg-bg-elevated px-3 py-2 text-left text-xs leading-snug text-ink shadow-md"
      >
        {fromGlossary?.label ? (
          <strong className="mb-1 block font-semibold text-ink">
            {fromGlossary.label}
          </strong>
        ) : null}
        <span className="text-ink-soft">{text}</span>
      </TooltipContent>
    </Tooltip>
  )
}

/** Etichetta driver/dettaglio: toglie «(proxy)» e mette la «i» con spiegazione. */
export function LabeledTerm({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  const proxy = /\(\s*proxy\s*\)/i.test(label)
  const clean = label.replace(/\s*\(\s*proxy\s*\)/gi, '').trim()

  return (
    <span className={cn('inline-flex items-baseline gap-1', className)}>
      <span>{clean}</span>
      {proxy ? <InfoTip term="proxy" /> : null}
    </span>
  )
}
