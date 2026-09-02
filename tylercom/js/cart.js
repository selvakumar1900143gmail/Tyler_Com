const cartContainer = document.getElementById("cart-container");
const totalElement = document.getElementById("total");
const clearCartButton = document.getElementById("clear-cart");
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const icon = themeToggle.querySelector("i");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
        themeToggle.setAttribute("aria-pressed", "true");
    } else {
        icon.className = "fa-solid fa-moon";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
        themeToggle.setAttribute("aria-pressed", "false");
    }
}

applyTheme(document.documentElement.getAttribute("data-theme"));

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
});

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function renderCart() {
    const cart = getCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-state">Your cart is empty</p>`;
        totalElement.textContent = "Total: $0.00";
        return;
    }

    cart.forEach(product => {
        const div = document.createElement("div");
        div.className = "cart-card";
        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>
                Quantity:
                <button class="decrease" data-id="${product.id}">-</button>
                <span>${product.quantity}</span>
                <button class="increase" data-id="${product.id}">+</button>
            </p>
            <p>Subtotal: $${(product.price * product.quantity).toFixed(2)}</p>
            <button class="remove" data-id="${product.id}">Remove</button>
        `;
        cartContainer.appendChild(div);
    });

    calculateTotal();
}

function updateQuantity(id, change) {
    let cart = getCart();
    const product = cart.find(item => item.id === id);
    if (!product) return;

    product.quantity += change;

    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
}

function calculateTotal() {
    const cart = getCart();
    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

cartContainer.addEventListener("click", e => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("increase")) updateQuantity(id, 1);
    if (e.target.classList.contains("decrease")) updateQuantity(id, -1);
    if (e.target.classList.contains("remove")) removeFromCart(id);
});

clearCartButton.addEventListener("click", clearCart);

renderCart();
const checkoutButton = document.getElementById("checkout");
const orderStatus = document.getElementById("order-status");

checkoutButton.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
        orderStatus.textContent = "Your cart is empty.";
        return;
    }
    orderStatus.textContent = "Your order has been placed! Order tracking will be available soon.";
    checkoutButton.disabled = true;
});
