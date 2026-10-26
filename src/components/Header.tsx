/**
 * REVIEW — Header
 * - Titolo "GOALmar: …" senza corsivo; KPI maiuscolo arriva da meta.title.
 * - Mark = porta 3D rossa (SVG), senza quadrato di sfondo.
 * - Hero grande → compact allo scroll; tracking stretto sul titolo.
 * - Fondo opaco (bg-bg), no trasparenza/blur.
 * - --header-h aggiornato da altezza reale (ResizeObserver) per non coprire la nav.
 * - Azioni: Scarica HTML (outline) + Scarica PDF (secondary rosso chiaro).
 */
import { useEffect, useRef, useState } from 'react'

type Props = {
  title: string
  onExportPdf: () => void
  onExportHtml: () => void
  exporting: boolean
}

const COMPACT_THRESHOLD = 48

const btnBase =
  'appearance-none border border-ink rounded-sm px-4 py-2 text-[13.5px] font-medium whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-wait'

export function Header({ title, onExportPdf, onExportHtml, exporting }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > COMPACT_THRESHOLD,
  )

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const syncHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--header-h', `${height}px`)
    }

    const syncCompact = () => {
      setCompact(window.scrollY > COMPACT_THRESHOLD)
    }

    syncCompact()
    syncHeight()

    const ro = new ResizeObserver(syncHeight)
    ro.observe(el)

    el.addEventListener('transitionend', syncHeight)
    window.addEventListener('scroll', syncCompact, { passive: true })
    window.addEventListener('resize', syncHeight)

    return () => {
      ro.disconnect()
      el.removeEventListener('transitionend', syncHeight)
      window.removeEventListener('scroll', syncCompact)
      window.removeEventListener('resize', syncHeight)
      document.documentElement.style.removeProperty('--header-h')
    }
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    // After compact class toggles, measure on next frame (post-layout)
    const id = requestAnimationFrame(() => {
      const height = Math.ceil(el.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--header-h', `${height}px`)
    })
    return () => cancelAnimationFrame(id)
  }, [compact])

  return (
    <header
      ref={headerRef}
      className={`site-header sticky top-0 z-40 border-b border-line bg-bg${compact ? ' site-header--compact' : ''}`}
    >
      <div className="site-header__inner mx-auto flex max-w-report items-center justify-between gap-6 px-5 py-[22px]">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="site-header__mark grid shrink-0 place-items-center leading-none" aria-hidden="true">
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
              <path d="M4.4 6.4 H27.6" stroke="#ff6b66" strokeWidth="0.6" opacity="0.7" />
              <path d="M4.5 6.5 V23.5" stroke="#ff6b66" strokeWidth="0.5" opacity="0.55" />
            </svg>
          </span>
          <h1 className="site-header__title m-0 font-display font-bold tracking-[-0.03em] leading-[1.15]">
            GOALmar: {title}
          </h1>
        </div>
        <div className="site-header__actions no-print flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={`${btnBase} bg-bg-elevated text-ink`}
            onClick={onExportHtml}
            disabled={exporting}
          >
            Scarica HTML
          </button>
          <button
            type="button"
            className={`${btnBase} bg-accent-secondary text-white hover:brightness-105`}
            onClick={onExportPdf}
            disabled={exporting}
          >
            {exporting ? 'PDF…' : 'Scarica PDF'}
          </button>
        </div>
      </div>
    </header>
  )
}
