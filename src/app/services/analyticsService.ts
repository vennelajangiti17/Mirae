const API_BASE = 'http://127.0.0.1:5000/api';

export async function getAnalyticsOverview() {
  const response = await fetch(`${API_BASE}/analytics/overview`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics overview');
  }

  return response.json();
}

export async function getStatusBreakdown() {
  const response = await fetch(`${API_BASE}/analytics/status-breakdown`);

  if (!response.ok) {
    throw new Error('Failed to fetch status breakdown');
  }

  return response.json();
}

export async function getTrends() {
  const response = await fetch(`${API_BASE}/analytics/trends`);

  if (!response.ok) {
    throw new Error('Failed to fetch trends');
  }

  return response.json();
}
