import React from 'react';
import { Pill, Clock } from 'lucide-react';
import { BaseMedication, ClientMedication } from '../../types/medication';
import { getMedicationDisplayName } from '../../utils/medicationUtils';

interface MedicationListProps {
  medications: BaseMedication[];
  clientMedications: ClientMedication[];
  selectedMedication: { base: BaseMedication; client: ClientMedication } | null;
  onSelect: (medication: { base: BaseMedication; client: ClientMedication } | null) => void;
  onAdminister: (base: BaseMedication, client: ClientMedication) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  clientMedications,
  selectedMedication,
  onSelect,
  onAdminister,
}) => {
  const handleAdminister = (base: BaseMedication, client: ClientMedication, event: React.MouseEvent) => {
    event.stopPropagation();
    onAdminister(base, client);
  };

  const validMedications = medications.filter((med): med is BaseMedication => 
    typeof med.id === 'string' && med.id.length > 0
  );

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 bg-background border-b border-border">
        <h3 className="font-medium text-text">Current Medications</h3>
      </div>

      <div className="divide-y divide-border">
        {validMedications.length === 0 ? (
          <div className="p-4 text-center text-text-secondary">
            No medications found
          </div>
        ) : (
          validMedications.map((base) => {
            const client = clientMedications.find(cm => cm.medicationId === base.id);
            if (!client) return null;

            const isSelected = selectedMedication?.base.id === base.id;
            const canAdminister = client.status === 'active' && (client.supply ?? 0) > 0;

            return (
              <div
                key={base.id}
                className={`p-4 cursor-pointer hover:bg-background/50 ${
                  isSelected ? 'bg-background/50' : ''
                }`}
                onClick={() => onSelect({ base, client })}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-text flex items-center">
                      <Pill className="h-4 w-4 text-text-secondary mr-2" />
                      {getMedicationDisplayName(base, client)}
                    </h4>
                    {base.instructions && (
                      <p className="text-sm text-text-secondary mt-1">
                        {base.instructions}
                      </p>
                    )}
                    {client.status === 'discontinued' && (
                      <p className="text-sm text-red-500 mt-1">
                        Discontinued
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                      <span>Supply: {client.supply || 0} days</span>
                      <span>Refills: {client.refillsRemaining || 0}</span>
                      <span>Status: {client.status}</span>
                    </div>
                  </div>
                  {client.status === 'active' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => handleAdminister(base, client, e)}
                        className={`btn ${canAdminister ? 'btn-primary' : 'btn-secondary'} btn-sm whitespace-nowrap`}
                        disabled={!canAdminister}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        {canAdminister ? 'Administer' : 'No Supply'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MedicationList;