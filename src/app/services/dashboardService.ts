const API_BASE = 'http://127.0.0.1:5000/api';

export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE}/dashboard/summary`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return response.json();
}

export async function getRecentJobs() {
  const response = await fetch(`${API_BASE}/dashboard/recent`);

  if (!response.ok) {
    throw new Error('Failed to fetch recent jobs');
  }

  return response.json();
}
