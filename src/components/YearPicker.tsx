import { useEffect, useRef } from 'react'

type Props = {
  years: readonly number[]
  value: number
  onChange: (year: number) => void
}

const ITEM_H = 40
const PAD = 40 // (120 - 40) / 2 — centra la voce attiva

export function YearPicker({ years, value, onChange }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const index = Math.max(0, years.indexOf(value))
    scroller.scrollTop = index * ITEM_H
  }, [value, years])

  const settle = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const index = Math.round(scroller.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(years.length - 1, index))
    const year = years[clamped]
    scroller.scrollTo({
      top: clamped * ITEM_H,
      behavior: 'smooth',
    })
    if (year !== value) onChange(year)
  }

  const onScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(settle, 80)
  }

  return (
    <div className="year-picker relative w-28 select-none">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-bg-elevated to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-bg-elevated to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-2 top-1/2 z-[1] h-10 -translate-y-1/2 border-y border-ink"
        aria-hidden
      />
      <div
        ref={scrollerRef}
        className="year-picker__scroller h-[120px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'y mandatory' }}
        onScroll={onScroll}
        role="listbox"
        aria-label="Anno report"
      >
        <div style={{ height: PAD }} aria-hidden />
        {years.map((year) => {
          const selected = year === value
          return (
            <button
              key={year}
              type="button"
              role="option"
              aria-selected={selected}
              className={`flex w-full shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent font-mono text-lg tabular-nums transition-colors ${
                selected ? 'font-semibold text-ink' : 'font-medium text-muted'
              }`}
              style={{
                height: ITEM_H,
                scrollSnapAlign: 'center',
              }}
              onClick={() => onChange(year)}
            >
              {year}
            </button>
          )
        })}
        <div style={{ height: PAD }} aria-hidden />
      </div>
    </div>
  )
}
