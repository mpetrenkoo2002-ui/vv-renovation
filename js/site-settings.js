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

document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/site-settings.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load site settings");
      return res.json();
    })
    .then((settings) => {
      renderServicesMenu(settings.servicesMenu);
    })
    .catch((error) => {
      console.error("Site settings loading error:", error);
    });
});