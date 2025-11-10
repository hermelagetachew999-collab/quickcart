const API_URL = "https://quickcart-bips.onrender.com";


const getToken = () => localStorage.getItem("token");

// === AUTH ===
export const signup = (data) => 
  fetch(`${API}/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

export const login = (data) => 
  fetch(`${API}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === PRODUCTS ===
export const getProducts = () => 
  fetch(`${API}/products`, {
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === CONTACT ===
export const contact = (data) =>
  fetch(`${API}/contact`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === ORDERS - Add placeOrder function ===
export const placeOrder = (data) => 
  fetch(`${API}/contact`, { // Using contact endpoint as placeholder
    method: "POST",
    body: JSON.stringify({
      ...data,
      type: 'order'
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  }).then(r => r.json());

export const getMyOrders = () => 
  fetch(`${API}/products`, { // Using products endpoint as placeholder
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  }).then(r => r.json());