function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
}

function setHref(selector, value) {
  const el = document.querySelector(selector);
  if (el && value) {
    el.href = value;
  }
}

function renderIntroMedia(intro) {
  const mediaWrap = document.querySelector(".intro-video");
  if (!mediaWrap || !intro.media) return;

  if (intro.mediaType === "image") {
    mediaWrap.innerHTML = `
      <img src="${esc(intro.media)}" alt="${esc(intro.mediaAlt || intro.title)}">
    `;
    mediaWrap.classList.add("intro-image");
    return;
  }

  mediaWrap.innerHTML = `
    <video autoplay muted loop playsinline>
      <source src="${esc(intro.media)}" type="video/mp4">
    </video>
  `;
}

function renderTypes(types) {
  if (!types) return;

  setText(".accent-types-title", types.title);

  const grid = document.querySelector(".accent-types-grid");
  if (!grid || !Array.isArray(types.cards)) return;

  grid.innerHTML = types.cards.map(card => `
    <div class="accent-type-card">
      <h3>${esc(card.title)}</h3>
      <p>${esc(card.text)}</p>
    </div>
  `).join("");
}

function renderProcess(process) {
  if (!process) return;

  setText(".process-title", process.title);

  const timeline = document.querySelector(".process-timeline");
  if (timeline && Array.isArray(process.steps)) {
    timeline.innerHTML = process.steps.map((step, index) => `
      <div class="process-item">
        <div class="process-marker">${index + 1}</div>
        <div class="process-text">
          <h3>${esc(step.title)}</h3>
          <p>${esc(step.text)}</p>
        </div>
      </div>
    `).join("");
  }

  const btn = document.querySelector(".process-cta a");
  if (btn) {
    btn.textContent = process.buttonText || "Get Free Estimate";
    btn.href = process.buttonLink || "#contact";
  }
}

function renderWhy(why) {
  if (!why) return;

  setText(".why-title", why.title);
  setText(".why-subtitle", why.subtitle);

  const grid = document.querySelector(".why-grid");
  if (!grid || !Array.isArray(why.cards)) return;

  grid.innerHTML = why.cards.map(card => `
    <div class="why-card">
      <div class="why-card-head">
        <img class="why-check" src="checkmark-fill.svg" alt="">
        <h3>${esc(card.title)}</h3>
      </div>
      <p>${esc(card.text)}</p>
    </div>
  `).join("");
}

function renderWork(work) {
  if (!work) return;

  const workSection = document.querySelector(".work");
  if (!workSection) return;

  const title = workSection.querySelector(".section-title");
  if (title) title.textContent = work.title || "Our Work";

  const grid = workSection.querySelector(".work-grid");
  if (grid && Array.isArray(work.images)) {
    grid.innerHTML = work.images.map(item => `
      <a href="${esc(item.image)}" target="_blank" rel="noopener">
        <img src="${esc(item.image)}" alt="${esc(item.alt)}" class="work-item">
      </a>
    `).join("");
  }

  const btn = workSection.querySelector(".work-cta a");
  if (btn) {
    btn.textContent = work.buttonText || "See More";
    btn.href = work.buttonLink || "#contact";
  }
}

function renderFaq(faq) {
  if (!faq) return;

  setText(".framing-faq-title", faq.title);

  const list = document.querySelector(".framing-faq-list");
  if (!list || !Array.isArray(faq.items)) return;

  list.innerHTML = faq.items.map(item => `
    <div class="framing-faq-item">
      <button class="framing-faq-question" type="button">
        <span>${esc(item.question)}</span>
        <span class="framing-faq-icon">+</span>
      </button>
      <div class="framing-faq-answer">
        <p>${esc(item.answer)}</p>
      </div>
    </div>
  `).join("");

  // Re-bind FAQ click behavior after rendering new FAQ items
  const faqItems = document.querySelectorAll(".framing-faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".framing-faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (!page) {
    console.warn("No data-page attribute found on body.");
    return;
  }

  fetch(`/data/${page}.json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.seo) {
        if (data.seo.title) document.title = data.seo.title;

        const description = document.querySelector('meta[name="description"]');
        if (description && data.seo.description) {
          description.setAttribute("content", data.seo.description);
        }
      }

      if (data.hero) {
        const heroSection = document.querySelector(".service-hero");
        if (heroSection && data.hero.backgroundImage) {
          heroSection.style.backgroundImage = `url("${data.hero.backgroundImage}")`;
        }

        setText(".service-hero-title", data.hero.title);
        setText(".service-hero-subtitle", data.hero.subtitle);

        const heroBtn = document.querySelector(".service-hero-btn");
        if (heroBtn) {
          heroBtn.textContent = data.hero.buttonText || "Get Free Estimate";
          heroBtn.href = data.hero.buttonLink || "#contact";
        }
      }

      if (data.intro) {
        const introSection = document.querySelector(".service-intro");
        if (introSection && data.intro.anchorId) {
          introSection.id = data.intro.anchorId;
        }

        setText(".service-intro-title", data.intro.title);
        setText(".service-intro-text", data.intro.mainText);
        setText(".service-secondary-intro-text", data.intro.secondaryText);
        renderIntroMedia(data.intro);
      }

      renderTypes(data.types);
      renderProcess(data.process);
      renderWhy(data.why);
      renderWork(data.work);
      renderFaq(data.faq);
    })
    .catch((error) => {
      console.error("Service page content loading error:", error);
    });
});