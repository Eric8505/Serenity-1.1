import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Medication } from '../types';

interface MedicationInputProps {
  medications: Medication[];
  onChange: (medications: Medication[]) => void;
}

const MedicationInput: React.FC<MedicationInputProps> = ({ medications, onChange }) => {
  const addMedication = () => {
    onChange([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      },
    ]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    onChange(updatedMedications);
  };

  const removeMedication = (index: number) => {
    onChange(medications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Current Medications
        </label>
        <button
          type="button"
          onClick={addMedication}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Medication
        </button>
      </div>

      {medications.map((medication, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-900">
              Medication #{index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeMedication(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={medication.name}
                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Medication name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                value={medication.dosage}
                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., 50mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <input
                type="text"
                value={medication.frequency}
                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={medication.startDate}
                onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={medication.endDate || ''}
                onChange={(e) => updateMedication(index, 'endDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {medications.length === 0 && (
        <p className="text-sm text-gray-500 italic">No medications added yet</p>
      )}
    </div>
  );
};

export default MedicationInput;