import { CalendarEvent, CreateCalendarEvent, UpdateCalendarEvent } from '../types/calendar';

const API_URL = 'http://localhost:5000/api/calendar';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Calendar service request failed');
  }
  return response.json();
};

export const calendarService = {
  async syncDashboardReminders(): Promise<{ syncedCount: number; events: CalendarEvent[] }> {
    const response = await fetch(`${API_URL}/sync-dashboard-reminders`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ syncedCount: number; events: CalendarEvent[] }>(response);
  },

  async getAllEvents(): Promise<{ events: CalendarEvent[] }> {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ events: CalendarEvent[] }>(response);
  },

  async getEventById(id: string): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<CalendarEvent>(response);
  },

  async createEvent(eventData: CreateCalendarEvent): Promise<CalendarEvent> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse<CalendarEvent>(response);
  },

  async updateEvent(id: string, eventData: UpdateCalendarEvent): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse<CalendarEvent>(response);
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};
