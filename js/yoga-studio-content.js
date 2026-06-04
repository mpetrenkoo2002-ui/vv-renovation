function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("data/yoga-studio-langley.json")
  .then(function(res) { return res.json(); })
  .then(function(data) {

    // About section
    var about = data.about;
    if (about) {
      var heading = document.getElementById("yoga-about-heading");
      var p1      = document.getElementById("yoga-about-p1");
      var p2      = document.getElementById("yoga-about-p2");
      if (heading && about.heading) heading.textContent = about.heading;
      if (p1 && about.para1)        p1.textContent      = about.para1;
      if (p2 && about.para2)        p2.textContent      = about.para2;
    }

    // Scope section
    var scope = data.scope;
    if (scope) {
      var scopeH2    = document.getElementById("yoga-scope-heading");
      var scopeIntro = document.getElementById("yoga-scope-intro");
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

    // Testimonial
    var t = data.testimonial;
    if (t) {
      var quote    = document.getElementById("yoga-testimonial-quote");
      var avatar   = document.getElementById("yoga-testimonial-avatar");
      var author   = document.getElementById("yoga-testimonial-author");
      var role     = document.getElementById("yoga-testimonial-role");
      var location = document.getElementById("yoga-testimonial-location");

      if (quote  && t.quote)    quote.textContent    = t.quote;
      if (author && t.author)   author.textContent   = t.author;
      if (role   && t.role)     role.textContent     = t.role;
      if (location && t.location) location.textContent = t.location;
      if (avatar && t.avatarUrl) {
        avatar.src = t.avatarUrl;
        avatar.alt = esc(t.author) + " — " + esc(t.role);
      }
    }

    // FAQ
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

        // Re-bind FAQ accordion after repopulating
        list.querySelectorAll(".framing-faq-item").forEach(function(item) {
          var btn = item.querySelector(".framing-faq-question");
          if (btn) btn.addEventListener("click", function() {
            item.classList.toggle("active");
          });
        });
      }
    }
  })
  .catch(function(err) { console.error("Yoga content error:", err); });
