/* ========================================================
   LIQUID GLASS PORTFOLIO — Interactive JavaScript
   3D glass effects, particles, scroll animations
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Hero Particle Canvas ==========
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.hue = Math.random() > 0.5 ? (200 + Math.random() * 40) : (260 + Math.random() * 30);
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouseX - this.x, dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.006;
          this.y -= dy * force * 0.006;
        }
        this.pulsePhase += this.pulseSpeed;
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
        return this.opacity + Math.sin(this.pulsePhase) * 0.1;
      }
      draw(op) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 60%, 55%, ${Math.max(0, op)})`;
        ctx.fill();
      }
    }

    const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(77, 107, 255, ${(1 - dist / 130) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { const op = p.update(); p.draw(op); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  }


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


  // ========== 3D Glass Card Tilt + Glow ==========
  document.querySelectorAll('.glass-card').forEach(card => {
    const glow = card.querySelector('.glass-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D tilt
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;

      // Move glow
      if (glow) {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ========== Animated Counters ==========
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
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + '+';
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


  // ========== Parallax Orbs ==========
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.bg-orb').forEach((orb, i) => {
      orb.style.transform = `translateY(${scrollY * (0.02 + i * 0.01)}px)`;
    });
  }, { passive: true });


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

});
