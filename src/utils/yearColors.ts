/**
 * Palette anni coerente in tutto il report:
 * 2026 ambra · 2027 blu · 2028 verde
 */
const YEAR_BG: Record<number, string> = {
  2026: 'bg-year-2026',
  2027: 'bg-year-2027',
  2028: 'bg-year-2028',
}

const YEAR_BORDER: Record<number, string> = {
  2026: 'border-year-2026',
  2027: 'border-year-2027',
  2028: 'border-year-2028',
}

const YEAR_TEXT: Record<number, string> = {
  2026: 'text-year-2026',
  2027: 'text-year-2027',
  2028: 'text-year-2028',
}

const YEAR_CSS: Record<number, string> = {
  2026: 'var(--color-year-2026)',
  2027: 'var(--color-year-2027)',
  2028: 'var(--color-year-2028)',
}

const FALLBACK_BG = 'bg-year-2028'
const FALLBACK_BORDER = 'border-ink'
const FALLBACK_TEXT = 'text-ink'
const FALLBACK_CSS = 'var(--color-year-2028)'

export function yearBgClass(year: number) {
  return YEAR_BG[year] ?? FALLBACK_BG
}

export function yearBorderClass(year: number) {
  return YEAR_BORDER[year] ?? FALLBACK_BORDER
}

export function yearTextClass(year: number) {
  return YEAR_TEXT[year] ?? FALLBACK_TEXT
}

/** Per style={{ background / stroke / fill }} */
export function yearCssVar(year: number) {
  return YEAR_CSS[year] ?? FALLBACK_CSS
}
