/**
 * REVIEW — Export HTML
 * Snapshot del report + nav sezioni cliccabili (#ancore) con scroll smooth
 * e chip attiva. Reveal e barre forzati visibili. Stili Tailwind dai CSS del documento.
 */
import { SECTION_LINKS } from '../data/nav'

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
  // Carosello → slide impilate, senza transform
  const track = clone.querySelector('.carousel__track') as HTMLElement | null
  if (track) {
    track.style.transform = 'none'
    track.style.width = '100%'
    track.style.display = 'block'
  }
  const viewport = clone.querySelector('.carousel__viewport') as HTMLElement | null
  if (viewport) {
    viewport.style.height = 'auto'
    viewport.style.overflow = 'visible'
    viewport.style.scrollSnapType = 'none'
  }
  clone.querySelectorAll('.carousel__slide').forEach((node) => {
    const el = node as HTMLElement
    el.style.flex = 'none'
    el.style.width = '100%'
    el.style.maxWidth = '100%'
    el.style.height = 'auto'
    el.style.overflow = 'visible'
    el.style.visibility = 'visible'
    el.style.display = 'block'
  })
  clone.querySelectorAll('.no-print').forEach((node) => node.remove())
  return clone.outerHTML
}

const linkBase =
  'shrink-0 rounded-sm border px-3 py-2 text-chip font-medium no-underline transition-colors duration-150'
const linkIdle = 'border-transparent bg-transparent text-muted hover:bg-bg-warm hover:text-ink'
const linkActive = 'is-active border-accent bg-transparent text-accent'

function buildSectionNavHtml(): string {
  const links = SECTION_LINKS.map(
    (link, index) =>
      `<a href="#${link.id}" class="${linkBase} ${index === 0 ? linkActive : linkIdle}"${index === 0 ? ' aria-current="true"' : ''}>${link.label}</a>`,
  ).join('\n          ')

  return `<nav class="section-nav sticky top-0 z-30 border-b border-line bg-bg" aria-label="Sezioni">
      <div class="section-nav__shell relative mx-auto max-w-report">
        <div class="section-nav__scroller box-border flex items-center gap-1 overflow-x-auto px-5 py-3">
          ${links}
        </div>
        <div class="section-nav__fade section-nav__fade--left" aria-hidden="true"></div>
        <div class="section-nav__fade section-nav__fade--right" aria-hidden="true"></div>
        <button type="button" class="section-nav__arrow section-nav__arrow--left" aria-label="Sezioni precedenti" tabindex="-1" disabled>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 2 L4 7 L9 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"/></svg>
        </button>
        <button type="button" class="section-nav__arrow section-nav__arrow--right" aria-label="Sezioni successive" tabindex="-1" disabled>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 2 L10 7 L5 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"/></svg>
        </button>
      </div>
    </nav>`
}

const NAV_SCRIPT = `
(function () {
  var ids = [${SECTION_LINKS.map((l) => JSON.stringify(l.id)).join(', ')}];
  var links = Array.prototype.slice.call(document.querySelectorAll('.section-nav__scroller a'));
  var scroller = document.querySelector('.section-nav__scroller');
  var fadeL = document.querySelector('.section-nav__fade--left');
  var fadeR = document.querySelector('.section-nav__fade--right');
  var arrowL = document.querySelector('.section-nav__arrow--left');
  var arrowR = document.querySelector('.section-nav__arrow--right');
  var locked = null;
  var unlockTimer = null;
  var linkBase = ${JSON.stringify(linkBase)};
  var linkIdle = ${JSON.stringify(linkIdle)};
  var linkActive = ${JSON.stringify(linkActive)};
  var step = 180;

  function offset() {
    var nav = document.querySelector('.section-nav');
    var gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-gap')) || 8;
    return (nav ? nav.getBoundingClientRect().height : 44) + gap;
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

  function syncOverflow() {
    if (!scroller) return;
    var left = scroller.scrollLeft > 2;
    var right = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2;
    if (fadeL) fadeL.classList.toggle('is-visible', left);
    if (fadeR) fadeR.classList.toggle('is-visible', right);
    if (arrowL) {
      arrowL.classList.toggle('is-visible', left);
      arrowL.disabled = !left;
      arrowL.tabIndex = left ? 0 : -1;
    }
    if (arrowR) {
      arrowR.classList.toggle('is-visible', right);
      arrowR.disabled = !right;
      arrowR.tabIndex = right ? 0 : -1;
    }
  }

  function setActive(id) {
    var activeLink = null;
    links.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.className = linkBase + ' ' + (match ? linkActive : linkIdle);
      if (match) {
        link.setAttribute('aria-current', 'true');
        activeLink = link;
      } else link.removeAttribute('aria-current');
    });
    if (scroller && activeLink) {
      var target =
        activeLink.offsetLeft - scroller.clientWidth * 0.25 + activeLink.offsetWidth / 2;
      var maxScroll = scroller.scrollWidth - scroller.clientWidth;
      var nextLeft = Math.max(0, Math.min(target, maxScroll));
      scroller.scrollTo({
        left: nextLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
      setTimeout(syncOverflow, 350);
    }
    syncOverflow();
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

  if (scroller) {
    scroller.addEventListener('scroll', syncOverflow, { passive: true });
    window.addEventListener('resize', syncOverflow);
  }
  if (arrowL) {
    arrowL.addEventListener('click', function () {
      if (!scroller) return;
      scroller.scrollBy({
        left: -step,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  }
  if (arrowR) {
    arrowR.addEventListener('click', function () {
      if (!scroller) return;
      scroller.scrollBy({
        left: step,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scrollend', function () {
    if (locked) unlock();
  });
  setActive(resolveActive());
  syncOverflow();
})();
`

export function exportDashboardHtml(
  element: HTMLElement,
  filename = 'Golmar-2028-KPI.html',
  pageTitle = 'Golmar 2028 KPI',
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

/* Snapshot: force revealed content + bar fills visible */
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
  scroll-margin-top: calc(var(--nav-h) + var(--sticky-gap, 8px)) !important;
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
