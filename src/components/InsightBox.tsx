type Props = {
  children: string
  className?: string
}

export function InsightBox({ children, className = '' }: Props) {
  return (
    <aside
      className={`border border-ink bg-accent-soft p-4${className ? ` ${className}` : ''}`}
    >
      <p className="m-0 mb-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink">
        Insight
      </p>
      <p className="m-0 text-base font-medium leading-snug text-ink">{children}</p>
    </aside>
  )
}
