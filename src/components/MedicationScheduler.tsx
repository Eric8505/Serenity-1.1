import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { MarSchedule } from '../types/mar';

interface MedicationSchedulerProps {
  medicationId: string;
  onScheduleCreate: (schedule: MarSchedule) => void;
}

const MedicationScheduler: React.FC<MedicationSchedulerProps> = ({
  medicationId,
  onScheduleCreate,
}) => {
  const [schedule, setSchedule] = useState<Partial<MarSchedule>>({
    medicationId,
    times: [],
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
  });

  const addTime = () => {
    setSchedule(prev => ({
      ...prev,
      times: [...(prev.times || []), '12:00'],
    }));
  };

  const removeTime = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      times: prev.times?.filter((_, i) => i !== index),
    }));
  };

  const updateTime = (index: number, value: string) => {
    setSchedule(prev => ({
      ...prev,
      times: prev.times?.map((time, i) => (i === index ? value : time)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schedule.times?.length && schedule.startDate) {
      onScheduleCreate(schedule as MarSchedule);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Frequency</label>
        <select
          value={schedule.frequency}
          onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value as MarSchedule['frequency'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {schedule.frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Days of Week</label>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  const days = schedule.daysOfWeek || [];
                  setSchedule({
                    ...schedule,
                    daysOfWeek: days.includes(index)
                      ? days.filter(d => d !== index)
                      : [...days, index],
                  });
                }}
                className={`p-2 text-sm font-medium rounded-md ${
                  schedule.daysOfWeek?.includes(index)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Administration Times</label>
          <button
            type="button"
            onClick={addTime}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Time
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {schedule.times?.map((time, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="time"
                value={time}
                onChange={(e) => updateTime(index, e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeTime(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={schedule.startDate}
            onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input
            type="date"
            value={schedule.endDate || ''}
            onChange={(e) => setSchedule({ ...schedule, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Schedule
        </button>
      </div>
    </form>
  );
};

export default MedicationScheduler;