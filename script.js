/* ========================================================
   LIQUID GLASS PORTFOLIO — Interactive JavaScript
   3D glass effects, particles, scroll animations
   Includes: Theme Toggle, Enhanced 3D Background Engine
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Theme Toggle (Light / Dark Mode) ==========
  // Reads saved preference from localStorage, falls back to 'light'
  const THEME_KEY = 'portfolio-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Apply saved theme immediately (no flash)
  setTheme(getStoredTheme());

  // Wire up any theme-toggle buttons on the page
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  });




  // ========== Navigation ==========
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // ========== Scroll Reveal ==========
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));





  // ========== Animated Counters ==========
  const statCards = document.querySelectorAll('.stat-card[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const valueEl = card.querySelector('.stat-value') || card.querySelector('.stat-number');
        if (valueEl) {
          const target = parseInt(card.getAttribute('data-count'));
          animateCount(valueEl, target);
        }
        counterObserver.unobserve(card);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(el => counterObserver.observe(el));

  function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (target > 1000 ? '+' : (target < 100 ? '+' : ''));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }


  // ========== Smooth Scroll ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });





  // ========== Typing effect (hero only) ==========
  const statusEl = document.querySelector('.hero-status');
  if (statusEl) {
    const phrases = ['Available for opportunities', 'Open to collaboration', 'Building with AI', 'Crafting automation'];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    const dot = statusEl.querySelector('.status-dot');

    function typeEffect() {
      const phrase = phrases[phraseIndex];
      if (isDeleting) charIndex--; else charIndex++;
      statusEl.innerHTML = '';
      if (dot) statusEl.appendChild(dot.cloneNode(true));
      statusEl.appendChild(document.createTextNode(phrase.substring(0, charIndex)));
      let timeout;
      if (!isDeleting && charIndex === phrase.length) { timeout = 3000; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; timeout = 500; }
      else timeout = isDeleting ? 35 : 65;
      setTimeout(typeEffect, timeout);
    }
    setTimeout(typeEffect, 4000);
  }



  // ========== Interactive Terminal ==========
  const termInput = document.getElementById('terminalInput');
  const termBody = document.getElementById('terminalBody');
  const termSection = document.getElementById('terminal-section');
  
  if (termInput && termBody && termSection) {
    termSection.addEventListener('click', () => termInput.focus());
    
    termInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        this.value = '';
        
        // Echo command
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="term-prompt">kingsley@ai-workflow:~$</span>${cmd}`;
        termBody.insertBefore(echoLine, termBody.lastElementChild);
        
        // Process command
        const outLine = document.createElement('div');
        outLine.className = 'term-line';
        
        switch(cmd) {
          case 'help':
            outLine.innerHTML = `Available commands:<br>
              <span class="term-highlight">whoami</span>   - Print bio information<br>
              <span class="term-highlight">projects</span> - List core projects<br>
              <span class="term-highlight">skills</span>   - Display tech stack<br>
              <span class="term-highlight">contact</span>  - Get contact info<br>
              <span class="term-highlight">clear</span>    - Clear terminal window`;
            break;
          case 'whoami':
            outLine.innerHTML = `Kingsley (Afolabi Joshua)<br>Role: AI Automation & Workflow Engineer<br>Status: Available for opportunities`;
            break;
          case 'projects':
            outLine.innerHTML = `1. AI Workflow Orchestrator (n8n, Python)<br>2. Smart Betting Analytics (Node.js)<br>3. Prompt Engineering Toolkit (FastAPI)<br>4. WhatsApp Gemini Bot (AI Chatbot)`;
            break;
          case 'skills':
            outLine.innerHTML = `[Python] [JavaScript] [Node.js] [React]<br>[OpenAI] [LangChain] [n8n] [Make.com]`;
            break;
          case 'contact':
            outLine.innerHTML = `Email: joshuaking0037@outlook.com<br>GitHub: joshuaking0037-beep<br>X: @kingsley00_7`;
            break;
          case 'clear':
            const initialLines = Array.from(termBody.children).slice(-1);
            termBody.innerHTML = '';
            termBody.appendChild(initialLines[0]);
            return;
          case '':
            return;
          default:
            outLine.innerHTML = `Command not found: ${cmd}. Type <span class="term-highlight">'help'</span> for a list of commands.`;
        }
        
        termBody.insertBefore(outLine, termBody.lastElementChild);
        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

});
