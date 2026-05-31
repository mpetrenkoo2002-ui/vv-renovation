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

function renderIntroMedia(intro) {
  if (!intro) return;

  let mediaContainer = document.querySelector(".service-intro-media");
const introGrid = document.querySelector(".intro-grid");
const hasMediaPair = Array.isArray(intro.mediaItems) && intro.mediaItems.length > 1;

if (introGrid) {
  introGrid.classList.toggle("intro-grid--media-pair", hasMediaPair);
}
  // If the new two-media wrapper doesn't exist yet, create it from the old single media block
  if (!mediaContainer) {
    const oldMedia = document.querySelector(".intro-video, .intro-image");

    if (!oldMedia) return;

    mediaContainer = document.createElement("div");
    mediaContainer.className = "service-intro-media";
    mediaContainer.setAttribute("aria-label", "Project examples");

    oldMedia.replaceWith(mediaContainer);
  }

  // New format: multiple media items
  if (Array.isArray(intro.mediaItems) && intro.mediaItems.length > 0) {
    mediaContainer.innerHTML = intro.mediaItems.map((item) => {
      const type = item.type || "image";
      const src = esc(item.src || "");
      const alt = esc(item.alt || intro.title || "");

      if (type === "video") {
        const controls = item.controls ? "controls" : "";
        const autoplay = item.autoplay ? "autoplay" : "";
        const loop = item.loop ? "loop" : "";

        return `
          <div class="intro-video intro-media-card">
            <video ${controls} ${autoplay} ${loop} muted playsinline preload="metadata" aria-label="${alt}">
              <source src="${src}" type="video/mp4">
            </video>
          </div>
        `;
      }

      return `
        <div class="intro-image intro-media-card">
          <img src="${src}" alt="${alt}">
        </div>
      `;
    }).join("");

    return;
  }

  // Old fallback format: one media item
  if (!intro.media) return;

  const type = intro.mediaType || "image";
  const src = esc(intro.media);
  const alt = esc(intro.mediaAlt || intro.title || "");

  if (type === "video") {
    mediaContainer.innerHTML = `
      <div class="intro-video intro-media-card">
        <video autoplay muted loop playsinline preload="metadata" aria-label="${alt}">
          <source src="${src}" type="video/mp4">
        </video>
      </div>
    `;
    return;
  }

  mediaContainer.innerHTML = `
    <div class="intro-image intro-media-card">
      <img src="${src}" alt="${alt}">
    </div>
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

  bindFaq();
}

function bindFaq() {
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
    bindFaq();
    return;
  }

  fetch(`data/${page}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load data/${page}.json`);
      return res.json();
    })
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

        const scroll = document.querySelector(".service-hero-scroll");
        if (scroll && data.hero.scrollTarget) {
          scroll.href = `#${data.hero.scrollTarget}`;
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
      bindFaq();
    });
});
