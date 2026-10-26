/**
 * Chrome sticky unico (header + nav): niente gap tra titolo e chip durante lo scroll.
 * Aggiorna --chrome-h dall’altezza reale del blocco.
 */
import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function SiteChrome({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const sync = () => {
      const height = Math.ceil(el.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--chrome-h', `${height}px`)
      // Compat scroll-margin / spy che ancora leggono --header-h
      document.documentElement.style.setProperty('--header-h', `${height}px`)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      document.documentElement.style.removeProperty('--chrome-h')
    }
  }, [])

  return (
    <div ref={ref} className="site-chrome sticky top-0 z-40 bg-bg">
      {children}
    </div>
  )
}
