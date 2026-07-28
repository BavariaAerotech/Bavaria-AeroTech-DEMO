(() => {
  const accordion = document.querySelector('[data-hydro-process-accordion]');
  if (!accordion) return;

  const items = [...accordion.querySelectorAll('.hydro-process-item')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 5000;
  let timer = null;

  const activeIndex = () => Math.max(0, items.findIndex(item => item.open));

  const activate = index => {
    const next = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.open = itemIndex === next;
    });
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (reducedMotion.matches || document.hidden) return;
    timer = window.setInterval(() => activate(activeIndex() + 1), interval);
  };

  items.forEach((item, index) => {
    const summary = item.querySelector('summary');
    summary?.addEventListener('click', event => {
      event.preventDefault();
      activate(index);
      start();
    });
  });

  accordion.addEventListener('pointerenter', stop);
  accordion.addEventListener('pointerleave', start);
  accordion.addEventListener('focusin', stop);
  accordion.addEventListener('focusout', event => {
    if (!accordion.contains(event.relatedTarget)) start();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener('change', start);
  activate(activeIndex());
  start();
})();
