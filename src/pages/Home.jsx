// pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

const localProducts = [ /* your 19 products */ ];

export default function Home({ addToCart }) {
  const [products, setProducts] = useState(localProducts); // Show local first
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const searchRef = useRef(null);
  const location = useLocation();

  // === GET SEARCH FROM URL (NAVBAR) ===
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  // === 1. CACHE ALL 194+ PRODUCTS ===
  useEffect(() => {
    const cached = localStorage.getItem("quickcart_all_products");
    const cacheTime = localStorage.getItem("quickcart_cache_time");

    const isCacheValid = cached && cacheTime && (Date.now() - cacheTime < 1000 * 60 * 60); // 1 hour

    if (isCacheValid) {
      setProducts(prev => [...prev, ...JSON.parse(cached)]);
      setInitialLoad(false);
      return;
    }

    const loadAllProducts = async () => {
      setInitialLoad(true);
      try {
        const response = await fetch("https://dummyjson.com/products?limit=194");
        const data = await response.json();
        const apiProducts = (data.products || []).map(p => ({
          name: p.title,
          price: p.price,
          image: p.thumbnail || p.images?.[0] || "/fallback.jpg"
        }));

        // Cache for next load
        localStorage.setItem("quickcart_all_products", JSON.stringify(apiProducts));
        localStorage.setItem("quickcart_cache_time", Date.now().toString());

        setProducts(prev => [...prev, ...apiProducts]);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setInitialLoad(false);
      }
    };

    loadAllProducts();
  }, []);

  // === 2. SEARCH LOGIC (debounced + cached) ===
  useEffect(() => {
    let isCurrent = true;
    let debounceTimer;

    const search = async () => {
      if (!isCurrent) return;

      if (searchTerm.length === 0) {
        // Show full list
        const cached = localStorage.getItem("quickcart_all_products");
        const fullList = cached ? JSON.parse(cached) : [];
        setProducts([...localProducts, ...fullList]);
        setSuggestions([]);
        return;
      }

      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      const localMatches = localProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      try {
        const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=30`;
        const response = await fetch(url);
        const data = await response.json();
        const rawApi = data.products || [];
        const mappedApi = rawApi.map(p => ({
          name: p.title,
          price: p.price,
          image: p.thumbnail || p.images?.[0] || "/fallback.jpg"
        }));

        const apiMatches = mappedApi.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const merged = [
          ...localMatches,
          ...apiMatches.filter(apiP =>
            !localMatches.some(localP => localP.name.toLowerCase() === apiP.name.toLowerCase())
          )
        ];

        if (isCurrent) {
          setProducts(merged);
          setSuggestions(merged.slice(0, 5));
        }
      } catch (err) {
        if (isCurrent) {
          setProducts(localMatches);
          setSuggestions(localMatches.slice(0, 5));
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(search, 300);

    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  // === 3. CLICK OUTSIDE TO CLOSE SUGGESTIONS ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
  };

  // === RENDER ===
  return (
    <section className="home">
      <h2 style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
        All 200+ Products
      </h2>

      {/* LOADING STATES */}
      {initialLoad && (
        <div className="loader">
          <div className="spinner"></div> Loading products...
        </div>
      )}

      {loading && searchTerm && (
        <div className="loader">
          <div className="spinner"></div> Searching...
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
    </section>
  );
}