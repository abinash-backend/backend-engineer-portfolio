/* ============================================
   ABINASH NAYAK | PORTFOLIO — main.js
   Scroll reveal · Active nav · Typed hero · Code highlight
   ============================================ */

'use strict';

/* ── 1. SCROLL REVEAL ─────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.project-card, .architecture-item, .stack-category, .contact-card, .section-header'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger delay within parent groups
    const siblings = el.parentElement.children;
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0 && idx <= 4) {
      el.classList.add(`reveal-delay-${idx}`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ── 2. ACTIVE NAV HIGHLIGHT ─────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── 3. TYPED HERO SUBTITLE ──────────────── */
function initTypedSubtitle() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;

  const lines = [
    'Building transactional systems with Spring Boot, PostgreSQL, and production-grade backend architecture',
    'Designing reliable APIs with JWT auth, Redis caching & Docker-powered CI/CD',
    'Turning business logic into clean, testable Java services',
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTicks = 0;
  const PAUSE = 55; // ticks to wait at full string

  function tick() {
    const current = lines[lineIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        pauseTicks = 0;
        setTimeout(tick, 1800); // pause before deleting
        return;
      }
    } else {
      if (pauseTicks < PAUSE) { pauseTicks++; }
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        lineIdx   = (lineIdx + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
    }

    const speed = deleting ? 22 : 38;
    setTimeout(tick, speed);
  }

  // Delay start so it feels intentional
  el.textContent = '';
  setTimeout(tick, 900);
}

/* ── 4. CODE SNIPPET SYNTAX HIGHLIGHT ───── */
function initCodeHighlight() {
  const codeEl = document.querySelector('.code-snippet code');
  if (!codeEl) return;

  const raw = codeEl.textContent;

  const rules = [
    // annotations
    { re: /(@\w+)/g,           cls: 'hl-annotation' },
    // keywords
    { re: /\b(public|class|void|return|new)\b/g, cls: 'hl-keyword' },
    // types / identifiers starting with uppercase
    { re: /\b([A-Z][a-zA-Z0-9]+)\b/g, cls: 'hl-type' },
    // method calls
    { re: /\b(\w+)\s*\(/g,    cls: 'hl-method', group: 1 },
    // strings
    { re: /(".*?")/g,          cls: 'hl-string' },
  ];

  // Build a safe HTML string without clobbering each other
  // We use a token-map approach keyed by position
  const tokens = []; // [{start,end,cls}]

  rules.forEach(({ re, cls, group }) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(raw)) !== null) {
      const g      = group != null ? group : 0;
      const start  = m.index + (group ? m[0].indexOf(m[g]) : 0);
      const end    = start + m[g].length;
      tokens.push({ start, end, cls });
    }
  });

  // Sort and de-overlap (first-come priority)
  tokens.sort((a, b) => a.start - b.start);
  const used    = [];
  const filtered = tokens.filter(({ start, end }) => {
    const overlap = used.some((u) => start < u.end && end > u.start);
    if (!overlap) { used.push({ start, end }); return true; }
    return false;
  });

  // Build final HTML
  let html = '';
  let cursor = 0;
  filtered.sort((a, b) => a.start - b.start).forEach(({ start, end, cls }) => {
    html += escHtml(raw.slice(cursor, start));
    html += `<span class="${cls}">${escHtml(raw.slice(start, end))}</span>`;
    cursor = end;
  });
  html += escHtml(raw.slice(cursor));
  codeEl.innerHTML = html;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── 5. SMOOTH NAV SCROLL ─────────────────── */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ── 6. HEADER SHADOW ON SCROLL ─────────── */
function initHeaderShadow() {
  const header = document.querySelector('.header');
  if (!header) return;
  const update = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 32px rgba(0,0,0,0.5)'
      : 'none';
  };
  window.addEventListener('scroll', update, { passive: true });
}

/* ── 7. ACTIVE NAV CSS (injected) ────────── */
function injectNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--cyan) !important;
      border-color: var(--border) !important;
      background: var(--cyan-glow) !important;
    }
    .hl-annotation { color: #c792ea; }
    .hl-keyword    { color: #89ddff; }
    .hl-type       { color: #ffcb6b; }
    .hl-method     { color: #82aaff; }
    .hl-string     { color: #c3e88d; }
  `;
  document.head.appendChild(style);
}

/* ── BOOT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectNavActiveStyle();
  initScrollReveal();
  initActiveNav();
  initTypedSubtitle();
  initCodeHighlight();
  initSmoothNav();
  initHeaderShadow();
});
