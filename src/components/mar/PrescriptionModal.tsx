import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Medication } from '../../types/medication';

interface PrescriptionModalProps {
  onSubmit: (medication: Omit<Medication, 'id'>) => void;
  onClose: () => void;
  initialData?: Partial<Medication>;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  onSubmit,
  onClose,
  initialData,
}) => {
  const [prescription, setPrescription] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prescription.name && prescription.dosage && prescription.frequency) {
      onSubmit(prescription as Omit<Medication, 'id'>);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-lg my-8">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-surface z-10">
          <h3 className="text-lg font-medium text-text">
            {initialData ? 'Edit Prescription' : 'New Prescription'}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="med-name" className="block text-sm font-medium text-text-secondary mb-1">
              Medication Name
            </label>
            <input
              id="med-name"
              type="text"
              value={prescription.name}
              onChange={(e) => setPrescription({ ...prescription, name: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label htmlFor="med-dosage" className="block text-sm font-medium text-text-secondary mb-1">
              Dosage
            </label>
            <input
              id="med-dosage"
              type="text"
              value={prescription.dosage}
              onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
              placeholder="e.g., 50mg"
            />
          </div>

          <div>
            <label htmlFor="med-frequency" className="block text-sm font-medium text-text-secondary mb-1">
              Frequency
            </label>
            <input
              id="med-frequency"
              type="text"
              value={prescription.frequency}
              onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
              placeholder="e.g., Once daily"
            />
          </div>

          <div>
            <label htmlFor="med-instructions" className="block text-sm font-medium text-text-secondary mb-1">
              Instructions
            </label>
            <textarea
              id="med-instructions"
              value={prescription.instructions}
              onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              rows={3}
              placeholder="Special instructions or notes"
            />
          </div>

          <div>
            <label htmlFor="med-start-date" className="block text-sm font-medium text-text-secondary mb-1">
              Start Date
            </label>
            <input
              id="med-start-date"
              type="date"
              value={prescription.startDate}
              onChange={(e) => setPrescription({ ...prescription, startDate: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {initialData ? 'Update' : 'Add'} Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;