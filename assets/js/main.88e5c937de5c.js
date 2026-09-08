(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observeOnce = (element, callback, options = {}) => {
    if (!element) return;
    if (!('IntersectionObserver' in window)) return callback();
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        callback();
      }
    }, options);
    observer.observe(element);
  };

  const year = document.getElementById('yr');
  if (year) year.textContent = new Date().getFullYear();

  // Set attribution before Typeform's loader reads the widget attributes.
  const widget = document.getElementById('tf-inline');
  const formLink = document.getElementById('formDirectLink');
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const hidden = [];
  const formHash = new URLSearchParams();
  ['ref', 'trakyo_id'].forEach(key => {
    const value = query.get(key) || hash.get(key);
    if (value) {
      hidden.push(key + '=' + encodeURIComponent(value));
      formHash.set(key, value);
    }
  });
  if (widget && hidden.length) widget.setAttribute('data-tf-hidden', hidden.join(','));
  if (formLink && hidden.length) formLink.href += '#' + formHash.toString();

  let formRequested = false;
  function loadForm() {
    if (!widget || formRequested) return;
    formRequested = true;
    const script = document.createElement('script');
    script.src = 'https://embed.typeform.com/next/embed.js';
    script.async = true;
    script.onerror = () => {
      formRequested = false;
      const status = document.getElementById('formStatus');
      if (status) status.textContent = 'Use the link below to open your application.';
    };
    const ready = new MutationObserver(() => {
      if (widget.querySelector('iframe')) {
        document.getElementById('formStatus')?.remove();
        ready.disconnect();
      }
    });
    ready.observe(widget, { childList: true, subtree: true });
    document.head.appendChild(script);
  }
  observeOnce(document.getElementById('apply'), loadForm, { rootMargin: '400px 0px' });
  document.querySelectorAll('a[href="#apply"]').forEach(link => {
    link.addEventListener('click', loadForm);
  });
  if (window.location.hash === '#apply') loadForm();

  // Load the existing above-the-fold player after the page can paint.
  function loadHeroVideo() {
    const host = document.getElementById('vidalytics_embed_zosa3bAhEHrS8oqy');
    const fallback = document.getElementById('videoFallback');
    const retry = document.getElementById('videoRetry');
    if (!host || host.dataset.loading === 'true') return;
    host.dataset.loading = 'true';
    fallback.hidden = true;
    const fail = () => {
      if (host.querySelector('video, iframe')) return;
      fallback.hidden = false;
      host.dataset.loading = 'false';
      retry.disabled = false;
    };
    const watchdog = window.setTimeout(fail, 18000);
    const ready = new MutationObserver(() => {
      if (host.querySelector('video, iframe')) {
        window.clearTimeout(watchdog);
        fallback.hidden = true;
        const poster = document.getElementById('heroPoster');
        if (poster) poster.hidden = true;
        ready.disconnect();
      }
    });
    ready.observe(host, { childList: true, subtree: true });
    try {
      (function (v, i, d, a, l, y, t, c, s) {
        y = '_' + d.toLowerCase(); c = d + 'L';
        if (!v[d]) v[d] = {};
        if (!v[c]) v[c] = {};
        if (!v[y]) v[y] = {};
        const vl = 'Loader';
        let vli = v[y][vl];
        let vsl = v[c][vl + 'Script'];
        if (!vsl) {
          vsl = function (url, callback) {
            if (t) { callback(); return; }
            s = i.createElement('script');
            s.async = true;
            s.src = url;
            s.onload = callback;
            s.onerror = fail;
            i.head.appendChild(s);
          };
        }
        vsl(l + 'loader.min.js', function () {
          try {
            if (!vli) { const Loader = v[c][vl]; vli = new Loader(); }
            vli.loadScript(l + 'player.min.js', function () {
              try { const Embed = v[d].Embed; t = new Embed(); t.run(a); }
              catch (_) { fail(); }
            });
          } catch (_) { fail(); }
        });
      })(window, document, 'Vidalytics', 'vidalytics_embed_zosa3bAhEHrS8oqy',
        'https://fast.vidalytics.com/embeds/Brc8QfTa/zosa3bAhEHrS8oqy/');
    } catch (_) { fail(); }
  }
  requestAnimationFrame(() => window.setTimeout(loadHeroVideo, 0));
  document.getElementById('videoRetry')?.addEventListener('click', loadHeroVideo);

  // Content stays readable if JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.querySelectorAll('.reveal, .wall-item').forEach(element => {
      if (element.id === 'apply') return;
      element.classList.add('reveal-pending');
      observeOnce(element, () => {
        element.classList.add('in');
        element.classList.remove('reveal-pending');
      }, { threshold: 0.08, rootMargin: '0px 0px 50px 0px' });
    });
  }

  document.querySelectorAll('.stat-num').forEach(element => {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    observeOnce(element, () => {
      const target = Number(element.dataset.count) || 0;
      const prefix = element.dataset.prefix || '';
      let start;
      function step(timestamp) {
        if (start === undefined) start = timestamp;
        const progress = Math.min((timestamp - start) / 1400, 1);
        const value = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
        element.textContent = prefix + value.toLocaleString('en-US');
        if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(step);
        else element.textContent = prefix + target.toLocaleString('en-US');
      }
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
  });

  // YouTube players make no requests until their local thumbnail is activated.
  document.querySelectorAll('.cs-thumb.yt').forEach(box => {
    const button = box.querySelector('button');
    button?.addEventListener('click', () => {
      const id = box.dataset.yt;
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      iframe.title = button.getAttribute('aria-label') || 'Student case study';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.className = 'case-study-frame';
      box.replaceChildren(iframe);
      iframe.focus();
    }, { once: true });
  });

  const floatCta = document.getElementById('floatCta');
  let scrollPending = false;
  function updateFloat() {
    if (floatCta) {
      const visible = window.scrollY > window.innerHeight * 1.15;
      floatCta.classList.toggle('show', visible);
      floatCta.inert = !visible || document.getElementById('tosOverlay')?.classList.contains('open');
    }
    scrollPending = false;
  }
  function queueFloat() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(updateFloat);
  }
  window.addEventListener('scroll', queueFloat, { passive: true });
  window.addEventListener('resize', queueFloat, { passive: true });
  updateFloat();

  const overlay = document.getElementById('tosOverlay');
  const openButton = document.getElementById('tosOpenBtn');
  const closeButton = document.getElementById('tosCloseBtn');
  if (overlay && openButton && closeButton) {
    const background = [...document.querySelectorAll('header, main, footer, #floatCta')];
    let inertStates = [];
    let previousFocus;
    let previousOverflow = '';
    function openTerms() {
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      inertStates = background.map(element => element.inert);
      background.forEach(element => { element.inert = true; });
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      openButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    }
    function closeTerms() {
      if (!overlay.classList.contains('open')) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      openButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = inertStates[index]; });
      previousFocus?.focus({ preventScroll: true });
    }
    openButton.addEventListener('click', openTerms);
    closeButton.addEventListener('click', closeTerms);
    overlay.addEventListener('click', event => { if (event.target === overlay) closeTerms(); });
    document.addEventListener('keydown', event => {
      if (!overlay.classList.contains('open')) return;
      if (event.key === 'Escape') closeTerms();
      if (event.key === 'Tab') {
        const targets = [...overlay.querySelectorAll('button, a[href], [tabindex="0"]')];
        const first = targets[0], last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function syncMotion() {
    document.body.classList.toggle('page-hidden', document.hidden);
    if (reducedMotion.matches) document.querySelectorAll('.reveal-pending').forEach(element => {
      element.classList.remove('reveal-pending');
      element.classList.add('in');
    });
  }
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener?.('change', syncMotion);
  syncMotion();
})();
