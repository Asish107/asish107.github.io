/* ═══════════════════════════════════════════════════════════════════
   ALEX CHEN — AI ENGINEER PORTFOLIO · main.js
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ──────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    // Trigger hero animations
    document.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 120);
    });
    initTyped();
  }, 2000);
});

/* ─── CUSTOM CURSOR ───────────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot  = document.getElementById('cursor-dot');

// Raw mouse position — updated instantly
let mouseX = 0, mouseY = 0;
// Lerped glow position — follows smoothly but not laggy
let glowX = 0, glowY = 0;
let cursorScale = 1, cursorOpacity = 1;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

// RAF loop: dot snaps instantly, glow lerps softly
(function cursorLoop() {
  // Dot: set directly — zero lag
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // Glow: smooth lerp at ~12% per frame (~60fps → very responsive)
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';

  requestAnimationFrame(cursorLoop);
})();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorDot.style.opacity = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorDot.style.opacity = '1';
  });
});

// Follow project card glow
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const glow = card.querySelector('.project-glow');
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
});

/* ─── NAV SCROLL ──────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── HAMBURGER MENU ──────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
let mobileNav = null;

function createMobileNav() {
  if (mobileNav) return;
  mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  const links = ['about','skills','projects','demo','timeline','contact'];
  links.forEach(id => {
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = id.charAt(0).toUpperCase() + id.slice(1);
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.appendChild(a);
  });
  document.body.appendChild(mobileNav);
}

hamburger.addEventListener('click', () => {
  createMobileNav();
  setTimeout(() => mobileNav.classList.toggle('open'), 10);
});

/* ─── TYPED.JS ────────────────────────────────────────────────────── */
function initTyped() {
  new Typed('#typed-target', {
    strings: [
      'Large Language Models',
      'Autonomous Agents',
      'Data Engineering',
      'RAG Pipelines',
      'MLOps at Scale',
      'Open-Source AI',
    ],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1800,
    loop: true,
    cursorChar: '█',
  });
}

