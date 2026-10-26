/** Link sezioni report — fonte unica per SectionNav e export HTML. */
export const SECTION_LINKS = [
  { href: '#response', label: 'Response Rate' },
  { href: '#overview', label: 'Overview' },
  { href: '#evoluzione', label: 'Evoluzione' },
  { href: '#engagement', label: 'Engagement Index' },
  { href: '#enablement', label: 'Performance Enablement Index' },
  { href: '#innovation', label: 'Innovation Index' },
  { href: '#trust', label: 'Trust in Management Index' },
] as const

export const SECTION_IDS = SECTION_LINKS.map((link) => link.href.slice(1))
