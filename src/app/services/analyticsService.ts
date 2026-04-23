const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export async function getAnalyticsOverview() {
  const response = await fetch(`${API_BASE}/analytics/overview`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics overview');
  }

  return response.json();
}

export async function getTrends() {
  const response = await fetch(`${API_BASE}/analytics/trends`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trends');
  }

  return response.json();
}



export async function getSkillGapAnalysis() {
  const response = await fetch(`${API_BASE}/analytics/skill-gap`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch skill gap analysis');
  }

  return response.json();
}

export async function getMatchInsights() {
  const response = await fetch(`${API_BASE}/analytics/match-insights`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch match insights');
  }

  return response.json();
}
