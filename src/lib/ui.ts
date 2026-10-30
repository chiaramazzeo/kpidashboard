/**
 * Classi UI condivise (Golmar report).
 *
 * Perché non `Button` shadcn sulle tile KPI?
 * La tile è un’intera card cliccabile (hero score + meta): un Button default
 * avrebbe padding/fill sbagliati. Usiamo un `<button>` + `tileOpen*`.
 *
 * Token tipo: `text-hero` / `text-slide` / `text-meta` definiti in index.css @theme.
 */

/** Tile full-width che apre ChartModal (Response / Index). */
export const tileOpen =
  'group relative w-full rounded-sm border border-ink bg-bg-elevated p-5 pr-12 text-left transition-[background-color,border-color] duration-200 hover:border-ink hover:bg-bg-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Tile griglia Overview (più compatta). */
export const tileOpenCard =
  'group relative w-full rounded-sm border border-ink bg-bg-elevated p-5 pr-11 text-left transition-[background-color,border-color] duration-200 hover:bg-bg-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Label mono uppercase (banner demo, meta slide). */
export const metaLabel =
  'm-0 font-mono text-meta uppercase tracking-[0.08em] text-accent'

export const metaLabelMuted =
  'm-0 font-mono text-meta uppercase tracking-[0.08em] text-muted'

/** Titolo slide report. */
export const slideTitle =
  'm-0 font-display text-slide font-bold tracking-[-0.02em] leading-tight'

/** Score hero Response. */
export const scoreHero =
  'm-0 font-display text-hero font-extrabold leading-[0.92] tracking-[-0.02em]'

/** Score hero Index KPI. */
export const scoreHeroKpi =
  'm-0 font-display text-hero-kpi font-extrabold leading-none tracking-[-0.02em]'

/** Score in card Overview. */
export const scoreCard =
  'mt-3 mb-0 font-display text-hero-card font-bold leading-none tracking-[-0.02em]'

/** Segmented control (Overview mode, level chips pattern). */
export const segmentGroup =
  'flex h-9 overflow-hidden rounded-sm border border-ink'

export const segmentItem =
  'h-full px-3 font-mono text-[0.6875rem] uppercase tracking-[0.06em]'

export const segmentItemOn = 'bg-ink text-bg'
export const segmentItemOff =
  'bg-bg-elevated text-ink hover:bg-bg-warm'
