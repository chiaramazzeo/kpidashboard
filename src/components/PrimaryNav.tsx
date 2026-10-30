import { useDemo } from '../context/DemoContext'
import type { NavArea } from '../data/nav'
import { NewFeatureBadge } from './NewFeatureBadge'

export function PrimaryNav() {
  const { area, setArea, feature, featureNew } = useDemo()

  const items: { id: NavArea; label: string; enabled: boolean; isNew?: boolean }[] =
    [
      { id: 'report', label: 'Report', enabled: true },
      {
        id: 'survey',
        label: 'Survey',
        enabled: feature('surveyAdmin'),
        isNew: featureNew('surveyAdmin'),
      },
    ]

  return (
    <nav
      className="primary-nav border-b border-line"
      aria-label="Aree principali"
    >
      <div className="mx-auto flex max-w-report gap-2 px-5 py-2">
        {items.map((item) => {
          const active = area === item.id
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.enabled}
              aria-current={active ? 'page' : undefined}
              className={`rounded-sm border px-4 py-2 text-sm font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                active
                  ? 'border-accent text-accent'
                  : 'border-line text-ink hover:border-ink'
              }`}
              onClick={() => item.enabled && setArea(item.id)}
              title={
                !item.enabled ? 'Disponibile dal Livello 2' : undefined
              }
            >
              <span className="inline-flex items-center gap-2">
                {item.label}
                {item.isNew ? <NewFeatureBadge level={2} compact /> : null}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
