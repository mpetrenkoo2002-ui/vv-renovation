function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("/data/home.json")
  .then((res) => res.json())
  .then((data) => {
    const hero = data.hero;
    document.querySelector(".hero h1").innerHTML =
      `${esc(hero.line1)}<br>${esc(hero.line2)}<br><span class="accent">${esc(hero.accent)}</span>`;
    document.querySelector(".hero p").textContent = hero.subtitle;

    const heroButtons = document.querySelectorAll(".hero .cta-row a");
    heroButtons[0].textContent = hero.primaryButtonText;
    heroButtons[0].href = hero.primaryButtonLink;
    heroButtons[1].textContent = hero.secondaryButtonText;
    heroButtons[1].href = hero.secondaryButtonLink;

    document.querySelector(".services-title").textContent = data.services.title;
    document.querySelector(".services-grid").innerHTML = data.services.cards.map(card => `
      <article class="service-card">
        <div class="service-media">
          <img class="service-photo" src="${esc(card.image)}" alt="${esc(card.title)}">
        </div>
        <div class="service-panel">
          ${card.icon ? `<img class="service-icon" src="${esc(card.icon)}" alt="">` : ""}
          <h3 class="service-heading"><a href="${esc(card.link)}">${esc(card.title)}</a></h3>
          <ul class="service-list">
            ${(card.items || []).map(item => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `).join("");

    document.querySelector(".why-title").textContent = data.why.title;
    document.querySelector(".why-subtitle").textContent = data.why.subtitle;
    document.querySelector(".why-grid").innerHTML = data.why.cards.map(card => `
      <div class="why-card">
        <div class="why-card-head">
          <img class="why-check" src="checkmark-fill.svg" alt="">
          <h3>${esc(card.title)}</h3>
        </div>
        <p>${esc(card.text)}</p>
      </div>
    `).join("");

    const testimonials = document.querySelector(".testimonials");
    if (testimonials) {
      testimonials.querySelector(".section-title").textContent = data.testimonials.title;
      testimonials.querySelector(".section-subtitle").textContent = data.testimonials.subtitle;
      testimonials.querySelector(".testimonials-grid").innerHTML = data.testimonials.reviews.map(review => `
        <article class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>“${esc(review.text)}”</p>
        </article>
      `).join("");
    }

    const work = document.querySelector(".work");
    work.querySelector(".section-title").textContent = data.work.title;
    work.querySelector(".work-grid").innerHTML = data.work.images.map(item => `
      <a href="${esc(item.image)}" target="_blank" rel="noopener">
        <img src="${esc(item.image)}" alt="${esc(item.alt)}" class="work-item">
      </a>
    `).join("");

    const workBtn = work.querySelector(".work-cta a");
    workBtn.textContent = data.work.buttonText;
    workBtn.href = data.work.buttonLink;
  })
  .catch((error) => {
    console.error("Homepage content loading error:", error);
  });