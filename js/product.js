document.addEventListener("DOMContentLoaded", function () {
  const productDetailContainer = document.getElementById("product-detail");
  const relatedContainer = document.getElementById("related-products");

  if (!productDetailContainer || !window.veloraProducts) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));
  const product = window.veloraProductLookup[productId];

  if (!product) {
    productDetailContainer.innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <p>The selected jewellery piece could not be found. Please browse the collection and choose another item.</p>
        <a class="button primary" href="shop.html">Back to shop</a>
      </div>
    `;
    return;
  }

  const relatedProducts = window.veloraProducts
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  productDetailContainer.innerHTML = `
    <div class="product-layout">
      <div class="product-image-large">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 800\'><rect width=\'100%\' height=\'100%\' fill=\'#F5EFE5\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'Arial\' font-size=\'46\' fill=\'#302720\'>VELORA</text></svg>');" />
      </div>
      <div class="product-info">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <div class="product-price">
          <strong>${window.formatPrice(product.price)}</strong>
          ${product.originalPrice ? `<span class="old-price">${window.formatPrice(product.originalPrice)}</span>` : ""}
        </div>
        <p class="lead">${product.description}</p>
        <ul class="meta-list">
          <li><strong>Material:</strong> ${product.material}</li>
          <li><strong>Care:</strong> ${product.care}</li>
          <li><strong>Availability:</strong> ${product.availability}</li>
        </ul>
        <div class="product-actions-detail">
          <a class="button primary" href="${window.buildWhatsAppLink(product.name)}" target="_blank" rel="noreferrer">WhatsApp Enquiry</a>
          <a class="button secondary" href="shop.html">Continue Shopping</a>
        </div>
      </div>
    </div>
  `;

  relatedContainer.innerHTML = relatedProducts.length
    ? relatedProducts.map((item) => window.createProductCard(item)).join("")
    : '<div class="empty-state"><p>No related items available right now.</p></div>';
});
