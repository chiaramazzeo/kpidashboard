/**
 * REVIEW — Header
 * - Titolo "GOALmar: …" senza corsivo; KPI maiuscolo arriva da meta.title.
 * - Mark = porta 3D rossa (SVG), senza quadrato di sfondo.
 * - Hero grande → compact allo scroll; tracking stretto sul titolo.
 * - Fondo opaco (bg-bg), no trasparenza/blur.
 * - Altezza chrome gestita da SiteChrome (--chrome-h).
 * - Calendario (anno report) + hamburger export.
 * - Mobile hero: titolo su 2 righe; compact/desktop: una riga.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { YearPicker } from './YearPicker'

type Props = {
  title: string
  year: number
  availableYears: readonly number[]
  onYearChange: (year: number) => void
  onExportPdf: () => void
  onExportHtml: () => void
  onImportCsv: () => void
  exporting: boolean
}

/** Isteresi: evita flicker quando lo shrink dell’header sposta scrollY intorno alla soglia. */
const ENTER_COMPACT = 64
const EXIT_COMPACT = 16

const menuItemClass =
  'appearance-none block w-full border-0 bg-transparent px-4 py-3 text-left text-sm font-medium text-ink cursor-pointer hover:bg-bg-warm disabled:opacity-60 disabled:cursor-wait'

export function Header({
  title,
  year,
  availableYears,
  onYearChange,
  onExportPdf,
  onExportHtml,
  onImportCsv,
  exporting,
}: Props) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const yearMenuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)
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

  useEffect(() => {
    if (!menuOpen && !yearOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
        setYearOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setYearOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, yearOpen])

  const runExport = (action: () => void) => {
    setMenuOpen(false)
    action()
  }

  const handleYearChange = (next: number) => {
    onYearChange(next)
    setYearOpen(false)
  }

  return (
    <header
      className={`site-header border-b border-line bg-bg${compact ? ' site-header--compact' : ''}`}
    >
      <div className="site-header__inner mx-auto flex max-w-report items-center justify-between gap-4 px-5 max-sm:items-start">
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
            <span className="site-header__title-brand">GOALmar:</span>{' '}
            <span className="site-header__title-kpi">{title}</span>
          </h1>
        </div>

        <div
          ref={actionsRef}
          className="site-header__actions no-print relative flex shrink-0 items-center gap-2"
        >
          <button
            type="button"
            className="site-header__menu-btn grid place-items-center rounded-sm border border-ink bg-bg-elevated text-ink"
            aria-label={yearOpen ? 'Chiudi selezione anno' : 'Seleziona anno report'}
            aria-expanded={yearOpen}
            aria-controls={yearMenuId}
            onClick={() => {
              setYearOpen((open) => !open)
              setMenuOpen(false)
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="3.5"
                width="14"
                height="12.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M2 7.5 H16" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M6 2 V5 M12 2 V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>

          {yearOpen && (
            <div
              id={yearMenuId}
              className="absolute top-[calc(100%+6px)] right-12 z-50 border border-ink bg-bg-elevated p-3"
              role="dialog"
              aria-label="Anno report"
            >
              <p className="m-0 mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                Anno report
              </p>
              <YearPicker
                years={availableYears}
                value={year}
                onChange={handleYearChange}
              />
            </div>
          )}

          <button
            type="button"
            className="site-header__menu-btn grid place-items-center rounded-sm border border-ink bg-bg-elevated text-ink"
            aria-label={menuOpen ? 'Chiudi menu esportazione' : 'Apri menu esportazione'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            disabled={exporting}
            onClick={() => {
              setMenuOpen((open) => !open)
              setYearOpen(false)
            }}
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
          </button>

          {menuOpen && (
            <div
              id={menuId}
              role="menu"
              aria-label="Esporta"
              className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-44 border border-ink bg-bg-elevated"
            >
              <button
                type="button"
                role="menuitem"
                className={`${menuItemClass} border-b border-line`}
                disabled={exporting}
                onClick={() => runExport(onExportHtml)}
              >
                Scarica HTML
              </button>
              <button
                type="button"
                role="menuitem"
                className={`${menuItemClass} border-b border-line text-accent-secondary`}
                disabled={exporting}
                onClick={() => runExport(onExportPdf)}
              >
                {exporting ? 'PDF…' : 'Scarica PDF'}
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItemClass}
                onClick={() => {
                  setMenuOpen(false)
                  onImportCsv()
                }}
              >
                Importa CSV…
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
