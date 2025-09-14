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
  setText("product-category", product.category || "");
  setText("product-category-info", product.category || "");
  setText("product-description", product.description || "");

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
    const sizePane = $("size");
    if (!sizePane) return;
    if (Array.isArray(product.specifications) && product.specifications.length) {
      sizePane.innerHTML = '<div class="table-responsive"></div>';
      const tbl = buildPropValueTable(product.specifications);
      if (tbl) sizePane.querySelector(".table-responsive").appendChild(tbl);
    } // else keep existing static markup already in the pane
  })();

  // 2) Insulation tab -> try to show insulation-related rows (from specifications or standards)
  (function fillInsulation() {
    const insPane = $("insulation");
    if (!insPane) return;
    // prefer explicit 'Insulation' properties
    const specs = Array.isArray(product.specifications) ? product.specifications : [];
    const insulationRows = specs.filter(s => /insul|mica|kraft|paper|aramid|therm/i.test(s.property || ""));
    const standards = Array.isArray(product.standards) ? product.standards : [];

    // If we have insulation-specific data or standards, show them (merged)
    const merged = [...insulationRows];
    if (standards.length) {
      // convert standards to property/value rows if not already present
      standards.forEach(s => {
        if (s.property && s.value) merged.push({ property: s.property, value: s.value });
      });
    }

    if (merged.length) {
      insPane.innerHTML = '<div class="table-responsive"></div>';
      const tbl = buildPropValueTable(merged);
      if (tbl) insPane.querySelector(".table-responsive").appendChild(tbl);
    }
    // else keep static content (your original descriptive table remains)
  })();

  // 3) Applications tab -> show product.applications
  (function fillApplications() {
    const appsPane = $("applications");
    if (!appsPane) return;
    if (Array.isArray(product.applications) && product.applications.length) {
      appsPane.innerHTML = '<div class="table-responsive"></div>';
      const tbl = buildPropValueTable(product.applications);
      if (tbl) appsPane.querySelector(".table-responsive").appendChild(tbl);
    }
  })();

  // 4) Packing tab -> if product.packing exists, replace; otherwise keep static
  (function fillPacking() {
    const packPane = $("packing");
    if (!packPane) return;
    if (Array.isArray(product.packing) && product.packing.length) {
      packPane.innerHTML = '<div class="table-responsive"></div>';
      const tbl = buildPropValueTable(product.packing);
      if (tbl) packPane.querySelector(".table-responsive").appendChild(tbl);
    }
  })();

  // --- FAQs ---
  (function fillFaqs() {
    const faqContainer = $("faq-list");
    if (!faqContainer) return;

    faqContainer.innerHTML = ""; // clear first

    if (Array.isArray(product.faqs) && product.faqs.length) {
      product.faqs.forEach((faq, i) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        // Use safe escaping for text (simple) to avoid breaking HTML - using text nodes for contents
        const headerId = `faq-heading-${i}`;
        const collapseId = `faq-collapse-${i}`;
        item.innerHTML = `
          <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button ${i > 0 ? "collapsed" : ""}" type="button"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
              aria-expanded="${i === 0 ? "true" : "false"}"
              aria-controls="${collapseId}">
              ${faq.q}
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse ${i === 0 ? "show" : ""}" data-bs-parent="#faq-list">
            <div class="accordion-body">${faq.a}</div>
          </div>`;
        faqContainer.appendChild(item);
      });
    } else {
      // No FAQs — hide accordion or show a short message
      faqContainer.innerHTML = `<p class="text-muted">No frequently asked questions available for this product.</p>`;
    }
  })();

  // --- Similar products (exclude current) ---
  (function fillSimilar() {
    const similarContainer = $("similar-products-list");
    if (!similarContainer) return;
    similarContainer.innerHTML = "";
    if (!Array.isArray(products)) return;
    const similar = products.filter(p => p.id !== product.id).slice(0, 6);
    similar.forEach(sp => {
      const card = document.createElement("div");
      card.className = "swiper-slide";
      const imgSrc = Array.isArray(sp.images) && sp.images[0] ? sp.images[0] : "assets/img/products/placeholder.jpg";
      // Link to product detail with id param
      card.innerHTML = `
        <a href="product-detail.html?id=${encodeURIComponent(sp.id)}" class="d-block text-decoration-none">
          <img src="${imgSrc}" alt="${sp.name}" loading="lazy">
          <h5 class="p-3 mb-0">${sp.name}</h5>
        </a>`;
      similarContainer.appendChild(card);
    });
  })();

  // --- Try to update existing Swiper instances if they already exist (safe) ---
  try {
    if (window.thumbsSwiper && typeof window.thumbsSwiper.update === "function") window.thumbsSwiper.update();
    if (window.mainSwiper && typeof window.mainSwiper.update === "function") window.mainSwiper.update();
    if (window.similarSwiper && typeof window.similarSwiper.update === "function") window.similarSwiper.update();
  } catch (err) {
    console.warn("product-detail.js: Swiper update failed (it may be initialized later):", err);
  }

  // --- Re-init or create GLightbox for newly-added anchors ---
  try {
    if (window.lightbox && typeof window.lightbox.destroy === "function") {
      // destroy previous instance (if any)
      try { window.lightbox.destroy(); } catch (e) { /* ignore */ }
    }
    if (typeof GLightbox === "function") {
      window.lightbox = GLightbox({ selector: ".glightbox" });
    }
  } catch (e) {
    console.warn("product-detail.js: GLightbox init failed:", e);
  }

}); // end DOMContentLoaded
