type Props = {
  title: string
  onExport: () => void
  exporting: boolean
}

export function Header({ title, onExport, exporting }: Props) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__mark">G</span>
          <h1 className="site-header__title">{title}</h1>
        </div>
        <button
          type="button"
          className="btn btn--accent"
          onClick={onExport}
          disabled={exporting}
        >
          {exporting ? 'PDF…' : 'Scarica PDF'}
        </button>
      </div>
    </header>
  )
}
