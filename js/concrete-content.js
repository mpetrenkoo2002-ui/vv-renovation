/* Shared by the service page and the featured service on Home / Services. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const safeUrl = value => /^(?:https?:\/\/|\/|[a-z0-9_.-])/i.test(value || '') && !/^\w+:/i.test(value || '') ? esc(value) : /^https?:\/\//i.test(value || '') ? esc(value) : '';
  function photo(src, alt, extra = '') {
    const isOptimized = /^images\/concrete\/[a-z-]+\.webp$/.test(src || '') && !src.includes('-poster');
    const landscape = /\/(scan-markings|wall-drilling|application-(?:plumbing|electrical|hvac))\.webp$/.test(src || '');
    const smallWidth = landscape ? 720 : 540;
    const largeWidth = landscape ? 1440 : 1080;
    return `<img src="${safeUrl(src)}" ${isOptimized ? `srcset="${safeUrl(src.replace('.webp', '-small.webp'))} ${smallWidth}w, ${safeUrl(src)} ${largeWidth}w" sizes="(max-width: 760px) 92vw, 50vw"` : ''} alt="${esc(alt)}" ${extra}>`;
  }
  function heroPhoto(src, alt) {
    const isOptimized = /^images\/concrete\/[a-z-]+\.webp$/.test(src || '') && !src.includes('-poster');
    return `<img src="${safeUrl(src)}" ${isOptimized ? `srcset="${safeUrl(src.replace('.webp', '-small.webp'))} 720w, ${safeUrl(src)} 1440w" sizes="100vw"` : ''} alt="${esc(alt)}" fetchpriority="high" width="1440" height="1080">`;
  }
  function heading(data) {
    return `<div class="concrete-section-heading"><p class="concrete-eyebrow">${esc(data.eyebrow)}</p><h2>${esc(data.title)}</h2>${data.text ? `<p>${esc(data.text)}</p>` : ''}</div>`;
  }
  function promo(data) {
    return `<article class="concrete-promo"><a class="concrete-promo-media" href="${safeUrl(data.buttonLink)}" aria-label="${esc(data.title)}">${photo(data.image, data.imageAlt, 'loading="lazy" width="1440" height="1080"')}</a><div class="concrete-promo-copy"><p class="concrete-eyebrow">${esc(data.eyebrow)}</p><h3>${esc(data.title)}</h3><p>${esc(data.text)}</p><a class="btn btn-primary" href="${safeUrl(data.buttonLink)}">${esc(data.buttonText)} <span aria-hidden="true">↗</span></a></div></article>`;
  }
  function sections(data) {
    return {
      hero: `<figure class="concrete-hero-background">${heroPhoto(data.hero.image, data.hero.imageAlt)}</figure><div class="concrete-hero-overlay" aria-hidden="true"></div><div class="container concrete-hero-content"><p class="concrete-eyebrow">${esc(data.hero.eyebrow)}</p><h1><span>${esc(data.hero.title)}</span><span>${esc(data.hero.secondLine)}</span><span>${esc(data.hero.location)}</span></h1><p class="concrete-hero-description">${esc(data.hero.text)}</p><div class="concrete-actions"><a class="btn btn-primary" href="#contact">${esc(data.hero.primaryButtonText)}</a><a class="concrete-call" href="tel:+17782667999">${esc(data.hero.secondaryButtonText)}</a></div><ul class="concrete-tags">${data.hero.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul><a class="concrete-hero-scroll" href="#concrete-services" aria-label="Scroll to concrete services"><span aria-hidden="true"></span></a></div>`,
      services: `<div class="container">${heading(data.services)}<div class="concrete-services-grid">${data.services.cards.map(card => `<article class="concrete-service"><figure>${photo(card.image, card.imageAlt, 'loading="lazy" width="1440" height="1080"')}<figcaption>${esc(card.caption)}</figcaption></figure><div class="concrete-service-copy"><span class="concrete-number">${esc(card.number)}</span><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p><ul>${card.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div></article>`).join('')}</div><p class="concrete-method-note">${esc(data.services.note)}</p></div>`,
      applications: `<div class="container">${heading(data.applications)}<div class="concrete-applications-grid">${data.applications.items.map((item, i) => `<article class="concrete-application-card"><figure>${photo(item.image, item.imageAlt, 'loading="lazy" width="1440" height="900"')}</figure><div class="concrete-application-copy"><span class="concrete-number">0${i + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`).join('')}</div></div>`,
      process: `<div class="container">${heading(data.process)}<ol class="concrete-steps">${data.process.steps.map((step, i) => `<li><span class="concrete-step-index" aria-hidden="true">0${i + 1}</span><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></li>`).join('')}</ol></div>`,
      work: `<div class="container">${heading(data.work)}<div class="concrete-gallery">${data.work.images.map(item => `<figure><a class="concrete-gallery-link" href="${safeUrl(item.image)}" data-concrete-zoom aria-label="Enlarge: ${esc(item.caption)}">${photo(item.image, item.alt, 'loading="lazy" width="1080" height="1440"')}<span class="concrete-enlarge" aria-hidden="true">↗</span></a><figcaption>${esc(item.caption)}</figcaption></figure>`).join('')}</div><div class="concrete-videos">${data.work.videos.map(item => `<figure><video controls playsinline muted preload="none" poster="${safeUrl(item.poster)}" aria-label="${esc(item.title)}"><source src="${safeUrl(item.src)}" type="video/mp4"><a href="${safeUrl(item.src)}">Watch ${esc(item.title)}</a></video><figcaption><span class="concrete-eyebrow">Site video · ${esc(item.duration)} · No audio</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></figcaption></figure>`).join('')}</div></div>`,
      faq: `<div class="container concrete-faq-grid">${heading(data.faq)}<div class="concrete-faq-list">${data.faq.items.map(item => `<details><summary>${esc(item.question)}<span aria-hidden="true">+</span></summary><p>${esc(item.answer)}</p></details>`).join('')}</div></div>`
    };
  }
  root.ConcreteContent = { sections, promo };
  if (typeof document === 'undefined') return;

  function hydrate(data) {
    document.querySelectorAll('[data-concrete-promo]').forEach(el => { el.innerHTML = promo(data.promo); });
    if (!document.querySelector('[data-concrete-section]')) return;
    const markup = sections(data);
    for (const [key, html] of Object.entries(markup)) {
      const target = document.querySelector(`[data-concrete-section="${key}"]`);
      if (target) target.innerHTML = html;
    }
    for (const [key, value] of Object.entries(data.quote)) {
      const el = document.querySelector(`[data-concrete-quote="${key}"]`);
      if (el) el.textContent = value;
    }
    document.title = data.seo.title;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute('content', data.seo.description);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute('content', data.seo.title);
    const socialImage = new URL(data.hero.image, 'https://www.vvrenovation.ca/').href;
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) document.querySelector(selector)?.setAttribute('content', socialImage);
    const serviceSchema = document.getElementById('concrete-service-schema');
    if (serviceSchema) {
      const schema = JSON.parse(serviceSchema.textContent);
      schema.description = data.seo.description;
      serviceSchema.textContent = JSON.stringify(schema);
    }
    const faqSchema = document.getElementById('concrete-faq-schema');
    if (faqSchema) faqSchema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:data.faq.items.map(item => ({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
  }
  document.addEventListener('DOMContentLoaded', () => {
    fetch('data/concrete-scanning-core-drilling.json').then(response => {
      if (!response.ok) throw new Error('Concrete content could not be loaded');
      return response.json();
    }).then(hydrate).catch(error => console.warn(error.message));

    const form = document.getElementById('concrete-quote-form');
    if (form) {
      const service = form.elements.service;
      const drilling = form.querySelector('[data-drilling-fields]');
      function updateFields() {
        const scanningOnly = service.value === 'Concrete scanning';
        drilling.hidden = scanningOnly;
        drilling.disabled = scanningOnly;
      }
      service.addEventListener('change', updateFields);
      updateFields();
    }

    const dialog = document.getElementById('concrete-lightbox');
    let opener;
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-concrete-zoom]');
      if (!link || !dialog || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      opener = link;
      const image = dialog.querySelector('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      dialog.querySelector('figcaption').textContent = link.closest('figure').querySelector('figcaption').textContent;
      dialog.showModal();
    });
    if (dialog) {
      dialog.querySelector('button').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => opener?.focus());
    }
    document.addEventListener('play', event => {
      if (!event.target.matches('.concrete-videos video')) return;
      document.querySelectorAll('.concrete-videos video').forEach(video => { if (video !== event.target) video.pause(); });
    }, true);
  });
})(typeof window === 'undefined' ? globalThis : window);
