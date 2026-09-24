// Progressive enhancement only: case studies and navigation work without JavaScript.
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scenes = document.querySelectorAll('.project');
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('in-view', entry.isIntersecting);
  }, { threshold: 0.12 });
  scenes.forEach(scene => observer.observe(scene));
}
for (const details of document.querySelectorAll('details')) {
  details.addEventListener('toggle', () => {
    if (details.open) history.replaceState(null, '', `#${details.id}`);
  });
}
function openLinkedCase() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) target.open = true;
}
window.addEventListener('hashchange', openLinkedCase);
openLinkedCase();
