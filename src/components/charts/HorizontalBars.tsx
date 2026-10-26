/** REVIEW: fill barre senza border-right; animazione scaleX via classe .hbar-fill */
import { useInView } from '../../hooks/useCountUp'
import { formatScore } from '../../utils/format'

type Item = { label: string; value: number; color?: string }

type Props = {
  items: Item[]
  max?: number
  color?: string
}

export function HorizontalBars({
  items,
  max = 100,
  color = 'var(--color-series-a)',
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div className="grid gap-4" ref={ref}>
      {items.map((item) => (
        <div
          className="grid grid-cols-[minmax(8rem,11rem)_1fr_auto] items-center gap-3 max-sm:grid-cols-1 max-sm:gap-1"
          key={item.label}
        >
          <span className="text-sm text-ink-soft">{item.label}</span>
          <div className="relative h-5 overflow-hidden border border-ink bg-bg-warm">
            <div
              className={`hbar-fill h-full${inView ? ' is-visible' : ''}`}
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color ?? color,
              }}
            />
          </div>
          <span className="min-w-10 text-right font-mono text-sm">
            {formatScore(item.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
