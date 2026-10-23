import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useCountUp'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: Props) {
  const { ref, inView } = useInView<HTMLElement>(0.15)

  const style = {
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties

  return (
    <Tag
      ref={ref as never}
      className={`reveal${inView ? ' is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  )
}
