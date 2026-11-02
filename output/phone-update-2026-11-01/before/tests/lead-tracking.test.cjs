const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const script = fs.readFileSync(path.join(__dirname, '../js/analytics.js'), 'utf8');

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.listeners = {};
    this.attributes = {};
    this.value = '';
    this.disabled = false;
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  getAttribute(name) { return this.attributes[name]; }
}

function harness(options = {}) {
  const stored = options.stored || new Map();
  const events = [];
  const metaEvents = [];
  const requests = [];
  const form = new Element('form');
  const button = new Element('button');
  const phone = new Element('a');
  const email = new Element('a');
  phone.href = 'tel:+17782667999';
  email.href = 'mailto:volodymyr@vvrenovation.ca';
  form.action = options.endpoint || 'https://formspree.io/f/mqedjzqz';
  form.fields = new Map();
  form.status = null;
  form.resetCount = 0;
  for (const [name, value] of Object.entries({ name: 'Fixture Person', email: 'fixture@example.test', phone: '5555555555', message: 'Fixture message' })) {
    const field = new Element('input');
    Object.assign(field, { name, value });
    form.fields.set(name, field);
  }
  form.querySelector = selector => {
    const name = /input\[name="([^"]+)"\]/.exec(selector)?.[1];
    return form.fields.get(name) || null;
  };
  form.querySelectorAll = () => [button];
  form.appendChild = element => {
    if (element.tagName === 'INPUT') form.fields.set(element.name, element);
    else form.status = element;
  };
  form.checkValidity = () => options.valid !== false;
  form.reportValidity = () => {};
  form.reset = () => {
    form.resetCount++;
    for (const field of form.fields.values()) if (field.type !== 'hidden') field.value = '';
  };
  const callbacks = {};
  const document = {
    referrer: options.referrer || '',
    addEventListener: (name, callback) => { callbacks[name] = callback; },
    querySelectorAll: selector => selector === '.contact-form' ? [form]
      : selector === 'a[href^="tel:"]' ? [phone]
      : selector === 'a[href^="mailto:"]' ? [email] : [],
    createElement: name => new Element(name),
  };
  let count = 0;
  const window = {
    VVTracking: { internal: Boolean(options.internal) },
    location: new URL(options.url || 'https://www.vvrenovation.ca/'),
    localStorage: {
      getItem: key => { if (options.blockStorage) throw Error('blocked'); return stored.get(key) || null; },
      setItem: (key, value) => { if (options.blockStorage) throw Error('blocked'); stored.set(key, value); },
    },
    crypto: { randomUUID: () => `00000000-0000-4000-8000-${String(++count).padStart(12, '0')}` },
    FormData: class {
      constructor(source) { this.values = new Map([...source.fields].map(([key, field]) => [key, field.value])); }
      get(key) { return this.values.get(key); }
    },
    fetch: async (url, init) => {
      requests.push({ url, body: init.body, init });
      return options.fetch ? options.fetch(url, init) : { ok: true, json: async () => ({ ok: true }) };
    },
    AbortController, setTimeout, clearTimeout,
    addEventListener() {},
  };
  const context = {
    document, window, URL, URLSearchParams,
    gtag: (...args) => {
      if (options.blockAnalytics) throw Error('blocked');
      if (args[0] === 'event') events.push({ name: args[1], params: args[2] });
      if (args[0] === 'get') args[3]('1234.5678');
    },
    fbq: (...args) => { if (options.blockAnalytics) throw Error('blocked'); metaEvents.push(args); },
  };
  vm.runInNewContext(script, context);
  callbacks.DOMContentLoaded();
  return {
    form, button, phone, email, stored, events, metaEvents, requests,
    field: name => form.fields.get(name)?.value,
    submit: async () => {
      const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
      if (form.listeners.submit) await form.listeners.submit(event);
      return event;
    },
  };
}

