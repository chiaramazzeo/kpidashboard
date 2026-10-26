import { delta, deltaLabel } from '../utils/format'

type Props = {
  current: number
  previous: number
  previousYear: number
}

export function DeltaBadge({ current, previous, previousYear }: Props) {
  const d = delta(current, previous)
  const tone =
    d > 0 ? 'text-delta-up' : d < 0 ? 'text-negative' : 'text-muted'

  return (
    <span className={`font-mono text-[13px] ${tone}`}>
      {deltaLabel(current, previous)} vs {previousYear}
    </span>
  )
}
