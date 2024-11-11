export interface Appointment {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'individual' | 'group' | 'medical' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  staffIds: string[]; // IDs of staff members involved
  reminderSent: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // e.g., every 2 weeks
    daysOfWeek?: number[]; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  recipientIds: string[]; // staff member IDs
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
  type: 'email' | 'notification';
  status: 'pending' | 'sent' | 'failed';
}</content>