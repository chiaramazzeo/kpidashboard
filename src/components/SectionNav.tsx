/**
 * REVIEW — Section nav (chip)
 * - Chip con bordo; attiva = stroke+testo accent, NON fill rosso pieno.
 * - Niente underline / border-bottom di selezione.
 * - Al click: lock activeId durante smooth scroll (altrimenti lo spy la “spegne”).
 * - Dentro SiteChrome sticky (header+nav uniti, niente gap).
 * - Allo scroll della pagina: la track orizzontale tiene la chip attiva nella metà sinistra.
 * - Overflow: niente scrollbar; fade laterali + frecce.
 */
import { useEffect, useRef, useState } from 'react'
import { SECTION_IDS, SECTION_LINKS } from '../data/nav'

const links = SECTION_LINKS
const sectionIds = SECTION_IDS
const SCROLL_STEP = 180

function stickyOffset() {
  const styles = getComputedStyle(document.documentElement)
  const chromeH =
    Number.parseFloat(styles.getPropertyValue('--chrome-h')) ||
    Number.parseFloat(styles.getPropertyValue('--header-h')) ||
    100
  const stickyGap =
    Number.parseFloat(styles.getPropertyValue('--sticky-gap')) || 8
  return chromeH + stickyGap
}

function resolveActiveId() {
  const offset = stickyOffset()
  let current = sectionIds[0]

  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= offset) {
      current = id
    }
  }

  return current
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M9 2 L4 7 L9 12' : 'M5 2 L10 7 L5 12'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function SectionNav() {
  const [activeId, setActiveId] = useState(sectionIds[0])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const lockedId = useRef<string | null>(null)
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  const syncOverflow = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const { scrollLeft, scrollWidth, clientWidth } = scroller
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
  }

  useEffect(() => {
    const clearUnlockTimer = () => {
      if (unlockTimer.current !== null) {
        clearTimeout(unlockTimer.current)
        unlockTimer.current = null
      }
    }

    const unlock = () => {
      lockedId.current = null
      clearUnlockTimer()
      setActiveId(resolveActiveId())
    }

    const scheduleUnlock = () => {
      clearUnlockTimer()
      unlockTimer.current = setTimeout(unlock, 400)
    }

    const syncActive = () => {
      if (lockedId.current) {
        scheduleUnlock()
        return
      }
      setActiveId(resolveActiveId())
    }

    const onScrollEnd = () => {
      if (!lockedId.current) return
      unlock()
    }

    setActiveId(resolveActiveId())
    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('hashchange', syncActive)
    window.addEventListener('scrollend', onScrollEnd)

    return () => {
      clearUnlockTimer()
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('hashchange', syncActive)
      window.removeEventListener('scrollend', onScrollEnd)
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    syncOverflow()
    scroller.addEventListener('scroll', syncOverflow, { passive: true })
    window.addEventListener('resize', syncOverflow)

    const ro = new ResizeObserver(syncOverflow)
    ro.observe(scroller)

    return () => {
      scroller.removeEventListener('scroll', syncOverflow)
      window.removeEventListener('resize', syncOverflow)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    const chip = chipRefs.current[activeId]
    if (!scroller || !chip) return

    const target =
      chip.offsetLeft - scroller.clientWidth * 0.25 + chip.offsetWidth / 2
    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    const nextLeft = Math.max(0, Math.min(target, maxScroll))

    if (Math.abs(scroller.scrollLeft - nextLeft) < 2) {
      syncOverflow()
      return
    }

    scroller.scrollTo({
      left: nextLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })

    const t = window.setTimeout(syncOverflow, 350)
    return () => clearTimeout(t)
  }, [activeId])

  const handleClick = (id: string) => {
    lockedId.current = id
    setActiveId(id)
  }

  const nudge = (dir: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({
      left: dir * SCROLL_STEP,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  return (
    <nav className="section-nav border-b border-line bg-bg" aria-label="Sezioni">
      <div className="section-nav__shell relative mx-auto max-w-report">
        <div
          ref={scrollerRef}
          className="section-nav__scroller box-border flex items-center gap-1 overflow-x-auto px-5 py-3"
        >
          {links.map((link) => {
            const id = link.href.slice(1)
            const isActive = activeId === id
            return (
              <a
                key={link.href}
                ref={(el) => {
                  chipRefs.current[id] = el
                }}
                href={link.href}
                className={`shrink-0 rounded-sm border px-3 py-2 text-chip font-medium no-underline transition-colors duration-150 ${
                  isActive
                    ? 'is-active border-accent bg-transparent text-accent'
                    : 'border-transparent bg-transparent text-muted hover:bg-bg-warm hover:text-ink'
                }`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => handleClick(id)}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        <div
          className={`section-nav__fade section-nav__fade--left${canScrollLeft ? ' is-visible' : ''}`}
          aria-hidden
        />
        <div
          className={`section-nav__fade section-nav__fade--right${canScrollRight ? ' is-visible' : ''}`}
          aria-hidden
        />

        <button
          type="button"
          className={`section-nav__arrow section-nav__arrow--left${canScrollLeft ? ' is-visible' : ''}`}
          aria-label="Sezioni precedenti"
          tabIndex={canScrollLeft ? 0 : -1}
          disabled={!canScrollLeft}
          onClick={() => nudge(-1)}
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          className={`section-nav__arrow section-nav__arrow--right${canScrollRight ? ' is-visible' : ''}`}
          aria-label="Sezioni successive"
          tabIndex={canScrollRight ? 0 : -1}
          disabled={!canScrollRight}
          onClick={() => nudge(1)}
        >
          <Chevron dir="right" />
        </button>
      </div>
    </nav>
  )
}
