document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.getElementById("contact-form");
  const featuredContainer = document.getElementById("featured-products");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mainNav.classList.toggle("open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (navLinks.length) {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const matchesPage = href === currentPath || (currentPath === "" && href === "index.html");
      const matchesShopCategory = currentPath === "shop.html" && href === "shop.html";
      const matchesProductPage = currentPath === "product.html" && href === "shop.html";
      if (matchesPage || matchesShopCategory || matchesProductPage) {
        link.classList.add("active");
      }
    });
  }

  if (backToTop) {
    const toggleBackToTop = function () {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", toggleBackToTop);
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (featuredContainer && window.veloraProducts) {
    const featuredProducts = window.veloraProducts.filter((item) => item.featured).slice(0, 4);
    featuredContainer.innerHTML = featuredProducts.map((product) => window.createProductCard(product)).join("");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const message = document.getElementById("message");
      const status = document.getElementById("form-status");

      const invalid = [];
      if (!name || name.value.trim().length < 2) invalid.push("name");
      if (!phone || phone.value.trim().length < 7) invalid.push("phone");
      if (!message || message.value.trim().length < 10) invalid.push("message");

      if (invalid.length) {
        status.textContent = "Please complete all fields with valid details before submitting.";
        status.className = "form-status error";
        return;
      }

      status.textContent = "Your message has been prepared for review. Please use WhatsApp or phone contact for immediate enquiries.";
      status.className = "form-status success";
      contactForm.reset();
    });
  }

  if (window.location.pathname.endsWith("/shop.html") || window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/")) {
    const navSearchButton = document.querySelector(".icon-btn[aria-label='Search products']");
    if (navSearchButton) {
      navSearchButton.addEventListener("click", function () {
        const shopUrl = "shop.html";
        window.location.href = shopUrl;
      });
    }
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".product-card, .category-card, .feature-card, .button, .icon-btn").forEach((el) => {
      el.classList.add("animate-ready");
    });
  }

});
