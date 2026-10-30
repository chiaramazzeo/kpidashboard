# UI primitives (shadcn/ui)

Componenti generati con la CLI shadcn e adattati al brand Golmar.

## Cosa c’è

| File | Uso tipico nel dashboard |
|------|---------------------------|
| `button.tsx` | Header (PDF/HTML), dialog actions, CTA admin |
| `badge.tsx` | Base di `NewFeatureBadge` |
| `dialog.tsx` | `CsvImportDialog`, `ChartModal`, modal KPI admin |
| `dropdown-menu.tsx` | Menu export Header |
| `tooltip.tsx` | `InfoTip` (glossario «i») — richiede `TooltipProvider` in `main.tsx` |
| `switch.tsx` | Admin / Utente in Header (area Survey) |
| `input.tsx` / `label.tsx` | Form `KpiAdminPanel` |
| `separator.tsx` | Divider nei modal |

Utility: `src/lib/utils.ts` → `cn()` (clsx + tailwind-merge).

## Aggiungere un componente

```bash
npx shadcn@latest add <nome> -y
```

Poi:

1. Verifica che `import { cn } from "@/lib/utils"` (non dal pacchetto npm `cn`).
2. Aggiungi un commento in testa al file (come negli altri).
3. Se serve, allinea `rounded-sm` / colori al brand.

Registry Animate UI (icone): già in `components.json` → `@animate-ui`.

## Tema colori

Token shadcn in `src/index.css` (`:root` + `@theme inline`):

- `--primary` = `#e10600` (rosso Golmar)
- `--secondary` = `#f87874` (PDF)
- `--radius` = `4px`

I token KPI (`--color-accent`, `--color-year-*`, series, …) restano separati: non sostituirli con i nomi shadcn.

Livelli / novità feature: `src/data/levels.ts` + CSS vars `--level-accent*`.

## Classi report condivise

Vedi `src/lib/ui.ts`: `tileOpen`, `metaLabel`, `slideTitle`, `scoreHero*`, `segmentGroup`.
Slide estratte in `src/components/slides/`.

## Regole progetto

- **Non** reintrodurre fogli BEM tipo `App.css` / `charts.css` / `tokens.css`.
- CSS custom consentito solo per: reveal, header compact, carousel, chat, print, `.info-tip__btn`.
- Tile KPI = `<button>` + `tileOpen` (non `Button` default). Chat resta dock custom + Button/Input.
