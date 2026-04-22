// src/app/services/authService.ts

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  // 1. Sign up a new user
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to sign up');
    return data;
  },

  // 2. Log in an existing user
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to log in');
    return data;
  },

  // 3. Log out
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};
