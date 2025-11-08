// src/pages/Cart.jsx
import React, { useState } from "react";
import { placeOrder } from "../api";

export default function Cart({ cartItems, user, removeFromCart }) {
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, i) => sum + i.price, 0).toFixed(2);

  const handleCheckout = () => {
    if (!user) return alert("Please login!");
    if (cartItems.length === 0) return alert("Cart is empty!");
    setShowModal(true);
  };

  const confirmCheckout = async () => {
    setLoading(true);
    try {
      const res = await placeOrder({ items: cartItems, total });
      if (res.success) {
        setShowModal(false);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
        // Clear cart after success
        removeFromCart("all");
      }
    } catch (err) {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  // CLEAR ALL ON SUCCESS
  if (orderSuccess && cartItems.length > 0) {
    removeFromCart("all");
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart">
        <h2>Your Cart is Empty</h2>
        <p>Add products to continue!</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <h2>Your Cart ({cartItems.length} items)</h2>

      <ul className="cart-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            {/* REMOVE BUTTON */}
            <button
              className="remove-btn"
              onClick={() => removeFromCart(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>Total: ${total}</h3>
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Order</h3>
            <p><strong>Total: ${total}</strong></p>
            <div className="modal-actions">
              <button onClick={confirmCheckout} disabled={loading}>
                {loading ? "Placing..." : "Confirm"}
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="success-message">
          Order placed! Cart cleared.
        </div>
      )}
    </section>
  );
}