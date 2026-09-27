import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../dist/motion.js', import.meta.url), 'utf8');
const storageKey = 'portfolio-motion-paused';

function page({ reduced = false, width = 1200, storage = new Map(), storageFails = false } = {}) {
  const queries = new Map();
  const events = new Map();
  const classes = () => {
    const values = new Set();
    return { add: value => values.add(value), contains: value => values.has(value),
      toggle: (value, enabled) => enabled ? values.add(value) : values.delete(value) };
  };
  const targets = Array.from({ length: 2 }, () => ({
    classList: classes(), getBoundingClientRect: () => ({ top: 2000 }),
  }));
  const button = { hidden: true, setAttribute(key, value) { this[key] = value; },
    addEventListener(key, callback) { this[key] = callback; } };
  const progress = { style: {}, setAttribute() {} };
  const body = { classList: classes(), append() {} };
  let observer;
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; observer = this; }
    observe() {}
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  const context = {
    matchMedia(query) {
      const media = { matches: query.includes('prefers-reduced-motion') ? reduced : width <= 700,
        addEventListener(event, callback) { this[event] = callback; } };
      queries.set(query, media);
      return media;
    },
    document: { querySelector: () => button, querySelectorAll: () => targets,
      createElement: () => progress, documentElement: { scrollHeight: 3000 }, body },
    localStorage: {
      getItem(key) { if (storageFails) throw Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageFails) throw Error('Storage unavailable'); storage.set(key, value); },
    },
    IntersectionObserver, window: { IntersectionObserver },
    innerHeight: 800, innerWidth: width, scrollY: 0,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    addEventListener: (event, callback) => events.set(event, callback),
  };
  vm.runInNewContext(source, context);
  return {
    button, targets, progress, events,
    paused: () => body.classList.contains('motion-paused'),
    visible: () => targets.every(target => target.classList.contains('is-visible')),
    disconnected: () => observer?.disconnected,
    change(query, matches) { const media = queries.get(query); media.matches = matches; media.change(); },
  };
}

const reducedQuery = '(prefers-reduced-motion: reduce)';
const compactQuery = '(max-width: 700px)';
let test = page({ reduced: true });
assert(test.paused() && test.visible() && test.button.hidden, 'OS preference must apply on load');
test.change(reducedQuery, false);
assert(!test.paused() && !test.button.hidden, 'OS preference changes must restore motion control');
test.change(reducedQuery, true);
assert(test.paused() && test.visible(), 'OS preference changes must reveal all content');

for (const width of [320, 700]) {
  test = page({ width });
  assert(test.paused() && test.visible(), `Motion must reduce at ${width}px`);
}
test = page({ width: 701 });
assert(!test.paused(), 'Desktop motion begins above 700px');
test.change(compactQuery, true);
assert(test.paused() && test.visible() && test.disconnected(), 'Entering mobile must stop pending reveals');
test.change(compactQuery, false);
assert(!test.paused() && test.visible(), 'Leaving mobile must never hide revealed content again');

const storage = new Map();
test = page({ storage });
assert(!test.visible(), 'Offscreen content should be eligible for an initial reveal');
test.button.click();
assert(test.paused() && test.visible() && test.disconnected(), 'Manual pause must reveal all content');
assert.equal(storage.get(storageKey), 'true');
test = page({ storage });
assert(test.paused() && test.visible(), 'Manual preference must survive navigation');
assert.equal(test.button['aria-pressed'], 'true');
test.button.click();
assert(!test.paused());
assert.equal(storage.get(storageKey), 'false');
assert(!page({ storage }).paused(), 'Resuming must persist across pages');

test = page({ storageFails: true });
test.button.click();
assert(test.paused() && test.visible(), 'Unavailable storage must not break the manual control');
test.button.click();
assert(!test.paused());
for (const event of ['hashchange', 'beforeprint']) {
  test = page();
  test.events.get(event)();
  assert(test.visible(), `${event} must expose all content`);
}
console.log('Motion checks passed: OS/mobile preferences, pause persistence, storage fallback, and content visibility.');
