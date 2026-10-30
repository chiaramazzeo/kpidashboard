/**
 * REVIEW — Header
 * - Titolo = solo meta.title (niente prefisso GOALmar); mark porta 3D.
 * - Chip livelli 1–2–3 in alto a destra + switch Admin/Utente.
 * - Hero → compact allo scroll; fondo opaco.
 *
 * SHADCN (migrazione)
 * Prima: `<button>` + menu assoluto gestito a mano (mousedown/Escape).
 * Ora:
 *   - `Button` → PDF desktop + trigger anno + hamburger
 *   - `DropdownMenu` → Scarica HTML / PDF / Importa CSV (a11y Radix)
 *   - `Switch` → Admin/Utente (solo area survey + feature surveyAdmin)
 * I chip L1–L2–L3 restano custom: usano `LEVEL_THEMES[l].accent` runtime
 * (non mappabile 1:1 su variant Button senza perdere i colori per livello).
 */
import { useEffect, useId, useRef, useState } from 'react'
import { LEVEL_THEMES } from '../data/levels'
import type { DemoLevel } from '../data/types'
import { useDemo } from '../context/DemoContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { YearPicker } from './YearPicker'

type Props = {
  title: string
  onExportPdf: () => void
  onExportHtml: () => void
  onImportCsv: () => void
  exporting: boolean
}

const ENTER_COMPACT = 64
const EXIT_COMPACT = 16

