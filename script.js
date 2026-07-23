(function(){

  const photos = [
    { id: 1,  category: "nature",   title: "Ridge Light",        seed: "gallery-nature-1"   },
    { id: 2,  category: "urban",    title: "Concrete Interval",  seed: "gallery-urban-1"    },
    { id: 3,  category: "portrait", title: "Quiet Attention",    seed: "gallery-portrait-1" },
    { id: 4,  category: "travel",   title: "Departure Gate",     seed: "gallery-travel-1"   },
    { id: 5,  category: "nature",   title: "Low Tide",           seed: "gallery-nature-2"   },
    { id: 6,  category: "urban",    title: "Night Grid",         seed: "gallery-urban-2"    },
    { id: 7,  category: "portrait", title: "Half Turn",          seed: "gallery-portrait-2" },
    { id: 8,  category: "travel",   title: "Coastal Road",       seed: "gallery-travel-2"   },
    { id: 9,  category: "nature",   title: "Canopy Break",       seed: "gallery-nature-3"   },
    { id: 10, category: "urban",    title: "Glass Reflection",   seed: "gallery-urban-3"    },
    { id: 11, category: "portrait", title: "Window Seat",        seed: "gallery-portrait-3" },
    { id: 12, category: "travel",   title: "Foreign Platform",   seed: "gallery-travel-3"   },
    { id: 13, category: "nature",   title: "Frost Line",         seed: "gallery-nature-4"   },
    { id: 14, category: "urban",    title: "Stairwell",          seed: "gallery-urban-4"    },
    { id: 15, category: "portrait", title: "Held Gaze",          seed: "gallery-portrait-4" },
    { id: 16, category: "travel",   title: "Border Crossing",    seed: "gallery-travel-4"   }
  ];

  const imgUrl = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  const gallery = document.getElementById('gallery');
  const filterCount = document.getElementById('filterCount');
  let currentFilter = 'all';
  let currentIndex = 0;

  function heightFor(i){
    const variants = [340, 420, 300, 460, 380];
    return variants[i % variants.length];
  }

  function renderGallery(){
    gallery.innerHTML = '';
    photos.forEach((p, i) => {
      const fig = document.createElement('figure');
      fig.className = 'tile';
      fig.dataset.category = p.category;
      fig.style.animationDelay = (i * 0.03) + 's';

      const h = heightFor(i);
      fig.innerHTML = `
        <img src="${imgUrl(p.seed, 500, h)}" alt="${p.title}" loading="lazy">
        <div class="tile-overlay">
          <p class="tile-index">Plate ${String(p.id).padStart(2,'0')}</p>
          <p class="tile-title">${p.title}</p>
          <p class="tile-tag">${p.category}</p>
        </div>
      `;
      fig.addEventListener('click', () => openLightbox(i));
      gallery.appendChild(fig);
    });
    applyFilter(currentFilter);
  }

  function applyFilter(filter){
    currentFilter = filter;
    const tiles = document.querySelectorAll('.tile');
    let visible = 0;
    tiles.forEach(t => {
      const match = filter === 'all' || t.dataset.category === filter;
      t.classList.toggle('hide', !match);
      if (match) visible++;
    });
    filterCount.textContent = `${visible} image${visible === 1 ? '' : 's'}`;
  }

  document.getElementById('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });

  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbTitle = document.getElementById('lbTitle');
  const lbTag = document.getElementById('lbTag');
  const lbIndex = document.getElementById('lbIndex');
  const lbCounter = document.getElementById('lbCounter');
  const lbFilmstrip = document.getElementById('lbFilmstrip');

  function visiblePhotos(){
    return currentFilter === 'all' ? photos : photos.filter(p => p.category === currentFilter);
  }

  function openLightbox(indexInFull){
    const list = visiblePhotos();
    const photo = photos[indexInFull];
    currentIndex = list.findIndex(p => p.id === photo.id);
    if (currentIndex === -1) currentIndex = 0;
    renderFilmstrip();
    showSlide(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showSlide(idx){
    const list = visiblePhotos();
    currentIndex = (idx + list.length) % list.length;
    const p = list[currentIndex];

    lbImage.classList.remove('show');
    const newImg = new Image();
    newImg.src = imgUrl(p.seed, 1200, 800);
    newImg.onload = () => {
      lbImage.src = newImg.src;
      lbImage.alt = p.title;
      requestAnimationFrame(() => lbImage.classList.add('show'));
    };

    lbIndex.textContent = `Plate ${String(p.id).padStart(2,'0')}`;
    lbTitle.textContent = p.title;
    lbTag.textContent = p.category;
    lbCounter.textContent = `${currentIndex + 1} / ${list.length}`;

    document.querySelectorAll('.lb-filmstrip img').forEach((im, i) => {
      im.classList.toggle('active', i === currentIndex);
    });
    const activeThumb = lbFilmstrip.children[currentIndex];
    if (activeThumb) activeThumb.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }

  function renderFilmstrip(){
    const list = visiblePhotos();
    lbFilmstrip.innerHTML = '';
    list.forEach((p, i) => {
      const im = document.createElement('img');
      im.src = imgUrl(p.seed, 100, 100);
      im.alt = p.title;
      im.addEventListener('click', () => showSlide(i));
      lbFilmstrip.appendChild(im);
    });
  }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => showSlide(currentIndex - 1));
  document.getElementById('lbNext').addEventListener('click', () => showSlide(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });

  renderGallery();

})();
