// assets/js/products/product-detail.js
document.addEventListener("DOMContentLoaded", function () {
  // safe helper
  const $ = id => document.getElementById(id);

  // --- Get productId from URL or fallback to first product ---
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || (Array.isArray(products) && products[0] && products[0].id);
  const product = Array.isArray(products) ? products.find(p => p.id === productId) : null;

  if (!product) {
    console.error("product-detail.js: product not found for id:", productId);
    return;
  }
  console.debug("product-detail.js: Loaded product:", product);

  // --- Safe setters ---
  const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
  const setHTML = (el, html) => { if (!el) return; el.innerHTML = html; };
  const appendChildSafe = (el, child) => { if (el) el.appendChild(child); };

  // --- Header / Basic fields ---
  setText("product-name", product.name || "");
  setText("product-name-breadcrumb", product.name || "");
  setText("product-category-info", product.category || "");
  setText("product-description", product.description || "");
  // small summary fields (visible card)
  setText("product-name-mini", product.name || "");
  setText("product-short-desc", product.description || "");
  const setIfExists = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
  setIfExists('product-material', product.material || 'Aluminum');
  setIfExists('product-voltage', product.voltage || '600V');

  // --- Features block: if #product-features exists use it, otherwise create a small block under product info ---
  let featuresList = $("product-features");
  if (!featuresList) {
    // find product info column and append features list (keeps design intact)
    const infoCol = document.querySelector(".col-lg-5");
    if (infoCol) {
      const wrapper = document.createElement("div");
      wrapper.className = "product-key-features mb-4";
      wrapper.innerHTML = `<h5 class="mb-2">Key Features</h5><ul id="product-features" class="ps-3 mb-0"></ul>`;
      infoCol.insertBefore(wrapper, infoCol.querySelector(".mb-4")); // insert before Request Quote button area (if present)
      featuresList = $("product-features");
    }
  }
  if (featuresList && Array.isArray(product.features)) {
    featuresList.innerHTML = ""; // clear
    product.features.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      featuresList.appendChild(li);
    });
  }

  // quick-specs and preview removed to avoid duplicates; full details render in right column

  // --- Gallery (thumbnails + main) ---
  const thumbsWrapper = $("thumbs-wrapper");
  const mainWrapper = $("main-wrapper");

  if (thumbsWrapper && mainWrapper && Array.isArray(product.images) && product.images.length) {
    thumbsWrapper.innerHTML = "";
    mainWrapper.innerHTML = "";

    product.images.forEach((img, i) => {
      // Thumbnail slide
      const tSlide = document.createElement("div");
      tSlide.className = "swiper-slide";
      tSlide.innerHTML = `<img src="${img}" alt="${product.name} thumbnail ${i+1}" loading="lazy">`;
      thumbsWrapper.appendChild(tSlide);

      // Main slide (wrap with glightbox anchor)
      const mSlide = document.createElement("div");
      mSlide.className = "swiper-slide";
      mSlide.innerHTML = `
        <a href="${img}" class="glightbox" data-gallery="product-gallery">
          <img src="${img}" alt="${product.name} image ${i+1}" loading="lazy">
        </a>`;
      mainWrapper.appendChild(mSlide);
    });
  } else {
    // If no wrappers or images, show a single placeholder slide (keeps layout safe)
    if (mainWrapper && mainWrapper.children.length === 0) {
      mainWrapper.innerHTML = `<div class="swiper-slide"><img src="assets/img/products/placeholder.jpg" alt="No image"></div>`;
    }
  }

  // --- Helper to build property/value table ---
  function buildPropValueTable(data) {
    if (!Array.isArray(data) || data.length === 0) return null;
    const table = document.createElement("table");
    table.className = "table table-bordered align-middle";
    table.innerHTML = `<thead class="table-light"><tr><th>Property</th><th>Value</th></tr></thead>`;
    const tbody = document.createElement("tbody");
    data.forEach(r => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.textContent = r.property ?? "";
      const td2 = document.createElement("td");
      td2.textContent = r.value ?? "";
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }

  // --- Tabs: map product data to the existing tab panes in your HTML
  // Your HTML tab IDs are: size, insulation, applications, packing
  // We'll replace the tab content only when product data exists (keeps backup static layout otherwise)

  // 1) Size tab -> show product.specifications (property/value)
  (function fillSize() {
    const section = $("size");
    if (!section) return;
    const container = section.querySelector('div') || section;
    container.innerHTML = "";
    if (Array.isArray(product.specifications) && product.specifications.length) {
      const tbl = buildPropValueTable(product.specifications);
      if (tbl) {
        tbl.className = 'table table-borderless';
        container.appendChild(tbl);
      }
    } else {
      container.innerHTML = '<p class="text-muted">No technical specifications provided for this product.</p>';
    }
  })();

  // 2) Insulation tab -> try to show insulation-related rows (from specifications or standards)
  (function fillInsulation() {
    const container = document.getElementById('insulation-content') || (function(){ const sec = $("insulation"); return sec ? sec.querySelector('div') : null; })();
    container.innerHTML = "";
    const specs = Array.isArray(product.specifications) ? product.specifications : [];
    const insulationRows = specs.filter(s => /insul|mica|kraft|paper|aramid|therm/i.test(s.property || ""));
    const standards = Array.isArray(product.standards) ? product.standards : [];

    if (insulationRows.length) {
      const tbl = buildPropValueTable(insulationRows);
      if (tbl) {
        tbl.className = 'table table-borderless';
        container.appendChild(tbl);
      }
    } else {
      container.innerHTML = '<p>High quality insulating materials used as per product requirements (e.g. mica, kraft paper, aramid, XLPE).</p>';
    }

    if (standards.length) {
      const stdWrap = document.createElement('div');
      stdWrap.className = 'product-standards';
      standards.forEach(s => {
        const b = document.createElement('span');
        b.className = 'badge bg-light text-dark border';
        b.textContent = (s.property ? s.property + ': ' : '') + (s.value || '');
        stdWrap.appendChild(b);
      });
      container.appendChild(stdWrap);
    }
  })();

  // 3) Applications tab -> show product.applications
  (function fillApplications() {
    const container = document.getElementById('applications-content') || (function(){ const sec = $("applications"); return sec ? sec.querySelector('div') : null; })();
    container.innerHTML = "";
    if (Array.isArray(product.applications) && product.applications.length) {
      const list = document.createElement('div');
      list.className = 'app-list';
      product.applications.forEach((a, i) => {
        const item = document.createElement('div');
        item.className = 'app-item';
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.textContent = (i+1).toString();
        const content = document.createElement('div');
        const title = document.createElement('div');
        title.style.fontWeight = '600';
        title.textContent = a.property || a.title || 'Application';
        const desc = document.createElement('div');
        desc.className = 'text-muted';
        desc.textContent = a.value || '';
        content.appendChild(title);
        content.appendChild(desc);
        item.appendChild(icon);
        item.appendChild(content);
        list.appendChild(item);
      });
      container.appendChild(list);
    } else {
      container.innerHTML = '<p class="text-muted">No application data available.</p>';
    }
  })();

  // 4) Packing tab -> if product.packing exists, replace; otherwise keep static
  (function fillPacking() {
    const container = document.getElementById('packing-content') || (function(){ const sec = $("packing"); return sec ? sec.querySelector('div') : null; })();
    container.innerHTML = "";
    if (Array.isArray(product.packing) && product.packing.length) {
      const tbl = buildPropValueTable(product.packing);
      if (tbl) {
        tbl.className = 'table table-borderless';
        container.appendChild(tbl);
      }
    } else {
      container.innerHTML = '<p>Conductors are supplied in sturdy wooden reels, securely wrapped to prevent damage during transportation and storage. Customized packing is available upon request.</p>';
    }
  })();

  // --- FAQs ---
  (function fillFaqs() {
    const faqContainer = $("faq-list");
    if (!faqContainer) return;
    faqContainer.innerHTML = '';
    if (Array.isArray(product.faqs) && product.faqs.length) {
      product.faqs.forEach((faq, i) => {
        const q = document.createElement('div');
        q.className = 'fw-600 mb-1';
        q.textContent = faq.q || faq.question || faq.property || (`Question ${i+1}`);
        const a = document.createElement('div');
        a.className = 'text-muted mb-3';
        a.textContent = faq.a || faq.answer || faq.value || '';
        faqContainer.appendChild(q);
        faqContainer.appendChild(a);
      });
    } else {
      faqContainer.innerHTML = `<p class="text-muted">No frequently asked questions available for this product.</p>`;
    }
  })();

  // --- Similar products (exclude current) ---
  // Render similar products list (exclude current product)
  (function renderSimilarProducts() {
    try {
      const listEl = document.getElementById('similar-products-list');
      // products is defined in product-data.js as a const; try that, fallback to window.products
      const dataProducts = (typeof products !== 'undefined' && Array.isArray(products)) ? products : (Array.isArray(window.products) ? window.products : null);
      if (!listEl || !dataProducts) {
        // if product-data.js didn't load yet for some reason, retry shortly (one-shot)
        if (!listEl) return;
        setTimeout(() => {
          try {
            const retryProducts = (typeof products !== 'undefined' && Array.isArray(products)) ? products : (Array.isArray(window.products) ? window.products : null);
            if (!retryProducts) return;
            // re-run rendering quickly
            listEl.innerHTML = '';
            const others = retryProducts.filter(p => p.id !== productId);
            let preferred = others.filter(p => p.category === product.category);
            let pool = preferred.concat(others.filter(p => p.category !== product.category));
            pool = pool.slice(0, 8);
            pool.forEach(p => {
              const img = Array.isArray(p.images) && p.images[0] ? p.images[0] : 'assets/img/products/placeholder.jpg';
              const slide = document.createElement('div');
              slide.className = 'swiper-slide';
              slide.innerHTML = `\n          <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="similar-product-card text-decoration-none text-dark d-block">\n            <div class="card h-100 border-0 shadow-sm">\n              <div class="card-img-top overflow-hidden" style="height:180px;background:#f6f6f6;">\n                <img src="${img}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">\n              </div>\n              <div class="card-body py-2 px-3">\n                <h5 class="card-title mb-1" style="font-size:0.98rem;font-weight:600;">${p.name}</h5>\n                <p class="card-text small text-muted mb-0">${(p.description||'').replace(/<[^>]+>/g,'').slice(0,90)}</p>\n              </div>\n            </div>\n          </a>`;
              listEl.appendChild(slide);
            });
            try { if (window.similarSwiper && typeof window.similarSwiper.update === 'function') window.similarSwiper.update(); } catch(e) { /* ignore */ }
          } catch (e) { /* ignore retry errors */ }
        }, 120);
        return;
      }
      listEl.innerHTML = '';
      // choose up to 8 similar products (simple strategy: same category first)
      const others = dataProducts.filter(p => p.id !== productId);
      // prefer same category
      let preferred = others.filter(p => p.category === product.category);
      let pool = preferred.concat(others.filter(p => p.category !== product.category));
      pool = pool.slice(0, 8);
      pool.forEach(p => {
        const img = Array.isArray(p.images) && p.images[0] ? p.images[0] : 'assets/img/products/placeholder.jpg';
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="similar-product-box d-block text-decoration-none">
            <div class="sim-box" aria-hidden="false">
              <img src="${img}" alt="${p.name}" loading="lazy">
              <div class="sim-overlay"><div class="sim-title">${p.name}</div></div>
            </div>
          </a>`;
        listEl.appendChild(slide);
      });
    } catch (e) {
      console.warn('renderSimilarProducts failed', e);
    }
  })();

  (function initSwipersAndLightbox() {
    try {
      // Destroy previous instances if present
      try { if (window.thumbsSwiper && typeof window.thumbsSwiper.destroy === 'function') window.thumbsSwiper.destroy(true, true); } catch(e) { /* ignore */ }
      try { if (window.mainSwiper && typeof window.mainSwiper.destroy === 'function') window.mainSwiper.destroy(true, true); } catch(e) { /* ignore */ }
      try { if (window.similarSwiper && typeof window.similarSwiper.destroy === 'function') window.similarSwiper.destroy(true, true); } catch(e) { /* ignore */ }

      if (typeof Swiper === 'function') {
        // Thumbs swiper (vertical on desktop, horizontal on small screens)
        window.thumbsSwiper = new Swiper('#product-thumbs', {
          spaceBetween: 8,
          slidesPerView: Math.min(5, Array.isArray(product.images) ? product.images.length : 5),
          watchSlidesProgress: true,
          centeredSlides: false,
          slideToClickedSlide: true,
          direction: window.innerWidth >= 992 ? 'vertical' : 'horizontal',
          breakpoints: {
            0: { direction: 'horizontal', slidesPerView: Math.min(4, Array.isArray(product.images) ? product.images.length : 4) },
            576: { direction: 'horizontal', slidesPerView: Math.min(4, Array.isArray(product.images) ? product.images.length : 4) },
            992: { direction: 'vertical', slidesPerView: Math.min(5, Array.isArray(product.images) ? product.images.length : 5) }
          }
        });

        // Main swiper with thumbs controller
        window.mainSwiper = new Swiper('#product-main', {
          spaceBetween: 12,
          pagination: { el: '#product-main .swiper-pagination', clickable: true },
          navigation: { nextEl: '#product-main .swiper-button-next', prevEl: '#product-main .swiper-button-prev' },
          thumbs: { swiper: window.thumbsSwiper },
          keyboard: { enabled: true },
          loop: false,
          preloadImages: true,
        });

        // Similar products slider
        const similarEl = document.querySelector('.similar-products-slider');
        if (similarEl) {
          window.similarSwiper = new Swiper(similarEl, {
            slidesPerView: 3,
            spaceBetween: 18,
            navigation: { nextEl: '.similar-products-slider .swiper-button-next', prevEl: '.similar-products-slider .swiper-button-prev' },
            pagination: { el: '.similar-products-slider .swiper-pagination', clickable: true },
            breakpoints: {
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1400: { slidesPerView: 4 }
            }
          });
          // If slides were added dynamically, update swiper
          try { window.similarSwiper.update(); } catch(e) { /* ignore */ }
        }
      }
    } catch (err) {
      console.warn('product-detail.js: Swiper init failed:', err);
    }

    // GLightbox init (destroy previous safe)
    try {
      if (window.lightbox && typeof window.lightbox.destroy === 'function') {
        try { window.lightbox.destroy(); } catch (e) { /* ignore */ }
      }
      if (typeof GLightbox === 'function') {
        window.lightbox = GLightbox({ selector: '.glightbox' });
      }
    } catch (e) {
      console.warn('product-detail.js: GLightbox init failed:', e);
    }
  })();

  // --- Inject product JSON-LD (for SEO) ---
  try {
    // Remove previous if present
    const prev = document.getElementById('product-jsonld');
    if (prev) prev.remove();
    const json = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name || '',
      'description': product.description || '',
      'image': Array.isArray(product.images) ? product.images.map(i => (location.origin + '/' + i).replace(/([^:]\/\/)/, 'http://').replace(/\/\//g,'/')) : [],
      'sku': product.id || undefined,
      'brand': { '@type': 'Organization', 'name': 'Ampire Industries' },
      'category': product.category || undefined
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'product-jsonld';
    s.text = JSON.stringify(json);
    document.head.appendChild(s);
  } catch (e) {
    console.warn('product-detail.js: JSON-LD injection failed:', e);
  }

  // --- Populate sticky CTA product name if present ---
  try {
    const ctaName = document.getElementById('cta-product-name');
    if (ctaName) ctaName.textContent = product.name || '';
  } catch (e) { /* ignore */ }

  // --- Safe handler for 'Explore' anchor that points to #similar-products ---
  try {
    // Use delegated/specific handler to prevent the browser from setting location.hash on load/refresh
    const exploreAnchors = Array.from(document.querySelectorAll('a')).filter(a => a.getAttribute('href') === '#similar-products' || a.getAttribute('data-target') === '#similar-products');
    exploreAnchors.forEach(a => {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        const target = document.getElementById('similar-products');
        if (!target) return;
        // Smooth scroll but do not change URL (no hash)
        const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
        window.scrollTo({ top: target.offsetTop - scrollMarginTop, behavior: 'smooth' });
      });
    });
  } catch (e) {
    // ignore
  }

  // --- Dev-only diagnostic: log hash & navigation info when ?debugHash is present ---
  try {
    const debug = new URLSearchParams(window.location.search).has('debugHash');
    if (debug) {
      let navType = 'unknown';
      try {
        const entries = performance.getEntriesByType && performance.getEntriesByType('navigation');
        if (entries && entries[0]) navType = entries[0].type;
        else if (performance && performance.navigation) navType = performance.navigation.type === 1 ? 'reload' : 'navigate';
      } catch (e) { /* ignore */ }
      console.info('product-detail.js debug: initial location.hash=', window.location.hash, ' navType=', navType);
    }
  } catch (e) { /* ignore */ }

}); // end DOMContentLoaded
