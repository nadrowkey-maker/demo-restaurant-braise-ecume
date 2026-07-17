// La Braise & l'Écume — interactions communes

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header : fond plein au scroll
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('open');
    })
  );
}

// Apparition au défilement
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ----------------------------------------------------------
// Hero vidéo : boucle d'ambiance (pause si animations réduites)
// ----------------------------------------------------------
const heroVideo = document.querySelector('.hero-scrub video');
if (heroVideo && reduceMotion) heroVideo.pause();

// ----------------------------------------------------------
// Braises flottantes (canvas) — hero & bandeaux
// ----------------------------------------------------------
if (!reduceMotion) {
  document.querySelectorAll('[data-embers]').forEach(host => {
    const canvas = document.createElement('canvas');
    canvas.className = 'embers';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w, h, sparks = [];

    const resize = () => {
      w = canvas.width = host.offsetWidth;
      h = canvas.height = host.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.min(38, Math.floor(w / 34));
    const spawn = () => ({
      x: Math.random() * w,
      y: h + 10 + Math.random() * 40,
      r: .8 + Math.random() * 2.1,
      vy: .25 + Math.random() * .8,
      vx: (Math.random() - .5) * .35,
      life: 0,
      max: 260 + Math.random() * 240,
      hue: 18 + Math.random() * 14
    });
    for (let i = 0; i < COUNT; i++) { const s = spawn(); s.y = Math.random() * h; s.life = Math.random() * s.max; sparks.push(s); }

    (function draw() {
      ctx.clearRect(0, 0, w, h);
      sparks.forEach((s, i) => {
        s.life++; s.y -= s.vy; s.x += s.vx + Math.sin((s.life + i * 40) / 46) * .3;
        const t = s.life / s.max;
        const alpha = t < .15 ? t / .15 : 1 - (t - .15) / .85;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 60%, ${Math.max(0, alpha) * .8})`;
        ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(226,112,58,.8)';
        ctx.fill();
        if (s.life > s.max || s.y < -12) sparks[i] = spawn();
      });
      requestAnimationFrame(draw);
    })();
  });
}

// ----------------------------------------------------------
// Parallaxe douce sur les images éditoriales
// ----------------------------------------------------------
if (!reduceMotion) {
  const parallaxImgs = document.querySelectorAll('.split-img img');
  if (parallaxImgs.length) {
    const update = () => {
      parallaxImgs.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const center = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.transform = `translateY(${center * -18}px) scale(1.06)`;
      });
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}

// ----------------------------------------------------------
// Compteurs animés (page histoire)
// ----------------------------------------------------------
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1600;
      (function step(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: .6 });
  io.observe(el);
});

// Galerie : lightbox
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbLegende = lightbox.querySelector('.lightbox-legende');
  document.querySelectorAll('.galerie-grid a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      lbImg.src = link.href;
      lbLegende.textContent = link.dataset.legende || '';
      lightbox.classList.add('open');
    });
  });
  const close = () => lightbox.classList.remove('open');
  lightbox.addEventListener('click', e => { if (e.target !== lbImg) close(); });
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Formulaire de réservation (démo : pas d'envoi réel)
const form = document.querySelector('#form-resa');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const prenom = form.querySelector('#resa-nom').value.trim().split(' ')[0] || '';
    const succes = form.querySelector('.form-success');
    succes.textContent = `Merci ${prenom} ! Votre demande de réservation a bien été enregistrée. ` +
      `Nous vous confirmons votre table par téléphone dans les plus brefs délais. À très vite !`;
    succes.classList.add('visible');
    form.reset();
    succes.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// Date minimum du formulaire = aujourd'hui
const dateInput = document.querySelector('#resa-date');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
