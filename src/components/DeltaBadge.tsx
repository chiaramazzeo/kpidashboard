import { delta, deltaLabel } from '../utils/format'

type Props = {
  current: number
  previous?: number
  previousYear?: number
}

export function DeltaBadge({ current, previous, previousYear }: Props) {
  if (previous === undefined || previousYear === undefined) return null

  const d = delta(current, previous)
  const tone =
    d > 0 ? 'text-positive' : d < 0 ? 'text-negative' : 'text-muted'

  return (
    <span className={`font-mono text-sm font-medium ${tone}`}>
      {deltaLabel(current, previous)} vs {previousYear}
    </span>
  )
}
