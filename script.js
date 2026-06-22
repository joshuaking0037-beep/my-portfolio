/* ========================================================
   LIQUID GLASS PORTFOLIO — Interactive JavaScript
   3D glass effects, particles, scroll animations
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== 3D Background Canvas ==========
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position with smoothing relative to center
    document.addEventListener('mousemove', e => {
      targetMouseX = e.clientX - width / 2;
      targetMouseY = e.clientY - height / 2;
    });

    // Helper functions for 3D rotation
    function rotateX(x, y, z, angle) {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      return [x, y * cos - z * sin, y * sin + z * cos];
    }
    function rotateY(x, y, z, angle) {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    }
    function rotateZ(x, y, z, angle) {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      return [x * cos - y * sin, x * sin + y * cos, z];
    }

    // Class for 3D floating object
    class Object3D {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Random position in space
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = init ? Math.random() * 1000 : 1000; // start far away

        // Rotation angles and speeds
        this.rx = Math.random() * Math.PI * 2;
        this.ry = Math.random() * Math.PI * 2;
        this.rz = Math.random() * Math.PI * 2;
        this.rotSpeedX = (Math.random() - 0.5) * 0.012;
        this.rotSpeedY = (Math.random() - 0.5) * 0.012;
        this.rotSpeedZ = (Math.random() - 0.5) * 0.012;

        // Speed moving towards screen
        this.speedZ = -0.3 - Math.random() * 0.5;

        // Color theme
        const colors = [
          'rgba(0, 180, 216, ',   // Cyan
          'rgba(77, 107, 255, ',  // Blue
          'rgba(139, 92, 246, ',  // Purple
          'rgba(232, 67, 147, '   // Pink
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];

        // Select type
        const rand = Math.random();
        if (rand < 0.65) {
          this.type = 'text';
          const symbols = ['⚙', '{ }', '</>', '∫', '∑', '∞', 'π', 'λ', '⌬', 'Δ', '⚡', '⏣', 'd/dx'];
          this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        } else if (rand < 0.85) {
          this.type = 'wireframe';
          const shapes = ['cube', 'pyramid', 'benzene'];
          this.shape = shapes[Math.floor(Math.random() * shapes.length)];
          this.initGeometry();
        } else {
          this.type = 'gear';
          this.initGearGeometry();
        }
      }

      initGeometry() {
        if (this.shape === 'cube') {
          const s = 30;
          this.vertices = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
          ];
          this.edges = [
            [0,1], [1,2], [2,3], [3,0],
            [4,5], [5,6], [6,7], [7,4],
            [0,4], [1,5], [2,6], [3,7]
          ];
        } else if (this.shape === 'pyramid') {
          const s = 35;
          this.vertices = [
            [0, -s, 0], [-s, s, -s], [s, s, -s], [s, s, s], [-s, s, s]
          ];
          this.edges = [
            [0,1], [0,2], [0,3], [0,4],
            [1,2], [2,3], [3,4], [4,1]
          ];
        } else if (this.shape === 'benzene') {
          const r = 30;
          const h = 12;
          this.vertices = [];
          this.edges = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            this.vertices.push([x, y, -h]);
            this.vertices.push([x, y, h]);
            const idx = i * 2;
            this.edges.push([idx, idx + 1]);
            const nextIdx = ((i + 1) % 6) * 2;
            this.edges.push([idx, nextIdx]);
            this.edges.push([idx + 1, nextIdx + 1]);
          }
        }
      }

      initGearGeometry() {
        const rInner = 24;
        const rOuter = 34;
        const h = 10;
        const teeth = 8;
        const segments = teeth * 2;
        this.vertices = [];
        this.edges = [];

        for (let i = 0; i < segments; i++) {
          const angle = (i * Math.PI * 2) / segments;
          const r = (i % 2 === 0) ? rOuter : rInner;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);

          this.vertices.push([x, y, -h]);
          this.vertices.push([x, y, h]);

          const idx = i * 2;
          this.edges.push([idx, idx + 1]);

          const nextIdx = ((i + 1) % segments) * 2;
          this.edges.push([idx, nextIdx]);
          this.edges.push([idx + 1, nextIdx + 1]);
        }
      }

      update() {
        this.z += this.speedZ;
        this.rx += this.rotSpeedX;
        this.ry += this.rotSpeedY;
        this.rz += this.rotSpeedZ;
        if (this.z < 10) {
          this.reset(false);
        }
      }

      draw() {
        const d = 400;
        const mx = mouseX * (1 - this.z / 1200);
        const my = mouseY * (1 - this.z / 1200);
        
        let px = this.x - mx;
        let py = this.y - my;
        let pz = this.z;

        const scale = d / (pz + d);
        const screenX = px * scale + width / 2;
        const screenY = py * scale + height / 2;

        if (screenX < -100 || screenX > width + 100 || screenY < -100 || screenY > height + 100) return;

        let opacity = 1;
        if (this.z > 800) {
          opacity = (1000 - this.z) / 200;
        } else if (this.z < 150) {
          opacity = (this.z - 10) / 140;
        }
        opacity = Math.max(0, Math.min(1, opacity)) * 0.45;

        ctx.fillStyle = this.colorPrefix + opacity + ')';
        ctx.strokeStyle = this.colorPrefix + (opacity * 0.85) + ')';

        if (this.type === 'text') {
          ctx.font = `${Math.floor(16 + scale * 14)}px ${this.symbol.length > 2 ? 'var(--font-mono)' : 'var(--font-sans)'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate(this.rz * 0.3);
          ctx.fillText(this.symbol, 0, 0);
          ctx.restore();
        } else {
          ctx.lineWidth = 0.8 + scale * 0.8;
          ctx.beginPath();

          const projectedPoints = this.vertices.map(v => {
            let [rx, ry, rz] = rotateX(v[0], v[1], v[2], this.rx);
            [rx, ry, rz] = rotateY(rx, ry, rz, this.ry);
            [rx, ry, rz] = rotateZ(rx, ry, rz, this.rz);

            const tx = rx + this.x - mx;
            const ty = ry + this.y - my;
            const tz = rz + this.z;

            const s = d / (tz + d);
            return [
              tx * s + width / 2,
              ty * s + height / 2
            ];
          });

          this.edges.forEach(e => {
            const p1 = projectedPoints[e[0]];
            const p2 = projectedPoints[e[1]];
            if (p1 && p2) {
              ctx.moveTo(p1[0], p1[1]);
              ctx.lineTo(p2[0], p2[1]);
            }
          });
          ctx.stroke();
        }
      }
    }

    const objects = [];
    const objectCount = 35;
    for (let i = 0; i < objectCount; i++) {
      objects.push(new Object3D());
    }

    // Connect close objects in 3D space to form a dynamic network
    function draw3DConnections() {
      ctx.lineWidth = 0.4;
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const dx = objects[i].x - objects[j].x;
          const dy = objects[i].y - objects[j].y;
          const dz = objects[i].z - objects[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 220) {
            const pz = (objects[i].z + objects[j].z) / 2;
            const d = 400;
            const scale = d / (pz + d);
            
            // Average opacity
            let opacity = 1;
            if (pz > 800) {
              opacity = (1000 - pz) / 200;
            } else if (pz < 150) {
              opacity = (pz - 10) / 140;
            }
            opacity = Math.max(0, Math.min(1, opacity)) * 0.18 * (1 - dist / 220);
            
            const mx = mouseX * (1 - pz / 1200);
            const my = mouseY * (1 - pz / 1200);

            const x1 = (objects[i].x - mx) * (d / (objects[i].z + d)) + width / 2;
            const y1 = (objects[i].y - my) * (d / (objects[i].z + d)) + height / 2;
            const x2 = (objects[j].x - mx) * (d / (objects[j].z + d)) + width / 2;
            const y2 = (objects[j].y - my) * (d / (objects[j].z + d)) + height / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      objects.sort((a, b) => b.z - a.z);

      objects.forEach(obj => {
        obj.update();
        obj.draw();
      });

      draw3DConnections();

      requestAnimationFrame(animate);
    }
    animate();
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
