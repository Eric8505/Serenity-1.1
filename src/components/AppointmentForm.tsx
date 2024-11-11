import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Appointment } from '../types/appointments';

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (appointment: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [appointment, setAppointment] = useState<Partial<Appointment>>({
    title: '',
    description: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
    type: 'individual',
    status: 'scheduled',
    location: '',
    staffIds: [],
    reminderSent: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointment.title && appointment.startTime && appointment.endTime) {
      onSubmit(appointment as Omit<Appointment, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium text-text">
          {initialData ? 'Edit Appointment' : 'New Appointment'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-secondary hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Title
          </label>
          <input
            type="text"
            value={appointment.title}
            onChange={e => setAppointment({ ...appointment, title: e.target.value })}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Description
          </label>
          <textarea
            value={appointment.description}
            onChange={e => setAppointment({ ...appointment, description: e.target.value })}
            className="w-full rounded-lg border-border bg-surface text-text"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={appointment.startTime}
              onChange={e => setAppointment({ ...appointment, startTime: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={appointment.endTime}
              onChange={e => setAppointment({ ...appointment, endTime: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Type
            </label>
            <select
              value={appointment.type}
              onChange={e => setAppointment({ ...appointment, type: e.target.value as Appointment['type'] })}
              className="w-full rounded-lg border-border bg-surface text-text"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="medical">Medical</option>
              <option value="virtual">Virtual</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Location
            </label>
            <input
              type="text"
              value={appointment.location}
              onChange={e => setAppointment({ ...appointment, location: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Update' : 'Create'} Appointment
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;