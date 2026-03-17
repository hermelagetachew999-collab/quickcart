const API_URL = import.meta.env.VITE_API_URL || "https://quickcart-bips.onrender.com";
console.log("API_URL configured as:", API_URL);

const getToken = () => localStorage.getItem("token");

// === AUTH ===
export const signup = (data) =>
  fetch(`${API_URL}/api/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());

export const login = (data) =>
  fetch(`${API_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());

export const forgotPassword = (email) =>
  fetch(`${API_URL}/api/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const verifyCode = (email, code) =>
  fetch(`${API_URL}/api/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  }).then((r) => r.json());

export const resetPassword = (data) =>
  fetch(`${API_URL}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// === PRODUCTS ===
export const getProducts = () =>
  fetch(`${API_URL}/api/products`, {
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());

// === CONTACT ===
export const contact = (data) =>
  fetch(`${API_URL}/api/contact`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());

// === ORDERS ===
export const placeOrder = (data) =>
  fetch(`${API_URL}/api/orders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((r) => r.json());

export const getMyOrders = () =>
  fetch(`${API_URL}/api/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((r) => r.json());
