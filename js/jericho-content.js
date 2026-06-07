function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("data/jericho-beach.json")
  .then(function(res) { return res.json(); })
  .then(function(data) {

    // ── Media / Images ───────────────────────────────────────────────────────
    var m = data.media;
    if (m) {

      // Hero background
      var heroEl = document.querySelector('.jericho-beach-hero');
      if (heroEl && m.heroBg) {
        heroEl.style.backgroundImage = 'url("' + esc(m.heroBg) + '")';
      }

      // Main gallery (8 images — first item gets large class)
      var mainGallery = document.querySelector('.project-gallery-section .project-gallery-grid-4');
      if (mainGallery && Array.isArray(m.gallery) && m.gallery.length) {
        mainGallery.innerHTML = m.gallery.map(function(img, i) {
          var cls = 'project-gallery-item' + (i === 0 ? ' project-gallery-item-large' : '');
          return '<figure class="' + cls + '">' +
            '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy">' +
          '</figure>';
        }).join('');
      }

      // About section image
      var aboutWrap = document.querySelector('.project-about-video');
      if (aboutWrap && m.aboutImage) {
        var ai = m.aboutImage;
        aboutWrap.innerHTML =
          '<img src="' + esc(ai.src) + '" alt="' + esc(ai.alt) + '" loading="lazy">';
      }

      // Before / After images
      var beforeAfterGrid = document.querySelector('.before-after-visual-grid');
      if (beforeAfterGrid && m.beforeSrc && m.afterSrc) {
        beforeAfterGrid.innerHTML =
          '<figure class="before-after-figure">' +
            '<span class="before-after-label before-label">Before</span>' +
            '<div class="before-after-image-wrap">' +
              '<img src="' + esc(m.beforeSrc) + '" alt="' + esc(m.beforeAlt || '') + '">' +
            '</div>' +
          '</figure>' +
          '<figure class="before-after-figure">' +
            '<span class="before-after-label after-label">After</span>' +
            '<div class="before-after-image-wrap">' +
              '<img src="' + esc(m.afterSrc) + '" alt="' + esc(m.afterAlt || '') + '">' +
            '</div>' +
          '</figure>';
      }

      // Final result gallery (3 images — first gets --main class)
      var finalGallery = document.querySelector('.project-final-gallery-3');
      if (finalGallery && Array.isArray(m.finalGallery) && m.finalGallery.length) {
        finalGallery.innerHTML = m.finalGallery.map(function(img, i) {
          var cls = 'project-gallery-item' + (i === 0 ? ' project-gallery-item--main' : '');
          return '<figure class="' + cls + '">' +
            '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy">' +
          '</figure>';
        }).join('');
      }
    }

    // ── About text ───────────────────────────────────────────────────────────
    var about = data.about;
    if (about) {
      var heading = document.getElementById("jericho-about-heading");
      var p1      = document.getElementById("jericho-about-p1");
      var p2      = document.getElementById("jericho-about-p2");
      if (heading && about.heading) heading.textContent = about.heading;
      if (p1 && about.para1)        p1.textContent      = about.para1;
      if (p2 && about.para2)        p2.textContent      = about.para2;
    }

    // ── Scope cards ──────────────────────────────────────────────────────────
    var scope = data.scope;
    if (scope) {
      var scopeH2    = document.getElementById("jericho-scope-heading");
      var scopeIntro = document.getElementById("jericho-scope-intro");
      var scopeGrid  = document.querySelector(".project-scope-grid");

      if (scopeH2 && scope.heading)   scopeH2.textContent    = scope.heading;
      if (scopeIntro && scope.intro)  scopeIntro.textContent = scope.intro;

      if (scopeGrid && Array.isArray(scope.cards) && scope.cards.length) {
        scopeGrid.innerHTML = scope.cards.map(function(card) {
          return '<article class="project-scope-card">' +
            '<span class="project-scope-number">' + esc(card.number) + '</span>' +
            '<h3>' + esc(card.title) + '</h3>' +
            '<p>' + esc(card.text) + '</p>' +
          '</article>';
        }).join("");
      }
    }

    // ── FAQ ──────────────────────────────────────────────────────────────────
    var faq = data.faq;
    if (faq && Array.isArray(faq.items) && faq.items.length) {
      var list = document.querySelector(".framing-faq-list");
      if (list) {
        list.innerHTML = faq.items.map(function(item) {
          return '<div class="framing-faq-item">' +
            '<button class="framing-faq-question" type="button">' +
              '<span>' + esc(item.question) + '</span>' +
              '<span class="framing-faq-icon">+</span>' +
            '</button>' +
            '<div class="framing-faq-answer"><p>' + esc(item.answer) + '</p></div>' +
          '</div>';
        }).join("");

        list.querySelectorAll(".framing-faq-item").forEach(function(item) {
          var btn = item.querySelector(".framing-faq-question");
          if (btn) btn.addEventListener("click", function() {
            item.classList.toggle("active");
          });
        });
      }
    }
  })
  .catch(function(err) { console.error("Jericho content error:", err); });