test('accepted request stores attribution and uses the same lead ID in Formspree, GA4 and Meta', async () => {
  const h = harness({ url: 'https://www.vvrenovation.ca/richmond-home-renovation?utm_source=instagram&utm_medium=paid_social&utm_campaign=richmond&fbclid=click-123' });
  await h.submit();
  const body = h.requests[0].body;
  assert.equal(body.get('lead_source'), 'instagram');
  assert.equal(body.get('lead_medium'), 'paid_social');
  assert.equal(body.get('lead_campaign'), 'richmond');
  assert.equal(body.get('ga_client_id'), '1234.5678');
  assert.equal(body.get('fbclid'), 'click-123');
  assert.equal(body.get('landing_page'), 'https://www.vvrenovation.ca/richmond-home-renovation');
  assert.equal(h.events.length, 1);
  assert.equal(h.events[0].name, 'generate_lead');
  assert.equal(h.events[0].params.lead_id, body.get('lead_id'));
  assert.equal(h.metaEvents[0][1], 'Lead');
  assert.equal(h.metaEvents[0][3].eventID, body.get('lead_id'));
  assert.equal(h.form.resetCount, 1);
  assert.equal(h.button.disabled, true);
  assert.match(h.form.status.textContent, /received/);
  const analyticsData = JSON.stringify([h.events, h.metaEvents]);
  for (const personalValue of ['Fixture Person', 'fixture@example.test', '5555555555', 'Fixture message']) {
    assert.equal(analyticsData.includes(personalValue), false);
  }
});

test('a failed request retains the customer input and retries with the same ID', async () => {
  let fail = true;
  const h = harness({ fetch: async () => { if (fail) throw Error('network'); return { ok: true, json: async () => ({ ok: true }) }; } });
  await h.submit();
  assert.equal(h.events.length, 0);
  assert.equal(h.metaEvents.length, 0);
  assert.equal(h.form.resetCount, 0);
  assert.equal(h.field('message'), 'Fixture message');
  assert.equal(h.button.disabled, false);
  assert.equal(h.form.status.attributes.role, 'alert');
  fail = false;
  await h.submit();
  assert.equal(h.requests[0].body.get('lead_id'), h.requests[1].body.get('lead_id'));
  assert.equal(h.events.length, 1);
});

test('HTTP errors and Formspree validation errors never count as leads', async () => {
  for (const response of [{ ok: false, json: async () => ({ errors: [{ message: 'Invalid' }] }) },
    { ok: true, json: async () => ({ ok: false }) },
    { ok: true, json: async () => { throw Error('Invalid JSON'); } }]) {
    const h = harness({ fetch: async () => response });
    await h.submit();
    assert.equal(h.events.length, 0);
    assert.equal(h.metaEvents.length, 0);
    assert.equal(h.form.resetCount, 0);
    assert.equal(h.button.disabled, false);
  }
});

test('duplicate clicks while pending and after acceptance do not submit twice', async () => {
  let finish;
  const h = harness({ fetch: () => new Promise(resolve => { finish = resolve; }) });
  const first = h.submit();
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.events.length, 0);
  finish({ ok: true, json: async () => ({ ok: true }) });
  await first;
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.events.length, 1);
});

test('first attribution survives navigation, while a later campaign updates the last source', () => {
  const first = harness({ referrer: 'https://www.google.ca/search?q=renovation' });
  const internal = harness({ stored: first.stored, url: 'https://www.vvrenovation.ca/painting', referrer: 'https://vvrenovation.ca/' });
  assert.equal(internal.field('first_source'), 'google');
  assert.equal(internal.field('lead_source'), 'google');
  assert.equal(internal.field('first_medium'), 'organic');
  const campaign = harness({ stored: first.stored, url: 'https://www.vvrenovation.ca/?utm_source=facebook&utm_medium=paid_social&utm_campaign=return' });
  assert.equal(campaign.field('first_source'), 'google');
  assert.equal(campaign.field('lead_source'), 'facebook');
  const direct = harness({ stored: first.stored });
  assert.equal(direct.field('lead_source'), 'facebook');
});

test('storage and ad blockers do not prevent accepted requests', async () => {
  const h = harness({ blockStorage: true, blockAnalytics: true, referrer: 'https://www.google.ca/' });
  await h.submit();
  assert.equal(h.requests[0].body.get('lead_source'), 'google');
  assert.equal(h.form.resetCount, 1);
  assert.match(h.form.status.textContent, /received/);
});

test('unmarked visits stay explicitly unattributed, and a Meta click alone does not claim Facebook over Instagram', () => {
  assert.equal(harness().field('lead_source'), 'direct_or_unattributed');
  assert.equal(harness({ url: 'https://www.vvrenovation.ca/?fbclid=abc' }).field('lead_source'), 'meta');
  assert.equal(harness({ url: 'https://www.vvrenovation.ca/?fbclid=abc', referrer: 'https://l.instagram.com/' }).field('lead_source'), 'instagram');
});

