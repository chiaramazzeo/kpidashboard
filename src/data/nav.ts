import type { DemoLevel } from './types'

export type NavArea = 'report' | 'survey'

export type SectionLink = {
  id: string
  label: string
  area: NavArea
  minLevel: DemoLevel
  introducedIn?: DemoLevel
}

export const SECTION_LINKS: SectionLink[] = [
  { id: 'response', label: 'Response Rate', area: 'report', minLevel: 1 },
  { id: 'overview', label: 'Overview', area: 'report', minLevel: 1 },
  { id: 'engagement', label: 'eNPS (Engagement)', area: 'report', minLevel: 1 },
  {
    id: 'enablement',
    label: 'Performance Enablement Index',
    area: 'report',
    minLevel: 1,
  },
  { id: 'innovation', label: 'Innovation Index', area: 'report', minLevel: 1 },
  {
    id: 'trust-central',
    label: 'Trust — Management centrale',
    area: 'report',
    minLevel: 1,
  },
  {
    id: 'trust-direct',
    label: 'Trust — Responsabili diretti',
    area: 'report',
    minLevel: 1,
  },
  {
    id: 'survey',
    label: 'Somministrazione',
    area: 'survey',
    minLevel: 2,
    introducedIn: 2,
  },
  {
    id: 'kpi-admin',
    label: 'KPI e domande',
    area: 'survey',
    minLevel: 3,
    introducedIn: 3,
  },
]

export function sectionsForLevel(level: DemoLevel, area: NavArea) {
  return SECTION_LINKS.filter((s) => s.area === area && level >= s.minLevel)
}

export function areaForSection(sectionId: string): NavArea {
  // Legacy id «evoluzione» (ora vista Overview → A confronto)
  if (sectionId === 'evoluzione') return 'report'
  return SECTION_LINKS.find((s) => s.id === sectionId)?.area ?? 'report'
}

/** @deprecated shape for exportHtml */
export const SECTION_IDS = SECTION_LINKS.map((link) => link.id)
