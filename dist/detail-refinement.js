// Without JavaScript both source images remain visible and linked at full resolution.
for (const group of document.querySelectorAll('.technical-views')) {
  const controls = group.querySelector('.view-controls');
  const buttons = [...controls.querySelectorAll('[data-view]')];
  const panels = [...group.querySelectorAll('[data-view-panel]')];
  const select = id => {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.view === id));
    for (const panel of panels) panel.hidden = panel.id !== id;
  };
  for (const button of buttons) button.addEventListener('click', () => select(button.dataset.view));
  select(buttons[0].dataset.view);
  controls.hidden = false;
}
