// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.warn("VITE_API_URL not set, using default");
}

const API = BASE_URL || "https://quickcart-3vqg.vercel.app";

const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.warn("Cannot access localStorage:", error);
    return null;
  }
};

const apiRequest = (endpoint, options = {}) => {
  const url = `${API}${endpoint}`;
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth header if token exists
  const token = getToken();
  if (token && !endpoint.includes('/signup') && !endpoint.includes('/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, config).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  });
};

// === AUTH ===
export const signup = (data) => 
  apiRequest("/api/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const login = (data) => 
  apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

// === ORDERS ===
export const placeOrder = (data) => 
  apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyOrders = () => 
  apiRequest("/api/my-orders");

// === CONTACT ===
export const contact = (data) =>
  apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });

// === PASSWORD RESET ===
export const forgotPassword = (email) =>
  apiRequest("/api/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (data) =>
  apiRequest("/api/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });