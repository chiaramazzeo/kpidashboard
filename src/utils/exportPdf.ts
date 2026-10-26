/**
 * REVIEW — Export PDF
 * Deve restare print nativo (testo selezionabile + SVG vettoriali).
 * NON reintrodurre html2canvas / jsPDF raster / JPEG embedded.
 */
export function exportDashboardPdf() {
  window.print()
}
