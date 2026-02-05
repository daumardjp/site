(function () {
  const linkSel = 'a[data-lightbox="carnet"]';
  const getLinks = () => Array.from(document.querySelectorAll(linkSel));
  if (!getLinks().length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-stage" role="dialog" aria-modal="true">
      <img class="lb-image" alt="">
      <button class="lb-close" aria-label="Fermer">×</button>
      <div class="lb-nav">
        <button class="lb-prev" aria-label="Image précédente">‹</button>
        <div class="lb-counter"></div>
        <button class="lb-next" aria-label="Image suivante">›</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('.lb-image');
  const counter = overlay.querySelector('.lb-counter');
  const closeBtn = overlay.querySelector('.lb-close');
  const prevBtn = overlay.querySelector('.lb-prev');
  const nextBtn = overlay.querySelector('.lb-next');
  const backdrop = overlay.querySelector('.lb-backdrop');

  let index = 0;

  function render() {
    const links = getLinks();
    const n = links.length;
    if (!n) return;
    index = ((index % n) + n) % n;

    const href = links[index].getAttribute('href');
    lbImg.src = href;
    counter.textContent = `${index + 1} / ${n}`;
  }

  function openAt(i) {
    index = i;
    render();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function next() { openAt(index + 1); }
  function prev() { openAt(index - 1); }

  document.addEventListener('click', (e) => {
    const a = e.target.closest(linkSel);
    if (!a) return;
    e.preventDefault();
    const i = parseInt(a.getAttribute('data-index') || '0', 10);
    openAt(isNaN(i) ? 0 : i);
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();
