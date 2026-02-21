/* ═══════════════════════════════════════
   PRAJWAL.DEV — Premium Interactions
═══════════════════════════════════════ */

'use strict';

/* ── util ── */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const raf = requestAnimationFrame;

/* ══════════════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════════════ */
const progressBar = $('#scrollProgress');
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
  if (progressBar) progressBar.style.width = `${pct}%`;
}, { passive: true });


/* ══════════════════════════════════════
   2. NAVBAR SCROLL STATE + ACTIVE LINKS
══════════════════════════════════════ */
const navbar  = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

const navIO = new IntersectionObserver(
  entries => entries.forEach(e => {
    const link = navLinks.find(l => l.getAttribute('href') === `#${e.target.id}`);
    if (link) link.classList.toggle('active', e.isIntersecting);
  }),
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => navIO.observe(s));

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ══════════════════════════════════════
   3. SIDE NAV DOTS
══════════════════════════════════════ */
const dots = $$('.side-dot');
const dotIO = new IntersectionObserver(
  entries => entries.forEach(e => {
    const dot = dots.find(d => d.getAttribute('href') === `#${e.target.id}`);
    if (dot) dot.classList.toggle('active', e.isIntersecting);
  }),
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => dotIO.observe(s));


/* ══════════════════════════════════════
   4. MOBILE BURGER MENU
══════════════════════════════════════ */
const burger  = $('#burger');
const drawer  = $('#mobileDrawer');

burger?.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  drawer.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});

$$('.drawer-link').forEach(l => l.addEventListener('click', () => {
  drawer.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
  drawer.setAttribute('aria-hidden', true);
  document.body.style.overflow = '';
}));


/* ══════════════════════════════════════
   5. CUSTOM CURSOR
══════════════════════════════════════ */
const cursor   = $('#cursor');
const follower = $('#cursorFollower');
let mx = -100, my = -100;
let fx = -100, fy = -100;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    if (cursor) cursor.style.transform = `translate(${mx}px, ${my}px)`;
    fx += (mx - fx) * .14;
    fy += (my - fy) * .14;
    if (follower) follower.style.transform = `translate(${fx}px, ${fy}px)`;
    raf(animCursor);
  }
  raf(animCursor);

  const hoverEls = $$('a, button, .magnetic, .b-card, .proj-item, .ct-tile, .sk-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hover');
      follower?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hover');
      follower?.classList.remove('hover');
    });
  });
}


/* ══════════════════════════════════════
   6. MAGNETIC BUTTON EFFECT
══════════════════════════════════════ */
$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    el.style.transform = `translate(${dx * .2}px, ${dy * .2}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});


/* ══════════════════════════════════════
   7. CARD RADIAL GLOW HOVER
══════════════════════════════════════ */
$$('.b-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width)  * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`);
  });
});


/* ══════════════════════════════════════
   8. PROJECT LEFT-BORDER COLOR
══════════════════════════════════════ */
$$('.proj-item').forEach(item => {
  const color = item.dataset.accent;
  if (color) item.style.setProperty('--accent', color);
});


/* ══════════════════════════════════════
   9. SCROLL REVEAL
══════════════════════════════════════ */
const revealIO = new IntersectionObserver(
  (entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  }),
  { rootMargin: '0px 0px -60px 0px' }
);
$$('.reveal-up').forEach(el => revealIO.observe(el));


/* ══════════════════════════════════════
   10. COUNTER ANIMATION
══════════════════════════════════════ */
function animateCounter(el, end, duration = 1400) {
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round(easeOut(t) * end);
    if (t < 1) raf(step);
  }
  raf(step);
}

const counterIO = new IntersectionObserver(
  (entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) {
      const count = parseInt(e.target.dataset.count ?? e.target.textContent, 10);
      if (!isNaN(count)) animateCounter(e.target, count);
      obs.unobserve(e.target);
    }
  }),
  { threshold: .5 }
);
$$('.counter, .hm-num[data-count]').forEach(el => counterIO.observe(el));


