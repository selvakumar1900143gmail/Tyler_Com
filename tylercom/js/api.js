const categoryMap = {
    smartphones: ["mobile-accessories", "smartphones"],
    mens: ["mens-shirts", "mens-shoes", "mens-watches", "sunglasses"],
    womens: ["womens-bags", "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches"],
    accessories: ["beauty", "fragrances", "skin-care", "sports-accessories"],
    homeappliances: ["furniture", "groceries", "home-decoration", "kitchen-accessories"],
    vehicle: ["motorcycle", "vehicle"],
    laptops: ["laptops"],
    kids: []
};

function formatLabel(value) {
    return value
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export async function getProducts(group) {
    const types = categoryMap[group];

    if (!types || types.length === 0) {
        return {};
    }

    const requests = types.map(async type => {
        const url = `https://dummyjson.com/products/category/${type}?limit=0`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} for ${type}`);
        }

        const data = await response.json();
        return { type, products: data.products };
    });

    const results = await Promise.all(requests);

    const grouped = {};
    results.forEach(({ type, products }) => {
        if (products.length > 0) {
            grouped[formatLabel(type)] = products;
        }
    });

    return grouped;
}

export async function getOfferProducts() {
    const response = await fetch("https://dummyjson.com/products?limit=0");
    const data = await response.json();
    const offerProducts = data.products.slice(0, 40);

    const grouped = {};
    offerProducts.forEach(product => {
        const label = formatLabel(product.category);
        if (!grouped[label]) {
            grouped[label] = [];
        }
        grouped[label].push(product);
    });

    return grouped;
}
