// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ email: "user@example.com" });
    }

    fetch("https://dummyjson.com/products/category-list")
      .then(res => res.json())
      .then(data => {
        const fullCats = ["All", ...data];
        setCategories(fullCats);
        localStorage.setItem("quickcart_categories", JSON.stringify(fullCats));
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const addToCart = (item) => setCart(prev => [...prev, item]);

  // REMOVE FROM CART
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} cartCount={cart.length} categories={categories} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} categoriesProp={categories} />} />
        <Route path="/cart" element={<Cart cartItems={cart} user={user} removeFromCart={removeFromCart} />} />
        <Route path="/contact" element={<Contact user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}