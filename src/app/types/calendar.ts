export type CalendarEventType = 'interview' | 'deadline' | 'follow-up' | 'other';
export type CalendarEventStatus = 'pending' | 'completed';

export interface CalendarEventBase {
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime?: string;
  endTime?: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  location?: string;
}

export interface CalendarEvent extends CalendarEventBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCalendarEvent = Omit<CalendarEvent, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateCalendarEvent = Partial<CreateCalendarEvent>;
