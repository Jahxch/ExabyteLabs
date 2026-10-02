const WA_NUMBER = "51917158224";
let cart = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const cartModal = $("#cart-modal");
const cartItems = $("#cart-items");
const cartEmpty = $("#cart-empty");
const cartBadge = $("#cart-badge");
const toast = $("#toast");

function updateCart() {
  cartItems.innerHTML = "";

  cart.forEach((service, index) => {
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <span>${escapeHtml(service)}</span>
      <button class="remove-item" data-index="${index}" aria-label="Eliminar ${escapeHtml(service)}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItems.appendChild(item);
  });

  cartEmpty.style.display = cart.length ? "none" : "block";
  cartBadge.textContent = cart.length;
  cartBadge.classList.toggle("show", cart.length > 0);

  $$(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.index), 1);
      updateCart();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$$(".add-service").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    cart.push(service);
    updateCart();
    showToast("Servicio agregado a tu solicitud");
  });
});

$$(".category-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    $$(".category-tab").forEach(t => t.classList.remove("active"));
    $$(".service-grid").forEach(grid => grid.classList.remove("active"));
    tab.classList.add("active");
    $("#" + tab.dataset.tab).classList.add("active");
  });
});

function openCart() {
  updateCart();
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

$("#cart-button").addEventListener("click", openCart);
$("#close-modal").addEventListener("click", closeCart);

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) closeCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

$("#whatsapp-submit").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Agrega al menos un servicio");
    return;
  }

  const name = $("#client-name").value.trim();
  const notes = $("#client-notes").value.trim();

  if (!name) {
    $("#client-name").focus();
    showToast("Escribe tu nombre para continuar");
    return;
  }

  let message = `¡Hola ExabyteLabs! 👋\n\nMi nombre es ${name} y me gustaría solicitar una cotización.\n\nServicios:\n`;
  cart.forEach(service => message += `• ${service}\n`);

  if (notes) {
    message += `\nDetalles adicionales:\n${notes}`;
  }

  message += "\n\nQuedo atento(a). ¡Gracias!";

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

const menuButton = $("#menu-button");
const mainNav = $("#main-nav");

menuButton.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  menuButton.innerHTML = mainNav.classList.contains("open")
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    $$(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    mainNav.classList.remove("open");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

const header = $("#header");
window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 20 ? "0 10px 35px rgba(0,0,0,.18)" : "none";
});
