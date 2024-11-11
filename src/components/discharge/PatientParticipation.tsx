import React from 'react';

interface PatientParticipationProps {
  participation: {
    involved: boolean;
    understands: boolean;
    receivedCopy: boolean;
    notes: string;
  };
  onChange: (participation: any) => void;
}

const PatientParticipation: React.FC<PatientParticipationProps> = ({
  participation,
  onChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Participation</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={participation.involved}
            onChange={e => onChange({ ...participation, involved: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label className="ml-2 block text-sm text-gray-900">
            Patient participated in discharge planning
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={participation.understands}
            onChange={e => onChange({ ...participation, understands: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label className="ml-2 block text-sm text-gray-900">
            Patient understands discharge plan
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={participation.receivedCopy}
            onChange={e => onChange({ ...participation, receivedCopy: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label className="ml-2 block text-sm text-gray-900">
            Patient received copy of discharge instructions
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={participation.notes}
            onChange={e => onChange({ ...participation, notes: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientParticipation;