import React, { useState } from 'react';
import { Plus, Pill } from 'lucide-react';
import { BaseMedication, ClientMedication } from '../types/medication';
import { getMedicationDisplayName } from '../utils/medicationUtils';
import MedicationForm from './MedicationForm';

interface MedicationListProps {
  medications: BaseMedication[];
  clientMedications: ClientMedication[];
  clientId: string;
  onAddMedication: (data: {
    medication: Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>;
    clientSpecificData: Partial<ClientMedication>;
  }) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  clientMedications,
  clientId,
  onAddMedication,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMedication = (data: Parameters<typeof onAddMedication>[0]) => {
    onAddMedication(data);
    setShowAddForm(false);
  };

  const clientMedicationList = clientMedications
    .filter(cm => cm.clientId === clientId)
    .map(cm => {
      const baseMedication = medications.find(m => m.id === cm.medicationId);
      return { base: baseMedication!, client: cm };
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-text">Medications</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {clientMedicationList.length > 0 ? (
          <div className="divide-y divide-border">
            {clientMedicationList.map(({ base, client }) => (
              <div
                key={client.id}
                className="p-4 hover:bg-background/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Pill className="h-5 w-5 text-text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">
                        {getMedicationDisplayName(base, client)}
                      </h4>
                      {base.instructions && (
                        <p className="text-sm text-text-secondary mt-1">
                          {base.instructions}
                        </p>
                      )}
                      {client.specialInstructions && (
                        <p className="text-sm text-text-secondary mt-1">
                          Special Instructions: {client.specialInstructions}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                        <span>Supply: {client.supply} days</span>
                        <span>Refills: {client.refillsRemaining}</span>
                        <span>Status: {client.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-text-secondary">
            No medications found
          </div>
        )}
      </div>

      {showAddForm && (
        <MedicationForm
          onSubmit={handleAddMedication}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default MedicationList;