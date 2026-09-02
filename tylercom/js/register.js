import { registerUser } from "./auth.js";

const form = document.getElementById("register-form");
const errorEl = document.getElementById("register-error");
const successEl = document.getElementById("register-success");

form.addEventListener("submit", e => {
    e.preventDefault();
    errorEl.textContent = "";
    successEl.textContent = "";

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    const result = registerUser({ username, email, password });

    if (!result.success) {
        errorEl.textContent = result.message;
        return;
    }

    successEl.textContent = "Account created! Redirecting to sign in...";
    setTimeout(() => window.location.href = "login.html", 1200);
});