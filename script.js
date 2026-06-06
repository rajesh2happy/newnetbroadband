/* ============================================================
   NewNet BroadBand — JavaScript
   Handles: navbar scroll, mobile toggle, smooth nav links,
   scroll reveal animations, stat counter animation, form UX
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Preloader ──────────────────────────────────────────────────
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 600); // Cleanup DOM
    }
  });

  // ── Scroll Progress Bar ────────────────────────────────────────
  const scrollProgress = document.getElementById('scrollProgress');
  const updateScrollProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  // ── Dark/Light Mode Toggle ─────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.textContent = '☀️';
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '🌙';
      }
    });
  }

  // ── 3D Card Tilt ───────────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.feature-card, .plan-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = ``;
    });
  });

  // ── Mobile Navigation Toggle ─────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ── Active nav link highlighting ──────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealElements = document.querySelectorAll(
    '.feature-card, .plan-card, .about-card, .value-card, .why-card, .section-header, .about-content, .contact-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    revealObserver.observe(el);
  });

  // ── Stat Counter Animation ────────────────────────────────
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let statAnimated = false;

  const animateStats = () => {
    if (statAnimated) return;
    statAnimated = true;

    statNumbers.forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const duration = 2000;
      const start = performance.now();
      const isFloat = target % 1 !== 0;

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateStats();
      statsObserver.unobserve(statsSection);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);

  // ── Speedometer Animation ─────────────────────────────────────
  const speedDial = document.querySelector('.speed-dial');
  const speedNeedle = document.querySelector('.speed-needle');
  if (speedDial && speedNeedle) {
    const featureObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        speedDial.style.strokeDashoffset = '20';
        speedNeedle.style.transform = 'rotate(80deg)';
        featureObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });
    
    const featureCard = speedDial.closest('.feature-card');
    if (featureCard) featureObserver.observe(featureCard);
  }



});

// ── Coverage Checker ───────────────────────────────────────────
window.checkCoverage = function () {
  const pinInput = document.getElementById('pinCode');
  const resultDiv = document.getElementById('coverageResult');
  if (!pinInput || !resultDiv) return;

  const pin = pinInput.value.trim();
  if (pin.length !== 6 || isNaN(pin)) {
    resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter a valid 6-digit PIN code.</span>';
    resultDiv.className = 'coverage-result error';
    return;
  }

  // Simulate API call with a spinner
  resultDiv.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
      <div style="width: 20px; height: 20px; border: 3px solid rgba(99,102,241,0.3); border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span>Checking availability...</span>
    </div>
  `;
  resultDiv.className = 'coverage-result';
  
  if (!document.getElementById('spin-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spin-keyframes';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    if (pin === '401107') {
      resultDiv.innerHTML = '<span style="color: #10b981; font-weight: 600;">✅ Great news! We provide blazing fast internet in your area. View our plans below!</span>';
      resultDiv.className = 'coverage-result success';
    } else {
      resultDiv.innerHTML = '<span style="color: #ef4444;">❌ We are not servicing in this area yet. We are focused in the Mira Road, Mumbai area.</span>';
      resultDiv.className = 'coverage-result error';
    }
  }, 1500);
};

// ── Global Fiber Optic Canvas Animation ────────────────────
(function initGlobalFiberCanvas() {
  const canvas = document.getElementById('globalFiberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const fibers = [];
  const numFibers = 6;
  const colors = ['#6366f1', '#ec4899', '#22d3ee', '#f97316'];

  for (let i = 0; i < numFibers; i++) {
    fibers.push({
      baseY: Math.random() * h,
      amplitude: 40 + Math.random() * 80,
      frequency: 0.0005 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0005 + Math.random() * 0.001,
      color: colors[Math.floor(Math.random() * colors.length)],
      thickness: 0.8 + Math.random() * 1.5,
      slope: (Math.random() - 0.5) * 0.5,
      packets: []
    });
  }

  setInterval(() => {
    const fiber = fibers[Math.floor(Math.random() * fibers.length)];
    if (fiber.packets.length < 4) {
      fiber.packets.push({
        x: -100 - Math.random() * 200,
        speed: 3 + Math.random() * 5,
        size: 1.5 + Math.random() * 2,
        glow: 8 + Math.random() * 10
      });
    }
  }, 400);

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 16;

    fibers.forEach(fiber => {
      fiber.phase += fiber.speed;

      ctx.beginPath();
      for (let x = -100; x < w + 100; x += 40) {
        const yOffset = fiber.baseY + Math.sin(time * 0.0002 + fiber.phase) * 150 + (x * fiber.slope);
        const y = yOffset + Math.sin(x * fiber.frequency + fiber.phase) * fiber.amplitude;
        if (x === -100) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = fiber.color;
      ctx.lineWidth = fiber.thickness;
      ctx.globalAlpha = 0.15;
      ctx.stroke();

      ctx.globalAlpha = 1;
      for (let i = fiber.packets.length - 1; i >= 0; i--) {
        let p = fiber.packets[i];
        p.x += p.speed;
        if (p.x > w + 200) {
          fiber.packets.splice(i, 1);
          continue;
        }

        const yOffset = fiber.baseY + Math.sin(time * 0.0002 + fiber.phase) * 150 + (p.x * fiber.slope);
        const y = yOffset + Math.sin(p.x * fiber.frequency + fiber.phase) * fiber.amplitude;

        const isLightMode = document.body.classList.contains('light-mode');
        const packetFillStyle = isLightMode ? '#0f172a' : '#ffffff';

        ctx.beginPath();
        ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = packetFillStyle;
        ctx.shadowColor = fiber.color;
        ctx.shadowBlur = p.glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, y, p.size * 0.6, 0, Math.PI * 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = packetFillStyle;
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
})();
