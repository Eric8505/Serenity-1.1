import React from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { Check, X, AlertCircle, Clock } from 'lucide-react';
import { MarSchedule, MedicationAdministration } from '../../types/mar';
import { Medication } from '../../types/medication';

interface MedicationScheduleProps {
  medication: Medication;
  schedule: MarSchedule;
  administrations: MedicationAdministration[];
  onAdminister: (time: string) => void;
  onMissed: (time: string) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({
  medication,
  schedule,
  administrations,
  onAdminister,
  onMissed,
}) => {
  const getAdministrationStatus = (scheduledTime: string) => {
    const administration = administrations.find(a => a.scheduledTime === scheduledTime);
    if (!administration) {
      if (isAfter(new Date(), parseISO(scheduledTime))) {
        return 'missed';
      }
      return 'scheduled';
    }
    return administration.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'administered':
        return 'text-green-500';
      case 'missed':
        return 'text-red-500';
      case 'refused':
        return 'text-yellow-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'administered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'missed':
        return <X className="h-5 w-5 text-red-500" />;
      case 'refused':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-text">{medication.name}</h3>
        <div className="text-sm text-text-secondary">
          {medication.dosage} - {medication.frequency}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 bg-background border-b border-border">
          <h4 className="font-medium text-text">Schedule</h4>
        </div>

        <div className="divide-y divide-border">
          {schedule.times.map((time) => {
            const status = getAdministrationStatus(time);
            const isPast = isAfter(new Date(), parseISO(time));

            return (
              <div
                key={time}
                className="p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(status)}
                  <div>
                    <p className="text-sm font-medium text-text">
                      {format(parseISO(time), 'h:mm a')}
                    </p>
                    <p className={`text-xs ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                  </div>
                </div>

                {status === 'scheduled' && !isPast && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAdminister(time)}
                      className="btn btn-primary btn-sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Administer
                    </button>
                    <button
                      onClick={() => onMissed(time)}
                      className="btn btn-secondary btn-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Missed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedule;