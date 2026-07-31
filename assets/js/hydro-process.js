(() => {
  const accordion = document.querySelector('[data-hydro-process-accordion]');
  if (!accordion) return;

  const items = [...accordion.querySelectorAll('.hydro-process-item')];
  const preview = accordion.querySelector('.hydro-process-preview');
  const previewImage = preview?.querySelector('img');
  const previewCopy = preview?.querySelector('[data-hydro-process-copy]');
  const activeIndex = () => Math.max(0, items.findIndex(item => item.open));

  const activate = index => {
    const next = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.open = itemIndex === next;
    });
    const activeItem = items[next];
    const alt = activeItem.querySelector('.hydro-process-item__alt')?.textContent?.trim();
    const copy = activeItem.querySelector('.hydro-process-item__copy')?.textContent?.trim();
    if (previewImage && activeItem.dataset.image) {
      previewImage.src = activeItem.dataset.image;
      previewImage.alt = alt || '';
    }
    if (previewCopy && copy) previewCopy.textContent = copy;
  };

  items.forEach((item, index) => {
    const summary = item.querySelector('summary');
    summary?.addEventListener('click', event => {
      event.preventDefault();
      activate(index);
    });
  });
  activate(activeIndex());
  document.addEventListener('bat:languagechange', () => activate(activeIndex()));
})();
