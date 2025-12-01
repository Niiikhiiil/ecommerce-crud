const BASE_URL = "https://fakestoreapi.com";

export const api = {
  getAllProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  getProduct: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
  getByCategory: async (cat) => {
    const res = await fetch(
      `${BASE_URL}/products/category/${encodeURIComponent(cat)}`
    );
    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
  },
  addProduct: async (product) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to add product");
    return res.json();
  },
  updateProduct: async (id, product) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  },
  deleteProduct: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
  },
};
