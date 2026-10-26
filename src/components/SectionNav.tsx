import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '#response', label: 'Response' },
  { href: '#overview', label: 'Overview' },
  { href: '#engagement', label: 'Engagement' },
  { href: '#enablement', label: 'Enablement' },
  { href: '#innovation', label: 'Innovation' },
  { href: '#trust', label: 'Trust' },
  { href: '#splits', label: 'Segmenti' },
]

const sectionIds = links.map((link) => link.href.slice(1))

function stickyOffset() {
  const styles = getComputedStyle(document.documentElement)
  const headerH = Number.parseFloat(styles.getPropertyValue('--header-h')) || 56
  const navH = Number.parseFloat(styles.getPropertyValue('--nav-h')) || 44
  return headerH + navH + 4
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

export function SectionNav() {
  const [activeId, setActiveId] = useState(sectionIds[0])
  const lockedId = useRef<string | null>(null)
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const handleClick = (id: string) => {
    lockedId.current = id
    setActiveId(id)
  }

  return (
    <nav className="section-nav" aria-label="Sezioni">
      <div className="section-nav__inner">
        {links.map((link) => {
          const id = link.href.slice(1)
          const isActive = activeId === id
          return (
            <a
              key={link.href}
              href={link.href}
              className={`section-nav__link${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => handleClick(id)}
            >
              {link.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
