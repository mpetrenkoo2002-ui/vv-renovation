/* Shared card markup for the homepage and the services directory. */
(function (root) {
  'use strict';
  function esc(value) {
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function render(cards, headingTag) {
    const heading = headingTag === 'h2' ? 'h2' : 'h3';
    return cards.map(card => {
      const slug = String(card.link || '').replace(/\.html.*$/, '').replace(/[^a-z0-9-]/gi, '');
      const titleId = `${slug}-service-title`;
      const listId = `${slug}-service-list`;
      const outlineIcon = String(card.icon || '').startsWith('images/icons/');
      return `<article class="service-tile${slug === 'carpentry' ? ' service-tile--carpentry' : ''}" id="${esc(slug)}-service" aria-labelledby="${esc(titleId)}">
        <div class="service-tile-media"><img src="${esc(card.image)}" alt="${esc(card.imageAlt || card.title)}" loading="lazy" decoding="async"></div>
        <div class="service-tile-body">
          ${card.icon ? `<span class="service-tile-icon${outlineIcon ? ' service-tile-icon--outline' : ''}" aria-hidden="true"><img src="${esc(card.icon)}" alt="" width="58" height="58"></span>` : ''}
          <${heading} class="service-tile-title" id="${esc(titleId)}"><a class="service-tile-title-link" href="${esc(card.link)}">${esc(card.title)}</a></${heading}>
          <button class="service-tile-toggle" type="button" data-service-toggle aria-expanded="false" aria-controls="${esc(listId)}"><span data-service-toggle-label>View services</span><span data-service-toggle-icon aria-hidden="true">+</span></button>
          <ul class="service-tile-list" id="${esc(listId)}">${(card.items || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </div>
      </article>`;
    }).join('');
  }
  root.VVServiceCards = { render };
  if (typeof document === 'undefined') return;
  function setExpanded(tile, expanded) {
    tile.dataset.open = String(expanded);
    const button = tile.querySelector('[data-service-toggle]');
    button.setAttribute('aria-expanded', String(expanded));
    button.querySelector('[data-service-toggle-label]').textContent = expanded ? 'Hide services' : 'View services';
    button.querySelector('[data-service-toggle-icon]').textContent = expanded ? '−' : '+';
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-service-toggle]');
    if (!button) return;
    const tile = button.closest('.service-tile');
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.service-tile[data-open="true"]').forEach(other => {
      if (other !== tile) setExpanded(other, false);
    });
    setExpanded(tile, expanded);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const tile = event.target.closest('.service-tile[data-open="true"]');
    if (!tile) return;
    setExpanded(tile, false);
    tile.querySelector('[data-service-toggle]').focus();
  });
})(typeof window === 'undefined' ? globalThis : window);
