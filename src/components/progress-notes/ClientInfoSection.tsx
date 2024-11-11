import React from 'react';
import { format } from 'date-fns';
import { Clock, Sun, Moon } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { ClientInfo } from './types';

interface ClientInfoSectionProps {
  client: ClientInfo;
  sessionDate: string;
  period: 'day' | 'night';
  startTime: string;
  endTime: string;
  sessionType: string;
  onDateChange: (date: string) => void;
  onPeriodChange: (period: 'day' | 'night') => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onSessionTypeChange: (type: string) => void;
  autosaveEnabled: boolean;
  onAutosaveChange: (enabled: boolean) => void;
  lastSaved: Date | null;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  client,
  sessionDate,
  period,
  startTime,
  endTime,
  sessionType,
  onDateChange,
  onPeriodChange,
  onStartTimeChange,
  onEndTimeChange,
  onSessionTypeChange,
  autosaveEnabled,
  onAutosaveChange,
  lastSaved,
}) => {
  // Default time ranges for day and night periods
  const dayStartTime = '07:00';
  const dayEndTime = '19:00';
  const nightStartTime = '19:00';
  const nightEndTime = '07:00';

  const handlePeriodChange = (newPeriod: 'day' | 'night') => {
    onPeriodChange(newPeriod);
    // Set default times based on period
    if (newPeriod === 'day') {
      onStartTimeChange(dayStartTime);
      onEndTimeChange(dayEndTime);
    } else {
      onStartTimeChange(nightStartTime);
      onEndTimeChange(nightEndTime);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-medium text-text">Progress Note</h2>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-text-secondary">
              Client: {client.firstName} {client.lastName}
            </p>
            {client.dateOfBirth && (
              <p className="text-sm text-text-secondary">
                DOB: {format(new Date(client.dateOfBirth), 'MM/dd/yyyy')}
              </p>
            )}
            {client.insuranceProvider && client.insuranceNumber && (
              <p className="text-sm text-text-secondary">
                Insurance: {client.insuranceProvider} ({client.insuranceNumber})
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Autosave</span>
            <Switch
              checked={autosaveEnabled}
              onCheckedChange={onAutosaveChange}
              size="sm"
            />
          </div>
          {lastSaved && (
            <span className="text-sm text-text-secondary flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last saved: {format(lastSaved, 'h:mm a')}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Date
          </label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Period
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handlePeriodChange('day')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border ${
                period === 'day'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-text-secondary hover:bg-background'
              }`}
            >
              <Sun className="h-4 w-4 mr-2" />
              Day
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('night')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border ${
                period === 'night'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-text-secondary hover:bg-background'
              }`}
            >
              <Moon className="h-4 w-4 mr-2" />
              Night
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Session Type
          </label>
          <select
            value={sessionType}
            onChange={(e) => onSessionTypeChange(e.target.value)}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          >
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="family">Family</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;