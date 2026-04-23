const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE}/dashboard/summary`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return response.json();
}

export async function getRecentJobs() {
  const response = await fetch(`${API_BASE}/dashboard/recent`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recent jobs');
  }

  return response.json();
}

export async function deleteDashboardJob(jobId: string) {
  const response = await fetch(`${API_BASE}/tracker/${jobId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete job');
  }

  return response.json();
}
