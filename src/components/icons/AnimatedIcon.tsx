/**
 * Facade sulle icone Animate UI (Lucide + Motion).
 * @see https://animate-ui.com/docs/icons/get-started
 */
import { useId, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { AnimateIcon } from '@animate-ui/react/icons'
import { Maximize as ExpandIcon } from '@/components/animate-ui/icons/maximize'
import { Download as DownloadIcon } from '@/components/animate-ui/icons/download'
import { ClipboardList as TableIcon } from '@/components/animate-ui/icons/clipboard-list'
import { ChartLine as ChartIcon } from '@/components/animate-ui/icons/chart-line'
import { MessageSquare as MessageIcon } from '@/components/animate-ui/icons/message-square'
import { Pin as AnchorIcon } from '@/components/animate-ui/icons/pin'
import { X as CloseIcon } from '@/components/animate-ui/icons/x'

export {
  ExpandIcon,
  DownloadIcon,
  TableIcon,
  ChartIcon,
  MessageIcon,
  AnchorIcon,
  CloseIcon,
}

type ActionProps = {
  label: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  children: ReactNode
  active?: boolean
}

/** Bottone icon-only: hover anima l’icona Animate UI; label dopo dwell ~400ms. */
export function IconAction({
  label,
  onClick,
  disabled,
  children,
  active,
}: ActionProps) {
  const tipId = useId()
  return (
    <AnimateIcon animateOnHover animateOnTap asChild>
      <button
        type="button"
        className={`icon-action no-print relative grid h-11 w-11 place-items-center rounded-sm border border-ink bg-bg-elevated text-ink disabled:opacity-50 ${active ? 'border-[var(--level-accent,#e10600)] text-[var(--level-accent,#e10600)]' : ''}`}
        aria-label={label}
        aria-describedby={tipId}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
        <span id={tipId} role="tooltip" className="icon-action__tip">
          {label}
        </span>
      </button>
    </AnimateIcon>
  )
}

/**
 * Indicatore “espandi” in alto a destra.
 * Deve stare dentro un `AnimateIcon` (es. `ExpandableCard`) per animarsi al hover.
 */
export function ExpandHint({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute top-3 right-3 grid h-8 w-8 place-items-center text-muted transition-colors group-hover:text-ink ${className}`}
      aria-hidden
    >
      <ExpandIcon size={18} />
    </span>
  )
}

type ExpandableCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

/** Card/tile cliccabile: hover sul pannello anima l’icona espandi. */
export function ExpandableCard({
  children,
  className = '',
  type = 'button',
  ...props
}: ExpandableCardProps) {
  return (
    <AnimateIcon animateOnHover animateOnTap asChild>
      <button type={type} className={`group ${className}`.trim()} {...props}>
        {children}
      </button>
    </AnimateIcon>
  )
}
