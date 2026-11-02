(function () {
  'use strict';
  function esc(value) {
    return String(value == null ? '' : value).replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }
  function text(selector, value) {
    var node = document.querySelector(selector);
    if (node && value != null) node.textContent = value;
  }
  function image(item) {
    var size = item.width && item.height ? ' width="' + esc(item.width) + '" height="' + esc(item.height) + '"' : '';
    return '<img src="' + esc(item.src) + '" alt="' + esc(item.alt) + '"' + size + ' loading="lazy">';
  }
  function gallery(items) {
    return items.map(function (item) {
      return '<figure class="project-gallery-item">' + image(item) + '</figure>';
    }).join('');
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('.project-faq .framing-faq-question');
    if (!button) return;
    var open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.closest('.framing-faq-item').classList.toggle('active', open);
    var answer = document.getElementById(button.getAttribute('aria-controls'));
    if (answer) answer.hidden = !open;
  });
  document.addEventListener('play', function (event) {
    if (!event.target.matches('.moutcha-video-grid video')) return;
    document.querySelectorAll('.moutcha-video-grid video').forEach(function (video) {
      if (video !== event.target) video.pause();
    });
  }, true);
  fetch('data/moutcha-bay.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('Project content unavailable');
      return res.json();
    })
    .then(function (data) {
      if (data.hero) {
        text('.project-eyebrow', data.hero.eyebrow);
        text('.project-hero-subtitle', data.hero.subtitle);
        if (data.hero.title) document.querySelector('.project-hero-title').innerHTML =
          esc(data.hero.title) + '<br><span>' + esc(data.hero.secondaryTitle || 'Custom Carpentry') + '</span>';
        if (Array.isArray(data.hero.highlights)) document.querySelector('.project-hero-meta').innerHTML =
          data.hero.highlights.map(function (item) { return '<span>' + esc(item) + '</span>'; }).join('');
      }
      var media = data.media || {};
      if (media.heroBg) document.querySelector('.project-hero').style.backgroundImage = 'url(' + JSON.stringify(media.heroBg) + ')';
      if (Array.isArray(media.gallery)) document.querySelector('#project-gallery .project-gallery-grid-4').innerHTML = gallery(media.gallery);
      if (media.aboutImage) document.querySelector('.project-about-video').innerHTML = image(media.aboutImage);
      if (Array.isArray(media.videos) && media.videos.length) {
        document.querySelector('.moutcha-video-grid').innerHTML = media.videos.map(function (video, index) {
          return '<figure class="moutcha-video-card' + (index === media.videos.length - 1 ? ' moutcha-video-card--result' : '') + '">' +
            '<div class="moutcha-video-media"><video controls playsinline muted preload="none" poster="' + esc(video.poster) + '" aria-label="' + esc(video.title) + '"><source src="' + esc(video.src) + '" type="video/mp4"></video></div>' +
            '<figcaption class="moutcha-video-caption"><p class="moutcha-video-stage">' + esc(video.stage) + '</p><h3>' + esc(video.title) + '</h3><p>' + esc(video.description) + '</p></figcaption></figure>';
        }).join('');
      }
      if (data.galleryIntro) {
        text('.project-gallery-heading h2', data.galleryIntro.heading);
        text('.project-gallery-heading p:last-child', data.galleryIntro.text);
      }
      if (data.about) {
        text('#moutcha-about-heading', data.about.heading);
        text('#moutcha-about-p1', data.about.para1);
        text('#moutcha-about-p2', data.about.para2);
      }
      if (Array.isArray(data.details)) document.querySelector('.project-details-list').innerHTML = data.details.map(function (item) {
        return '<div><dt>' + esc(item.label) + ':</dt><dd>' + esc(item.value) + '</dd></div>';
      }).join('');
      if (data.scope) {
        text('.project-scope-heading h2', data.scope.heading);
        text('.project-scope-heading p:last-child', data.scope.intro);
        if (Array.isArray(data.scope.cards)) document.querySelector('.project-scope-grid').innerHTML = data.scope.cards.map(function (item) {
          return '<article class="project-scope-card"><span class="project-scope-number">' + esc(item.number) + '</span><h3>' + esc(item.title) + '</h3><p>' + esc(item.text) + '</p></article>';
        }).join('');
      }
      ['challenge', 'approach'].forEach(function (key) {
        if (!data[key]) return;
        text('[data-project-' + key + '] h3', data[key].heading);
        text('[data-project-' + key + '] p', data[key].text);
      });
      if (data.walkthroughIntro) {
        text('.project-final-heading h2', data.walkthroughIntro.heading);
        text('.project-final-heading p:last-child', data.walkthroughIntro.text);
      }
      if (Array.isArray(data.relatedServices)) document.querySelector('.project-related-service-grid').innerHTML = data.relatedServices.map(function (item) {
        return '<a href="' + esc(item.url) + '" class="project-related-service-card"><div class="project-related-service-media">' + image({src:item.image,alt:item.imageAlt}) + '</div><div class="project-related-service-panel"><img class="project-related-service-icon" src="' + esc(item.icon) + '" alt=""><h3>' + esc(item.label) + '</h3></div></a>';
      }).join('');
      if (data.faq && Array.isArray(data.faq.items)) document.querySelector('.framing-faq-list').innerHTML = data.faq.items.map(function (item, index) {
        var id = 'moutcha-faq-' + index;
        return '<div class="framing-faq-item"><button class="framing-faq-question" type="button" aria-expanded="false" aria-controls="' + id + '"><span>' + esc(item.question) + '</span><span class="framing-faq-icon" aria-hidden="true">+</span></button><div class="framing-faq-answer" id="' + id + '" hidden><p>' + esc(item.answer) + '</p></div></div>';
      }).join('');
    })
    .catch(function (error) { console.error('Moutcha Bay content:', error); });
})();
