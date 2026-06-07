/**
 * Desarrollador: Christian Jair Valero Tovar
 * Tecnologías: HTML5, CSS3, JavaScript
 * Nota de desarrollo: Código escrito y estructurado por el desarrollador, 
 * con asistencia de Claude (Anthropic) para la optimización y depuración.
 * Año: 2026
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // NAVEGACIÓN STICKY + HAMBURGER
  // ==============================
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });

  // ==============================
  // SCROLL SUAVE
  // ==============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==============================
  // BOTÓN VOLVER ARRIBA
  // ==============================
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==============================
  // REVEAL ON SCROLL
  // ==============================
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ==============================
  // TOGGLES DE IDIOMA — EXPERIENCIA
  // ==============================
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const group = this.closest('.lang-toggle-group');
      group.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const lang = this.dataset.lang;
      const contentWrap = group.nextElementSibling;
      contentWrap.querySelectorAll('.lang-content').forEach(c => c.classList.remove('active'));
      contentWrap.querySelector(`.lang-content[data-lang="${lang}"]`).classList.add('active');
    });
  });

  // ==============================
  // TOGGLES DE IDIOMA — CONFERENCIAS
  // ==============================
  document.querySelectorAll('.conference-lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const toggle = this.closest('.conference-lang-toggle');
      toggle.querySelectorAll('.conference-lang-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const lang = this.dataset.lang;
      const card = this.closest('.conference-card');
      card.querySelectorAll('.conf-lang-content').forEach(c => c.classList.remove('active'));
      card.querySelector(`.conf-lang-content[data-lang="${lang}"]`).classList.add('active');
    });
  });

  // ==============================
  // CARRUSEL PRINCIPAL
  // ==============================
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  const totalSlides = track ? track.children.length : 0;
  let autoplayTimer;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
  }

  if (track && totalSlides > 0) {
    document.getElementById('carousel-prev')?.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoplay();
    });

    document.getElementById('carousel-next')?.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoplay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    // Swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
      startAutoplay();
    });

    startAutoplay();
  }

  // ==============================
  // LIGHTBOX
  // ==============================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  function openLightbox(src, caption) {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (src) {
      lightboxImg.innerHTML = `<img src="${src}" alt="${caption || ''}">`;
    } else {
      lightboxImg.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;height:100%;background:rgba(0,174,239,0.05);">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0,174,239,0.4)" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:3px;color:rgba(0,174,239,0.4);text-transform:uppercase;">Foto por agregar</span>
        </div>`;
    }
    lightboxCaption.textContent = caption || 'Colombia 5.0 — Bogotá 2025';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Abrir lightbox en slides del carrusel
  document.querySelectorAll('.carousel-slide').forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const img = slide.querySelector('img');
      openLightbox(img?.src, `Colombia 5.0 — Foto ${i + 1}`);
    });
  });

  // Abrir lightbox en galerías de conferencias
  document.querySelectorAll('.conf-gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img?.src, item.dataset.caption || `Colombia 5.0 — Galería`);
    });
  });

  // ==============================
  // BUSCADOR DE GLOSARIO
  // ==============================
  const glossarySearch = document.getElementById('glossary-search');
  const glossaryRows = document.querySelectorAll('.glossary-row');
  const glossaryCount = document.getElementById('glossary-count');
  const noResults = document.getElementById('glossary-no-results');

  function updateCount(count) {
    if (glossaryCount) {
      glossaryCount.innerHTML = `Mostrando <span>${count}</span> de <span>${glossaryRows.length}</span> términos`;
    }
  }

  if (glossarySearch) {
    glossarySearch.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      let visible = 0;

      glossaryRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = !query || text.includes(query);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      updateCount(visible);
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });

    updateCount(glossaryRows.length);
  }

  // ==============================
  // ANIMACIÓN CONTADOR HERO
  // ==============================
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.counter').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target), 2000);
        });
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

});
