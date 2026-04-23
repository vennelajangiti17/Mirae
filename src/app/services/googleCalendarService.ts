const API_URL = 'http://localhost:5000/api/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'Google Calendar request failed');
  }
  return body;
};

export const googleCalendarService = {
  async getAuthUrl() {
    const response = await fetch(`${API_URL}/google/url`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getConnectionStatus() {
    const response = await fetch(`${API_URL}/google/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async syncGoogleCalendar() {
    const response = await fetch(`${API_URL}/google/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
