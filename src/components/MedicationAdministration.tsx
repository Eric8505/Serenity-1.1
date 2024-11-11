import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Check, AlertCircle } from 'lucide-react';
import { Medication } from '../types';

interface Props {
  medication: Medication;
  onAdminister: (time: string) => void;
  onRefillAlert: () => void;
}

const MedicationAdministration: React.FC<Props> = ({ medication, onAdminister, onRefillAlert }) => {
  const [remainingDoses, setRemainingDoses] = useState(medication.supply || 0);
  const [nextDoses, setNextDoses] = useState<string[]>([]);

  useEffect(() => {
    // Calculate next doses based on frequency
    const calculateNextDoses = () => {
      const doses: string[] = [];
      const now = new Date();
      
      // Parse frequency and calculate next doses
      const [amount, unit] = medication.frequency.split(' ');
      const times = parseInt(amount);
      
      for(let i = 0; i < times; i++) {
        doses.push(format(addDays(now, i), 'yyyy-MM-dd HH:mm'));
      }
      
      setNextDoses(doses);
    };

    calculateNextDoses();
  }, [medication]);

  useEffect(() => {
    // Check supply and trigger refill alert
    if (remainingDoses <= 7) {
      onRefillAlert();
    }
  }, [remainingDoses, onRefillAlert]);

  const handleAdminister = (time: string) => {
    setRemainingDoses(prev => prev - 1);
    onAdminister(time);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{medication.name}</h3>
        <div className="flex items-center space-x-2">
          <span>Remaining doses: {remainingDoses}</span>
          {remainingDoses <= 7 && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Refill needed</span>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y">
        {nextDoses.map((time) => (
          <div key={time} className="py-3 flex justify-between items-center">
            <span>{format(new Date(time), 'MMM d, h:mm a')}</span>
            <button
              onClick={() => handleAdminister(time)}
              className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Administered
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationAdministration;