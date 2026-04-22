// src/app/services/authService.ts

const AUTH_URL = 'http://localhost:5000/api/auth';
const PROFILE_URL = 'http://localhost:5000/api/profile';

// Helper to get the secure token from storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const authService = {
  // --- AUTHENTICATION METHODS ---

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to sign up');
    return data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to log in');
    return data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
    }
  },

  // --- PROFILE & RESUME METHODS ---

  // 1. Fetch the user's name, email, and stored resume text
  async getProfile() {
    const response = await fetch(PROFILE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  // 2. Save the extracted text from a resume PDF to the database
  async updateResume(resumeText: string) {
    const response = await fetch(`${PROFILE_URL}/resume`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resumeText }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update resume');
    return data;
  },

  // 3. Save the social links array
  async updateSocialLinks(socialLinks: any[]) {
    const response = await fetch(`${PROFILE_URL}/social-links`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ socialLinks }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update social links');
    return data;
  }
};
