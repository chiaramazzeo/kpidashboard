# Golmar 2028 KPI

Dashboard editoriale per i KPI della survey engagement Golmar (management interno).

## Avvio

```bash
npm install
npm run dev
```

Build statica (sito HTML in `dist/`):

```bash
npm run build
npm run preview
```

## Aggiornare i dati

Modifica i valori mock in [`src/data/kpis.ts`](src/data/kpis.ts):

- `meta` — titolo, invitati, rispondenti, anni
- `responseRate` — tasso e split per area
- `indices` — Engagement, Enablement, Innovation, Trust (+ drivers e target)
- `splits` — segmentazioni dimostrative

## Export PDF

Il pulsante **Scarica PDF** genera un PDF multipagina della dashboard (html2canvas + jsPDF). In caso di errore, viene usato il dialogo di stampa del browser.

## Stack

Vite + React + TypeScript. Grafici SVG/CSS custom (barre stroked, gauge, radar, slope, bullet, small multiples). Nessun backend.
