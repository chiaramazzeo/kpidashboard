/**
 * CRUD dictionary KPI (Livello 3 + ruolo Admin).
 *
 * SHADCN: modal KPI → `Dialog`; campi → `Input`/`Label`; CTA → `Button`.
 * Gate: `feature('kpiCrud')` e `role === 'admin'` (DemoContext).
 */
import { useEffect, useId, useMemo, useState } from 'react'
import { surveysByYear } from '../data/kpis'
import type { IndexKpi } from '../data/types'
import { useDemo } from '../context/DemoContext'
import { NewFeatureBadge } from './NewFeatureBadge'
import { CloseIcon, IconAction } from './icons/AnimatedIcon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function suggestQuestions(kpi: IndexKpi): string[] {
  if (kpi.id === 'engagement') {
    return [
      'Su una scala 0–10, quanto raccomanderesti Golmar come luogo di lavoro?',
      'Sono orgoglioso di lavorare in Golmar.',
      'Intendo restare in Golmar nei prossimi 12 mesi.',
    ]
  }
  if (kpi.id === 'enablement') {
    return [
      'Il mio ruolo valorizza le mie competenze.',
      'Ho strumenti e risorse adeguati.',
      'Il mio responsabile mi supporta nel raggiungere i risultati.',
    ]
  }
  if (kpi.id === 'innovation') {
    return [
      'Nel team c’è supporto concreto all’innovazione.',
      'Possiamo mettere in discussione i processi (task orientation).',
      'La visione di innovazione è chiara e condivisa.',
    ]
  }
  if (kpi.id.startsWith('trust')) {
    return [
      'Il management comunica in modo credibile.',
      'Mi fido del giudizio del mio responsabile diretto.',
      'Le decisioni sono eque e trasparenti.',
    ]
  }
  return [`Proposta domanda per ${kpi.label}`]
}

type DictionaryVersion = {
  id: string
  label: string
  at: number
  indices: IndexKpi[]
}

