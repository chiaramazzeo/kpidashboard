import { delta, deltaLabel } from '../utils/format'

type Props = {
  current: number
  previous: number
  previousYear: number
}

export function DeltaBadge({ current, previous, previousYear }: Props) {
  const d = delta(current, previous)
  const cls = d > 0 ? 'delta--up' : d < 0 ? 'delta--down' : 'delta--flat'

  return (
    <span className={`delta ${cls}`}>
      {deltaLabel(current, previous)} vs {previousYear}
    </span>
  )
}
