function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

fetch("data/our-projects.json")
  .then(function(res) { return res.json(); })
  .then(function(data) {

    // Heading
    var h = data.heading;
    if (h) {
      var h1 = document.querySelector(".projects-hub-heading h1");
      var p  = document.querySelector(".projects-hub-intro");
      if (h1 && h.title)    h1.textContent = h.title;
      if (p  && h.text)      p.innerHTML   = h.text;
    }

    // Project cards
    var grid = document.querySelector(".projects-hub-grid");
    if (grid && Array.isArray(data.projects) && data.projects.length) {
      grid.innerHTML = data.projects.map(function(proj) {
        return '<a href="' + esc(proj.url) + '" class="projects-hub-card">' +
          '<div class="projects-hub-media">' +
            '<img src="' + esc(proj.image) + '" alt="' + esc(proj.imageAlt) + '" loading="lazy">' +
            '<span class="projects-hub-tag">' + esc(proj.tag) + '</span>' +
          '</div>' +
          '<div class="projects-hub-body">' +
            '<h2 class="projects-hub-card-title">' + esc(proj.title) + '</h2>' +
            '<p class="projects-hub-card-text">' + esc(proj.description) + '</p>' +
            '<div class="projects-hub-meta">' +
              '<span>' + esc(proj.location) + '</span>' +
              '<span>' + esc(proj.timeline) + '</span>' +
            '</div>' +
            '<span class="projects-hub-link">View Project →</span>' +
          '</div>' +
        '</a>';
      }).join("");
    }
  })
  .catch(function(err) { console.error("Projects content error:", err); });
