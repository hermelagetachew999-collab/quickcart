// src/api.js
const API = "https://quickcart-bips.onrender.com";

const getToken = () => localStorage.getItem("token");

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
