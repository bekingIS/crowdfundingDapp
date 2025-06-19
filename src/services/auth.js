// src/services/auth.js
const API_URL = "http://localhost:4000/auth";

export const register = async (email, password, role, walletAddress) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role, walletAddress }),
  });

  return res.json();
};



export const getProfile = async (uid, token) => {
  const res = await fetch(`http://localhost:4000/auth/profile?uid=${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

