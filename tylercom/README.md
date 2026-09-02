# TYLERCOM

A front-end e-commerce demo built with vanilla HTML, CSS, and JavaScript. Products are pulled live from the [DummyJSON](https://dummyjson.com/) API, with a simulated cart, login/register system, and admin panel — all running entirely in the browser with no backend server.

## Features

- **Product browsing** — Products are fetched from DummyJSON and grouped by category (Mobile, Home appliances, Fashion, Laptops, Vehicle, Men's, Women's).
- **Search** — Live search against the DummyJSON search endpoint, with a friendly fallback message if nothing is found or the request fails.
- **Cart** — Add products, adjust quantities, remove items, and see a running total. Cart state persists in `localStorage`.
- **Checkout (simulated)** — Placing an order shows a confirmation message. There's no real payment or fulfillment backend — it's a placeholder for "order tracking coming soon."
- **Accounts** — Register a new user or sign in with an existing one. Accounts are stored in the browser's `localStorage`.
- **Admin panel** — A seeded admin account can add and delete products, which then appear alongside the DummyJSON catalog and in search results.
- **Personalized greeting** — Greets the signed-in user (or "Guest") based on the time of day.
- **Weather-based suggestions** — Uses the browser's geolocation and the [Open-Meteo](https://open-meteo.com/) API (no key required) to suggest categories based on current conditions (e.g. rain → umbrellas, hot → sunglasses).
- **Dark/light theme toggle** — Persists across pages via `localStorage`.

## Tech stack

- Vanilla JavaScript (ES modules), HTML, CSS — no build step, no framework
- [DummyJSON](https://dummyjson.com/) for product data
- [Open-Meteo](https://open-meteo.com/) for weather data
- Font Awesome (via CDN) for icons
- `localStorage` for cart, theme, accounts, and admin-added products (this app has no real backend/database)

## Project structure

```
├── index.html          Shop homepage
├── cart.html            Cart page
├── login.html            Sign-in page
├── register.html          Registration page
├── admin.html              Admin product management (admin only)
├── css/
│   ├── style.css        Shop/homepage styles
│   ├── cart.css          Cart page styles
│   └── auth.css            Login/register/admin + greeting/weather styles
└── js/
    ├── app.js           Homepage logic: product rendering, search, nav, greeting, weather
    ├── cart.js           Cart logic: quantities, totals, checkout
    ├── auth.js            Shared auth/admin-product logic (localStorage-backed)
    ├── login.js           Login form handling
    ├── register.js          Registration form handling
    ├── admin.js             Admin panel logic
    └── api.js              DummyJSON fetch helpers
```

## Getting started

### Run locally

Because the app uses ES modules and browser geolocation, it needs to be served over `http://localhost` or `https://` — opening `index.html` directly as a `file://` URL will break module imports and silently block geolocation.

Easiest options:
- **VS Code**: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server."
- **Python**: run `python -m http.server` from the project folder, then visit `http://localhost:8000`.

### Deploy to GitHub Pages

1. Push the project to a public GitHub repository (all files at the repo root).
2. In the repo, go to **Settings → Pages**, set Source to **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. Your site will be live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

GitHub Pages serves over HTTPS, so geolocation (needed for the weather suggestion) works out of the box there.

## Admin login

A demo admin account is seeded automatically the first time the site loads in a browser:

- **Username:** `admin`
- **Password:** `admin123`

Log in at `login.html` with these credentials to reach the admin panel and add/remove products.

## Known limitations

This is a front-end learning/demo project, not production software:

- **No real backend.** Accounts, sessions, admin-added products, and the cart all live in `localStorage`. They're scoped to a single browser on a single device — clearing site data wipes everything, and different visitors don't share data.
- **Passwords are stored in plain text** in `localStorage`. Fine for a demo; never do this in a real production app.
- **No real checkout.** "Placing an order" just shows a confirmation message — there's no payment processing or order tracking.
- **Weather suggestions require location permission.** If a visitor denies the browser's location prompt, the suggestion box stays empty.

## License

For personal/educational use.
