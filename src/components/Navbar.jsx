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
    if (term) {
      navigate(`/?search=${encodeURIComponent(term)}`);
    } else {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogout(false);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/" onClick={closeMobileMenu}>QuickCart</Link>
      </h2>

      <button
        className="hamburger-menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={mobileMenuOpen ? "active" : ""}></span>
        <span className={mobileMenuOpen ? "active" : ""}></span>
        <span className={mobileMenuOpen ? "active" : ""}></span>
      </button>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search 200+ products..."
          className="navbar-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search button removed as requested */}
      </form>

      <ul className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
        <li><Link to="/cart" onClick={closeMobileMenu}>Cart ({cartCount})</Link></li>
        <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>

        {/* MOBILE CATEGORIES SECTION */}
        {mobileMenuOpen && categories && (
          <li className="mobile-categories-section">
            <span className="mobile-section-title">Collections</span>
            <div className="mobile-category-list">
              {categories.slice(0, 14).map(cat => (
                <Link
                  key={cat}
                  to={`/?category=${encodeURIComponent(cat)}`}
                  onClick={closeMobileMenu}
                  className="mobile-category-link"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Link>
              ))}
            </div>
          </li>
        )}

        <li className="auth-item">
          {user ? (
            <div className="profile-container">
              <div
                className="profile-avatar"
                onClick={() => setShowLogout(!showLogout)}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              {showLogout && (
                <div className="logout-dropdown">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="auth-btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
                closeMobileMenu();
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
