/* Progressive enhancement: all content is visible without JavaScript. */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = matchMedia('(max-width: 700px)');
  const heroCircuit = document.querySelector('.hero-circuit');
  const toggle = document.querySelector('.motion-toggle');
  const targets = [...document.querySelectorAll('.project-tile, .home-about, .contact, .case-page-body > div, .project-gallery, .detail-code, .about-experience, .education, .detail-visual')];
  const storageKey = 'portfolio-motion-paused';
  let manualPause = false;
  try { manualPause = localStorage.getItem(storageKey) === 'true'; } catch { /* Storage may be unavailable. */ }
  let observer;
  let frame = 0;
  let paused = true;
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const showContent = () => {
    observer?.disconnect();
    targets.forEach(target => target.classList.add('is-visible'));
  };
  const updateProgress = () => {
    frame = 0;
    if (paused) return;
    const range = document.documentElement.scrollHeight - innerHeight;
    const fraction = range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    if (heroCircuit) {
      const offset = compactScreen.matches ? 0 : Math.min(24, Math.max(0, scrollY) * 0.045);
      heroCircuit.style.transform = `translateY(${offset}px)`;
    }
  };
  const requestProgress = () => {
    if (!paused && !frame) frame = requestAnimationFrame(updateProgress);
  };
  const applyPreference = () => {
    const automaticPause = reducedMotion.matches;
    paused = manualPause || automaticPause;
    document.body.classList.toggle('motion-paused', paused);
    progress.hidden = paused;
    if (toggle) {
      // Respect the operating system; mobile visitors keep the same pause control.
      toggle.hidden = automaticPause;
      toggle.setAttribute('aria-pressed', String(manualPause));
      toggle.textContent = manualPause ? 'Resume animation' : 'Pause animation';
    }
    if (paused) {
      cancelAnimationFrame(frame);
      frame = 0;
      heroCircuit?.style.removeProperty('transform');
      showContent();
    } else {
      requestProgress();
    }
  };

  applyPreference();
  if (!paused && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    targets.forEach(target => {
      if (target.matches('.project-tile')) {
        const cards = [...target.parentElement.querySelectorAll('.project-tile')];
        target.style.setProperty('--reveal-delay', `${(cards.indexOf(target) % 2) * 80}ms`);
      }
      // Do not hide anything visible on load, including fragment destinations.
      if (target.getBoundingClientRect().top < innerHeight) return;
      target.classList.add('reveal-ready');
      observer.observe(target);
    });
  }
  toggle?.addEventListener('click', () => {
    manualPause = !manualPause;
    try { localStorage.setItem(storageKey, String(manualPause)); } catch { /* Keep the preference for this page. */ }
    applyPreference();
  });
  reducedMotion.addEventListener('change', applyPreference);
  compactScreen.addEventListener('change', applyPreference);
  addEventListener('scroll', requestProgress, { passive: true });
  addEventListener('resize', requestProgress, { passive: true });
  addEventListener('beforeprint', showContent);
  addEventListener('hashchange', () => {
    // Native anchor navigation should never land on a hidden reveal.
    showContent();
    requestProgress();
  });
})();
