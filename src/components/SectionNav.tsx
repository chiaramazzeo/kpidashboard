const links = [
  { href: '#response', label: 'Response' },
  { href: '#overview', label: 'Overview' },
  { href: '#engagement', label: 'Engagement' },
  { href: '#enablement', label: 'Enablement' },
  { href: '#innovation', label: 'Innovation' },
  { href: '#trust', label: 'Trust' },
  { href: '#splits', label: 'Segmenti' },
]

export function SectionNav() {
  return (
    <nav className="section-nav" aria-label="Sezioni">
      <div className="section-nav__inner">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="section-nav__link">
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
