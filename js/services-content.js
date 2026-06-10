function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("data/services.json")
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var intro = data.intro;
    var hubHeading = document.querySelector(".projects-hub-heading");
    if (hubHeading) {
      var eyebrow = hubHeading.querySelector(".project-section-eyebrow");
      var h1 = hubHeading.querySelector("h1");
      var body = hubHeading.querySelector("p:not(.project-section-eyebrow)");
      if (eyebrow) eyebrow.textContent = intro.eyebrow;
      if (h1) h1.textContent = intro.heading;
      if (body) body.textContent = intro.text;
    }

    var grid = document.querySelector(".services-hub-grid");
    if (grid && Array.isArray(data.cards)) {
      grid.innerHTML = data.cards.map(function(card) {
        return '<a href="' + esc(card.link) + '" class="services-hub-card">' +
          '<div class="services-hub-media">' +
            '<img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt) + '" loading="lazy">' +
          '</div>' +
          '<div class="services-hub-body">' +
            '<div class="services-hub-icon-row">' +
              '<img src="' + esc(card.icon) + '" class="services-hub-icon" alt="">' +
              '<h2 class="services-hub-card-title">' + esc(card.title) + '</h2>' +
            '</div>' +
            '<ul class="services-hub-list">' +
              (card.items || []).map(function(item) { return '<li>' + esc(item) + '</li>'; }).join('') +
            '</ul>' +
            '<span class="services-hub-link">Learn more →</span>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    var cta = data.cta;
    if (cta) {
      var ctaHeading = document.querySelector(".projects-cta h2");
      var ctaText = document.querySelector(".projects-cta p");
      var ctaButtons = document.querySelectorAll(".projects-cta-actions a");
      if (ctaHeading) ctaHeading.textContent = cta.heading;
      if (ctaText) ctaText.textContent = cta.text;
      if (ctaButtons[0]) { ctaButtons[0].textContent = cta.primaryButtonText; ctaButtons[0].href = cta.primaryButtonLink; }
      if (ctaButtons[1]) { ctaButtons[1].textContent = cta.secondaryButtonText; ctaButtons[1].href = cta.secondaryButtonLink; }
    }
  });
