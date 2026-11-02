(function () {
  'use strict';
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  function closeDropdowns() {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  }
  function closeMenu() {
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('nav-open');
    if (window.innerWidth <= 760) nav.inert = true;
    closeDropdowns();
  }
  function updateMenu() {
    closeMenu();
    nav.inert = window.innerWidth <= 760;
  }
  updateMenu();
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('nav-open');
    if (!open) { closeMenu(); return; }
    nav.inert = false;
    nav.classList.add('nav-open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  });
  dropdowns.forEach(dropdown => {
    dropdown.querySelector('button').addEventListener('click', () => {
      const open = !dropdown.classList.contains('open');
      closeDropdowns();
      if (open) {
        dropdown.classList.add('open');
        dropdown.querySelector('button').setAttribute('aria-expanded', 'true');
      }
    });
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !burger.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('nav-open')) { closeMenu(); burger.focus(); }
  });
  window.matchMedia('(max-width: 760px)').addEventListener('change', updateMenu);
})();
