const API_URL = "https://quickcart-bips.onrender.com";

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