/* ══════════════════════════════════════
   11. SKILL BARS
══════════════════════════════════════ */
const barIO = new IntersectionObserver(
  (entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) {
      $$('.bar-fill', e.target.closest('.sk-card') || e.target).forEach(fill => {
        const w = fill.dataset.w;
        setTimeout(() => { fill.style.width = `${w}%`; }, 120);
      });
      obs.unobserve(e.target);
    }
  }),
  { threshold: .3 }
);
$$('.sk-card').forEach(c => barIO.observe(c));


/* ══════════════════════════════════════
   12. TYPEWRITER EFFECT
══════════════════════════════════════ */
const twEl = $('#typewriter');
const phrases = [
  'Splunk MVP Winner 🏆',
  'Penetration Tester',
  'SOC Analyst',
  'AI/ML Security Developer',
  'Cloud Security Engineer',
];
let pi = 0, ci = 0, deleting = false;

function typeLoop() {
  if (!twEl) return;
  const phrase = phrases[pi];
  twEl.textContent = deleting ? phrase.slice(0, --ci) : phrase.slice(0, ++ci);

  let delay = deleting ? 40 : 70;
  if (!deleting && ci === phrase.length) { delay = 1800; deleting = true; }
  if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 1200);


/* ══════════════════════════════════════
   13. CANVAS PARTICLE NETWORK
══════════════════════════════════════ */
const canvas = $('#heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r  = Math.random() * 1.5 + .5;
  }
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(110,231,183,${.18 * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129,140,248,.6)';
      ctx.fill();
    });

    animId = raf(drawParticles);
  }

  // Only run when hero is visible
  const heroEl = $('#home');
  const canvasIO = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cancelAnimationFrame(animId);
      drawParticles();
    } else {
      cancelAnimationFrame(animId);
    }
  });
  if (heroEl) canvasIO.observe(heroEl);
}


/* ══════════════════════════════════════
   14. FOOTER YEAR
══════════════════════════════════════ */
const fyEl = $('#fyear');
if (fyEl) fyEl.textContent = new Date().getFullYear();


/* ══════════════════════════════════════
   15. STAGGER BENTO + PROJECT ITEMS
══════════════════════════════════════ */
$$('.bento .b-card').forEach((el, i) => {
  el.style.setProperty('--d', `${i * 70}ms`);
  el.classList.add('reveal-up');
  revealIO.observe(el);
});

/* ══════════════════════════════════════════
   16. PROJECTS CRUD
══════════════════════════════════════════ */
const PROJ_KEY = 'ps_projects';

const DEFAULT_PROJECTS = [
  {
    id: 'p1', title: 'Compliance-Guardian-AI',
    desc: 'AI-powered compliance monitoring that automates security audits against NIST CSF, generates actionable remediation reports, and continuously monitors enterprise environments for policy violations.',
    lang: 'Python', color: '#3b82f6',
    tags: ['AI/ML', 'Compliance', 'Automation', 'NIST'],
    url: 'https://github.com/Unknown1502/Compliance-Guardian-AI'
  },
  {
    id: 'p2', title: 'IDS — Intrusion Detection System',
    desc: 'ML-powered IDS using LSTM neural networks and statistical anomaly detection to identify zero-day attack patterns in network traffic with high precision and low false-positive rates.',
    lang: 'Jupyter / Python', color: '#f59e0b',
    tags: ['LSTM', 'Network Security', 'ML', 'Real-time'],
    url: 'https://github.com/Unknown1502/IDS'
  },
  {
    id: 'p3', title: 'Splunk SOC Dashboard',
    desc: 'Enterprise-grade Splunk dashboards with custom SPL queries, real-time KPI tracking, automated alerting pipelines, and visualization layers built for SOC analyst workflows.',
    lang: 'Python', color: '#10b981',
    tags: ['SIEM', 'SOC', 'SPL', 'Viz'],
    url: 'https://github.com/Unknown1502/projectsplunk'
  },
  {
    id: 'p4', title: 'Stego- (Steganography Tool)',
    desc: 'Advanced steganography toolkit for embedding and extracting covert data within digital media — used for digital forensics analysis and red-team exercises.',
    lang: 'TypeScript', color: '#8b5cf6',
    tags: ['Forensics', 'Crypto', 'Red Team'],
    url: 'https://github.com/Unknown1502/stego-'
  },
  {
    id: 'p5', title: 'OpenAI Security Integration',
    desc: 'LLM-powered SOC assistant integrating OpenAI — automates threat log summarization, incident triage, and generates plain-English remediation guidance from raw security alerts.',
    lang: 'Python', color: '#ec4899',
    tags: ['LLM', 'Automation', 'Incident Response'],
    url: 'https://github.com/Unknown1502/openai-'
  },
  {
    id: 'p6', title: 'Security Scripts Collection',
    desc: 'Battle-tested library of 30+ automation scripts: network recon, log parsing, vulnerability enumeration, and routine security operations task automation.',
    lang: 'Python / Bash', color: '#06b6d4',
    tags: ['Automation', 'Recon', 'Tooling'],
    url: 'https://github.com/Unknown1502/scripts'
  }
];

