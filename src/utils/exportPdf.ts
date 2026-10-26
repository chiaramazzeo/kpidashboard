/**
 * Opens the browser print dialog so the user can save as PDF.
 * Uses native print (HTML text + SVG vectors), not a raster screenshot.
 */
export function exportDashboardPdf() {
  window.print()
}