test('Google Maps referrers and tagged business profile links are distinguishable from Google Search', () => {
  assert.equal(harness({ referrer: 'https://maps.google.ca/' }).field('lead_source'), 'google_maps');
  assert.equal(harness({ referrer: 'https://www.google.com/maps/place/vv' }).field('lead_source'), 'google_maps');
  const tagged = harness({ url: 'https://www.vvrenovation.ca/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile' });
  assert.equal(tagged.field('lead_campaign'), 'google_business_profile');
  assert.equal(harness({ referrer: 'https://mail.google.com/' }).field('lead_medium'), 'referral');
});

test('landing and referring URLs exclude unrelated queries and fragments', () => {
  const h = harness({ url: 'https://www.vvrenovation.ca/?email=private@example.test&token=secret#private', referrer: 'https://example.test/page?token=secret#private' });
  assert.equal(h.field('landing_page'), 'https://www.vvrenovation.ca/');
  assert.equal(h.field('referrer'), 'https://example.test/page');
  assert.equal(h.form.fields.has('token'), false);
});

test('expired or corrupt attribution is replaced', () => {
  for (const value of ['invalid JSON', JSON.stringify({ first: {}, last: {}, expires_at: Date.now() - 1 })]) {
    const stored = new Map([['vv_quote_attribution_v1', value]]);
    assert.equal(harness({ stored, referrer: 'https://www.google.ca/' }).field('first_source'), 'google');
  }
});

test('phone and email clicks remain contact actions and are not quote leads', () => {
  const h = harness();
  h.phone.listeners.click();
  h.email.listeners.click();
  assert.equal(h.events.map(event => event.name).join(','), 'phone_call_click,email_click');
  assert.equal(h.metaEvents.map(event => event[1]).join(','), 'PhoneClick,EmailClick');
  assert.ok(h.metaEvents.every(event => event[0] === 'trackCustom'));
  assert.ok(h.events.every(event => event.name !== 'generate_lead'));
});

test('phone clicks retain first/last attribution, destination and Vancouver business time', () => {
  const stored = new Map();
  harness({ stored, url: 'https://www.vvrenovation.ca/?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile' });
  const h = harness({ stored, url: 'https://www.vvrenovation.ca/painting?utm_source=google&utm_medium=cpc&utm_campaign=painting' });
  h.phone.closest = selector => selector === '#home, .hero' ? {} : null;
  h.phone.listeners.click();
  const event = h.events[0];
  assert.equal(event.name, 'phone_call_click');
  assert.equal(event.params.contact_source, 'google');
  assert.equal(event.params.first_source, 'instagram');
  assert.equal(event.params.contact_campaign, 'painting');
  assert.equal(event.params.contact_destination, '+17782667999');
  assert.equal(event.params.contact_location, 'hero');
  assert.equal(event.params.business_timezone, 'America/Vancouver');
  assert.match(event.params.business_hour, /^(0\d|1\d|2[0-3])$/);
  assert.match(event.params.interaction_time_utc, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(h.metaEvents[0][3].eventID, event.params.interaction_id);
  const data = JSON.stringify([h.events, h.metaEvents]);
  for (const customerValue of ['Fixture Person', 'fixture@example.test', '5555555555', 'Fixture message']) assert.ok(!data.includes(customerValue));
});

test('owner mode preserves working forms but suppresses contact and accepted-lead analytics', async () => {
  const h = harness({ internal: true });
  h.phone.listeners.click();
  h.email.listeners.click();
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.field('traffic_type'), 'internal');
  assert.equal(h.field('lead_source'), 'internal');
  assert.equal(h.form.resetCount, 1);
  assert.equal(h.events.length, 0);
  assert.equal(h.metaEvents.length, 0);
  assert.equal(h.stored.size, 0);
});

test('invalid forms and non-Formspree destinations do not produce accepted leads', async () => {
  const invalid = harness({ valid: false });
  await invalid.submit();
  assert.equal(invalid.requests.length, 0);
  const native = harness({ endpoint: 'https://example.test/contact' });
  assert.equal((await native.submit()).defaultPrevented, false);
  assert.equal(native.requests.length, 0);
});
