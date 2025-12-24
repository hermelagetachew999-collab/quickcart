import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>QuickCart</h3>
          <p>Your one-stop shop for quality products at great prices.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul className="footer-links">
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/">Browse Products</Link></li>
            <li><Link to="/contact">Help & Support</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <p>Stay updated with our latest offers and products.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span>📘</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <span>🐦</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span>📷</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} QuickCart. All rights reserved.</p>
      </div>
    </footer>
  );
}
