import { formatScore } from '../../utils/format'
import { yearBgClass, yearCssVar } from '../../utils/yearColors'

type Item = {
  label: string
  rate: number
}

type Props = {
  items: Item[]
  year: number
}

export function ParticipationStack({ items, year }: Props) {
  const fill = yearCssVar(year)

  return (
    <div className="grid gap-3">
      <ul className="mb-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-mono text-xs text-ink-soft">
        <li className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 border border-ink ${yearBgClass(year)}`}
          />
          Ha risposto
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 border border-ink bg-bg-warm" />
          Non ha risposto
        </li>
      </ul>
      {items.map((item) => (
        <div className="grid gap-1" key={item.label}>
          <div className="flex justify-between gap-4 text-sm">
            <span>{item.label}</span>
            <span className="font-mono text-sm">{formatScore(item.rate)}%</span>
          </div>
          <div className="flex h-5 overflow-hidden border border-ink">
            <div
              className="h-full transition-[flex-grow] duration-700 ease-[var(--ease-out)]"
              style={{ flexGrow: item.rate, background: fill }}
            />
            <div
              className="h-full transition-[flex-grow] duration-700 ease-[var(--ease-out)]"
              style={{ flexGrow: 100 - item.rate, background: 'var(--color-bg-warm)' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