export function Header({
  title,
  onExportPdf,
  onExportHtml,
  onImportCsv,
  exporting,
}: Props) {
  const {
    level,
    setLevel,
    role,
    setRole,
    year,
    setYear,
    years,
    feature,
    area,
  } = useDemo()
  const yearPanelRef = useRef<HTMLDivElement>(null)
  const yearMenuId = useId()
  const [yearOpen, setYearOpen] = useState(false)
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > ENTER_COMPACT,
  )

  useEffect(() => {
    const syncCompact = () => {
      const y = window.scrollY
      setCompact((prev) => {
        if (!prev && y > ENTER_COMPACT) return true
        if (prev && y < EXIT_COMPACT) return false
        return prev
      })
    }
    syncCompact()
    window.addEventListener('scroll', syncCompact, { passive: true })
    return () => window.removeEventListener('scroll', syncCompact)
  }, [])

  // Solo il popover anno resta manuale (YearPicker custom). Il menu export è DropdownMenu.
  useEffect(() => {
    if (!yearOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (!yearPanelRef.current?.contains(event.target as Node)) {
        setYearOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setYearOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [yearOpen])

  return (
    <header
      className={`site-header border-b border-line bg-bg${compact ? ' site-header--compact' : ''}`}
    >
      <div className="site-header__inner mx-auto flex max-w-report flex-col gap-3 px-5">
        <div className="flex items-center justify-between gap-4 max-sm:items-start">
          <div className="site-header__brand flex min-w-0 flex-1 items-center gap-4 max-sm:items-start">
            <span
              className="site-header__mark grid shrink-0 place-items-center leading-none max-sm:mt-1"
              aria-hidden="true"
            >
              <svg viewBox="0 0 32 28" width="32" height="28" fill="none">
                <g stroke="#c9a0a0" strokeWidth="0.7" opacity="0.85">
                  <path d="M7 6.5 L9.5 8.5 V22" />
                  <path d="M16 5.2 L16 22.5" />
                  <path d="M25 6.5 L22.5 8.5 V22" />
                  <path d="M9.5 8.5 H22.5" />
                  <path d="M8.2 12.5 H23.8" />
                  <path d="M7.5 16.5 H24.5" />
                  <path d="M7.2 20 H24.8" />
                </g>
                <path d="M4 6 L6 4.2 H26 L28 6 Z" fill="#a80500" />
                <path d="M6 4.2 H26 L25.2 5.6 H6.8 Z" fill="#f24a45" />
                <path d="M4 6 L6 4.2 V22.8 L4 24 Z" fill="#a80500" />
                <path d="M28 6 L26 4.2 V22.8 L28 24 Z" fill="#8f0400" />
                <path d="M4 6 H28 V8 H4 Z" fill="var(--color-accent)" />
                <path d="M4 6 H6 V24 H4 Z" fill="var(--color-accent)" />
                <path d="M26 6 H28 V24 H26 Z" fill="var(--color-accent)" />
                <path
                  d="M4.4 6.4 H27.6"
                  stroke="#ff6b66"
                  strokeWidth="0.6"
                  opacity="0.7"
                />
                <path
                  d="M4.5 6.5 V23.5"
                  stroke="#ff6b66"
                  strokeWidth="0.5"
                  opacity="0.55"
                />
              </svg>
            </span>
            <h1 className="site-header__title m-0 min-w-0 font-display font-bold tracking-[-0.03em] leading-[1.15]">
              <span className="site-header__title-kpi">{title}</span>
            </h1>
          </div>

          <div className="site-header__actions no-print relative flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {feature('multiYear') ? (
              <div ref={yearPanelRef} className="relative flex items-center gap-1.5">
                <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.06em] text-muted lg:inline">
                  Anno report
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-2.5 font-mono text-xs"
                  aria-label={
                    yearOpen
                      ? 'Chiudi selezione anno report'
                      : 'Seleziona anno del report (score principale)'
                  }
                  aria-expanded={yearOpen}
                  aria-controls={yearMenuId}
                  onClick={() => setYearOpen((open) => !open)}
                >
                  {year}
                </Button>
                {yearOpen && (
                  <div
                    id={yearMenuId}
                    className="absolute top-[calc(100%+6px)] left-0 z-50 border border-ink bg-bg-elevated p-3"
                    role="dialog"
                    aria-label="Anno del report"
                  >
                    <p className="m-0 mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                      Anno del report
                    </p>
                    <YearPicker
                      years={years}
                      value={year}
                      onChange={(next) => {
                        setYear(next as typeof year)
                        setYearOpen(false)
                      }}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Chip livelli: accent runtime da LEVEL_THEMES — non Button shadcn */}
            <div
              className="flex h-9 overflow-hidden rounded-sm border border-ink"
              role="group"
              aria-label="Pacchetto proposta demo"
            >
              {([1, 2, 3] as DemoLevel[]).map((l, i) => {
                const active = level === l
                const theme = LEVEL_THEMES[l]
                return (
                  <button
                    key={l}
                    type="button"
                    className={`h-full min-w-9 px-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.06em] ${
                      i > 0 ? 'border-l border-ink' : ''
                    } ${
                      active
                        ? 'text-white'
                        : 'bg-bg-elevated text-ink hover:bg-bg-warm'
                    }`}
                    style={active ? { background: theme.accent } : undefined}
                    aria-pressed={active}
                    title={theme.label}
                    onClick={() => setLevel(l)}
                  >
                    L{l}
                  </button>
                )
              })}
            </div>

            {/* Prima: segmented Admin|Utente. Ora: Switch + label (stesso stato `role`). */}
            {feature('surveyAdmin') && area === 'survey' ? (
              <label className="flex h-9 items-center gap-2 rounded-sm border border-ink bg-bg-elevated px-2.5 text-xs font-medium">
                <span className={role === 'user' ? 'text-ink' : 'text-muted'}>
                  Utente
                </span>
                <Switch
                  checked={role === 'admin'}
                  onCheckedChange={(checked) =>
                    setRole(checked ? 'admin' : 'user')
                  }
                  aria-label="Passa ad Admin"
                />
                <span className={role === 'admin' ? 'text-ink' : 'text-muted'}>
                  Admin
                </span>
              </label>
            ) : null}

            {/* variant=secondary → --secondary #f87874 (PDF) */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 font-mono text-[0.6875rem] font-medium"
              disabled={exporting}
              onClick={onExportPdf}
            >
              {exporting ? 'PDF…' : 'Scarica PDF'}
            </Button>

            <DropdownMenu
              onOpenChange={(open) => {
                if (open) setYearOpen(false)
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="site-header__menu-btn"
                  aria-label="Apri menu esportazione"
                  disabled={exporting}
                >
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1h16M1 7h16M1 13h16"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="square"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  disabled={exporting}
                  onSelect={() => onExportHtml()}
                >
                  Scarica HTML
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={exporting}
                  className="text-secondary"
                  onSelect={() => onExportPdf()}
                >
                  {exporting ? 'PDF…' : 'Scarica PDF'}
                </DropdownMenuItem>
                {feature('csvImport') ? (
                  <DropdownMenuItem onSelect={() => onImportCsv()}>
                    Importa CSV…
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
