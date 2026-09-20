// Daddy Roofer — shared site behavior

document.addEventListener('DOMContentLoaded', function () {

  /* Subtle scroll-reveal on major sections */
  var revealTargets = document.querySelectorAll('.row-block, .cta-band, .grid3 .cell, .step');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 60 + 'ms';
      revealIO.observe(el);
    });
  }

  /* Mobile nav toggle */
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

  /* Count-up on stat numbers, once, when scrolled into view */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        var duration = 900;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* Lightbox for gallery photos */
  var galleryImgs = document.querySelectorAll('.lightbox-trigger img');
  if (galleryImgs.length) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Fermer">&times;</button><img class="lightbox-img" src="" alt="">';
    document.body.appendChild(overlay);
    var lbImg = overlay.querySelector('.lightbox-img');

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    galleryImgs.forEach(function (img) {
      img.parentElement.style.cursor = 'zoom-in';
      img.parentElement.addEventListener('click', function () {
        openLightbox(img.src, img.alt);
      });
    });
    overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* Subtle header shadow after scrolling */
  var header = document.querySelector('header.site');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
});
