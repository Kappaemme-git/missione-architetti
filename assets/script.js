/* Missione Architetti — interazioni */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Anno corrente ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Nav: sticky + menu mobile ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var closeMenu = function () {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Video progetti: play in hover / in viewport ---------- */
  var cards = document.querySelectorAll('.pcard');

  cards.forEach(function (card) {
    var v = card.querySelector('video');
    if (!v) return;

    var play = function () {
      if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    var stop = function () { v.pause(); };

    // Desktop: hover
    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', stop);

    // Mobile / touch: autoplay quando la card è ben visibile
    if ('IntersectionObserver' in window && !reduce) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (window.matchMedia('(hover: hover)').matches) return;
          en.isIntersecting ? play() : stop();
        });
      }, { threshold: 0.6 });
      vo.observe(card);
    }
  });

  /* ---------- Bio del team ----------
     Desktop: si apre in hover (CSS). Touch/tastiera: si apre al tap/Invio. */
  var members = document.querySelectorAll('.member');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var closeMembers = function (except) {
    members.forEach(function (m) {
      if (m !== except) { m.classList.remove('is-open'); m.setAttribute('aria-expanded', 'false'); }
    });
  };

  members.forEach(function (m) {
    var closeBtn = m.querySelector('.member__close');

    var toggle = function () {
      var open = !m.classList.contains('is-open');
      closeMembers(m);
      m.classList.toggle('is-open', open);
      m.setAttribute('aria-expanded', String(open));
    };

    m.addEventListener('click', function (e) {
      if (closeBtn && closeBtn.contains(e.target)) {
        m.classList.remove('is-open');
        m.setAttribute('aria-expanded', 'false');
        return;
      }
      if (!canHover) toggle();
    });

    m.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      if (e.key === 'Escape') { m.classList.remove('is-open'); m.setAttribute('aria-expanded', 'false'); }
    });

    // In hover il CSS fa già tutto: teniamo aria-expanded allineato
    if (canHover) {
      m.addEventListener('mouseenter', function () { m.setAttribute('aria-expanded', 'true'); });
      m.addEventListener('mouseleave', function () { m.setAttribute('aria-expanded', 'false'); });
    }
  });

  if (!canHover) {
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.member')) closeMembers(null);
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lb');
  var lbVideo = document.getElementById('lbVideo');
  var lbImage = document.getElementById('lbImage');
  var lbClose = document.getElementById('lbClose');
  var lastFocus = null;

  var openVideo = function (src) {
    lastFocus = document.activeElement;
    if (lbImage) {
      lbImage.hidden = true;
      lbImage.removeAttribute('src');
      lbImage.alt = '';
    }
    lbVideo.hidden = false;
    lbVideo.src = src;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbVideo.play().catch(function () {});
    lbClose.focus();
  };

  var openImage = function (src, alt) {
    if (!lbImage) return;
    lastFocus = document.activeElement;
    lbVideo.pause();
    lbVideo.hidden = true;
    lbImage.src = src;
    lbImage.alt = alt || '';
    lbImage.hidden = false;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  var closeLb = function () {
    lb.classList.remove('is-open');
    lbVideo.pause();
    document.body.style.overflow = '';
    setTimeout(function () {
      lbVideo.removeAttribute('src');
      lbVideo.load();
      lbVideo.hidden = false;
      if (lbImage) {
        lbImage.hidden = true;
        lbImage.removeAttribute('src');
        lbImage.alt = '';
      }
    }, 400);
    if (lastFocus) lastFocus.focus();
  };

  cards.forEach(function (card) {
    var src = card.getAttribute('data-video');
    if (!src || !lb) return;
    card.addEventListener('click', function () { openVideo(src); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(src); }
    });
  });

  document.querySelectorAll('.project__shot[data-image]').forEach(function (shot) {
    shot.addEventListener('click', function () {
      openImage(shot.getAttribute('data-image'), shot.getAttribute('data-alt'));
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) {
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
    });
  }

  /* ---------- Hero video ----------
     Il poster è già visibile: carichiamo il filmato solo dopo il load della
     pagina, e in versione leggera su schermi piccoli. Se l'utente ha chiesto
     meno animazioni o è su connessione lenta, resta il poster. */
  var hero = document.getElementById('heroVideo');

  if (hero && !reduce) {
    var conn = navigator.connection || {};
    var slow = conn.saveData === true ||
               /2g/.test(conn.effectiveType || '');

    if (!slow) {
      var loadHero = function () {
        var small = window.matchMedia('(max-width: 820px)').matches;
        hero.src = hero.getAttribute(small ? 'data-src-mobile' : 'data-src');
        hero.preload = 'auto';
        hero.load();
        var p = hero.play();
        if (p && p.catch) p.catch(function () {});
      };
      if (document.readyState === 'complete') setTimeout(loadHero, 200);
      else window.addEventListener('load', function () { setTimeout(loadHero, 200); });
    }
  }
})();
