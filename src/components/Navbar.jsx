// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

export default function Navbar({ user, setUser, cartCount, categories }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/?search=${encodeURIComponent(term)}` : "/");
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat) => {
    navigate(`/?category=${encodeURIComponent(cat)}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogout(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>QuickCart</Link>
      </h2>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search products..."
          className="navbar-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search button removed as requested */}
      </form>

      <button
        className="hamburger-menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart ({cartCount})</Link></li>

        {/* MOBILE ONLY CATEGORIES */}
        {mobileMenuOpen && categories && (
          <li className="mobile-categories">
            <p style={{ color: "var(--primary)", fontSize: "0.8rem", margin: "1rem 0 0.5rem", fontWeight: "bold" }}>Categories</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "0.5rem" }}>
              {categories.slice(0, 8).map(cat => (
                <span
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{ cursor: "pointer", fontSize: "0.9rem", color: "#ccc" }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          </li>
        )}

        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>

        <li className="auth-item">
          {user ? (
            <div className="profile-container">
              <div className="profile-avatar" onClick={() => setShowLogout(!showLogout)}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showLogout && (
                <div className="logout-dropdown">
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="auth-btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
            >
              Login / Signup
            </button>
          )}
        </li>
      </ul>

      {showAuthModal && !user && (
        <AuthModal
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setUser={setUser}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </nav>
  );
}
