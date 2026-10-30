import type { Ref } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { formatScore } from '../utils/format'

type Props = {
  value: number
  decimals?: number
  suffix?: string
  className?: string
  duration?: number
  /** Se false (slide non attiva), resta a 0; al focus anima. */
  active?: boolean
  /** Prefisso «+» sui positivi (es. eNPS). */
  signed?: boolean
}

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  className,
  duration = 1300,
  active = true,
  signed = false,
}: Props) {
  const { ref, value: animated } = useCountUp(
    value,
    duration,
    decimals,
    active,
  )
  const sign = signed && animated > 0 ? '+' : ''

  return (
    <span className={className} ref={ref as Ref<HTMLSpanElement>}>
      {sign}
      {formatScore(animated, decimals)}
      {suffix}
    </span>
  )
}
