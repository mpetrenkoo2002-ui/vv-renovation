(function () {
  function track(eventName, params) {
    try {
      if (typeof gtag === 'function') gtag('event', eventName, params);
    } catch (_) { /* A blocked tracker must not interrupt a quote request. */ }
  }

  var pageName = window.location.pathname.replace(/^.*\//, '') || 'index.html';

  var attributionKey = 'vv_quote_attribution_v1';
  var attributionLifetime = 30 * 24 * 60 * 60 * 1000;
  var campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var clickKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'li_fat_id'];
  var gaClientId = '';

  function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maxLength || 300);
  }

  function pageUrl(value) {
    try {
      var url = new URL(value);
      return /^https?:$/.test(url.protocol) ? clean(url.origin + url.pathname, 700) : '';
    } catch (_) { return ''; }
  }

  function host(value) {
    try { return new URL(value).hostname.replace(/^www\./, ''); }
    catch (_) { return ''; }
  }

  function sourceFor(referrerHost) {
    if (/^maps\.google\.[a-z.]+$/.test(referrerHost) || referrerHost === 'maps.app.goo.gl') return ['google_maps', 'organic'];
    if (/^google\.[a-z.]+$/.test(referrerHost)) return ['google', 'organic'];
    if (/(^|\.)(bing\.com|search\.yahoo\.com|duckduckgo\.com)$/.test(referrerHost)) {
      return [referrerHost.replace(/^search\./, '').split('.')[0], 'organic'];
    }
    if (/(^|\.)facebook\.com$/.test(referrerHost) || referrerHost === 'fb.com') return ['facebook', 'social'];
    if (/(^|\.)instagram\.com$/.test(referrerHost)) return ['instagram', 'social'];
    if (/(^|\.)tiktok\.com$/.test(referrerHost)) return ['tiktok', 'social'];
    if (/(^|\.)linkedin\.com$/.test(referrerHost) || referrerHost === 'lnkd.in') return ['linkedin', 'social'];
    return referrerHost ? [referrerHost, 'referral'] : ['direct_or_unattributed', 'unknown'];
  }

  function newTouch() {
    var query = new URLSearchParams(window.location.search);
    var referrer = pageUrl(document.referrer);
    var external = referrer && host(referrer) !== host(window.location.href);
    var inferred = sourceFor(external ? host(referrer) : '');
    if (external && /^google\.[a-z.]+$/.test(host(referrer)) && /^\/maps(?:\/|$)/.test(new URL(referrer).pathname)) {
      inferred = ['google_maps', 'organic'];
    }
    var touch = {
      source: inferred[0], medium: inferred[1], landing_page: pageUrl(window.location.href),
      referrer: external ? referrer : '', seen_at: new Date().toISOString()
    };
    campaignKeys.concat(clickKeys).forEach(function (key) {
      touch[key] = clean(query.get(key));
    });
    if (touch.utm_source) touch.source = touch.utm_source;
    if (touch.utm_medium) touch.medium = touch.utm_medium;
    if (!touch.utm_source && (touch.gclid || touch.gbraid || touch.wbraid)) touch.source = 'google';
    if (!touch.utm_medium && (touch.gclid || touch.gbraid || touch.wbraid)) touch.medium = 'paid';
    // A Facebook click ID can also come from an unpaid post.
    if (!touch.utm_source && touch.fbclid && !external) touch.source = 'meta';
    if (!touch.utm_medium && touch.fbclid) touch.medium = 'social';
    if (!touch.utm_source && touch.ttclid) touch.source = 'tiktok';
    if (!touch.utm_source && touch.li_fat_id) touch.source = 'linkedin';
    return { touch: touch, newSource: Boolean(external || campaignKeys.concat(clickKeys).some(function (key) { return touch[key]; })) };
  }

  function getAttribution() {
    var incoming = newTouch();
    var saved;
    try { saved = JSON.parse(window.localStorage.getItem(attributionKey)); } catch (_) { /* Storage can be unavailable. */ }
    var now = Date.now();
    if (!saved || !saved.first || typeof saved.first !== 'object' || !saved.last ||
        typeof saved.last !== 'object' || !Number.isFinite(saved.expires_at) || now >= saved.expires_at) {
      saved = { first: incoming.touch, last: incoming.touch, expires_at: now + attributionLifetime };
    } else if (incoming.newSource) {
      saved.last = incoming.touch;
    }
    try { window.localStorage.setItem(attributionKey, JSON.stringify(saved)); } catch (_) { /* Keep the current-page attribution. */ }
    return saved;
  }

  var attribution = getAttribution();

  function newLeadId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'vv-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function setField(form, name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.appendChild(input);
    }
    input.value = clean(value, 700);
  }

  function addAttribution(form, leadId) {
    var first = attribution.first;
    var last = attribution.last;
    var fields = {
      lead_id: leadId, lead_source: last.source, lead_medium: last.medium,
      lead_campaign: last.utm_campaign, landing_page: last.landing_page, referrer: last.referrer,
      first_source: first.source, first_medium: first.medium, first_campaign: first.utm_campaign,
      first_landing_page: first.landing_page, first_referrer: first.referrer, first_seen_at: first.seen_at,
      form_page: pageUrl(window.location.href), ga_client_id: gaClientId
    };
    campaignKeys.concat(clickKeys).forEach(function (key) { fields[key] = last[key]; });
    Object.keys(fields).forEach(function (key) { setField(form, key, fields[key]); });
  }

  function trackAcceptedLead(leadId) {
    // Send attribution and a random ID only; never send the customer's form fields.
    var params = {
      event_category: 'lead', lead_type: 'quote_form_accepted', lead_id: leadId,
      lead_source: clean(attribution.last.source), lead_medium: clean(attribution.last.medium),
      lead_campaign: clean(attribution.last.utm_campaign), page_name: pageName
    };
    track('generate_lead', params);
    try {
      if (typeof fbq === 'function') fbq('track', 'Lead', { lead_id: leadId, content_name: pageName }, { eventID: leadId });
    } catch (_) { /* Formspree acceptance does not depend on Meta. */ }
  }

  function setupQuoteForm(form) {
    var leadId = newLeadId();
    var pending = false;
    var accepted = false;
    addAttribution(form, leadId);
    var formStarted = false;
    form.addEventListener('focusin', function (event) {
      if (!formStarted && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) {
        formStarted = true;
        track('form_start', { event_category: 'lead', event_label: 'free_quote_form', page_name: pageName });
      }
    });
    var endpoint;
    try { endpoint = new URL(form.action); } catch (_) { return; }
    // Preserve native submission for other destinations and browsers without AJAX support.
    if (endpoint.origin !== 'https://formspree.io' || !/^\/f\/[a-z]+$/.test(endpoint.pathname) ||
        !window.fetch || !window.FormData) return;

    var status = document.createElement('p');
    status.className = 'quote-request-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.appendChild(status);
    var buttons = Array.from(form.querySelectorAll('button[type="submit"], input[type="submit"]'));
    var initialDisabled = buttons.map(function (button) { return button.disabled; });

    form.addEventListener('submit', async function (event) {
      if (event.defaultPrevented) return;
      event.preventDefault();
      if (pending || accepted) return;
      if (form.checkValidity && !form.checkValidity()) { form.reportValidity(); return; }
      pending = true;
      addAttribution(form, leadId);
      var payload = new window.FormData(form);
      buttons.forEach(function (button) { button.disabled = true; });
      form.setAttribute('aria-busy', 'true');
      status.hidden = false;
      status.setAttribute('role', 'status');
      status.textContent = 'Sending your request…';
      var controller = window.AbortController ? new window.AbortController() : null;
      var timeout = controller ? window.setTimeout(function () { controller.abort(); }, 20000) : null;
      try {
        var response = await window.fetch(endpoint.href, {
          method: 'POST', body: payload, headers: { Accept: 'application/json' },
          signal: controller ? controller.signal : undefined
        });
        var result = await response.json();
        if (!response.ok || !result || result.ok === false || result.errors) throw new Error('Request not accepted');
        accepted = true;
        trackAcceptedLead(leadId);
        form.reset();
        status.textContent = 'Thank you — your request has been received. We’ll contact you shortly.';
      } catch (_) {
        status.setAttribute('role', 'alert');
        status.textContent = 'We couldn’t confirm your request. Please try again or call us using the number above.';
      } finally {
        if (timeout !== null) window.clearTimeout(timeout);
        pending = false;
        form.removeAttribute('aria-busy');
        if (!accepted) buttons.forEach(function (button, index) { button.disabled = initialDisabled[index]; });
      }
    });
  }

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

    // 8. Quote requests: persist attribution and count only confirmed acceptance.
    document.querySelectorAll('.contact-form').forEach(setupQuoteForm);
    try {
      if (typeof gtag === 'function') gtag('get', 'G-0G7MC17H0V', 'client_id', function (clientId) {
        gaClientId = clean(clientId, 100);
        document.querySelectorAll('.contact-form').forEach(function (form) { setField(form, 'ga_client_id', gaClientId); });
      });
    } catch (_) { /* Attribution in Formspree still works without GA4. */ }

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
