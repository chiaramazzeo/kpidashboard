import type { SurveyData } from '../data/types'
import { surveysByYear, type AvailableYear } from '../data/kpis'

/**
 * CSV admin (UTF-8, virgola).
 *
 * Intestazione:
 * kind,id,label,score,previousScore,extra
 *
 * Esempi:
 * meta,year,,2028,,
 * meta,previousYear,,2027,,   (omettere o lasciare score vuoto per nessun YoY, es. 2026)
 * meta,invited,,420,,
 * meta,respondents,,336,,
 * response,value,,80,72,
 * area,HQ / Corporate,,88,,90|79
 * index,engagement,Engagement Index,74,69,78
 * driver,engagement,Soddisfazione in Golmar,76,71,
 */

export const CSV_TEMPLATE = `kind,id,label,score,previousScore,extra
meta,year,,2028,,
meta,previousYear,,2027,,
meta,company,Golmar,,,
meta,invited,,420,,
meta,respondents,,336,,
response,value,,80,72,
area,HQ / Corporate,,88,,90|79
area,Vendite,,76,,120|91
area,Operations,,81,,110|89
area,R&D / Prodotto,,85,,60|51
area,Supporto,,65,,40|26
index,engagement,Engagement Index,74,69,78
driver,engagement,Soddisfazione in Golmar,76,71,
driver,engagement,Propensione a raccomandare,71,66,
driver,engagement,Senso di appartenenza,75,70,
index,enablement,Performance Enablement Index,68,64,75
driver,enablement,Strumenti di lavoro,72,68,
driver,enablement,Formazione,63,58,
driver,enablement,Supporto manageriale,69,66,
index,innovation,Innovation Index,61,58,70
driver,innovation,Nuovi prodotti,64,60,
driver,innovation,Canali di vendita,57,55,
driver,innovation,Processi interni,62,59,
index,trust,Trust in Management Index,70,73,75
driver,trust,Comunicazione,72,74,
driver,trust,Capacità di guida del cambiamento,66,71,
driver,trust,Credibilità delle iniziative,72,74,
`

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  out.push(cur)
  return out.map((c) => c.trim())
}

function parseNum(raw: string | undefined, fallback = 0) {
  if (raw === undefined || raw === '') return fallback
  const n = Number(raw.replace(',', '.'))
  return Number.isFinite(n) ? n : fallback
}

