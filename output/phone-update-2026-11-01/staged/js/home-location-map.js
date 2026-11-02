(() => {
  const map = document.querySelector('[data-location-map]');
  if (!map) return;
  const button = map.querySelector('[data-load-map]');
  const stage = map.querySelector('[data-map-stage]');
  const placeholder = map.querySelector('[data-map-placeholder]');
  const status = map.querySelector('[data-map-status]');
  button.hidden = false;

  button.addEventListener('click', () => {
    button.disabled = true;
    stage.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading Google Maps. You can also open the map using the address link.';
    const iframe = document.createElement('iframe');
    iframe.title = 'VV Renovation location on Google Maps — Richmond, British Columbia';
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2609.709324892408!2d-123.16672189999998!3d49.14914309999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54860bfcd3d78783%3A0xe17fe5bdad6a9e6c!2sVV%20Renovation!5e0!3m2!1sen!2sca!4v1790572357748!5m2!1sen!2sca';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.addEventListener('load', () => {
      stage.setAttribute('aria-busy', 'false');
      status.textContent = 'Explore the map here, or open Google Maps in a new tab.';
    }, { once: true });
    placeholder.hidden = true;
    stage.append(iframe);
    iframe.focus();
  }, { once: true });
})();
