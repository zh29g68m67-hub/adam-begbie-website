/* ═══════════════════════════════════════════════
   ADAM BEGBIE — main.js
   ═══════════════════════════════════════════════ */

/* ── NAV SCROLL ─────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── ACTIVE NAV LINK (IntersectionObserver) ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── HAMBURGER & MOBILE NAV ──────────────────── */
(function () {
  const ham    = document.getElementById('ham');
  const mobNav = document.getElementById('mob-nav');
  if (!ham || !mobNav) return;

  const close = () => {
    mobNav.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-label', 'Open menu');
    mobNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  ham.addEventListener('click', () => {
    const open = mobNav.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
    ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobNav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mlink').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── SCROLL REVEAL ───────────────────────────── */
(function () {
  const els = document.querySelectorAll('.sr');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── FILTER BAR (blog & athletes) ───────────── */
(function () {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const target  = group.dataset.filterGroup;
    const items   = document.querySelectorAll(`[data-filter-target="${target}"]`);
    const buttons = group.querySelectorAll('.filter-btn');
    if (!items.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const val = btn.dataset.filter;
        items.forEach(item => {
          const match = val === 'all' || item.dataset.type === val || item.dataset.sport === val;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  });
})();

/* ── FAQ ACCORDION ───────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all siblings
      item.closest('.faq').querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });

    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
  });
})();

/* ── CONTACT FORM ────────────────────────────── */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('form-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl  = document.getElementById('f-name');
    const emailEl = document.getElementById('f-email');
    let valid = true;

    [nameEl, emailEl].forEach(f => {
      if (!f) return;
      f.style.borderColor = '';
      if (!f.value.trim()) {
        f.style.borderColor = 'var(--accent)';
        if (valid) f.focus();
        valid = false;
      }
    });

    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.style.borderColor = 'var(--accent)';
      if (valid) emailEl.focus();
      valid = false;
    }

    if (!valid) return;

    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(() => {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      })
      .catch(() => {
        if (btn) { btn.textContent = 'Error — please try again'; btn.disabled = false; }
      });
  });
})();

/* ── COMMUNITY JOIN FORM ─────────────────────── */
(function () {
  const form    = document.getElementById('join-form');
  const success = document.getElementById('join-success');
  const btn     = document.getElementById('join-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = document.getElementById('j-email');
    if (emailEl && !emailEl.value.trim()) {
      emailEl.style.borderColor = 'var(--accent)';
      emailEl.focus();
      return;
    }
    if (btn) { btn.textContent = 'Joining…'; btn.disabled = true; }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(() => {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      })
      .catch(() => {
        if (btn) { btn.textContent = 'Error — please try again'; btn.disabled = false; }
      });
  });
})();