export function KpiAdminPanel() {
  const { feature, featureNew, surveys, setSurveys, role } = useDemo()
  const base = surveysByYear[2026].indices
  const [items, setItems] = useState<IndexKpi[]>(() => structuredClone(base))
  const [versions, setVersions] = useState<DictionaryVersion[]>(() => [
    {
      id: 'v1',
      label: 'Baseline Annex 2026',
      at: Date.now(),
      indices: structuredClone(base),
    },
  ])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = items.find((i) => i.id === selectedId) ?? null
  const suggestions = useMemo(
    () => (selected ? suggestQuestions(selected) : []),
    [selected],
  )
  const [picked, setPicked] = useState<string[]>([])
  const nameId = useId()
  const defId = useId()

  useEffect(() => {
    if (!selectedId) setPicked([])
  }, [selectedId])

  if (!feature('kpiCrud')) {
    return (
      <p className="text-sm text-muted">
        La gestione KPI è disponibile dal Livello 3.
      </p>
    )
  }

  if (role !== 'admin') {
    return (
      <p className="text-sm text-muted">
        La gestione KPI è disponibile solo nel ruolo Admin.
      </p>
    )
  }

  const closeModal = () => {
    setSelectedId(null)
    setPicked([])
  }

  const saveVersion = () => {
    setVersions((prev) => [
      {
        id: `v${prev.length + 1}-${Date.now()}`,
        label: `v${prev.length + 1} — ${new Date().toLocaleString('it-IT')}`,
        at: Date.now(),
        indices: structuredClone(items),
      },
      ...prev,
    ])
  }

  return (
    <div>
      {featureNew('kpiCrud') ? (
        <div className="mb-3">
          <NewFeatureBadge level={3} />
        </div>
      ) : null}
      <h2 className="m-0 font-display text-2xl font-bold tracking-tight">
        Gestione KPI
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Clicca un KPI per aprirlo in modal: modifica, rimuovi o genera
        domande. Il dictionary resta in sessione.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={saveVersion}>
          Salva versione dictionary
        </Button>
        <span className="self-center font-mono text-xs text-muted">
          {versions.length} versioni in memoria
        </span>
      </div>

      {versions.length > 0 ? (
        <ul className="mt-3 m-0 max-h-28 list-none space-y-1 overflow-auto border border-line p-2">
          {versions.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs">{v.label}</span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => {
                  setItems(structuredClone(v.indices))
                  setSelectedId(null)
                  setPicked([])
                }}
              >
                Ripristina
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {items.map((kpi) => (
          <Button
            key={kpi.id}
            type="button"
            variant="outline"
            className="h-auto justify-start px-3 py-3 text-left text-sm whitespace-normal"
            aria-haspopup="dialog"
            onClick={() => {
              setSelectedId(kpi.id)
              setPicked([])
            }}
          >
            {kpi.label}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          className="h-auto border-dashed px-3 py-3 text-sm"
          onClick={() => {
            const id = `custom-${Date.now()}`
            const next: IndexKpi = {
              id,
              label: 'Nuovo KPI',
              definition: 'Definizione da completare.',
              scale: 'index0_100',
              reliability: 'good',
              score: 50,
              target: 70,
              drivers: [],
              byPopulation: {
                employees: { score: 50 },
                agents: { score: 50 },
              },
            }
            setItems((prev) => [...prev, next])
            setSelectedId(id)
            setPicked([])
          }}
        >
          + Aggiungi KPI
        </Button>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) closeModal()
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="no-print flex max-h-[92vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden border-ink p-0 sm:max-w-2xl"
        >
          {selected ? (
            <>
              <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-line px-5 py-4 text-left">
                <DialogTitle className="font-display text-2xl font-bold tracking-tight">
                  {selected.label}
                </DialogTitle>
                <IconAction label="Chiudi" onClick={closeModal}>
                  <CloseIcon animateOnHover size={18} />
                </IconAction>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-auto px-5 py-5">
                <div className="space-y-1">
                  <Label
                    htmlFor={nameId}
                    className="font-mono text-xs uppercase tracking-[0.08em] text-muted"
                  >
                    Nome
                  </Label>
                  <Input
                    id={nameId}
                    value={selected.label}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((k) =>
                          k.id === selected.id
                            ? { ...k, label: e.target.value }
                            : k,
                        ),
                      )
                    }
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <Label
                    htmlFor={defId}
                    className="font-mono text-xs uppercase tracking-[0.08em] text-muted"
                  >
                    Definizione
                  </Label>
                  <textarea
                    id={defId}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 mt-0 block min-h-24 w-full rounded-sm border bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus-visible:ring-[3px]"
                    value={selected.definition}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((k) =>
                          k.id === selected.id
                            ? { ...k, definition: e.target.value }
                            : k,
                        ),
                      )
                    }
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary text-primary"
                    onClick={() => {
                      setItems((prev) =>
                        prev.filter((k) => k.id !== selected.id),
                      )
                      closeModal()
                    }}
                  >
                    Rimuovi KPI
                  </Button>
                </div>

                <div className="mt-8 border border-[var(--level-accent)] bg-[var(--level-accent-soft)] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="m-0 font-semibold">Domande suggerite</p>
                    {featureNew('kpiCrud') ? (
                      <NewFeatureBadge level={3} />
                    ) : null}
                  </div>
                  <ul className="m-0 list-none space-y-2 p-0">
                    {suggestions.map((s) => {
                      const on = picked.includes(s)
                      return (
                        <li key={s}>
                          <label className="flex cursor-pointer items-start gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() =>
                                setPicked((prev) =>
                                  on
                                    ? prev.filter((x) => x !== s)
                                    : [...prev, s],
                                )
                              }
                            />
                            <span>{s}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    disabled={picked.length === 0}
                    onClick={() => {
                      const id = `gen-${Date.now()}`
                      setSurveys([
                        ...surveys,
                        {
                          id,
                          title: `Questionario generato — ${selected.label}`,
                          year: 2028,
                          status: 'draft',
                          questions: picked.map((text, i) => ({
                            id: `gq-${i}`,
                            text,
                            kpiId: selected.id,
                            scale:
                              selected.scale === 'enps' ? 'enps' : 'likert4',
                          })),
                        },
                      ])
                      setPicked([])
                      closeModal()
                    }}
                  >
                    Genera questionario ({picked.length})
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
