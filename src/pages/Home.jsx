// pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

const localProducts = [ /* your 19 products */];

export default function Home({ addToCart }) {
  const [allProducts, setAllProducts] = useState([...localProducts]);
  const [products, setProducts] = useState([...localProducts]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const location = useLocation();

  // === GET SEARCH FROM URL (NAVBAR) ===
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  // === 1. CACHE ALL 194+ PRODUCTS & CATEGORIES ===
  useEffect(() => {
    const cachedProducts = localStorage.getItem("quickcart_all_products");
    const cachedCats = localStorage.getItem("quickcart_categories");

    if (cachedProducts) {
      const parsed = JSON.parse(cachedProducts);
      setAllProducts([...localProducts, ...parsed]);
      setProducts([...localProducts, ...parsed]);
      setInitialLoad(false);
    }

    if (cachedCats) {
      setCategories(JSON.parse(cachedCats));
    }

    const loadData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch("https://dummyjson.com/products/category-list");
        const catData = await catRes.json();
        const fullCats = ["All", ...catData];
        setCategories(fullCats);
        localStorage.setItem("quickcart_categories", JSON.stringify(fullCats));

        // Fetch Products
        const response = await fetch("https://dummyjson.com/products?limit=194");
        const data = await response.json();
        const apiProducts = (data.products || []).map(p => ({
          name: p.title,
          price: p.price,
          image: p.thumbnail || p.images?.[0] || "/fallback.jpg",
          category: p.category
        }));

        localStorage.setItem("quickcart_all_products", JSON.stringify(apiProducts));
        setAllProducts([...localProducts, ...apiProducts]);
        setInitialLoad(false);
      } catch (err) {
        console.error("Failed to load products:", err);
        setInitialLoad(false);
      }
    };

    loadData();
  }, []);

  // === 2. FILTERING LOGIC (Combined Category + Search) ===
  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);

  // === CATEGORY STYLE HELPERS ===
  const categoryContainerStyle = {
    display: "flex",
    gap: "0.5rem",
    overflowX: "auto",
    padding: "0.5rem 5%",
    marginBottom: "1.5rem",
    scrollbarWidth: "none",
    msOverflowStyle: "none"
  };

  const categoryButtonStyle = (cat) => ({
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: selectedCategory === cat ? "var(--primary)" : "var(--glass)",
    backdropFilter: "blur(4px)",
    color: selectedCategory === cat ? "white" : "var(--text)",
    fontSize: "var(--font-xs)",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s"
  });

  // === RENDER ===
  return (
    <section className="home">
      <h2 style={{ textAlign: "center", margin: "1.5rem 0 1rem", fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)" }}>
        Our Collections
      </h2>

      {/* CATEGORY BAR */}
      <div style={categoryContainerStyle} className="category-bar">
        {categories.map(cat => (
          <button
            key={cat}
            style={categoryButtonStyle(cat)}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* LOADING STATES */}
      {initialLoad && (
        <div className="loader">
          <div className="spinner"></div> Fast loading products...
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {products.map((item, index) => (
          <ProductCard
            key={`${item.name}-${index}`}
            name={item.name}
            price={item.price}
            image={item.image}
            onAddToCart={() => addToCart(item)}
          />
        ))}
      </div>

      {products.length === 0 && !initialLoad && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          No products found matching your criteria.
        </div>
      )}
    </section>
  );
}
