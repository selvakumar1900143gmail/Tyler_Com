const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const ADMIN_PRODUCTS_KEY = "adminProducts";

function seedAdmin() {
    const users = getUsers();
    if (!users.some(u => u.role === "admin")) {
        users.push({ username: "admin", email: "admin@tylercom.com", password: "admin123", role: "admin" });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function registerUser({ username, email, password }) {
    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: "That username is already taken." };
    }
    users.push({ username, email, password, role: "user" });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
}

export function loginUser(username, password) {
    seedAdmin();
    const users = getUsers();
    const match = users.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!match) return { success: false, message: "Invalid username or password." };

    const session = { username: match.username, role: match.role };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
    return { success: true, user: session };
}

export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
}

export function getAdminProducts() {
    return JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY)) || [];
}

export function addAdminProduct({ title, price, category, thumbnail, description }) {
    const products = getAdminProducts();
    const newProduct = {
        id: Date.now(),
        title,
        price: Number(price),
        category: category || "admin-added",
        thumbnail: thumbnail || "https://via.placeholder.com/300x300?text=No+Image",
        description: description || ""
    };
    products.push(newProduct);
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
}

export function deleteAdminProduct(id) {
    const products = getAdminProducts().filter(p => p.id !== id);
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

seedAdmin();