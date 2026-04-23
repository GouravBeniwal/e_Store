// Navbar scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 40);
});

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// Subscribe form
const form = document.getElementById("subscribeForm");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch("/subscribe", { method: "POST", body: data });
    const json = await res.json();
    if (json.success) {
      form.innerHTML = `<p style="color:var(--accent);font-size:14px;padding:10px 0;">✓ ${json.message}</p>`;
    }
  } catch {}
});

// Filter buttons (shop page)
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => {
      const cat = card.dataset.category || "";
      card.style.display =
        filter === "all" || cat === filter ? "block" : "none";
    });
  });
});

// Add to cart counter
let cartCount = 0;
document
  .querySelectorAll(".add-to-cart-btn, .product-quick-add")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      cartCount++;
      const counter = document.querySelector(".cart-count");
      if (counter) counter.textContent = cartCount;
      btn.textContent = "✓ Added";
      setTimeout(
        () =>
          (btn.textContent = btn.classList.contains("add-to-cart-btn")
            ? "Add to Cart"
            : "Quick Add"),
        1500,
      );
    });
  });

//  Login Logic
async function loginUser(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const response = await fetch("/login", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.access) {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    window.location = "/";
  } else {
    alert("Login failed");
  }
}
