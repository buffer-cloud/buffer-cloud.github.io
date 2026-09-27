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
  const style = () => ({ setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; } });
  const targets = Array.from({ length: 2 }, () => ({
    classList: classes(), style: style(), matches: selector => selector === '.project-tile', getBoundingClientRect: () => ({ top: 2000 }),
  }));
  targets.forEach(target => { target.parentElement = { querySelectorAll: () => targets }; });
  const hero = { style: style() };
  const frames = new Map();
  let frameId = 0;
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
    document: { querySelector: selector => selector === '.hero-circuit' ? hero : button, querySelectorAll: () => targets,
      createElement: () => progress, documentElement: { scrollHeight: 3000 }, body },
    localStorage: {
      getItem(key) { if (storageFails) throw Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageFails) throw Error('Storage unavailable'); storage.set(key, value); },
    },
    IntersectionObserver, window: { IntersectionObserver },
    innerHeight: 800, innerWidth: width, scrollY: 0,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; }, cancelAnimationFrame(id) { frames.delete(id); },
    addEventListener: (event, callback) => events.set(event, callback),
  };
  vm.runInNewContext(source, context);
  return {
    button, targets, progress, events, hero,
    frame() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); },
    scroll(value) { context.scrollY = value; events.get('scroll')(); },
    intersect() { observer.callback(targets.map(target => ({ target, isIntersecting: true }))); },
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
  assert(!test.paused() && !test.button.hidden, `Aesthetic motion and pause control remain available at ${width}px`);
  test.scroll(800);
  test.frame();
  assert.equal(test.hero.style.transform, 'translateY(0px)', 'Mobile disables only hero parallax');
  test.button.click();
  assert(test.paused() && test.visible(), 'Mobile pause must reveal all content');
}
test = page({ width: 701 });
test.scroll(800);
test.frame();
assert.equal(test.hero.style.transform, 'translateY(24px)', 'Desktop parallax must be bounded');
assert.equal(test.targets[1].style['--reveal-delay'], '80ms', 'Project cards use restrained stagger');
test.change(compactQuery, true);
test.frame();
assert(!test.paused(), 'Entering mobile must retain aesthetic motion');
assert.equal(test.hero.style.transform, 'translateY(0px)', 'Entering mobile resets parallax');
test.intersect();
assert(test.visible(), 'Observed content becomes visible');
test.change(compactQuery, false);
assert(!test.paused() && test.visible(), 'Leaving mobile must never hide revealed content again');
test.button.click();
assert.equal(test.hero.style.transform, undefined, 'Pausing clears hero parallax');

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
console.log('Motion checks passed: OS preferences, mobile motion, bounded parallax, pause persistence, storage fallback, and content visibility.');
