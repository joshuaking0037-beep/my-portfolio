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


  // ========== 3D Background Canvas ==========
  // Enhanced 3D engine with smooth floating motion, engineering symbols,
  // wireframe shapes, gears, and dynamic connection lines.
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let time = 0; // global time for wave-based drift

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
        // Each object gets a unique phase offset for sinusoidal drifting
        this.driftPhaseX = Math.random() * Math.PI * 2;
        this.driftPhaseY = Math.random() * Math.PI * 2;
        this.driftPhaseZ = Math.random() * Math.PI * 2;
        this.driftAmplitudeX = 30 + Math.random() * 50;
        this.driftAmplitudeY = 20 + Math.random() * 40;
        this.driftSpeedX = 0.0003 + Math.random() * 0.0006;
        this.driftSpeedY = 0.0004 + Math.random() * 0.0005;
      }

      reset(init = false) {
        // Random position in space
        this.baseX = (Math.random() - 0.5) * width * 1.5;
        this.baseY = (Math.random() - 0.5) * height * 1.5;
        this.x = this.baseX;
        this.y = this.baseY;
        this.z = init ? Math.random() * 1000 : 1000; // start far away

        // Rotation angles and speeds
        this.rx = Math.random() * Math.PI * 2;
        this.ry = Math.random() * Math.PI * 2;
        this.rz = Math.random() * Math.PI * 2;
        this.rotSpeedX = (Math.random() - 0.5) * 0.008;
        this.rotSpeedY = (Math.random() - 0.5) * 0.008;
        this.rotSpeedZ = (Math.random() - 0.5) * 0.008;

        // Speed moving towards screen (slow floating)
        this.speedZ = -0.15 - Math.random() * 0.25;

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
        if (rand < 0.60) {
          this.type = 'text';
          const symbols = ['⚙', '{ }', '</>', '∫', '∑', '∞', 'π', 'λ', '⌬', 'Δ', '⚡', '⏣', 'd/dx', '∂', '≈', 'Ω', 'φ', '∇', '⊕', '⊗'];
          this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        } else if (rand < 0.82) {
          this.type = 'wireframe';
          const shapes = ['cube', 'pyramid', 'benzene', 'octahedron'];
          this.shape = shapes[Math.floor(Math.random() * shapes.length)];
          this.initGeometry();
        } else {
          this.type = 'gear';
          this.initGearGeometry();
        }
      }

      initGeometry() {
        if (this.shape === 'cube') {
          const s = 28;
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
          const s = 32;
          this.vertices = [
            [0, -s, 0], [-s, s, -s], [s, s, -s], [s, s, s], [-s, s, s]
          ];
          this.edges = [
            [0,1], [0,2], [0,3], [0,4],
            [1,2], [2,3], [3,4], [4,1]
          ];
        } else if (this.shape === 'benzene') {
          const r = 28;
          const h = 10;
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
        } else if (this.shape === 'octahedron') {
          const s = 28;
          this.vertices = [
            [0, -s, 0], [s, 0, 0], [0, 0, s],
            [-s, 0, 0], [0, 0, -s], [0, s, 0]
          ];
          this.edges = [
            [0,1], [0,2], [0,3], [0,4],
            [5,1], [5,2], [5,3], [5,4],
            [1,2], [2,3], [3,4], [4,1]
          ];
        }
      }

      initGearGeometry() {
        const rInner = 22;
        const rOuter = 32;
        const h = 8;
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

      update(t) {
        this.z += this.speedZ;
        this.rx += this.rotSpeedX;
        this.ry += this.rotSpeedY;
        this.rz += this.rotSpeedZ;

        // Smooth sinusoidal drifting for a "floating in space" feel
        this.x = this.baseX + Math.sin(t * this.driftSpeedX + this.driftPhaseX) * this.driftAmplitudeX;
        this.y = this.baseY + Math.cos(t * this.driftSpeedY + this.driftPhaseY) * this.driftAmplitudeY;

        if (this.z < 10) {
          this.reset(false);
        }
      }

      draw() {
        const d = 400;
        const parallaxFactor = (1 - this.z / 1200);
        const mx = mouseX * parallaxFactor * 0.08;
        const my = mouseY * parallaxFactor * 0.08;
        
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
        opacity = Math.max(0, Math.min(1, opacity)) * 0.5;

        ctx.fillStyle = this.colorPrefix + opacity + ')';
        ctx.strokeStyle = this.colorPrefix + (opacity * 0.85) + ')';

        if (this.type === 'text') {
          const fontSize = Math.floor(14 + scale * 16);
          ctx.font = `${fontSize}px ${this.symbol.length > 2 ? '"JetBrains Mono", monospace' : '"Inter", sans-serif'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate(this.rz * 0.3);
          ctx.fillText(this.symbol, 0, 0);
          ctx.restore();
        } else {
          ctx.lineWidth = 0.7 + scale * 0.7;
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

    // Create pool of 3D objects
    const objects = [];
    const objectCount = Math.min(40, Math.max(20, Math.floor(width / 40)));
    for (let i = 0; i < objectCount; i++) {
      objects.push(new Object3D());
    }

    // Connect close objects in 3D space to form a dynamic network
    function draw3DConnections() {
      ctx.lineWidth = 0.2;
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const dx = objects[i].x - objects[j].x;
          const dy = objects[i].y - objects[j].y;
          const dz = objects[i].z - objects[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 250) {
            const pz = (objects[i].z + objects[j].z) / 2;
            const d = 400;
            
            // Average opacity
            let opacity = 1;
            if (pz > 800) {
              opacity = (1000 - pz) / 200;
            } else if (pz < 150) {
              opacity = (pz - 10) / 140;
            }
            opacity = Math.max(0, Math.min(1, opacity)) * 0.14 * (1 - dist / 250);
            
            const parallax = (1 - pz / 1200) * 0.08;
            const mx = mouseX * parallax;
            const my = mouseY * parallax;

            const x1 = (objects[i].x - mx) * (d / (objects[i].z + d)) + width / 2;
            const y1 = (objects[i].y - my) * (d / (objects[i].z + d)) + height / 2;
            const x2 = (objects[j].x - mx) * (d / (objects[j].z + d)) + width / 2;
            const y2 = (objects[j].y - my) * (d / (objects[j].z + d)) + height / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(255, 107, 0, ${opacity * 0.6})`;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      time++;

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      objects.sort((a, b) => b.z - a.z);

      objects.forEach(obj => {
        obj.update(time);
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

  // ========== Custom Cursor ==========
  const cursor = document.getElementById('liquidCursor');
  if (cursor && !window.matchMedia("(pointer: coarse)").matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });
    
    const interactables = document.querySelectorAll('a, button, input, textarea, .glass-card');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  } else if (cursor) {
    cursor.style.display = 'none'; // hide on touch devices
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
