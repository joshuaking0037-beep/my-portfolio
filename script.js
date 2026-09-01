/* ========================================================
   KINGSLEY PORTFOLIO — Cinematic Dark & Minimal
   Interactive JavaScript
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Theme Toggle (Light / Dark Mode) ==========
  const THEME_KEY = 'portfolio-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark for cinematic style
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Apply saved theme immediately
  setTheme(getStoredTheme());

  // Wire up theme-toggle buttons
  document.querySelectorAll('#themeToggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  });


  // ========== Header Scroll State ==========
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }


  // ========== Full-Screen Menu Overlay ==========
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuBtn && menuClose && menuOverlay) {
    const toggleMenu = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !menuOverlay.classList.contains('open');
      if (isOpen) {
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      } else {
        menuOverlay.classList.remove('open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu(true));
    menuClose.addEventListener('click', () => toggleMenu(false));
    
    // Close menu when a link is clicked
    menuOverlay.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }


  // ========== Scroll Reveal Animations ==========
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after revealing to animate only once
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // ========== Animated Number Counters ==========
  const statCards = document.querySelectorAll('.metric-value[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valueEl = entry.target;
        const target = parseInt(valueEl.getAttribute('data-count'));
        animateCount(valueEl, target);
        counterObserver.unobserve(valueEl);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(el => counterObserver.observe(el));

  function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      el.textContent = current + (target >= 50 ? (target >= 1000 ? '+' : '+') : '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }


  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
