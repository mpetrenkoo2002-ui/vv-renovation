(() => {
  const switcher = document.querySelector('[data-finish-switcher]');
  if (switcher) {
    const tabs = Array.from(switcher.querySelectorAll('[role="tab"]'));
    function selectFinish(selectedTab) {
      tabs.forEach(tab => {
        const selected = tab === selectedTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        panel.hidden = !selected;
        if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectFinish(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectFinish(tabs[next]);
        tabs[next].focus();
      });
    });
    function selectFromHash() {
      const linkedTab = tabs.find(tab => `#${tab.getAttribute('aria-controls')}` === location.hash);
      if (linkedTab) selectFinish(linkedTab);
    }
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
  }

  const gallery = document.querySelector('[data-microcement-gallery]');
  if (!gallery) return;
  const slides = Array.from(gallery.querySelectorAll('.microcement-slide'));
  const navigation = gallery.querySelector('.microcement-navigation');
  const status = gallery.querySelector('[data-gallery-status]');
  if (!slides.length) return;
  let current = 0;

  function show(index) {
    slides[current].querySelector('video')?.pause();
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => { slide.hidden = position !== current; });
    status.textContent = `${current + 1} / ${slides.length}`;
  }

  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
  navigation.hidden = false;
})();
