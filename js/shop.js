document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("product-grid");
  const summary = document.getElementById("shop-results-summary");
  const searchInput = document.getElementById("product-search");
  const categorySelect = document.getElementById("category-filter");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const sortSelect = document.getElementById("sort-select");
  const featuredToggle = document.getElementById("featured-only");
  const resetBtn = document.getElementById("reset-filters");

  if (!grid || !window.veloraProducts) return;

  const categories = [...new Set(window.veloraProducts.map((item) => item.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  if (requestedCategory) {
    categorySelect.value = requestedCategory;
  }

  function getFilteredProducts() {
    const value = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const minPrice = Number(minPriceInput.value) || 0;
    const maxPrice = Number(maxPriceInput.value) || Number.POSITIVE_INFINITY;
    const filterFeatured = featuredToggle.checked;

    let products = window.veloraProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(value);
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesMin = product.price >= minPrice;
      const matchesMax = product.price <= maxPrice;
      const matchesFeatured = !filterFeatured || product.featured;
      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesFeatured;
    });

    const sortBy = sortSelect.value;
    if (sortBy === "low-high") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "new-arrivals") {
      products = [...products].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    } else if (sortBy === "featured") {
      products = [...products].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return products;
  }

  function renderProducts() {
    const products = getFilteredProducts();
    if (!products.length) {
      grid.innerHTML = '<div class="empty-state"><h3>No products match your filters.</h3><p>Try another search term or reset the filters.</p></div>';
      summary.textContent = "0 products found";
      return;
    }

    grid.innerHTML = products.map((product) => window.createProductCard(product)).join("");
    summary.textContent = `${products.length} product${products.length > 1 ? "s" : ""} found`;
  }

  [searchInput, categorySelect, minPriceInput, maxPriceInput, sortSelect, featuredToggle].forEach((element) => {
    element.addEventListener("input", renderProducts);
    element.addEventListener("change", renderProducts);
  });

  resetBtn.addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "All";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortSelect.value = "featured";
    featuredToggle.checked = false;
    renderProducts();
  });

  renderProducts();
});
