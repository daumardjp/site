(function () {
  const sel = 'img[data-lightbox="carnet"]';
  const getImgs = () => Array.from(document.querySelectorAll(sel));
  if (!getImgs().length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-stage">
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
    const list = getImgs();
    const n = list.length;
    const cur = ((index % n) + n) % n;
    index = cur;
    lbImg.src = list[cur].src;
    counter.textContent = `${cur + 1} / ${n}`;
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
    const t = e.target;
    if (t && t.matches(sel)) {
      e.preventDefault();
      openAt(parseInt(t.getAttribute('data-index') || '0', 10));
    }
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
