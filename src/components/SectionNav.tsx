/**
 * Chip sezioni — sincronizzate con l’indice del carosello (non scroll spy verticale).
 */
import { useEffect, useRef, useState } from 'react'
import { sectionsForLevel } from '../data/nav'
import { useDemo } from '../context/DemoContext'
import { NewFeatureBadge } from './NewFeatureBadge'

type Props = {
  activeId: string
  onSelect: (id: string) => void
}

export function SectionNav({ activeId, onSelect }: Props) {
  const { level, area } = useDemo()
  const links = sectionsForLevel(level, area)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const syncFade = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    syncFade()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', syncFade, { passive: true })
    const ro = new ResizeObserver(syncFade)
    ro.observe(el)

    // Wheel/trackpad + drag sulla riga chip → scroll orizzontale (non solo scrollbar).
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 1) return
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      if (absX < 0.5 && absY < 0.5) return
      // Verticale→orizzontale sui chip, un po’ smorzato.
      const delta = absX >= absY ? e.deltaX : e.deltaY * 0.55
      const next = el.scrollLeft + delta
      const max = el.scrollWidth - el.clientWidth
      if (next <= 0 && el.scrollLeft <= 0 && delta < 0) return
      if (next >= max && el.scrollLeft >= max - 1 && delta > 0) return
      e.preventDefault()
      el.scrollLeft = Math.max(0, Math.min(max, next))
    }

    let pid: number | null = null
    let startX = 0
    let startScroll = 0
    let dragged = false

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      pid = e.pointerId
      startX = e.clientX
      startScroll = el.scrollLeft
      dragged = false
    }
    const onMove = (e: PointerEvent) => {
      if (pid !== e.pointerId) return
      const dx = e.clientX - startX
      if (Math.abs(dx) < 6) return
      dragged = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = (e: PointerEvent) => {
      if (pid !== e.pointerId) return
      pid = null
      if (!dragged) return
      const suppress = (ev: Event) => {
        ev.preventDefault()
        ev.stopPropagation()
        el.removeEventListener('click', suppress, true)
      }
      el.addEventListener('click', suppress, true)
      window.setTimeout(() => el.removeEventListener('click', suppress, true), 0)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    return () => {
      el.removeEventListener('scroll', syncFade)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      ro.disconnect()
    }
  }, [links])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const chip = el.querySelector<HTMLElement>(`[data-section="${activeId}"]`)
    chip?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  return (
    <nav className="section-nav border-b border-line" aria-label="Sezioni">
      <div className="relative mx-auto max-w-report px-5 py-2.5">
        <div
          className={`section-nav__fade section-nav__fade--left${canLeft ? ' is-visible' : ''}`}
        />
        <div
          className={`section-nav__fade section-nav__fade--right${canRight ? ' is-visible' : ''}`}
        />
        <button
          type="button"
          className={`section-nav__arrow section-nav__arrow--left${canLeft ? ' is-visible' : ''}`}
          aria-label="Scorri chip a sinistra"
          disabled={!canLeft}
          onClick={() =>
            scrollerRef.current?.scrollBy({ left: -160, behavior: 'smooth' })
          }
        >
          ‹
        </button>
        <button
          type="button"
          className={`section-nav__arrow section-nav__arrow--right${canRight ? ' is-visible' : ''}`}
          aria-label="Scorri chip a destra"
          disabled={!canRight}
          onClick={() =>
            scrollerRef.current?.scrollBy({ left: 160, behavior: 'smooth' })
          }
        >
          ›
        </button>
        <div
          ref={scrollerRef}
          className="section-nav__scroller flex gap-2 overflow-x-auto py-0.5"
        >
          {links.map((link) => {
            const active = link.id === activeId
            const isNew = link.introducedIn === level
            return (
              <button
                key={link.id}
                type="button"
                data-section={link.id}
                className={`shrink-0 rounded-sm border px-3 py-2 text-chip whitespace-nowrap transition-colors ${
                  active
                    ? 'border-accent text-accent'
                    : isNew
                      ? 'border-[var(--level-accent)] text-[var(--level-accent)]'
                      : 'border-line text-ink hover:border-ink'
                }`}
                style={
                  isNew && !active
                    ? { background: 'var(--level-accent-soft)' }
                    : undefined
                }
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(link.id)}
              >
                <span className="inline-flex items-center gap-2">
                  {link.label}
                  {isNew ? <NewFeatureBadge level={level} compact /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
