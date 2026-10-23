import type { Ref } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { formatScore } from '../utils/format'

type Props = {
  value: number
  decimals?: number
  suffix?: string
  className?: string
  duration?: number
}

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  className,
  duration = 1200,
}: Props) {
  const { ref, value: animated } = useCountUp(value, duration, decimals)

  return (
    <span className={className} ref={ref as Ref<HTMLSpanElement>}>
      {formatScore(animated, decimals)}
      {suffix}
    </span>
  )
}
