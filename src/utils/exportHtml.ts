const SECTION_LINKS = [
  { href: '#response', label: 'Response' },
  { href: '#overview', label: 'Overview' },
  { href: '#engagement', label: 'Engagement' },
  { href: '#enablement', label: 'Enablement' },
  { href: '#innovation', label: 'Innovation' },
  { href: '#trust', label: 'Trust' },
  { href: '#splits', label: 'Segmenti' },
] as const

function collectDocumentCss(): string {
  const parts: string[] = []

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        parts.push(rule.cssText)
      }
    } catch {
      if (sheet.href) {
        parts.push(`@import url("${sheet.href}");`)
      }
    }
  }

  return parts.join('\n')
}

function prepareClone(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.reveal').forEach((node) => {
    node.classList.add('is-visible')
  })
  return clone.outerHTML
}

function buildSectionNavHtml(): string {
  const links = SECTION_LINKS.map(
    (link, index) =>
      `<a href="${link.href}" class="section-nav__link${index === 0 ? ' is-active' : ''}"${index === 0 ? ' aria-current="true"' : ''}>${link.label}</a>`,
  ).join('\n          ')

  return `<nav class="section-nav" aria-label="Sezioni">
      <div class="section-nav__inner">
          ${links}
      </div>
    </nav>`
}

const NAV_SCRIPT = `
(function () {
  var ids = [${SECTION_LINKS.map((l) => JSON.stringify(l.href.slice(1))).join(', ')}];
  var links = Array.prototype.slice.call(document.querySelectorAll('.section-nav__link'));
  var locked = null;
  var unlockTimer = null;

  function offset() {
    var nav = document.querySelector('.section-nav');
    return (nav ? nav.getBoundingClientRect().height : 44) + 4;
  }

  function resolveActive() {
    var o = offset();
    var current = ids[0];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= o) current = ids[i];
    }
    return current;
  }

  function setActive(id) {
    links.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', match);
      if (match) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function unlock() {
    locked = null;
    if (unlockTimer) {
      clearTimeout(unlockTimer);
      unlockTimer = null;
    }
    setActive(resolveActive());
  }

  function onScroll() {
    if (locked) {
      if (unlockTimer) clearTimeout(unlockTimer);
      unlockTimer = setTimeout(unlock, 400);
      return;
    }
    setActive(resolveActive());
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href') || '';
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      locked = id;
      setActive(id);
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset();
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scrollend', function () {
    if (locked) unlock();
  });
  setActive(resolveActive());
})();
`

export function exportDashboardHtml(
  element: HTMLElement,
  filename = 'Golmar-2026-KPI.html',
  pageTitle = 'Golmar 2026 KPI',
) {
  const css = collectDocumentCss()
  const bodyHtml = prepareClone(element)
  const navHtml = buildSectionNavHtml()

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
  <style>
${css}

/* Snapshot: force revealed content visible */
.reveal {
  opacity: 1 !important;
  transform: none !important;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
}
/* No live site header in snapshot — pin nav to top */
.section-nav {
  top: 0 !important;
}
.section {
  scroll-margin-top: calc(var(--nav-h) + 0.5rem) !important;
}
  </style>
</head>
<body>
${navHtml}
${bodyHtml}
<script>
${NAV_SCRIPT}
</script>
</body>
</html>
`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
