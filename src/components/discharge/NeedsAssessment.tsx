import React from 'react';

interface NeedsAssessmentProps {
  needs: {
    ongoingTherapy: boolean;
    supportGroups: boolean;
    medicalCare: boolean;
    housingSupport: boolean;
    substanceAbuse: boolean;
    notes: string;
  };
  onChange: (needs: any) => void;
}

const NeedsAssessment: React.FC<NeedsAssessmentProps> = ({ needs, onChange }) => {
  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...needs,
      [field]: e.target.checked,
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Needs Assessment</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={needs.ongoingTherapy}
              onChange={handleCheckboxChange('ongoingTherapy')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Ongoing Therapy
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={needs.supportGroups}
              onChange={handleCheckboxChange('supportGroups')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Support Groups
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={needs.medicalCare}
              onChange={handleCheckboxChange('medicalCare')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Medical Care
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={needs.housingSupport}
              onChange={handleCheckboxChange('housingSupport')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Housing Support
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Needs</label>
          <textarea
            value={needs.notes}
            onChange={e => onChange({ ...needs, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default NeedsAssessment;