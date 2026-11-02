(function () {
  'use strict';
  function esc(value) {
    return String(value == null ? '' : value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }
  document.addEventListener('play', function (event) {
    if (event.target.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(function (video) {
      if (video !== event.target) video.pause();
    });
  }, true);
  fetch('data/carpentry.json', {cache: 'no-cache'})
    .then(function (res) { if (!res.ok) throw new Error('Carpentry content unavailable'); return res.json(); })
    .then(function (data) {
      var section = data.deckReplacement;
      if (!section) return;
      document.querySelector('#deck-replacement-title').textContent = section.title;
      document.querySelector('.carpentry-deck-heading > p:last-child').textContent = section.text;
      document.querySelector('.carpentry-deck-grid').innerHTML = section.videos.map(function (video, index) {
        return '<figure class="carpentry-deck-card' + (index === 1 ? ' carpentry-deck-card--after' : '') + '"><div class="carpentry-deck-stage"><span class="carpentry-deck-label">' + String(index + 1).padStart(2, '0') + ' / ' + esc(video.label) + '</span><span class="carpentry-deck-stage-note">' + (index === 0 ? 'Original deck' : 'New decking') + '</span></div><div class="carpentry-deck-media"><video controls playsinline muted preload="none" poster="' + esc(video.poster) + '" aria-label="' + esc(video.label + ': ' + video.title) + '"><source src="' + esc(video.src) + '" type="video/mp4"></video></div><figcaption><h3>' + esc(video.title) + '</h3><p>' + esc(video.text) + '</p></figcaption></figure>';
      }).join('<div class="carpentry-deck-bridge" aria-hidden="true"><span class="carpentry-deck-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>');
    })
    .catch(function (error) { console.error('Carpentry comparison:', error); });
})();