/** Restituisce undefined se la cella è vuota (es. anno senza YoY). */
function parseOptionalNum(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') return undefined
  const n = Number(raw.replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

export type CsvParseResult =
  | { ok: true; data: SurveyData; year: AvailableYear }
  | { ok: false; error: string }

export function parseSurveyCsv(text: string): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))

  if (lines.length < 2) {
    return { ok: false, error: 'CSV vuoto o senza righe dati.' }
  }

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase())
  const idx = {
    kind: header.indexOf('kind'),
    id: header.indexOf('id'),
    label: header.indexOf('label'),
    score: header.indexOf('score'),
    previousScore: header.indexOf('previousscore'),
    extra: header.indexOf('extra'),
  }
  if (idx.kind < 0 || idx.id < 0) {
    return {
      ok: false,
      error: 'Intestazione CSV non valida: servono almeno kind,id,label,score,previousScore,extra.',
    }
  }

  const col = (cells: string[], key: keyof typeof idx) =>
    idx[key] >= 0 ? cells[idx[key]] ?? '' : ''

  let year = 2028
  let previousYear: number | undefined = 2027
  let company = 'Golmar'
  let invited = 420
  let respondents = 336
  let responseValue = 80
  let responsePrevious: number | undefined = 72
  let sawPreviousYearMeta = false
  const areas: SurveyData['responseRate']['byArea'] = []
  const indexMap = new Map<
    string,
    {
      label: string
      score: number
      previousScore?: number
      target: number
      drivers: { label: string; score: number; previousScore?: number }[]
    }
  >()

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i])
    const kind = col(cells, 'kind').toLowerCase()
    const id = col(cells, 'id')
    const label = col(cells, 'label')
    const score = parseNum(col(cells, 'score'))
    const previousScore = parseOptionalNum(col(cells, 'previousScore'))
    const extra = col(cells, 'extra')

    if (kind === 'meta') {
      if (id === 'year') year = score
      else if (id === 'previousYear') {
        sawPreviousYearMeta = true
        previousYear = parseOptionalNum(col(cells, 'score'))
      } else if (id === 'invited') invited = score
      else if (id === 'respondents') respondents = score
      else if (id === 'company') company = label || extra || company
      continue
    }

    if (kind === 'response' && id === 'value') {
      responseValue = score
      responsePrevious = previousScore
      continue
    }

    if (kind === 'area') {
      const [invRaw, respRaw] = extra.split('|')
      areas.push({
        label: id || label,
        rate: score,
        invited: parseNum(invRaw, 0),
        respondents: parseNum(respRaw, 0),
      })
      continue
    }

    if (kind === 'index') {
      indexMap.set(id, {
        label: label || id,
        score,
        previousScore,
        target: parseNum(extra, score + 5),
        drivers: indexMap.get(id)?.drivers ?? [],
      })
      continue
    }

    if (kind === 'driver') {
      const entry = indexMap.get(id)
      if (!entry) {
        indexMap.set(id, {
          label: id,
          score: 0,
          target: 0,
          drivers: [{ label, score, previousScore }],
        })
      } else {
        entry.drivers.push({ label, score, previousScore })
      }
    }
  }

  if (year !== 2026 && year !== 2027 && year !== 2028) {
    return {
      ok: false,
      error: `Anno non supportato: ${year}. Usa 2026, 2027 o 2028.`,
    }
  }

  // 2026 (o previousYear vuoto nel CSV): nessun confronto YoY.
  if (year === 2026 || (sawPreviousYearMeta && previousYear === undefined)) {
    previousYear = undefined
    responsePrevious = undefined
  }

  const base = structuredClone(surveysByYear[year as AvailableYear])
  const order = ['engagement', 'enablement', 'innovation', 'trust'] as const
  const definitions = Object.fromEntries(
    base.indices.map((i) => [i.id, i.definition]),
  )

  const indices = order.map((id) => {
    const row = indexMap.get(id)
    const fallback = base.indices.find((i) => i.id === id)!
    if (!row) return fallback
    const drivers =
      row.drivers.length > 0
        ? row.drivers.map((d) =>
            previousYear === undefined
              ? { label: d.label, score: d.score }
              : d,
          )
        : fallback.drivers
    return {
      id,
      label: row.label || fallback.label,
      definition: definitions[id] ?? fallback.definition,
      score: row.score,
      ...(previousYear !== undefined && row.previousScore !== undefined
        ? { previousScore: row.previousScore }
        : {}),
      target: row.target || fallback.target,
      drivers,
    }
  })

  const data: SurveyData = {
    meta: {
      title: `Golmar ${year} KPI`,
      company,
      year,
      ...(previousYear !== undefined ? { previousYear } : {}),
      invited,
      respondents,
      note: base.meta.note,
    },
    responseRate: {
      value: responseValue,
      ...(responsePrevious !== undefined
        ? { previousValue: responsePrevious }
        : {}),
      definition: base.responseRate.definition,
      byArea: areas.length > 0 ? areas : base.responseRate.byArea,
    },
    indices,
  }

  return { ok: true, data, year: year as AvailableYear }
}

const STORAGE_KEY = 'golmar-kpi-surveys-v2'

export function loadStoredSurveys(): Partial<Record<AvailableYear, SurveyData>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<Record<AvailableYear, SurveyData>>
  } catch {
    return {}
  }
}

export function saveStoredSurvey(
  year: AvailableYear,
  data: SurveyData,
  current: Partial<Record<AvailableYear, SurveyData>>,
) {
  const next = { ...current, [year]: data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
