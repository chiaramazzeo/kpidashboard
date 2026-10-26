import { useRef, useState } from 'react'
import {
  CSV_TEMPLATE,
  parseSurveyCsv,
  type CsvParseResult,
} from '../utils/csvSurvey'
import type { SurveyData } from '../data/types'
import type { AvailableYear } from '../data/kpis'

type Props = {
  open: boolean
  onClose: () => void
  onImported: (year: AvailableYear, data: SurveyData) => void
}

export function CsvImportDialog({ open, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  if (!open) return null

  const applyResult = (result: CsvParseResult) => {
    if (!result.ok) {
      setError(result.error)
      setPreview(null)
      return
    }
    setError(null)
    setPreview(
      `Pronto: ${result.data.meta.title} · RR ${result.data.responseRate.value}% · ${result.data.indices.length} indici`,
    )
    onImported(result.year, result.data)
    onClose()
  }

  const onFile = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    applyResult(parseSurveyCsv(text))
  }

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'golmar-kpi-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="csv-import-title"
        className="w-full max-w-md border border-ink bg-bg-elevated p-5"
      >
        <h2
          id="csv-import-title"
          className="m-0 font-display text-xl font-bold tracking-tight"
        >
          Importa CSV
        </h2>
        <p className="mt-2 mb-4 text-sm text-muted">
          Carica i dati KPI per l’anno indicato nel file. Scarica il template per
          il formato corretto.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="appearance-none rounded-sm border border-ink bg-bg px-3 py-2 text-sm font-medium"
            onClick={downloadTemplate}
          >
            Scarica template
          </button>
          <button
            type="button"
            className="appearance-none rounded-sm border border-ink bg-accent-secondary px-3 py-2 text-sm font-medium text-white"
            onClick={() => fileRef.current?.click()}
          >
            Scegli file CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && (
          <p className="mt-4 mb-0 text-sm text-negative" role="alert">
            {error}
          </p>
        )}
        {preview && !error && (
          <p className="mt-4 mb-0 text-sm text-positive">{preview}</p>
        )}

        <button
          type="button"
          className="mt-5 appearance-none border-0 bg-transparent p-0 text-sm text-muted underline"
          onClick={onClose}
        >
          Annulla
        </button>
      </div>
    </div>
  )
}