/* ─── GRID CANVAS BACKGROUND ──────────────────────────────────────── */
(function initGrid() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let mouseGX = -9999, mouseGY = -9999;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseGX = e.clientX - rect.left;
    mouseGY = e.clientY - rect.top;
  });

  let t = 0;
  const STEP = 60;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;

    // Grid lines
    ctx.strokeStyle = 'rgba(0,229,255,0.06)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= W; x += STEP) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += STEP) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Intersection dots — animate near mouse
    for (let x = 0; x <= W; x += STEP) {
      for (let y = 0; y <= H; y += STEP) {
        const dist = Math.hypot(x - mouseGX, y - mouseGY);
        const brightness = Math.max(0, 1 - dist / 200);
        const pulse = (Math.sin(t * 3 + x * 0.05 + y * 0.05) + 1) / 2;
        const alpha = 0.12 + pulse * 0.1 + brightness * 0.6;
        const size  = 1.5 + brightness * 4;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    // Floating particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const px = ((Math.sin(t * 0.7 + i * 2.3) + 1) / 2) * W;
      const py = ((Math.cos(t * 0.5 + i * 1.7) + 1) / 2) * H;
      const alpha = (Math.sin(t + i) + 1) / 2 * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? `rgba(178,255,89,${alpha})` : `rgba(0,229,255,${alpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  draw();
})();

/* ─── SCROLL REVEAL — staggered, directional, section-aware ──────── */
function assignRevealDelays() {
  // Within each section, stagger children by their DOM order within that section
  document.querySelectorAll('section').forEach(section => {
    const items = section.querySelectorAll('.reveal');
    items.forEach((el, i) => {
      // Grid children (skill/project cards) get tighter stagger
      const isGridChild = el.closest('.skills-grid, .projects-grid');
      const base = isGridChild ? 0.07 : 0.1;
      el.style.transitionDelay = (i * base) + 's';
    });
  });
}

assignRevealDelays();

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── SKILL BARS ──────────────────────────────────────────────────── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(g => skillObs.observe(g));

/* ─── COUNTER ANIMATION ───────────────────────────────────────────── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-stats').forEach(g => statObs.observe(g));

/* ─── AI CHAT DEMO ────────────────────────────────────────────────── */
const KB = {
  greetings: ['hi','hello','hey','sup','what\'s up','howdy'],
  projects: ['project','build','ship','work','portfolio','ai news','crew','crewai','agentic','agent','medium','llm concepts','blog'],
  skills: ['skill','know','tech','stack','language','python','aws','llm','ml','ai','learn','gemini','serper','crewai'],
  contact: ['contact','email','reach','hire','available','work together','linkedin','github'],
  journey: ['journey','story','start','begin','how','background','experience','path','100 days'],
  about: ['about','who','tell me','yourself','intro','background'],
};

const RESPONSES = {
  greetings: [
    "Hey there! 👋 I'm Asish's AI assistant. What would you like to know about his work?",
    "Hello! Great to meet you. Ask me anything about Asish — his projects, skills, or how to collaborate.",
  ],
  projects: [
    "Asish has shipped two solid public projects so far:\n\n🤖 **AI News Crew** — a fully autonomous multi-agent pipeline built with CrewAI + Gemini 2.5 Flash. Give it a topic, it researches the web and writes a polished blog post end-to-end.\n\n✍️ **Understanding Core LLM Concepts** — a beginner-friendly Medium article breaking down how LLMs actually work (tokens, attention, context windows etc.)\n\nMore projects are in the pipeline — watch his GitHub!",
    "The flagship project is AI News Crew — a CrewAI agentic system that uses a Researcher agent (Serper/Google Search) and a Writer agent (Gemini 2.5 Flash) to autonomously produce blog content on any topic. He also writes on Medium about LLM concepts. Want more detail on either?",
  ],
  skills: [
    "Asish's core stack:\n\n🐍 Python — primary language\n🤖 CrewAI — multi-agent orchestration\n💎 Gemini 2.5 Flash — LLM backbone\n🔍 Serper API — Google Search for agents\n🧠 LLMs & Prompt Engineering\n☁️ AWS — cloud infra\n\nDeep in the agentic AI space right now.",
    "Strong in the LLM/agent layer — CrewAI, Gemini, prompt engineering, and autonomous pipeline design. Also comfortable with Python, AWS, and data engineering.",
  ],
  contact: [
    "You can reach Asish at:\n\n⌥ github.com/Asish107\n💼 Check the contact form below!\n\nHe's open to interesting projects and collaborations.",
    "Best way is the contact form on this page, or find him on GitHub at github.com/Asish107.",
  ],
  journey: [
    "Started with Python and ML fundamentals, then went deep on LLMs when GPT-3.5 changed everything. Built AI News Crew as a real agentic project using CrewAI + Gemini. Also writes to share what he learns — check his Medium article on LLM concepts.",
    "The journey is still early but moving fast — from learning core ML to shipping autonomous agent systems. Currently exploring agentic AI, CrewAI orchestration, and open-source LLMs.",
  ],
  about: [
    "Asish is an AI enthusiast and builder — obsessed with autonomous agents, LLMs, and making AI do useful things end-to-end. He builds in public, writes to share knowledge, and is always working on the next thing.",
    "He lives at the intersection of curiosity and code — building agentic AI systems, writing about LLMs, and learning out loud.",
  ],
  fallback: [
    "Interesting question! I'm best at answering about Asish's projects (AI News Crew, LLM article), his skills, or how to get in touch. Try one of those?",
    "Hmm, that's a bit outside my scope. Ask me about his work, his tech stack, or how to collaborate — I'm solid on all of those.",
    "Good question, but I don't have that in my context. What I *can* tell you about: his AI News Crew project, his Medium writing, or how to reach him.",
  ],
};

function matchResponse(q) {
  const lower = q.toLowerCase();
  for (const [key, keywords] of Object.entries(KB)) {
    if (keywords.some(k => lower.includes(k))) {
      const arr = RESPONSES[key];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  const arr = RESPONSES.fallback;
  return arr[Math.floor(Math.random() * arr.length)];
}

const messagesEl = document.getElementById('chat-messages');
const inputEl    = document.getElementById('chat-input');
const sendBtn    = document.getElementById('chat-send');
const clearBtn   = document.getElementById('chat-clear');

function addMsg(text, type) {
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + type;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = type === 'bot' ? 'AI' : 'YOU';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return wrap;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.id = 'typing-indicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function handleSend() {
  const q = inputEl.value.trim();
  if (!q) return;

  addMsg(q, 'user');
  inputEl.value = '';

  showTyping();
  const delay = 800 + Math.random() * 800;
  setTimeout(() => {
    removeTyping();
    addMsg(matchResponse(q), 'bot');
  }, delay);
}

sendBtn.addEventListener('click', handleSend);
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

clearBtn.addEventListener('click', () => {
  messagesEl.innerHTML = '';
  addMsg("Hey! I'm Asish's AI assistant. Ask me about his projects, skills, experience, or how to get in touch. 👋", 'bot');
});

// Suggestions
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    inputEl.value = btn.dataset.q;
    handleSend();
    document.getElementById('suggestions').style.display = 'none';
  });
});

/* ─── CONTACT FORM ────────────────────────────────────────────────── */
function handleForm(e) {
  e.preventDefault();
  const btn  = document.getElementById('form-btn-text');
  const note = document.getElementById('form-note');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    note.textContent = '→ Message received. Alex will reply within 24h.';
    document.getElementById('contact-form').reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      note.textContent = '';
    }, 5000);
  }, 1200);
}

/* ─── FOOTER YEAR ─────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── SMOOTH SCROLL OFFSET ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
