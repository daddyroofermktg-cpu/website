// Daddy Roofer: shared site behavior
document.addEventListener('DOMContentLoaded', function () {
  var lang = document.documentElement.lang === 'en' ? 'en' : 'fr';

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var navlinks = document.querySelector('.navlinks');
  if (toggle && navlinks) {
    toggle.addEventListener('click', function () {
      var open = navlinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navlinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navlinks.classList.remove('open'); });
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector('header.site');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* Gentle reveal */
  var targets = document.querySelectorAll('.reveal-on');
  if (targets.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* Services accordion: one open at a time, open from #hash */
  var acc = document.querySelectorAll('.acc details');
  acc.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) acc.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  function openFromHash() {
    if (!location.hash) return;
    var el = document.querySelector('.acc details' + location.hash);
    if (el) {
      el.open = true;
      setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* Lightbox with arrows, close button and captions */
  var items = document.querySelectorAll('[data-lightbox]');
  if (items.length) {
    var labels = lang === 'en'
      ? { close: 'Close', prev: 'Previous photo', next: 'Next photo' }
      : { close: 'Fermer', prev: 'Photo précédente', next: 'Photo suivante' };
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lb-close" aria-label="' + labels.close + '">&times;</button>' +
      '<button class="lb-prev" aria-label="' + labels.prev + '">&#8249;</button>' +
      '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="' + labels.next + '">&#8250;</button>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    var group = [], idx = 0, lastFocus = null;

    function show() {
      var el = group[idx], i = el.querySelector('img');
      img.src = el.getAttribute('data-full') || i.src;
      img.alt = i.alt;
      cap.textContent = el.getAttribute('data-caption') || '';
      cap.style.display = cap.textContent ? 'block' : 'none';
      var multi = group.length > 1;
      lb.querySelector('.lb-prev').style.display = multi ? '' : 'none';
      lb.querySelector('.lb-next').style.display = multi ? '' : 'none';
    }
    function open(el) {
      var g = el.getAttribute('data-lightbox');
      group = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + g + '"]'));
      idx = group.indexOf(el);
      lastFocus = el;
      show();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    function move(d) { idx = (idx + d + group.length) % group.length; show(); }

    items.forEach(function (el) { el.addEventListener('click', function () { open(el); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { move(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft' && group.length > 1) move(-1);
      if (e.key === 'ArrowRight' && group.length > 1) move(1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null || group.length < 2) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) move(dx > 0 ? -1 : 1);
      sx = null;
    });
  }
});
