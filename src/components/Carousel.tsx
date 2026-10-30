import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

type Props = {
  index: number
  onIndexChange: (index: number) => void
  count: number
  children: ReactNode
  labels?: string[]
}

/** Quanto bisogna scorrere (in frazione di slide) per impegnare il cambio. */
const COMMIT = 0.3

function normalizedWheelDelta(e: WheelEvent, pageSize: number) {
  let dx = e.deltaX
  let dy = e.deltaY
  if (e.deltaMode === 1) {
    dx *= 16
    dy *= 16
  } else if (e.deltaMode === 2) {
    dx *= pageSize
    dy *= pageSize
  }
  return { dx, dy }
}

export function Carousel({
  index,
  onIndexChange,
  count,
  children,
  labels = [],
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const ignoreScroll = useRef(false)
  const indexFromScroll = useRef(false)
  const indexRef = useRef(index)
  const countRef = useRef(count)
  const [viewportW, setViewportW] = useState(0)
  const [viewportH, setViewportH] = useState(0)

  indexRef.current = index
  countRef.current = count

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const sync = () => {
      setViewportW(el.clientWidth)
      setViewportH(el.clientHeight)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scrollToIndex = useCallback(
    (i: number, behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current
      if (!vp || viewportW <= 0) return
      const left = i * viewportW
      if (Math.abs(vp.scrollLeft - left) < 1) return
      ignoreScroll.current = true
      vp.classList.remove('carousel__viewport--free')
      vp.scrollTo({ left, behavior })
      const release = () => {
        ignoreScroll.current = false
        vp.removeEventListener('scrollend', release)
      }
      vp.addEventListener('scrollend', release, { once: true })
      // Fallback se scrollend non arriva (Safari vecchio / salto già a destinazione).
      window.setTimeout(release, behavior === 'smooth' ? 520 : 0)
    },
    [viewportW],
  )

  const go = useCallback(
    (next: number) => {
      onIndexChange(Math.max(0, Math.min(count - 1, next)))
    },
    [count, onIndexChange],
  )

  useLayoutEffect(() => {
    if (viewportW <= 0) return
    if (indexFromScroll.current) {
      indexFromScroll.current = false
      return
    }
    scrollToIndex(index, 'smooth')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, scrollToIndex])

  useLayoutEffect(() => {
    const vp = viewportRef.current
    if (!vp || viewportW <= 0) return
    ignoreScroll.current = true
    vp.classList.remove('carousel__viewport--free')
    vp.scrollLeft = index * viewportW
    window.setTimeout(() => {
      ignoreScroll.current = false
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportW])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    // Aggiorna l’indice attivo SOLO a riposo (niente flip mid-gesto Response↔Overview).
    const syncIndex = () => {
      if (ignoreScroll.current) return
      if (vp.classList.contains('carousel__viewport--free')) return
      const w = vp.clientWidth || 1
      const next = Math.max(
        0,
        Math.min(count - 1, Math.round(vp.scrollLeft / w)),
      )
      if (next === indexRef.current) return
      indexFromScroll.current = true
      onIndexChange(next)
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(syncIndex)
    }

    vp.addEventListener('scroll', onScroll, { passive: true })
    vp.addEventListener('scrollend', syncIndex)
    return () => {
      cancelAnimationFrame(frame)
      vp.removeEventListener('scroll', onScroll)
      vp.removeEventListener('scrollend', syncIndex)
    }
  }, [count, onIndexChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(index + 1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(index - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  useEffect(() => {
    const root = rootRef.current
    const vp = viewportRef.current
    if (!root || !vp || viewportW <= 0) return

    const slideWidth = () => viewportW || vp.clientWidth || 1
    const maxScroll = () =>
      Math.max(0, (countRef.current - 1) * slideWidth())

    const setFree = (free: boolean) => {
      vp.classList.toggle('carousel__viewport--free', free)
    }

    /** Snap rispetto alla slide di partenza del gesto (evita confusione 0↔1). */
    const snapFromGesture = (startIndex: number) => {
      const w = slideWidth()
      const progress = vp.scrollLeft / w
      let next = startIndex
      if (progress > startIndex + COMMIT) {
        next = Math.min(countRef.current - 1, startIndex + 1)
      } else if (progress < startIndex - COMMIT) {
        next = Math.max(0, startIndex - 1)
      }
      // Un solo passo per gesto (niente salti multipli).
      if (next > startIndex + 1) next = startIndex + 1
      if (next < startIndex - 1) next = startIndex - 1

      indexFromScroll.current = true
      onIndexChange(next)
      ignoreScroll.current = true
      setFree(false)
      vp.scrollTo({ left: next * w, behavior: 'smooth' })

      const release = () => {
        ignoreScroll.current = false
        vp.removeEventListener('scrollend', release)
      }
      vp.addEventListener('scrollend', release, { once: true })
      window.setTimeout(release, 520)
    }

    const isFormField = (t: EventTarget | null) => {
      const el = t as HTMLElement | null
      if (!el?.closest) return false
      return Boolean(
        el.closest('input, textarea, select, [contenteditable="true"]'),
      )
    }

    let wheelSnapTimer = 0
    let wheelStartIndex = 0
    let wheelGesturing = false

    const onWheel = (e: WheelEvent) => {
      if (isFormField(e.target)) return

      const { dx, dy } = normalizedWheelDelta(
        e,
        viewportH || vp.clientHeight || 600,
      )
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)
      if (absX < 0.5 && absY < 0.5) return

      // Solo orizzontale (anche da rotella verticale → cambio slide).
      const delta = !e.shiftKey && absX >= absY ? dx : dy
      e.preventDefault()
      e.stopPropagation()

      if (!wheelGesturing) {
        wheelGesturing = true
        wheelStartIndex = indexRef.current
        ignoreScroll.current = true
        setFree(true)
      }

      vp.scrollLeft = Math.max(0, Math.min(maxScroll(), vp.scrollLeft + delta))

      window.clearTimeout(wheelSnapTimer)
      wheelSnapTimer = window.setTimeout(() => {
        wheelGesturing = false
        snapFromGesture(wheelStartIndex)
      }, 150)
    }

    const THRESH = 14
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let startScroll = 0
    let dragStartIndex = 0
    let axis: 'x' | 'y' | null = null
    let dragged = false

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      if (isFormField(e.target)) return
      pointerId = e.pointerId
      startX = e.clientX
      startY = e.clientY
      startScroll = vp.scrollLeft
      dragStartIndex = indexRef.current
      axis = null
      dragged = false
    }

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY

      if (!axis) {
        if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) return
        axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y'
        if (axis === 'x') {
          ignoreScroll.current = true
          setFree(true)
          try {
            vp.setPointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }
      }

      if (axis !== 'x') return

      dragged = true
      e.preventDefault()
      vp.scrollLeft = Math.max(0, Math.min(maxScroll(), startScroll - dx))
    }

    const finish = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      const wasX = axis === 'x'
      const didDrag = dragged
      const startIdx = dragStartIndex
      pointerId = null
      axis = null
      dragged = false

      if (!wasX) {
        ignoreScroll.current = false
        return
      }

      try {
        if (vp.hasPointerCapture(e.pointerId)) {
          vp.releasePointerCapture(e.pointerId)
        }
      } catch {
        /* ignore */
      }

      snapFromGesture(startIdx)

      if (didDrag) {
        const suppress = (ev: Event) => {
          ev.preventDefault()
          ev.stopPropagation()
          vp.removeEventListener('click', suppress, true)
        }
        vp.addEventListener('click', suppress, true)
        window.setTimeout(() => {
          vp.removeEventListener('click', suppress, true)
        }, 0)
      }
    }

    root.addEventListener('wheel', onWheel, { passive: false, capture: true })
    vp.addEventListener('pointerdown', onDown, { capture: true })
    vp.addEventListener('pointermove', onMove, { passive: false })
    vp.addEventListener('pointerup', finish)
    vp.addEventListener('pointercancel', finish)

    return () => {
      window.clearTimeout(wheelSnapTimer)
      setFree(false)
      root.removeEventListener('wheel', onWheel, true)
      vp.removeEventListener('pointerdown', onDown, true)
      vp.removeEventListener('pointermove', onMove)
      vp.removeEventListener('pointerup', finish)
      vp.removeEventListener('pointercancel', finish)
    }
  }, [viewportW, viewportH, onIndexChange])

  const trackStyle = {
    ['--slide-w' as string]: viewportW > 0 ? `${viewportW}px` : '100%',
    ['--slide-h' as string]: viewportH > 0 ? `${viewportH}px` : '100%',
    width: viewportW > 0 ? viewportW * Math.max(count, 1) : '100%',
    height: viewportH > 0 ? viewportH : '100%',
    maxHeight: viewportH > 0 ? viewportH : '100%',
  } as CSSProperties

  const arrowBtnClass =
    'grid h-11 w-11 place-items-center rounded-sm border-2 border-ink bg-bg-elevated text-xl leading-none text-ink transition-colors hover:bg-bg-warm disabled:pointer-events-none disabled:opacity-25'

  return (
    <div
      ref={rootRef}
      className="carousel relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div ref={viewportRef} className="carousel__viewport min-h-0 flex-1">
        <div
          className="carousel__track flex h-full max-h-full min-h-0 items-stretch"
          style={trackStyle}
        >
          {children}
        </div>
      </div>

      <div className="carousel__controls no-print mt-3 flex shrink-0 items-center justify-between gap-3 px-0.5">
        <button
          type="button"
          className={arrowBtnClass}
          aria-label="Slide precedente"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <span className="carousel__arrow-glyph" aria-hidden>
            ‹
          </span>
        </button>

        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Indicatori slide"
        >
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={labels[i] ?? `Slide ${i + 1}`}
              className={`h-2.5 rounded-sm border border-ink transition-[width,background-color] duration-200 ${
                i === index
                  ? 'w-6 bg-accent'
                  : 'w-2.5 bg-transparent hover:bg-bg-warm'
              }`}
              onClick={() => go(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className={arrowBtnClass}
          aria-label="Slide successiva"
          disabled={index >= count - 1}
          onClick={() => go(index + 1)}
        >
          <span className="carousel__arrow-glyph" aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  )
}

export function CarouselSlide({
  children,
  id,
  active = true,
}: {
  children: ReactNode
  id: string
  active?: boolean
}) {
  return (
    <section
      id={id}
      className={`carousel__slide box-border flex min-h-0 shrink-0 grow-0 flex-col overflow-hidden px-1 pt-1 pb-2 ${
        active ? 'carousel__slide--active' : 'carousel__slide--idle'
      }`}
      style={{
        flex: '0 0 var(--slide-w, 100%)',
        width: 'var(--slide-w, 100%)',
        maxWidth: 'var(--slide-w, 100%)',
        height: 'var(--slide-h, 100%)',
        maxHeight: 'var(--slide-h, 100%)',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
      aria-roledescription="slide"
      aria-hidden={active ? undefined : true}
      inert={active ? undefined : true}
    >
      {children}
    </section>
  )
}
