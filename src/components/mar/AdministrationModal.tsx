import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { BaseMedication, ClientMedication } from '../../types/medication';
import { MedicationAdministration } from '../../types/mar';

interface AdministrationModalProps {
  medication: BaseMedication;
  clientMedication: ClientMedication;
  onSubmit: (data: Partial<MedicationAdministration>) => void;
  onClose: () => void;
  existingRecord?: MedicationAdministration;
}

const AdministrationModal: React.FC<AdministrationModalProps> = ({
  medication,
  clientMedication,
  onSubmit,
  onClose,
  existingRecord,
}) => {
  const [formData, setFormData] = useState({
    status: existingRecord?.status || 'administered',
    administeredBy: existingRecord?.administeredBy || '',
    notes: existingRecord?.notes || '',
    administeredTime: existingRecord?.administeredTime || new Date().toISOString(),
  });

  const hasSupply = (clientMedication.supply || 0) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      medicationId: medication.id,
      clientId: clientMedication.clientId,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="relative bg-surface rounded-lg shadow-lg w-full max-w-md my-8">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-surface z-10">
          <h3 className="text-lg font-medium text-text">
            {existingRecord ? 'Edit Administration Record' : 'Administer Medication'}
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
            <h4 className="font-medium text-text">{medication.name}</h4>
            <p className="text-sm text-text-secondary">{medication.dosage} - {medication.frequency}</p>
            
            {!hasSupply && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">No Supply Available</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This medication needs to be refilled. Please contact the pharmacy.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Administration Time
            </label>
            <input
              type="datetime-local"
              value={format(new Date(formData.administeredTime), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setFormData({ ...formData, administeredTime: new Date(e.target.value).toISOString() })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MedicationAdministration['status'] })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            >
              <option value="administered" disabled={!hasSupply}>Administered</option>
              <option value="refused">Refused</option>
              <option value="missed">Missed</option>
              <option value="no_supply" disabled={hasSupply}>No Supply Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Administrator Name
            </label>
            <input
              type="text"
              value={formData.administeredBy}
              onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border-border bg-surface text-text"
              placeholder={formData.status === 'refused' ? 'Enter reason for refusal...' : 'Enter any additional notes...'}
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
              {existingRecord ? 'Update Record' : 'Record Administration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdministrationModal;