function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("data/services.json", { cache: "no-cache" })
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
      grid.innerHTML = VVServiceCards.render(data.cards, "h2");
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
