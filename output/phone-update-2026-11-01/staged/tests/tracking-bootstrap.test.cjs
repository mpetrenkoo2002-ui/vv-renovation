const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const script = fs.readFileSync(path.join(__dirname, '../js/tracking-bootstrap.js'), 'utf8');
const key = 'vv_internal_browser_v1';

function browser(options = {}) {
  const stored = options.stored || new Map();
  const cookies = options.cookies || new Map();
  const loaded = [];
  const body = [];
  const callbacks = {};
  let reloads = 0;
  const document = {
    readyState: 'loading',
    addEventListener: (name, cb) => { callbacks[name] = cb; },
    getElementById: id => body.find(el => el.id === id),
    createElement: tag => ({ tag, style: {}, children: [], setAttribute() {}, addEventListener() {}, appendChild(el) { this.children.push(el); } }),
    head: { appendChild: el => loaded.push(el.src) },
    body: { appendChild: el => body.push(el) },
  };
  Object.defineProperty(document, 'cookie', {
    get() { if (options.blockCookies) throw Error('cookies blocked'); return [...cookies].map(([k,v]) => k + '=' + v).join('; '); },
    set(value) {
      if (options.blockCookies) throw Error('cookies blocked');
      const [pair] = value.split(';');
      const [k,v] = pair.split('=');
      if (value.includes('Max-Age=0')) cookies.delete(k); else cookies.set(k,v);
    },
  });
  const window = {
    location: new URL(options.url || 'https://www.vvrenovation.ca/'),
    localStorage: {
      getItem(k) { if (options.blockStorage) throw Error('storage blocked'); return stored.get(k) || null; },
      setItem(k,v) { if (options.blockStorage) throw Error('storage blocked'); stored.set(k,v); },
      removeItem(k) { if (options.blockStorage) throw Error('storage blocked'); stored.delete(k); },
    },
    addEventListener: (name, cb) => { callbacks[name] = cb; },
    history: { replaceState(_a,_b,url) { window.location = new URL(url, window.location); } },
  };
  const reload = () => { reloads++; };
  Object.defineProperty(window.location, 'reload', { value: reload });
  const context = vm.createContext({window, document, URL, URLSearchParams});
  vm.runInContext(script, context);
  return { window, stored, cookies, loaded, body, callbacks, run: () => vm.runInContext(script, context), reloads: () => reloads };
}

test('public browsing initializes each existing tracker once, including when evaluated twice', () => {
  const h = browser();
  h.run();
  assert.equal(h.loaded.length, 2);
  assert.equal(h.loaded.filter(url => url.includes('gtag/js')).length, 1);
  assert.equal(h.window.fbq.queue.filter(event => event[1] === 'PageView').length, 1);
  assert.equal(h.window.dataLayer.filter(event => event[0] === 'config').length, 1);
});

test('owner activation runs before trackers, persists, removes only the control query and shows status', () => {
  const h = browser({ url: 'https://www.vvrenovation.ca/?vv_owner=on&utm_source=instagram#contact' });
  assert.equal(h.window.VVTracking.internal, true);
  assert.equal(h.window.VVTracking.persistent, true);
  assert.equal(h.loaded.length, 0);
  assert.equal(h.window.fbq, undefined);
  assert.equal(h.window.gtag, undefined);
  assert.equal(h.window.location.search, '?utm_source=instagram');
  assert.equal(h.window.location.hash, '#contact');
  h.callbacks.DOMContentLoaded();
  assert.equal(h.body[0].id, 'vv-owner-mode');
  const nextPage = browser({stored:h.stored, cookies:h.cookies, url:'https://www.vvrenovation.ca/painting'});
  assert.equal(nextPage.loaded.length, 0);
  assert.equal(nextPage.window.VVTracking.internal, true);
});

test('mode survives unavailable localStorage through first-party cookie fallback', () => {
  const h = browser({blockStorage:true,url:'https://www.vvrenovation.ca/?vv_owner=on'});
  const next = browser({blockStorage:true,cookies:h.cookies});
  assert.equal(next.window.VVTracking.internal, true);
  assert.equal(next.loaded.length, 0);
});

test('current owner visit stays suppressed even when all persistence is blocked', () => {
  const h = browser({blockStorage:true,blockCookies:true,url:'https://www.vvrenovation.ca/?vv_owner=on'});
  assert.equal(h.window.VVTracking.internal, true);
  assert.equal(h.window.VVTracking.persistent, false);
  assert.equal(h.loaded.length, 0);
  h.callbacks.DOMContentLoaded();
  assert.match(h.body[0].children[0].textContent, /не сохранил/);
});

test('owner exit clears both persistence mechanisms and resumes normal tracking', () => {
  const h = browser({stored:new Map([[key,'1']]),cookies:new Map([[key,'1']]),url:'https://www.vvrenovation.ca/?vv_owner=off'});
  assert.equal(h.window.VVTracking.internal, false);
  assert.equal(h.stored.has(key), false);
  assert.equal(h.cookies.has(key), false);
  assert.equal(h.loaded.length, 2);
});

test('a storage change suppresses future tracking in already-open public tabs', () => {
  const h = browser();
  h.callbacks.storage({key,newValue:'1'});
  assert.equal(h.window.VVTracking.internal, true);
  assert.equal(h.window['ga-disable-G-0G7MC17H0V'], true);
  assert.equal(h.window.fbq.queue.at(-1)[0], 'consent');
  assert.equal(h.window.fbq.queue.at(-1)[1], 'revoke');
});

test('all public tracked pages share the synchronous bootstrap and no duplicate inline initializers', () => {
  const root = path.join(__dirname,'..');
  const pages = fs.readdirSync(root).filter(file => file.endsWith('.html')).map(file => ({file,html:fs.readFileSync(path.join(root,file),'utf8')})).filter(p => p.html.includes('js/analytics.js'));
  assert.equal(pages.length,14);
  for (const {file,html} of pages) {
    assert.equal((html.match(/<script src="js\/tracking-bootstrap\.js/g) || []).length,1,file);
    assert.ok(html.indexOf('js/tracking-bootstrap.js') < html.indexOf('</head>'),file);
    assert.ok(!/gtag\('config'|fbq\('init'/.test(html),file);
  }
});
