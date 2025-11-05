// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optional: validate token
      setUser({ email: "user@example.com" });
    }
  }, []);

  const addToCart = (item) => setCart(prev => [...prev, item]);

  // REMOVE FROM CART
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cart} user={user} removeFromCart={removeFromCart} />} />
        <Route path="/contact" element={<Contact user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}