// La Braise & l'Écume — interactions communes

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
