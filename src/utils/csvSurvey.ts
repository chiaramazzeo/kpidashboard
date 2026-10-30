import type { IndexKpi, SurveyData } from '../data/types'
import { surveysByYear, type AvailableYear } from '../data/kpis'

/**
 * CSV admin (UTF-8, virgola) — schema compatibile + merge su baseline Annex.
 */

export const CSV_TEMPLATE = `kind,id,label,score,previousScore,extra
meta,year,,2026,,
meta,company,Golmar,,,
meta,invited,,580,,
meta,respondents,,323,,
response,value,,56,,
area,Dipendenti (totale),,57,,180|103
area,Agenti (totale),,55,,400|220
index,engagement,eNPS (Engagement),-15,,10
driver,engagement,eNPS dipendenti,-24,,
driver,engagement,eNPS agenti,-10,,
index,enablement,Performance Enablement Index,64,,72
driver,enablement,Organizzazione,65.2,,
driver,enablement,Sviluppo professionale,52.9,,
driver,enablement,Condizioni di lavoro,70,,
driver,enablement,Clima,66.4,,
driver,enablement,Collaborazione,73.4,,
index,innovation,Innovation Index,60,,70
driver,innovation,Identità e strategia (Vision),61.5,,
driver,innovation,Comunicazione (Participative safety),59.3,,
index,trust-central,Trust in Management — Centrale,58,,70
driver,trust-central,Comunicazione strategica,57,,
driver,trust-central,Trasparenza della strategia,59,,
index,trust-direct,Trust in Management — Diretti,68,,75
driver,trust-direct,Leadership,69,,
driver,trust-direct,Supporto del responsabile,67,,
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
      error:
        'Intestazione CSV non valida: servono almeno kind,id,label,score,previousScore,extra.',
    }
  }

  const col = (cells: string[], key: keyof typeof idx) =>
    idx[key] >= 0 ? cells[idx[key]] ?? '' : ''

  let year = 2026
  let previousYear: number | undefined
  let company = 'Golmar'
  let invited = 580
  let respondents = 323
  let responseValue = 56
  let responsePrevious: number | undefined
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
        invitedIsPlaceholder: true,
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

  if (year === 2026 || (sawPreviousYearMeta && previousYear === undefined)) {
    previousYear = undefined
    responsePrevious = undefined
  }

  const base = structuredClone(surveysByYear[year as AvailableYear])
  const order = base.indices.map((i) => i.id)

  const indices: IndexKpi[] = order.map((id) => {
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
      ...fallback,
      label: row.label || fallback.label,
      score: row.score,
      ...(previousYear !== undefined && row.previousScore !== undefined
        ? { previousScore: row.previousScore }
        : { previousScore: undefined }),
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
      invitedIsPlaceholder: true,
      note: base.meta.note,
    },
    responseRate: {
      ...base.responseRate,
      value: responseValue,
      ...(responsePrevious !== undefined
        ? { previousValue: responsePrevious }
        : { previousValue: undefined }),
      byArea: areas.length > 0 ? areas : base.responseRate.byArea,
    },
    indices,
  }

  return { ok: true, data, year: year as AvailableYear }
}

const STORAGE_KEY = 'golmar-kpi-surveys-v3'

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
