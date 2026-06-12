(function () {
  'use strict';

  var WHATSAPP_NUMBER = '50760000000';

  function getSlugFromPath() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderCatalog(catalog) {
    return catalog.map(function (item, index) {
      return '<article class="catalog-card" data-index="' + index + '" tabindex="0" role="button" aria-label="Ver ' + escapeHtml(item.title) + '">'
        + '<div class="catalog-card__img-wrap">'
        + '<img src="' + item.src + '" alt="' + escapeHtml(item.alt) + '" width="600" height="450" loading="lazy" decoding="async">'
        + '<div class="catalog-card__overlay">'
        + '<span class="catalog-card__view">Ver proyecto</span>'
        + '</div>'
        + '</div>'
        + '<div class="catalog-card__body">'
        + '<h3>' + escapeHtml(item.title) + '</h3>'
        + '<p>' + escapeHtml(item.description) + '</p>'
        + '<span class="catalog-card__tag">' + escapeHtml(item.material) + '</span>'
        + '</div>'
        + '</article>';
    }).join('');
  }

  function renderProduct(product) {
    var root = document.getElementById('product-root');
    if (!root) return;

    document.title = product.title + ' | Catálogo — ModulArt';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', product.metaDescription);

    var catalogHtml = renderCatalog(product.catalog);
    var catalogCount = product.catalog.length;

    var relatedHtml = window.MODULART_PRODUCT_ORDER
      .filter(function (slug) { return slug !== product.slug; })
      .slice(0, 4)
      .map(function (slug) {
        var item = window.MODULART_PRODUCTS[slug];
        return '<a href="/productos/' + item.slug + '/" class="product-related__link">' + escapeHtml(item.title) + '</a>';
      }).join('');

    var whatsappText = encodeURIComponent('Hola ModulArt, vi su catálogo de ' + product.title.toLowerCase() + ' y me gustaría cotizar un proyecto similar.');

    root.innerHTML =
      '<section class="product-hero">'
      + '<img class="product-hero__img" src="' + product.heroImage + '" alt="' + escapeHtml(product.heroAlt) + '" width="1600" height="500" fetchpriority="high" decoding="async">'
      + '<div class="product-hero__overlay"></div>'
      + '<div class="container product-hero__content">'
      + '<nav class="breadcrumb" aria-label="Ruta de navegación">'
      + '<a href="/">Inicio</a><span aria-hidden="true">/</span>'
      + '<a href="/#productos">Productos</a><span aria-hidden="true">/</span>'
      + '<span>' + escapeHtml(product.title) + '</span>'
      + '</nav>'
      + '<h1>' + escapeHtml(product.title) + '</h1>'
      + '<p class="product-hero__subtitle">Catálogo de proyectos realizados</p>'
      + '</div>'
      + '</section>'
      + '<section class="section product-intro">'
      + '<div class="container product-intro__inner">'
      + '<p>' + escapeHtml(product.description) + '</p>'
      + '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappText + '" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Cotizar proyecto similar</a>'
      + '</div>'
      + '</section>'
      + '<section class="section section--dark product-catalog" id="catalogo">'
      + '<div class="container">'
      + '<div class="product-catalog__header">'
      + '<h2>Catálogo de trabajos</h2>'
      + '<div class="section__divider"></div>'
      + '<p class="product-catalog__count">' + catalogCount + ' proyectos · Haz clic en cualquier imagen para ver en detalle</p>'
      + '</div>'
      + '<div class="catalog-grid" id="catalog-grid">' + catalogHtml + '</div>'
      + '</div>'
      + '</section>'
      + '<section class="section product-related">'
      + '<div class="container">'
      + '<h2 class="section__title-center">Otros productos</h2>'
      + '<div class="section__divider section__divider--center"></div>'
      + '<div class="product-related__grid">' + relatedHtml + '</div>'
      + '</div>'
      + '</section>'
      + '<div class="catalog-lightbox" id="catalog-lightbox" hidden aria-hidden="true">'
      + '<div class="catalog-lightbox__backdrop" data-close-lightbox></div>'
      + '<div class="catalog-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">'
      + '<button class="catalog-lightbox__close" type="button" aria-label="Cerrar" data-close-lightbox>&times;</button>'
      + '<img class="catalog-lightbox__img" id="lightbox-img" src="" alt="">'
      + '<div class="catalog-lightbox__info">'
      + '<h3 id="lightbox-title"></h3>'
      + '<p id="lightbox-desc"></p>'
      + '<span class="catalog-card__tag" id="lightbox-tag"></span>'
      + '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappText + '" class="btn btn--outline" id="lightbox-cta" target="_blank" rel="noopener noreferrer">Cotizar proyecto similar</a>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  function initCatalogLightbox(catalog, productTitle) {
    var lightbox = document.getElementById('catalog-lightbox');
    var grid = document.getElementById('catalog-grid');
    if (!lightbox || !grid) return;

    var img = document.getElementById('lightbox-img');
    var title = document.getElementById('lightbox-title');
    var desc = document.getElementById('lightbox-desc');
    var tag = document.getElementById('lightbox-tag');
    var cta = document.getElementById('lightbox-cta');

    function openLightbox(index) {
      var item = catalog[index];
      if (!item) return;

      img.src = item.src.replace('w=900', 'w=1400');
      img.alt = item.alt;
      title.textContent = item.title;
      desc.textContent = item.description;
      tag.textContent = item.material;

      var text = encodeURIComponent('Hola ModulArt, me interesa el proyecto "' + item.title + '" de su catálogo de ' + productTitle.toLowerCase() + '. Me gustaría cotizar algo similar.');
      cta.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.catalog-lightbox__close').focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.catalog-card');
      if (!card) return;
      openLightbox(Number(card.dataset.index));
    });

    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.catalog-card');
      if (!card) return;
      e.preventDefault();
      openLightbox(Number(card.dataset.index));
    });

    lightbox.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  function initHeader() {
    var header = document.getElementById('header');
    if (header) header.classList.add('header--solid');

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
  }

  var slug = getSlugFromPath();
  var product = window.MODULART_PRODUCTS && window.MODULART_PRODUCTS[slug];

  if (!product) {
    window.location.replace('/#productos');
    return;
  }

  renderProduct(product);
  initCatalogLightbox(product.catalog, product.title);
  initHeader();
})();
