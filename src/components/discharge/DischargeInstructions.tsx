import React from 'react';

interface DischargeInstructionsProps {
  instructions: {
    medications: string;
    activities: string;
    followUpCare: string;
    warning: string;
  };
  onChange: (instructions: any) => void;
}

const DischargeInstructions: React.FC<DischargeInstructionsProps> = ({
  instructions,
  onChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Discharge Instructions</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Medications</label>
          <textarea
            value={instructions.medications}
            onChange={e => onChange({ ...instructions, medications: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="List medications, dosages, and schedules..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Activities</label>
          <textarea
            value={instructions.activities}
            onChange={e => onChange({ ...instructions, activities: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Activity restrictions or recommendations..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Follow-up Care</label>
          <textarea
            value={instructions.followUpCare}
            onChange={e => onChange({ ...instructions, followUpCare: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Follow-up appointments and care instructions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Warning Signs</label>
          <textarea
            value={instructions.warning}
            onChange={e => onChange({ ...instructions, warning: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Warning signs to watch for..."
          />
        </div>
      </div>
    </div>
  );
};

export default DischargeInstructions;