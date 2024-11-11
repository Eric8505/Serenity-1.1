import { Appointment, AppointmentReminder } from '../types/appointments';
import { format, addDays, isBefore } from 'date-fns';

export const createAppointmentReminder = (
  appointment: Appointment,
  recipientIds: string[]
): AppointmentReminder => {
  const appointmentDate = new Date(appointment.startTime);
  const reminderDate = addDays(appointmentDate, -1); // 1 day before

  return {
    id: crypto.randomUUID(),
    appointmentId: appointment.id,
    recipientIds,
    scheduledFor: format(reminderDate, "yyyy-MM-dd'T'HH:mm:ss"),
    sent: false,
    type: 'email',
    status: 'pending'
  };
};

export const sendAppointmentReminder = async (reminder: AppointmentReminder, appointment: Appointment) => {
  try {
    // In a real app, this would make an API call to your email service
    console.log('Sending reminder:', {
      to: reminder.recipientIds,
      subject: `Reminder: ${appointment.title} tomorrow`,
      body: `
        This is a reminder for your appointment tomorrow:
        
        Title: ${appointment.title}
        Date: ${format(new Date(appointment.startTime), 'MMMM d, yyyy')}
        Time: ${format(new Date(appointment.startTime), 'h:mm a')} - ${format(new Date(appointment.endTime), 'h:mm a')}
        Location: ${appointment.location || 'Not specified'}
        
        Please ensure you arrive on time.
      `
    });

    return {
      ...reminder,
      sent: true,
      sentAt: new Date().toISOString(),
      status: 'sent' as const
    };
  } catch (error) {
    console.error('Failed to send reminder:', error);
    return {
      ...reminder,
      status: 'failed' as const
    };
  }
};

export const checkAndSendReminders = async (
  reminders: AppointmentReminder[],
  appointments: Appointment[]
) => {
  const now = new Date();
  const updatedReminders: AppointmentReminder[] = [];

  for (const reminder of reminders) {
    if (!reminder.sent && isBefore(new Date(reminder.scheduledFor), now)) {
      const appointment = appointments.find(a => a.id === reminder.appointmentId);
      if (appointment) {
        const updatedReminder = await sendAppointmentReminder(reminder, appointment);
        updatedReminders.push(updatedReminder);
      }
    }
  }

  return updatedReminders;
};</content>