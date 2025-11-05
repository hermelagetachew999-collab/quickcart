// src/api.js
const API = "https://quickcart-bips.onrender.com"; // your Render backend URL

const getToken = () => localStorage.getItem("token");

// === AUTH ===
export const signup = (data) => 
  fetch(`${API}/api/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

export const login = (data) => 
  fetch(`${API}/api/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === ORDERS ===
export const placeOrder = (data) => 
  fetch(`${API}/api/orders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  }).then(r => r.json());

export const getMyOrders = () => 
  fetch(`${API}/api/my-orders`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  }).then(r => r.json());

// === CONTACT ===
export const contact = (data) =>
  fetch(`${API}/api/contact`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === PASSWORD RESET ===
export const forgotPassword = (email) =>
  fetch(`${API}/api/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

export const resetPassword = (data) =>
  fetch(`${API}/api/reset-password`, {
    method: "POST",
    body: JSON.stringify(data), // { email, code, newPassword }
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());
