import type { IndexKpi, ResponseRate, SurveyData } from '../data/types'

export function indexToCsv(index: IndexKpi, year: number): string {
  const lines = [
    'scope,population,label,score,previousScore,year',
    `total,total,${csv(index.label)},${index.score},${index.previousScore ?? ''},${year}`,
    `total,employees,${csv(index.label)},${index.byPopulation.employees.score},${index.byPopulation.employees.previousScore ?? ''},${year}`,
    `total,agents,${csv(index.label)},${index.byPopulation.agents.score},${index.byPopulation.agents.previousScore ?? ''},${year}`,
    ...index.drivers.map(
      (d) =>
        `driver,total,${csv(d.label)},${d.score},${d.previousScore ?? ''},${year}`,
    ),
    ...(index.byPopulation.employees.drivers ?? []).map(
      (d) =>
        `driver,employees,${csv(d.label)},${d.score},${d.previousScore ?? ''},${year}`,
    ),
    ...(index.byPopulation.agents.drivers ?? []).map(
      (d) =>
        `driver,agents,${csv(d.label)},${d.score},${d.previousScore ?? ''},${year}`,
    ),
  ]
  return lines.join('\n')
}

export function responseToCsv(rr: ResponseRate, data: SurveyData): string {
  const year = data.meta.year
  const lines = [
    'scope,population,label,score,respondents,invited,invitedPlaceholder,year',
    `total,total,Response Rate,${rr.value},${data.meta.respondents},${data.meta.invited},${data.meta.invitedIsPlaceholder ? 1 : 0},${year}`,
    `total,employees,Response Rate,${rr.byPopulation.employees.score},${rr.byPopulation.employees.respondents ?? ''},${rr.byPopulation.employees.invited ?? ''},${rr.byPopulation.employees.invitedIsPlaceholder ? 1 : 0},${year}`,
    `total,agents,Response Rate,${rr.byPopulation.agents.score},${rr.byPopulation.agents.respondents ?? ''},${rr.byPopulation.agents.invited ?? ''},${rr.byPopulation.agents.invitedIsPlaceholder ? 1 : 0},${year}`,
    ...rr.byArea.map(
      (a) =>
        `area,mixed,${csv(a.label)},${a.rate},${a.respondents},${a.invited},${a.invitedIsPlaceholder ? 1 : 0},${year}`,
    ),
  ]
  return lines.join('\n')
}

function csv(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseCsvPreview(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(',').map((c) => c.replace(/^"|"$/g, '')))
}
