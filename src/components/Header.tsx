type Props = {
  title: string
  onExportPdf: () => void
  onExportHtml: () => void
  exporting: boolean
}

export function Header({ title, onExportPdf, onExportHtml, exporting }: Props) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__mark">G</span>
          <h1 className="site-header__title">{title}</h1>
        </div>
        <div className="site-header__actions">
          <button
            type="button"
            className="btn"
            onClick={onExportHtml}
            disabled={exporting}
          >
            Scarica HTML
          </button>
          <button
            type="button"
            className="btn btn--accent"
            onClick={onExportPdf}
            disabled={exporting}
          >
            {exporting ? 'PDF…' : 'Scarica PDF'}
          </button>
        </div>
      </div>
    </header>
  )
}
