(function () {
  function track(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  var pageName = window.location.pathname.replace(/^.*\//, '') || 'index.html';

  document.addEventListener('DOMContentLoaded', function () {

    // 1. Phone call clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        track('phone_call_click', {
          event_category: 'contact',
          event_label: link.href.replace('tel://', '').replace('tel:', ''),
          page_name: pageName
        });
      });
    });

    // 2. Email link clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        track('email_click', {
          event_category: 'contact',
          event_label: link.href.replace('mailto:', ''),
          page_name: pageName
        });
      });
    });

    // 3. CTA button clicks
    // Excludes tel: links (counted as phone_call_click) and submit buttons (counted as generate_lead)
    document.querySelectorAll('.btn').forEach(function (btn) {
      if (btn.tagName === 'BUTTON' && btn.type === 'submit') return;
      var href = btn.getAttribute('href') || '';
      if (href.startsWith('tel:')) return;
      btn.addEventListener('click', function () {
        track('cta_click', {
          event_category: 'engagement',
          event_label: btn.textContent.trim().slice(0, 60),
          cta_destination: href,
          page_name: pageName
        });
      });
    });

    // 4. Service card clicks
    document.querySelectorAll('.services-hub-card, .project-related-service-card').forEach(function (el) {
      el.addEventListener('click', function () {
        var titleEl = el.querySelector('h2, h3');
        track('service_card_click', {
          event_category: 'navigation',
          event_label: titleEl ? titleEl.textContent.trim().slice(0, 60) : el.getAttribute('href'),
          link_url: el.getAttribute('href') || '',
          page_name: pageName
        });
      });
    });

    // 5. Project card clicks
    document.querySelectorAll('.projects-hub-card').forEach(function (el) {
      el.addEventListener('click', function () {
        var titleEl = el.querySelector('h2');
        track('project_card_click', {
          event_category: 'navigation',
          event_label: titleEl ? titleEl.textContent.trim().slice(0, 60) : el.getAttribute('href'),
          link_url: el.getAttribute('href') || '',
          page_name: pageName
        });
      });
    });

    // 6. Facebook / social link clicks
    document.querySelectorAll('a[href*="facebook.com"]').forEach(function (link) {
      link.addEventListener('click', function () {
        track('social_click', {
          event_category: 'social',
          event_label: 'facebook',
          page_name: pageName
        });
      });
    });

    // 7. FAQ accordion interactions — fires only on open
    document.querySelectorAll('.framing-faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.framing-faq-item');
        var isOpening = item && !item.classList.contains('active');
        if (isOpening) {
          var questionSpan = btn.querySelector('span:first-child');
          var label = questionSpan ? questionSpan.textContent.trim() : btn.textContent.trim().slice(0, 80);
          track('faq_open', {
            event_category: 'engagement',
            event_label: label,
            page_name: pageName
          });
        }
      });
    });

    // 8. Contact form: start + submit
    document.querySelectorAll('.contact-form').forEach(function (form) {
      var formStarted = false;
      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('focus', function () {
          if (!formStarted) {
            formStarted = true;
            track('form_start', {
              event_category: 'lead',
              event_label: 'free_quote_form',
              page_name: pageName
            });
          }
        });
      });

      form.addEventListener('submit', function () {
        track('generate_lead', {
          event_category: 'lead',
          event_label: 'free_quote_form',
          page_name: pageName
        });
      });
    });

    // 9. Scroll depth milestones: 25 / 50 / 75 / 100 %
    var milestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = Math.round((scrollTop / docHeight) * 100);
      [25, 50, 75, 100].forEach(function (m) {
        if (!milestones[m] && pct >= m) {
          milestones[m] = true;
          track('scroll_depth', {
            event_category: 'engagement',
            event_label: m + '%',
            value: m,
            page_name: pageName
          });
        }
      });
    }, { passive: true });

  });
})();
