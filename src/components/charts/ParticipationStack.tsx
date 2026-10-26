import { formatScore } from '../../utils/format'

type Item = {
  label: string
  rate: number
}

type Props = {
  items: Item[]
}

export function ParticipationStack({ items }: Props) {
  return (
    <div className="grid gap-3">
      <ul className="mb-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-mono text-xs text-ink-soft">
        <li>
          <span className="mr-[6px] inline-block h-3 w-3 border border-series-stroke bg-series-a align-[-1px]" />
          Ha risposto
        </li>
        <li>
          <span className="mr-[6px] inline-block h-3 w-3 border border-series-stroke bg-bg-warm align-[-1px]" />
          Non ha risposto
        </li>
      </ul>
      {items.map((item) => (
        <div className="grid gap-1" key={item.label}>
          <div className="flex justify-between gap-4 text-[13.5px]">
            <span>{item.label}</span>
            <span className="font-mono text-[13px]">{formatScore(item.rate)}%</span>
          </div>
          <div className="flex h-5 overflow-hidden border border-series-stroke">
            <div
              className="h-full transition-[flex-grow] duration-700 ease-[var(--ease-out)]"
              style={{ flexGrow: item.rate, background: 'var(--color-series-a)' }}
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
