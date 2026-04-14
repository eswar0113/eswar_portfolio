// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ===== FADE-IN ON SCROLL =====
const fadeEls = document.querySelectorAll(
  '.stat-card, .skill-tile, .timeline-item, .project-card, .cert-card, .contact-card, .skills-group'
);

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 70 * (i % 9));
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  fadeObserver.observe(el);
});

// Inject active / visible CSS
const dynStyle = document.createElement('style');
dynStyle.textContent = `
  .visible { opacity: 1 !important; transform: translateY(0) !important; }
  .nav-links a.active { color: var(--primary) !important; }
`;
document.head.appendChild(dynStyle);

// ===== TYPEWRITER =====
const roles = [
  '> ECE Student  /  AI & Web Developer',
  '> IoT Engineer  /  Problem Solver',
  '> 200+ DSA Solved  /  Open Source Builder'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewriter() {
  if (!typeEl) return;
  const text = roles[roleIdx];
  typeEl.textContent = deleting
    ? text.slice(0, charIdx - 1)
    : text.slice(0, charIdx + 1);
  deleting ? charIdx-- : charIdx++;

  let delay = deleting ? 35 : 65;
  if (!deleting && charIdx === text.length) { delay = 2200; deleting = true; }
  else if (deleting && charIdx === 0)       { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
  setTimeout(typewriter, delay);
}
typewriter();

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const raw    = el.dataset.count;
  const target = parseFloat(raw);
  const suffix = el.dataset.suffix || '';
  const dec    = raw.includes('.') ? raw.split('.')[1].length : 0;
  const dur    = 1600;
  const t0     = performance.now();

  (function tick(now) {
    const p    = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (ease * target).toFixed(dec) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}

const counterEls = document.querySelectorAll('.stat-number[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 65;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class Dot {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.4 + 0.5;
      this.a  = Math.random() * 0.45 + 0.1;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,157,${this.a * 0.7})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Dot());

  function links() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,157,${0.06 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.step(); p.draw(); });
    links();
    requestAnimationFrame(loop);
  })();
}
