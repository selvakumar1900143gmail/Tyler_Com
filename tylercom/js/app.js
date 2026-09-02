import { getProducts, getOfferProducts } from "./api.js";
import { getCurrentUser, logoutUser, getAdminProducts } from "./auth.js";

const navButton = document.getElementById("nav-button");
const navBar = document.getElementById("nav-bar");
const navClose = document.getElementById("nav-close");
const navOverlay = document.getElementById("nav-overlay");
const productCards = document.getElementById("product-cards");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const links = document.querySelectorAll("a[data-category]");

let products = [];

function openNav() {
    navBar.classList.add("open");
    navOverlay.classList.add("visible");
    navButton.setAttribute("aria-expanded", "true");
}

function closeNav() {
    navBar.classList.remove("open");
    navOverlay.classList.remove("visible");
    navButton.setAttribute("aria-expanded", "false");
}

navButton.addEventListener("click", openNav);
navClose.addEventListener("click", closeNav);
navOverlay.addEventListener("click", closeNav);

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

function renderProducts(grouped) {
    productCards.innerHTML = "";

    const entries = Object.entries(grouped);

    if (entries.length === 0) {
        productCards.innerHTML = `<p class="empty-state">No products found in this category yet.</p>`;
        return;
    }

    entries.forEach(([typeLabel, list]) => {
        const block = document.createElement("section");
        block.className = "category-block";

        const title = document.createElement("h2");
        title.className = "category-title";
        title.textContent = typeLabel;
        block.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "category-grid";

        list.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="product-card-body">
                    <p class="product-title">${product.title}</p>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">$${product.price}</p>
                </div>
                <button class="add-cart" data-product-id="${product.id}">Add to cart</button>
            `;
            grid.appendChild(card);
        });

        block.appendChild(grid);
        productCards.appendChild(block);
    });
}

async function loadCategory(category) {
    let grouped;

    if (category === "all") {
        grouped = await getOfferProducts();
    } else {
        grouped = await getProducts(category);
    }

    const adminProducts = getAdminProducts();
    if (adminProducts.length > 0) {
        grouped["Admin Added"] = adminProducts;
    }

    products = Object.values(grouped).flat();
    renderProducts(grouped);
}

links.forEach(link => {
    link.addEventListener("click", async e => {
        e.preventDefault();
        closeNav();
        try {
            await loadCategory(link.dataset.category);
        } catch (error) {
            console.log(error);
        }
    });
});

productCards.addEventListener("click", e => {
    if (!e.target.classList.contains("add-cart")) return;

    const productId = Number(e.target.dataset.productId);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
});

async function runSearch() {
    const term = searchInput.value.trim();
    if (!term) return;

    productCards.innerHTML = `<p class="empty-state">Searching...</p>`;

    try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        const adminMatches = getAdminProducts().filter(p =>
            p.title.toLowerCase().includes(term.toLowerCase())
        );
        const results = [...data.products, ...adminMatches];

        if (results.length === 0) {
            productCards.innerHTML = `<p class="empty-state">Sorry, couldn't fetch that product.</p>`;
            return;
        }

        products = results;
        renderProducts({ [`Results for "${term}"`]: results });
    } catch (error) {
        console.log(error);
        productCards.innerHTML = `<p class="empty-state">Sorry, couldn't fetch that product.</p>`;
    }
}

searchButton.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") runSearch();
});
function renderGreeting() {
    const el = document.getElementById("greeting");
    if (!el) return;
    const user = getCurrentUser();
    const hour = new Date().getHours();
    let timeGreeting = "Good evening";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    el.textContent = `${timeGreeting}, ${user ? user.username : "Guest"}!`;
}

function weatherSuggestionText(code, temp) {
    const rainCodes = [61, 63, 65, 80, 81, 82, 95, 96, 99];
    if (rainCodes.includes(code)) {
        return `It looks rainy where you are (${temp}°C) — check out umbrellas and rain jackets.`;
    }
    if (temp >= 28) return `It's ${temp}°C and warm — sunglasses and summer wear are calling.`;
    if (temp <= 10) return `A chilly ${temp}°C today — good day to browse jackets and coats.`;
    return `A pleasant ${temp}°C today — great weather to see what's new.`;
}

function renderWeatherSuggestion() {
    const box = document.getElementById("weather-suggestion");
    if (!box || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        async position => {
            try {
                const { latitude, longitude } = position.coords;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("Weather request failed");
                const data = await response.json();
                const { temperature, weathercode } = data.current_weather;
                box.textContent = weatherSuggestionText(weathercode, Math.round(temperature));
            } catch (error) {
                console.log(error);
            }
        },
        () => { /* permission denied or unavailable — silently skip */ }
    );
}

function renderAccountNav() {
    const user = getCurrentUser();
    const authLink = document.querySelector(".nav-header-first a");
    if (!authLink) return;

    if (user) {
        authLink.textContent = `Hi, ${user.username}`;
        authLink.href = "#";
        authLink.onclick = e => {
            e.preventDefault();
            logoutUser();
            window.location.reload();
        };

        if (user.role === "admin") {
            const adminSection = document.createElement("section");
            adminSection.innerHTML = `<a href="admin.html"><i class="fa-solid fa-user-shield"></i>Admin panel</a>`;
            document.querySelector(".nav-fifth").after(adminSection);
        }
    } else {
        authLink.textContent = "Sign in";
        authLink.href = "login.html";
        authLink.onclick = null;
    }
}

renderGreeting();
renderWeatherSuggestion();
renderAccountNav();

loadCategory("all").catch(error => console.log(error));
