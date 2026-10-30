/**
 * Survey in piattaforma (L2+). Admin pubblica; Utente risponde one-shot.
 * Controlli: Button / Input shadcn. Una job per blocco (lista / form / grazie).
 */
import { useEffect, useState } from 'react'
import { useDemo } from '../context/DemoContext'
import { NewFeatureBadge } from './NewFeatureBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { slideTitle } from '@/lib/ui'

export function SurveyPanel() {
  const {
    role,
    surveys,
    setSurveys,
    feature,
    featureNew,
    goToSection,
    setRole,
  } = useDemo()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [doneFor, setDoneFor] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(null)
    setAnswers({})
    setDoneFor(null)
  }, [role])

  if (!feature('surveyAdmin')) {
    return (
      <p className="text-sm text-muted">
        La survey in piattaforma è disponibile dal Livello 2.
      </p>
    )
  }

  const openSurveys = surveys.filter((s) =>
    role === 'user' ? s.status === 'open' : true,
  )
  const active = surveys.find((s) => s.id === activeId)

  if (role === 'user' && active && doneFor !== active.id) {
    return (
      <div className="rounded-sm border border-ink bg-bg-elevated p-6">
        {featureNew('surveyAdmin') ? (
          <div className="mb-3">
            <NewFeatureBadge level={2} />
          </div>
        ) : null}
        <h2 className={slideTitle}>{active.title}</h2>
        <p className="mt-3 text-sm text-muted">
          Accesso monouso anonimo. Le risposte non sono collegate all’identità.
        </p>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            setDoneFor(active.id)
            setActiveId(null)
            setAnswers({})
          }}
        >
          {active.questions.map((q) => (
            <fieldset key={q.id} className="m-0 space-y-2 border-0 p-0">
              <Label className="text-sm font-medium leading-snug">{q.text}</Label>
              {q.scale === 'enps' ? (
                <Input
                  type="number"
                  min={0}
                  max={10}
                  required
                  className="w-28"
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                  }
                />
              ) : (
                <select
                  required
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-sm border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                  }
                >
                  {q.scale === 'yesno' ? (
                    <>
                      <option value="">Seleziona</option>
                      <option value="yes">Sì</option>
                      <option value="no">No</option>
                    </>
                  ) : (
                    <>
                      <option value="">1–4</option>
                      <option value="1">1 — Per niente</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4 — Del tutto</option>
                    </>
                  )}
                </select>
              )}
            </fieldset>
          ))}
          <Button type="submit">Invia risposte</Button>
        </form>
      </div>
    )
  }

  if (role === 'user' && doneFor) {
    const title = surveys.find((s) => s.id === doneFor)?.title
    return (
      <div className="rounded-sm border border-ink bg-bg-elevated p-6">
        <h2 className={slideTitle}>Grazie</h2>
        <p className="mt-3 text-sm text-muted">
          Risposta a «{title}» registrata in forma anonima (simulazione
          locale).
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setDoneFor(null)
            setActiveId(null)
            setAnswers({})
          }}
        >
          Torna alle survey
        </Button>
      </div>
    )
  }

  return (
    <div>
      {featureNew('surveyAdmin') ? (
        <div className="mb-3">
          <NewFeatureBadge level={2} />
        </div>
      ) : null}
      <h2 className={slideTitle}>
        {role === 'admin' ? 'Somministrazione survey' : 'Le tue survey'}
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {role === 'admin'
          ? 'Configura e pubblica rilevazioni one-shot.'
          : 'Survey aperte con accesso monouso anonimo.'}
      </p>

      {role === 'user' && openSurveys.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Nessuna survey aperta. Passa ad Admin per pubblicarne una, oppure{' '}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-accent"
            onClick={() => setRole('admin')}
          >
            cambia ruolo
          </Button>
          .
        </p>
      ) : null}

      <ul className="mt-8 m-0 list-none space-y-3 p-0">
        {openSurveys.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink bg-bg-elevated px-4 py-4"
          >
            <div>
              <p className="m-0 font-semibold tracking-tight">{s.title}</p>
              <p className="mt-1 mb-0 font-mono text-meta uppercase tracking-[0.06em] text-muted">
                {s.year} · {s.status} · {s.questions.length} domande
              </p>
            </div>
            <div className="flex gap-2">
              {role === 'admin' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSurveys((prev) =>
                        prev.map((x) =>
                          x.id === s.id
                            ? {
                                ...x,
                                status:
                                  x.status === 'open' ? 'closed' : 'open',
                              }
                            : x,
                        ),
                      )
                    }
                  >
                    {s.status === 'open' ? 'Chiudi' : 'Pubblica'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      goToSection('kpi-admin', { level: 3, area: 'survey' })
                    }
                  >
                    Allinea KPI
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={s.status !== 'open' || doneFor === s.id}
                  onClick={() => {
                    setActiveId(s.id)
                    setAnswers({})
                  }}
                >
                  {doneFor === s.id ? 'Già inviata' : 'Rispondi'}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
