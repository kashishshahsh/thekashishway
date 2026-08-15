/* ================================================
   THE KASHISH WAY — Main JS
   Minimal. Purposeful.
   ================================================ */

'use strict';

/* --- Nav + wordmark: reveal after landing scrolls away --- */
(function initNav() {
  const nav      = document.getElementById('nav');
  const landing  = document.getElementById('landing');
  const wordmark = document.querySelector('.landing__wordmark');
  if (!nav || !landing) return;

  const obs = new IntersectionObserver(([e]) => {
    const exited = !e.isIntersecting;
    nav.classList.toggle('is-visible', exited);
    if (wordmark) wordmark.classList.toggle('is-nav', exited);
  }, { threshold: 0.15 });

  obs.observe(landing);

  // Active link
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  nav.querySelectorAll('.nav__link').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (path === href || (href !== '/' && path.startsWith(href))) {
      a.classList.add('is-active');
    }
  });
})();

/* --- Landing poem parallax --------------------------- */
(function initParallax() {
  const poem = document.querySelector('.landing__poem');
  const scroll = document.querySelector('.landing__scroll');
  if (!poem) return;

  const onScroll = () => {
    const y = window.scrollY;
    poem.style.transform = `translateY(${y * 0.22}px)`;
    if (scroll) scroll.style.opacity = Math.max(0, 1 - y / 120);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* --- Mobile nav toggle ------------------------------- */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('is-open');
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.classList.contains('is-open')) {
      toggle.classList.remove('is-open');
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* --- Scroll reveal ----------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const delay = parseFloat(target.dataset.delay || 0) * 1000;
      setTimeout(() => target.classList.add('is-visible'), delay);
      obs.unobserve(target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* --- Smooth page transitions ------------------------- */
(function initTransitions() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const isInternal = !a.hostname || a.hostname === location.hostname;
    const isAnchor   = href.startsWith('#');
    const isSpecial  = href.startsWith('mailto:') || href.startsWith('tel:');
    if (!isInternal || isAnchor || isSpecial || a.target === '_blank') return;

    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => { window.location.href = a.href; }, 300);
  });

  // Fade in on arrival
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });
})();
