(function () {
  'use strict';

  var WHATSAPP_NUMBER = '50760000000';

  /* Header scroll */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* Mobile menu */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('header__nav--open');
      menuToggle.setAttribute('aria-expanded', open);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('header__nav--open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Hero slider */
  var slides = document.querySelectorAll('.hero__slide');
  var dotsContainer = document.getElementById('hero-dots');
  var prevBtn = document.getElementById('hero-prev');
  var nextBtn = document.getElementById('hero-next');
  var current = 0;
  var autoplayTimer;

  if (slides.length && dotsContainer) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' hero__dot--active' : '');
      dot.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.hero__dot');

    function goTo(index) {
      slides[current].classList.remove('hero__slide--active');
      dots[current].classList.remove('hero__dot--active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('hero__slide--active');
      dots[current].classList.add('hero__dot--active');
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () { goTo(current + 1); }, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    resetAutoplay();
  }

  /* Contact form → WhatsApp */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nombre = document.getElementById('nombre').value.trim();
      var email = document.getElementById('email').value.trim();
      var telefono = document.getElementById('telefono').value.trim();
      var mensaje = document.getElementById('mensaje').value.trim();

      var text = 'Hola ModulArt, me gustaría cotizar un proyecto.%0A%0A'
        + '*Nombre:* ' + encodeURIComponent(nombre) + '%0A'
        + '*Email:* ' + encodeURIComponent(email) + '%0A'
        + '*Teléfono:* ' + encodeURIComponent(telefono) + '%0A'
        + '*Mensaje:* ' + encodeURIComponent(mensaje);

      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text, '_blank');
    });
  }
})();
