/* ========================================================
   LIQUID GLASS PORTFOLIO — Interactive JavaScript
   Particle system, scroll effects, glass interactions
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Hero Particle Canvas ==========
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() * 60 + 180; // 180-240 range: cyan to blue
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Gentle mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x -= dx * force * 0.008;
        this.y -= dy * force * 0.008;
      }

      // Pulse opacity
      this.pulsePhase += this.pulseSpeed;
      const pulseOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.15;

      // Wrap around edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;

      return pulseOpacity;
    }

    draw(currentOpacity) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${Math.max(0, currentOpacity)})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      const opacity = p.update();
      p.draw(opacity);
    });

    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Track mouse for particle interaction
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });


  // ========== Navigation Scroll Effect ==========
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });


  // ========== Mobile Navigation Toggle ==========
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ========== Scroll Reveal Animation ==========
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ========== Glass Card Mouse Tracking (Liquid Refraction) ==========
  const glassCards = document.querySelectorAll('.glass-card');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });


  // ========== Animated Counter for Stats ==========
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCount(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));

  function animateCount(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }


  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  // ========== Contact Form (Frontend Demo) ==========
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;

    // Simulate sending
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      Sending...
    `;
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      `;
      btn.style.background = 'linear-gradient(135deg, #2dd4bf, #00d4ff)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.pointerEvents = '';
        contactForm.reset();
      }, 2500);
    }, 1500);
  });


  // ========== Tilt Effect on Project Cards ==========
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ========== Parallax Background Orbs ==========
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.bg-orb');

    orbs.forEach((orb, i) => {
      const speed = 0.03 + i * 0.015;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });


  // ========== Active nav link highlight ==========
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));


  // ========== Typing effect on hero status ==========
  const statusEl = document.querySelector('.hero-status');
  if (statusEl) {
    const phrases = [
      'Available for opportunities',
      'Open to collaboration',
      'Building with AI',
      'Crafting automation'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const statusDot = statusEl.querySelector('.status-dot');

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      // Update text content (keep the dot)
      statusEl.innerHTML = '';
      statusEl.appendChild(statusDot.cloneNode(true));
      statusEl.appendChild(document.createTextNode(currentPhrase.substring(0, charIndex)));

      let timeout;

      if (!isDeleting && charIndex === currentPhrase.length) {
        timeout = 3000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = 500;
      } else {
        timeout = isDeleting ? 40 : 70;
      }

      setTimeout(typeEffect, timeout);
    }

    // Start typing after initial display
    setTimeout(() => {
      typeEffect();
    }, 4000);
  }

});


// ========== Add spin animation for loading state ==========
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
  .nav-links a.active {
    color: var(--text-primary);
  }
  .nav-links a.active::after {
    width: 100%;
  }
`;
document.head.appendChild(styleSheet);
