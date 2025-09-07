document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) return console.error("Product ID not found");

  const product = products.find(p => p.id === productId);
  if (!product) return console.error("Product not found for ID:", productId);

  // Populate text info
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-name-breadcrumb").textContent = product.name;
  document.getElementById("product-category").textContent = product.category;
  document.getElementById("product-category-info").textContent = product.category;
  document.getElementById("product-description").textContent = product.description;

  const featuresList = document.getElementById("product-features");
  featuresList.innerHTML = "";
  product.features.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    featuresList.appendChild(li);
  });

  // Populate slides
  const thumbsWrapper = document.getElementById("thumbs-wrapper");
  const mainWrapper = document.getElementById("main-wrapper");
  thumbsWrapper.innerHTML = "";
  mainWrapper.innerHTML = "";

  product.images.forEach(img => {
    thumbsWrapper.innerHTML += `<div class="swiper-slide"><img src="${img}" alt="${product.name} thumb"></div>`;
    mainWrapper.innerHTML += `<div class="swiper-slide"><img src="${img}" alt="${product.name}"></div>`;
  });

  // Initialize Swiper AFTER slides are added
  const thumbsSwiper = new Swiper("#product-thumbs", {
    direction: "vertical",
    slidesPerView: "auto",
    spaceBetween: 10,
    freeMode: true,
    watchSlidesProgress: true,
  });

  const mainSwiper = new Swiper("#product-main", {
    spaceBetween: 10,
    slidesPerView: 1,
    pagination: { el: ".swiper-pagination", clickable: true },
    thumbs: { swiper: thumbsSwiper },
  });

  // Force Swiper to recalc sizes
  thumbsSwiper.update();
  mainSwiper.update();
});
