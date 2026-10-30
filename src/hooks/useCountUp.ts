import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isElementInView(el: Element) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  return rect.top < vh * 0.92 && rect.bottom > 0
}

/**
 * Anima da 0 → target quando `active`.
 * Cleanup non forza il valore (così Strict Mode riavvia l’animazione pulita).
 */
export function useCountUp(
  target: number,
  duration = 1200,
  decimals = 0,
  active = true,
) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }

    if (prefersReducedMotion() || duration <= 0) {
      setValue(target)
      return
    }

    let cancelled = false
    let frame = 0
    const start = performance.now()
    setValue(0)

    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Number((target * eased).toFixed(decimals)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [active, target, duration, decimals])

  return { ref, value, started: active }
}

export function useInView<T extends HTMLElement>(
  threshold = 0.2,
  fallbackMs = 400,
  force = false,
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(force)

  useEffect(() => {
    if (force) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    if (prefersReducedMotion() || isElementInView(el)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    const timer = window.setTimeout(() => {
      setInView(true)
      observer.disconnect()
    }, fallbackMs)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [threshold, fallbackMs, force])

  return { ref, inView }
}
