import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Video, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../types/appointments';
import AppointmentForm from './AppointmentForm';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onViewAppointment: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAddAppointment,
  onEditAppointment,
  onViewAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.startTime), date)
    );
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    onAddAppointment(appointment);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-background rounded-lg"
          >
            <ChevronLeft className="h-5 w-5 text-text-secondary" />
          </button>
          <h2 className="text-lg font-medium text-text">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-background rounded-lg"
          >
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </button>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-background p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
        {daysInMonth.map((date, idx) => (
          <div
            key={idx}
            className={`bg-surface min-h-[120px] p-2 ${
              !isSameMonth(date, selectedDate) ? 'opacity-50' : ''
            } ${isToday(date) ? 'bg-accent/5' : ''}`}
          >
            <div className="text-sm font-medium text-text-secondary mb-2">
              {format(date, 'd')}
            </div>
            <div className="space-y-1">
              {getAppointmentsForDay(date).map(appointment => (
                <div
                  key={appointment.id}
                  onClick={() => onViewAppointment(appointment)}
                  className="p-2 rounded-md bg-background border border-border cursor-pointer hover:shadow-sm transition-shadow text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">
                        {appointment.title}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {format(new Date(appointment.startTime), 'h:mm a')}
                      </p>
                    </div>
                    {appointment.type === 'virtual' && (
                      <Video className="h-4 w-4 text-accent flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg w-full max-w-lg">
            <AppointmentForm
              onSubmit={handleAddAppointment}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;