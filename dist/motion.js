/* Progressive enhancement: every page remains usable without motion or JavaScript. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const paused = document.body.classList.toggle('motion-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume animation' : 'Pause animation';
    });
  }
  if (preference.matches) { if (toggle) toggle.hidden = true; return; }
  const targets = document.querySelectorAll('.project-tile, .home-about, .contact, .case-page-body > div, .project-gallery, .detail-code, .about-experience, .education, .detail-visual');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach((target, index) => {
      // Keep content already on screen visible, including native fragment navigation.
      if (target.getBoundingClientRect().top < innerHeight * .92) return;
      target.classList.add('reveal-ready');
      if (target.classList.contains('project-tile')) target.style.setProperty('--reveal-delay', `${index % 2 * 100}ms`);
      observer.observe(target);
    });
    preference.addEventListener('change', () => {
      if (preference.matches) { observer.disconnect(); targets.forEach(target => target.classList.add('is-visible')); }
    });
    addEventListener('beforeprint', () => targets.forEach(target => target.classList.add('is-visible')));
  }
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const circuit = document.querySelector('.hero-circuit');
  let waiting = false;
  const update = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    if (circuit && !preference.matches && !document.body.classList.contains('motion-paused') && innerWidth > 700 && scrollY < innerHeight) circuit.style.transform = `translateY(${scrollY * .14}px)`;
    waiting = false;
  };
  addEventListener('scroll', () => { if (!waiting) { waiting = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