function loadProjects() {
  try {
    const raw = localStorage.getItem(PROJ_KEY);
    return raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
  } catch { return [...DEFAULT_PROJECTS]; }
}

function saveProjects(arr) {
  localStorage.setItem(PROJ_KEY, JSON.stringify(arr));
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function renderProjects() {
  const list = $('#projList');
  if (!list) return;
  const projects = loadProjects();
  list.innerHTML = '';
  projects.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'proj-item reveal-up';
    item.dataset.accent = p.color;
    item.innerHTML = `
      <div class="pi-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="pi-body">
        <div class="pi-top">
          <h3>${escHtml(p.title)}</h3>
          <div class="pi-pills"><span style="--lc:${p.color}">${escHtml(p.lang || '')}</span></div>
        </div>
        <p>${escHtml(p.desc)}</p>
        <div class="pi-tags">${(p.tags || []).map(t => `<span>${escHtml(t)}</span>`).join('')}</div>
      </div>
      ${p.url ? `<a class="pi-btn magnetic" href="${encodeURI(p.url)}" target="_blank" rel="noopener" aria-label="View repo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </a>` : '<span class="pi-btn pi-nolnk" aria-hidden="true"></span>'}
    `;
    // stagger + reveal
    item.style.setProperty('--d', `${i * 70}ms`);
    revealIO.observe(item);
    list.appendChild(item);
  });

  // re-attach project accent border color logic
  $$('.proj-item').forEach(pi => {
    const col = pi.dataset.accent;
    if (col) pi.style.setProperty('--ac', col);
    // magnetic reattach
    pi.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  });
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Admin Panel ──────────────────────────────────────────────
let adminOpen = false;

function openAdmin() {
  adminOpen = true;
  const panel = $('#admPanel');
  const overlay = $('#admOverlay');
  const fab = $('#admFab');
  if (panel) { panel.classList.add('adm-show'); panel.setAttribute('aria-hidden','false'); }
  if (overlay) overlay.classList.add('adm-show');
  if (fab) fab.classList.add('adm-active');
  renderAdminList();
}

function closeAdmin() {
  adminOpen = false;
  const panel = $('#admPanel');
  const overlay = $('#admOverlay');
  const fab = $('#admFab');
  if (panel) { panel.classList.remove('adm-show'); panel.setAttribute('aria-hidden','true'); }
  if (overlay) overlay.classList.remove('adm-show');
  if (fab) fab.classList.remove('adm-active');
}

function renderAdminList() {
  const list = $('#admList');
  if (!list) return;
  const projects = loadProjects();
  if (!projects.length) {
    list.innerHTML = '<p class="adm-empty">No projects yet. Add one!</p>';
    return;
  }
  list.innerHTML = projects.map((p, i) => `
    <div class="adm-item">
      <span class="adm-dot" style="background:${p.color}"></span>
      <span class="adm-name">${escHtml(p.title)}</span>
      <div class="adm-btns">
        <button class="adm-edit" data-id="${p.id}" title="Edit">✏️</button>
        <button class="adm-del" data-id="${p.id}" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.adm-edit').forEach(btn => {
    btn.addEventListener('click', () => openForm(btn.dataset.id));
  });
  list.querySelectorAll('.adm-del').forEach(btn => {
    btn.addEventListener('click', () => deleteProject(btn.dataset.id));
  });
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const arr = loadProjects().filter(p => p.id !== id);
  saveProjects(arr);
  renderAdminList();
  renderProjects();
}

