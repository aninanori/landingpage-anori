/* ============================================================
   ANORI TECH – Website 2026 (V3)
   Burger-Nav · FAQ-Accordion · Fade-in
   Consent-Banner (vorbereitet, aktivieren ueber ANORI_CONFIG)
   ============================================================ */
(function () {
  'use strict';

  /* --------------------------------------------------------
     Konfiguration
     TRACKING_ENABLED auf true setzen, sobald Analytics
     eingebunden wird. Erst dann erscheint das Consent-Banner
     und der Footer-Link "Cookie-Einstellungen".
     -------------------------------------------------------- */
  var ANORI_CONFIG = window.ANORI_CONFIG || {
    TRACKING_ENABLED: false,
    CONSENT_KEY: 'anori-consent-v1'
  };

  /* ================= Header: transparent -> Navy beim Scrollen =================
     Gleiches Verhalten wie auf der bestehenden Live-Seite. */
  var hdr = document.getElementById('hdr');
  function onScroll() {
    if (!hdr) return;
    if (window.scrollY > 40) { hdr.classList.add('scrolled'); }
    else { hdr.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ================= Burger-Nav ================= */
  var menu = document.getElementById('nav-menu');
  var backdrop = document.getElementById('nav-backdrop');
  var burger = document.getElementById('burger-btn');

  function openNav() {
    if (!menu) return;
    menu.classList.add('open');
    backdrop.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = menu.querySelector('a.nav-link');
    if (first) first.focus();
  }

  function closeNav() {
    if (!menu) return;
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleNav() {
    if (menu && menu.classList.contains('open')) { closeNav(); } else { openNav(); }
  }

  if (burger) burger.addEventListener('click', toggleNav);
  if (backdrop) backdrop.addEventListener('click', closeNav);
  var closeBtn = document.querySelector('.nav-close');
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Fokus im geoeffneten Panel halten */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !menu || !menu.classList.contains('open')) return;
    var f = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });


  /* ================= FAQ-Accordion ================= */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ================= Fade-in ================= */
  var fades = document.querySelectorAll('.fi');
  if ('IntersectionObserver' in window && fades.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('vis'); });
  }

  /* ================= Consent-Banner =================
     Standardmaessig inaktiv: es laeuft aktuell kein Tracking
     auf der Seite. Sobald Analytics eingebunden wird:
     window.ANORI_CONFIG = { TRACKING_ENABLED: true } vor dem
     Einbinden dieser Datei setzen. Dann erscheint das Banner
     und der Footer-Link "Cookie-Einstellungen".
     ================================================== */
  var consent = document.getElementById('consent');

  function getConsent() {
    try { return localStorage.getItem(ANORI_CONFIG.CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(ANORI_CONFIG.CONSENT_KEY, value); } catch (e) {}
    if (consent) { consent.classList.remove('show'); consent.setAttribute('hidden', ''); }
    if (value === 'granted') loadAnalytics();
  }
  function loadAnalytics() {
    /* Platzhalter: hier spaeter das Analytics-Snippet einhaengen.
       Wird ausschliesslich nach ausdruecklicher Einwilligung aufgerufen. */
  }

  function showConsent() {
    if (!consent) return;
    consent.removeAttribute('hidden');
    consent.classList.add('show');
  }

  window.anoriOpenConsent = function () {
    if (!ANORI_CONFIG.TRACKING_ENABLED) return;
    showConsent();
  };

  if (ANORI_CONFIG.TRACKING_ENABLED && consent) {
    if (!getConsent()) showConsent();
    else if (getConsent() === 'granted') loadAnalytics();
    var acc = document.getElementById('consent-accept');
    var dec = document.getElementById('consent-decline');
    if (acc) acc.addEventListener('click', function () { setConsent('granted'); });
    if (dec) dec.addEventListener('click', function () { setConsent('denied'); });
    /* Cookie-Link im Footer einblenden, den CSS standardmaessig ausblendet */
    document.querySelectorAll('[data-consent-link]').forEach(function (el) {
      el.style.display = '';
    });
  }

  /* ================= Kontaktdaten-Schutz =================
     Mailadressen und Telefonnummern stehen nirgends vollstaendig
     im Quelltext. Im HTML liegen nur umgedrehte Bruchstuecke in
     data-Attributen (data-u, data-h, data-n); erst diese Funktion
     setzt daraus href und sichtbaren Text zusammen. Harvester, die
     nur HTML lesen und kein JavaScript ausfuehren, finden nichts.

     Ohne JavaScript bleibt der Platzhalter "team [at] anoritech
     [dot] com" stehen: lesbar, aber nicht klickbar.

     Ausnahme mit Absicht: die JSON-LD-Strukturdaten im <head>
     enthalten weiterhin Klartext, weil Google und KI-Suchen die
     Kontaktdaten dort auslesen.

     Markup-Muster:
       <a data-cx="mail" data-u="maet" data-h="moc.hcetirona" data-s="Betreff">
         <span data-cx-text>team [at] anoritech [dot] com</span></a>
       <a data-cx="tel" data-n="0171107615194">
         <span data-cx-text>+49 151 6701 1710</span></a>
     ======================================================== */
  function revStr(s) { return (s || '').split('').reverse().join(''); }

  window.anoriContacts = function (root) {
    var scope = root || document;

    scope.querySelectorAll('[data-cx="mail"]').forEach(function (el) {
      var addr = revStr(el.getAttribute('data-u')) + String.fromCharCode(64) + revStr(el.getAttribute('data-h'));
      var subj = el.getAttribute('data-s');
      el.setAttribute('href', 'mailto:' + addr + (subj ? '?subject=' + encodeURIComponent(subj) : ''));
      var slot = el.querySelector('[data-cx-text]');
      if (slot) { slot.textContent = addr; }
    });

    scope.querySelectorAll('[data-cx="tel"]').forEach(function (el) {
      var d = revStr(el.getAttribute('data-n'));
      el.setAttribute('href', 'tel:+' + d);
      var slot = el.querySelector('[data-cx-text]');
      if (slot) { slot.textContent = '+' + d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5); }
    });
  };

  window.anoriContacts();

  /* Aktuelles Jahr im Footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
