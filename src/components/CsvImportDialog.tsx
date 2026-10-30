/**
 * Import CSV survey — dialog controllato.
 *
 * SHADCN: prima backdrop+panel manuali; ora `Dialog` + `Button`.
 * `onOpenChange` chiude su overlay / Escape (Radix). Classe `no-print` obbligatoria.
 */
import { useRef, useState } from 'react'
import {
  CSV_TEMPLATE,
  parseSurveyCsv,
  type CsvParseResult,
} from '../utils/csvSurvey'
import type { SurveyData } from '../data/types'
import type { AvailableYear } from '../data/kpis'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  open: boolean
  onClose: () => void
  onImported: (year: AvailableYear, data: SurveyData) => void
}

export function CsvImportDialog({ open, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        className="no-print z-[60] sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Importa CSV
          </DialogTitle>
          <DialogDescription className="text-muted">
            Carica i dati KPI per l’anno indicato nel file. Scarica il template
            per il formato corretto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={downloadTemplate}>
            Scarica template
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileRef.current?.click()}
          >
            Scegli file CSV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && (
          <p className="mb-0 text-sm text-negative" role="alert">
            {error}
          </p>
        )}
        {preview && !error && (
          <p className="mb-0 text-sm text-positive">{preview}</p>
        )}

        <DialogFooter>
          <Button type="button" variant="link" onClick={onClose}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
