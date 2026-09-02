import { loginUser } from "./auth.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");

form.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const result = loginUser(username, password);

    if (!result.success) {
        errorEl.textContent = result.message;
        return;
    }

    window.location.href = result.user.role === "admin" ? "admin.html" : "index.html";
});