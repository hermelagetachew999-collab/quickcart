// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

export default function Navbar({ user, setUser, cartCount }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogout, setShowLogout] = useState(false); // NEW: TOGGLE LOGOUT
  const navigate = useNavigate();

  // === GLOBAL SEARCH: FILTERS HOME PAGE ===
  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/?search=${encodeURIComponent(term)}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogout(false);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/">Shopping Cart</Link>
      </h2>

      {/* SEARCH BAR — FILTERS HOME PAGE */}
      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search 200+ products..."
          className="navbar-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cart">Cart ({cartCount})</Link></li>

        {/* AUTH / PROFILE */}
        <li className="auth-item">
          {user ? (
            <div className="profile-container">
              {/* PROFILE AVATAR (FIRST LETTER) */}
              <div
                className="profile-avatar"
                onClick={() => setShowLogout(!showLogout)}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              {/* LOGOUT DROPDOWN */}
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
              }}
            >
              Login / Signup
            </button>
          )}
        </li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* AUTH MODAL */}
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