(function () {
  'use strict';
  if (window.VVTracking) return;

  var storageKey = 'vv_internal_browser_v1';
  var gaId = 'G-0G7MC17H0V';
  var pixelId = '1789259645630228';
  var query = new URLSearchParams(window.location.search);
  var command = query.get('vv_owner');
  var internal = false;
  var persistent = false;

  function savedMode() {
    var local = false;
    try { local = window.localStorage.getItem(storageKey) === '1'; } catch (_) {}
    var cookie = false;
    try { cookie = document.cookie.split(';').some(function (part) { return part.trim() === storageKey + '=1'; }); } catch (_) {}
    return local || cookie;
  }

  function saveMode(enabled) {
    var localSaved = false;
    try {
      if (enabled) window.localStorage.setItem(storageKey, '1');
      else window.localStorage.removeItem(storageKey);
      localSaved = window.localStorage.getItem(storageKey) === (enabled ? '1' : null);
    } catch (_) {}
    try {
      document.cookie = storageKey + '=' + (enabled ? '1' : '') + '; Path=/; SameSite=Lax; Max-Age=' +
        (enabled ? '31536000' : '0') + (window.location.protocol === 'https:' ? '; Secure' : '');
    } catch (_) {}
    return localSaved || (enabled && savedMode());
  }

  internal = savedMode();
  persistent = internal;
  if (command === 'on' || command === 'off') {
    internal = command === 'on';
    persistent = saveMode(internal);
    // Do not leak a mode-switch link into analytics, referrers or copied URLs.
    query.delete('vv_owner');
    var remaining = query.toString();
    try { window.history.replaceState(null, '', window.location.pathname + (remaining ? '?' + remaining : '') + window.location.hash); } catch (_) {}
  }

  var state = window.VVTracking = { internal: internal, persistent: persistent };
  window['ga-disable-' + gaId] = internal;

  function showOwnerMode() {
    if (!state.internal || document.getElementById('vv-owner-mode')) return;
    var notice = document.createElement('aside');
    notice.id = 'vv-owner-mode';
    notice.setAttribute('aria-label', 'Owner browsing mode');
    notice.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;z-index:10000;padding:12px 16px;background:#0b2a4a;color:#fff;border:2px solid #ed7c0e;border-radius:8px;font:14px/1.5 system-ui,sans-serif;box-shadow:0 4px 20px #0004;display:flex;align-items:center;gap:16px;flex-wrap:wrap';
    var text = document.createElement('span');
    text.textContent = 'Режим владельца: аналитика и рекламные пиксели выключены.' +
      (state.persistent ? '' : ' Браузер не сохранил настройку — откройте служебную ссылку заново при следующем посещении.');
    var exit = document.createElement('button');
    exit.type = 'button';
    exit.textContent = 'Выключить режим';
    exit.style.cssText = 'background:#fff;color:#0b2a4a;border:0;border-radius:4px;padding:8px 12px;font:inherit;font-weight:700;cursor:pointer';
    exit.addEventListener('click', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('vv_owner', 'off');
      window.location.assign(url.href);
    });
    notice.appendChild(text);
    notice.appendChild(exit);
    document.body.appendChild(notice);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showOwnerMode);
  else showOwnerMode();

  // A newly marked tab also stops further events in already-open tabs.
  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey) return;
    if (event.newValue === '1') {
      state.internal = true;
      state.persistent = true;
      window['ga-disable-' + gaId] = true;
      try { if (window.fbq) window.fbq('consent', 'revoke'); } catch (_) {}
      showOwnerMode();
    } else if (state.internal) {
      window.location.reload();
    }
  });

  // This decision happens synchronously in <head>, before either platform loads.
  if (internal) return;

  function load(src) {
    var script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId);
  load('https://www.googletagmanager.com/gtag/js?id=' + gaId);

  if (!window.fbq) {
    var fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    window._fbq = window._fbq || fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
  }
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
  load('https://connect.facebook.net/en_US/fbevents.js');
})();
