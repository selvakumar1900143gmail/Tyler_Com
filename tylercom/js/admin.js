import { getCurrentUser, logoutUser, getAdminProducts, addAdminProduct, deleteAdminProduct } from "./auth.js";

const user = getCurrentUser();
if (!user || user.role !== "admin") {
    window.location.href = "login.html";
}

const form = document.getElementById("product-form");
const listEl = document.getElementById("admin-product-list");
const logoutBtn = document.getElementById("admin-logout");

function renderList() {
    const products = getAdminProducts();
    if (products.length === 0) {
        listEl.innerHTML = `<p class="empty-state">No products added yet.</p>`;
        return;
    }
    listEl.innerHTML = products.map(p => `
        <div class="admin-product-row">
            <img src="${p.thumbnail}" alt="${p.title}">
            <div>
                <p><strong>${p.title}</strong></p>
                <p>$${p.price} · ${p.category}</p>
            </div>
            <button class="remove" data-id="${p.id}">Delete</button>
        </div>
    `).join("");
}

form.addEventListener("submit", e => {
    e.preventDefault();
    addAdminProduct({
        title: document.getElementById("p-title").value.trim(),
        price: document.getElementById("p-price").value,
        category: document.getElementById("p-category").value.trim(),
        thumbnail: document.getElementById("p-thumbnail").value.trim(),
        description: document.getElementById("p-description").value.trim()
    });
    form.reset();
    renderList();
});

listEl.addEventListener("click", e => {
    if (!e.target.classList.contains("remove")) return;
    deleteAdminProduct(Number(e.target.dataset.id));
    renderList();
});

logoutBtn.addEventListener("click", () => {
    logoutUser();
    window.location.href = "index.html";
});

renderList();