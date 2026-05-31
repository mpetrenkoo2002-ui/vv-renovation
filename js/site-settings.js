function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderServicesMenu(services) {
  const menus = document.querySelectorAll("[data-services-menu]");
  if (!menus.length || !Array.isArray(services)) return;

  const html = services.map((service) => {
    return `<a href="${escapeHtml(service.url)}">${escapeHtml(service.label)}</a>`;
  }).join("");

  menus.forEach((menu) => {
    menu.innerHTML = html;
  });
}

function renderProjectsMenu(projects) {
  const menus = document.querySelectorAll("[data-projects-menu]");
  if (!menus.length) return;

  const links = [`<a href="our-projects.html">All Projects</a>`];

  if (Array.isArray(projects)) {
    projects.forEach((project) => {
      links.push(`<a href="${escapeHtml(project.url)}">${escapeHtml(project.label)}</a>`);
    });
  }

  const html = links.join("");

  menus.forEach((menu) => {
    menu.innerHTML = html;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/site-settings.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load site settings");
      return res.json();
    })
    .then((settings) => {
      renderServicesMenu(settings.servicesMenu);
      renderProjectsMenu(settings.projectsMenu);
    })
    .catch((error) => {
      console.error("Site settings loading error:", error);
    });
});