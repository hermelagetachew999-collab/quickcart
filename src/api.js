// src/api.js
const API = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

export const signup = (data) => 
  fetch(`${API}/signup`, {
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

export const placeOrder = (data) => 
  fetch(`${API}/orders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  }).then(r => r.json());

export const getMyOrders = () => 
  fetch(`${API}/my-orders`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  }).then(r => r.json());