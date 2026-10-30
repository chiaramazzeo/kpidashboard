import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  LEVEL_THEMES,
  hasFeature,
  isFeatureNew,
  type FeatureKey,
} from '../data/levels'
import { areaForSection, type NavArea } from '../data/nav'
import type { ChatMessage, DemoLevel, DemoRole, DemoSurvey } from '../data/types'
import { availableYears, type AvailableYear } from '../data/kpis'
import { INITIAL_SURVEYS } from '../data/surveys'
import { effectiveCompareYears } from '../utils/yearCompare'

export type ChatPeekState = {
  x: number
  y: number
  /** Bozza / prompt suggerito. */
  seed?: string
}

/** Vista Overview L2+: griglia anno focus vs linee a confronto. */
export type OverviewMode = 'year' | 'compare'

type DemoContextValue = {
  level: DemoLevel
  setLevel: (level: DemoLevel) => void
  role: DemoRole
  setRole: (role: DemoRole) => void
  year: AvailableYear
  setYear: (year: AvailableYear) => void
  years: readonly AvailableYear[]
  compareYears: AvailableYear[]
  toggleCompareYear: (y: AvailableYear) => void
  overviewMode: OverviewMode
  setOverviewMode: (mode: OverviewMode) => void
  area: NavArea
  setArea: (area: NavArea) => void
  feature: (key: FeatureKey) => boolean
  featureNew: (key: FeatureKey) => boolean
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  /** true = pannello laterale; false = chat flottante piccola */
  chatDocked: boolean
  setChatDocked: (docked: boolean) => void
  chatExpanded: boolean
  setChatExpanded: (expanded: boolean) => void
  /** Mini-composer accanto al mouse (prima dell’invio). */
  chatPeek: ChatPeekState | null
  setChatPeek: (peek: ChatPeekState | null) => void
  chatMessages: ChatMessage[]
  pushChat: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  clearChat: () => void
  chatContextLabel: string | null
  setChatContextLabel: (label: string | null) => void
  surveys: DemoSurvey[]
  setSurveys: React.Dispatch<React.SetStateAction<DemoSurvey[]>>
  pendingSection: string | null
  goToSection: (
    sectionId: string,
    opts?: { level?: DemoLevel; area?: NavArea },
  ) => void
  clearPendingSection: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<DemoLevel>(1)
  const [role, setRole] = useState<DemoRole>('admin')
  const [year, setYear] = useState<AvailableYear>(2026)
  const [compareYears, setCompareYears] = useState<AvailableYear[]>([
    ...availableYears,
  ])
  const [overviewMode, setOverviewMode] = useState<OverviewMode>('year')
  const [area, setAreaState] = useState<NavArea>('report')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatDocked, setChatDocked] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [chatPeek, setChatPeek] = useState<ChatPeekState | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatContextLabel, setChatContextLabel] = useState<string | null>(null)
  const [surveys, setSurveys] = useState<DemoSurvey[]>(INITIAL_SURVEYS)
  const [pendingSection, setPendingSection] = useState<string | null>(null)

  const years = useMemo((): readonly AvailableYear[] => {
    if (level < 2) return [2026]
    return availableYears
  }, [level])

  useEffect(() => {
    if (!(years as readonly number[]).includes(year)) {
      setYear(years[0]!)
    }
  }, [years, year])

  // L1 → solo 2026; ingresso L2+ → tutti gli anni
  useEffect(() => {
    if (level < 2) {
      setCompareYears([2026])
      return
    }
    setCompareYears(
      effectiveCompareYears([...availableYears], year) as AvailableYear[],
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo cambio livello
  }, [level])

  // Solo cambio anno focus (non al cambio livello: evita race Strict Mode)
  useEffect(() => {
    setCompareYears((prev) => {
      if (prev.length === 1 && prev[0] === 2026 && year === 2026) return prev
      return effectiveCompareYears(prev, year) as AvailableYear[]
    })
  }, [year])

  useEffect(() => {
    const theme = LEVEL_THEMES[level]
    const root = document.documentElement
    root.dataset.demoLevel = String(level)
    root.style.setProperty('--color-bg', theme.bg)
    root.style.setProperty('--color-bg-warm', theme.bgWarm)
    root.style.setProperty('--level-accent', theme.accent)
    root.style.setProperty('--level-accent-soft', theme.accentSoft)
  }, [level])

  useEffect(() => {
    if (level < 2) {
      setChatOpen(false)
      setChatDocked(false)
      setChatPeek(null)
      setOverviewMode('year')
      setAreaState('report')
    }
  }, [level])

  const setArea = (next: NavArea) => {
    if (next === 'survey' && level < 2) return
    setAreaState(next)
  }

  const setLevel = (next: DemoLevel) => {
    setLevelState(next)
    if (next < 2) setAreaState('report')
  }

  const toggleCompareYear = useCallback(
    (y: AvailableYear) => {
      setCompareYears((prev) => {
        const has = prev.includes(y)
        if (has) {
          if (prev.length <= 1) return prev
          if (y === year && prev.length === 1) return prev
          const next = prev.filter((x) => x !== y)
          return effectiveCompareYears(next, year) as AvailableYear[]
        }
        return effectiveCompareYears([...prev, y], year) as AvailableYear[]
      })
    },
    [year],
  )

  const resolvedCompare = useMemo(
    () => effectiveCompareYears(compareYears, year) as AvailableYear[],
    [compareYears, year],
  )

  const value = useMemo<DemoContextValue>(
    () => ({
      level,
      setLevel,
      role,
      setRole,
      year,
      setYear,
      years,
      compareYears: resolvedCompare,
      toggleCompareYear,
      overviewMode,
      setOverviewMode,
      area,
      setArea,
      feature: (key) => hasFeature(level, key),
      featureNew: (key) => isFeatureNew(level, key),
      chatOpen,
      setChatOpen,
      chatDocked,
      setChatDocked,
      chatExpanded,
      setChatExpanded,
      chatPeek,
      setChatPeek,
      chatMessages,
      pushChat: (msg) =>
        setChatMessages((prev) => [
          ...prev,
          {
            ...msg,
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: Date.now(),
          },
        ]),
      clearChat: () => setChatMessages([]),
      chatContextLabel,
      setChatContextLabel,
      surveys,
      setSurveys,
      pendingSection,
      goToSection: (sectionId, opts) => {
        if (opts?.level) setLevelState(opts.level)
        // Legacy: Evoluzione → Overview in vista confronto
        const resolvedId =
          sectionId === 'evoluzione' ? 'overview' : sectionId
        if (sectionId === 'evoluzione') setOverviewMode('compare')
        const nextArea = opts?.area ?? areaForSection(resolvedId)
        if (nextArea === 'survey' && (opts?.level ?? level) < 2) {
          setAreaState('report')
        } else {
          setAreaState(nextArea)
        }
        setPendingSection(resolvedId)
      },
      clearPendingSection: () => setPendingSection(null),
    }),
    [
      level,
      role,
      year,
      years,
      resolvedCompare,
      toggleCompareYear,
      overviewMode,
      area,
      chatOpen,
      chatDocked,
      chatExpanded,
      chatPeek,
      chatMessages,
      chatContextLabel,
      surveys,
      pendingSection,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