// ── Form Modal ───────────────────────────────────────────────
function openForm(editId) {
  const modal = $('#fmModal');
  const backdrop = $('#fmBackdrop');
  const titleEl = $('#fmTitle');
  const idEl = $('#fId');
  const titleIn = $('#fTitle');
  const descIn = $('#fDesc');
  const langIn = $('#fLang');
  const colorIn = $('#fColor');
  const tagsIn = $('#fTags');
  const urlIn = $('#fUrl');

  if (editId) {
    const p = loadProjects().find(x => x.id === editId);
    if (!p) return;
    titleEl.textContent = 'Edit Project';
    idEl.value = p.id;
    titleIn.value = p.title;
    descIn.value = p.desc;
    langIn.value = p.lang || '';
    colorIn.value = p.color || '#6ee7b7';
    tagsIn.value = (p.tags || []).join(', ');
    urlIn.value = p.url || '';
  } else {
    titleEl.textContent = 'Add Project';
    $('#projForm').reset();
    idEl.value = '';
    colorIn.value = '#6ee7b7';
  }

  if (modal) modal.classList.add('fm-show');
  if (backdrop) backdrop.classList.add('fm-show');
  titleIn.focus();
}

function closeForm() {
  const modal = $('#fmModal');
  const backdrop = $('#fmBackdrop');
  if (modal) modal.classList.remove('fm-show');
  if (backdrop) backdrop.classList.remove('fm-show');
}

// ── Event Bindings ───────────────────────────────────────────
const admFab = $('#admFab');
const admClose = $('#admClose');
const admOverlay = $('#admOverlay');
const admAddBtn = $('#admAddBtn');
const fmClose = $('#fmClose');
const fmCancel = $('#fmCancel');
const fmBackdrop = $('#fmBackdrop');
const projForm = $('#projForm');

if (admFab) admFab.addEventListener('click', () => adminOpen ? closeAdmin() : openAdmin());
if (admClose) admClose.addEventListener('click', closeAdmin);
if (admOverlay) admOverlay.addEventListener('click', closeAdmin);
if (admAddBtn) admAddBtn.addEventListener('click', () => openForm());
if (fmClose) fmClose.addEventListener('click', closeForm);
if (fmCancel) fmCancel.addEventListener('click', closeForm);
if (fmBackdrop) fmBackdrop.addEventListener('click', closeForm);

if (projForm) {
  projForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = $('#fId').value.trim();
    const title = $('#fTitle').value.trim();
    const desc = $('#fDesc').value.trim();
    const lang = $('#fLang').value.trim();
    const color = $('#fColor').value;
    const tags = $('#fTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const url = $('#fUrl').value.trim();

    if (!title || !desc) {
      alert('Title and description are required.');
      return;
    }

    let projects = loadProjects();
    if (id) {
      projects = projects.map(p => p.id === id ? { ...p, title, desc, lang, color, tags, url } : p);
    } else {
      projects.push({ id: uid(), title, desc, lang, color, tags, url });
    }
    saveProjects(projects);
    closeForm();
    renderAdminList();
    renderProjects();
  });
}

// Keyboard shortcut: Ctrl+Shift+A → toggle admin
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
    e.preventDefault();
    adminOpen ? closeAdmin() : openAdmin();
  }
  if (e.key === 'Escape') {
    closeForm();
    closeAdmin();
  }
});

// Show FAB always (it's the access point)
const fabEl = $('#admFab');
if (fabEl) fabEl.style.display = '';

// Initial render
renderProjects();
