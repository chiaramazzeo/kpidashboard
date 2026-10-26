import { useEffect, useState } from 'react'

type Props = {
  title: string
  onExport: () => void
  exporting: boolean
}

const HEADER_H_EXPANDED = '92px'
const HEADER_H_COMPACT = '56px'
const COMPACT_THRESHOLD = 48

export function Header({ title, onExport, exporting }: Props) {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > COMPACT_THRESHOLD,
  )

  useEffect(() => {
    const sync = () => {
      const next = window.scrollY > COMPACT_THRESHOLD
      setCompact(next)
      document.documentElement.style.setProperty(
        '--header-h',
        next ? HEADER_H_COMPACT : HEADER_H_EXPANDED,
      )
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
      document.documentElement.style.removeProperty('--header-h')
    }
  }, [])

  return (
    <header className={`site-header${compact ? ' site-header--compact' : ''}`}>
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true">
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
              <path d="M4 6 H28 V8 H4 Z" fill="var(--accent)" />
              <path d="M4 6 H6 V24 H4 Z" fill="var(--accent)" />
              <path d="M26 6 H28 V24 H26 Z" fill="var(--accent)" />
              <path d="M4.4 6.4 H27.6" stroke="#ff6b66" strokeWidth="0.6" opacity="0.7" />
              <path d="M4.5 6.5 V23.5" stroke="#ff6b66" strokeWidth="0.5" opacity="0.55" />
            </svg>
          </span>
          <h1 className="site-header__title">
            GOALmar: {title}
          </h1>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onExport}
          disabled={exporting}
        >
          {exporting ? 'PDF…' : 'Scarica PDF'}
        </button>
      </div>
    </header>
  )
}
