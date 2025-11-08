const API = "https://quickcart-n42rplipb-hermela-getachews-projects-6c383e2f.vercel.app";

const getToken = () => localStorage.getItem("token");

// === AUTH ===
export const signup = (data) => 
  fetch(`${API}/api/register`, {
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

// === PRODUCTS ===
export const getProducts = () => 
  fetch(`${API}/api/products`, {
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === CONTACT ===
export const contact = (data) =>
  fetch(`${API}/api/contact`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.json());

// === ORDERS - Add placeOrder function ===
export const placeOrder = (data) => 
  fetch(`${API}/api/contact`, { // Using contact endpoint as placeholder
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
  fetch(`${API}/api/products`, { // Using products endpoint as placeholder
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  }).then(r => r.json());