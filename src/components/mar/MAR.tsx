import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Download } from 'lucide-react';
import { MedicationAdministration } from '../../types/mar';
import { BaseMedication, ClientMedication } from '../../types/medication';
import MedicationList from './MedicationList';
import AdministrationHistory from './AdministrationHistory';
import AdministrationModal from './AdministrationModal';
import { generateMARReport } from '../../utils/marReports';
import { useAuth } from '../../context/AuthContext';

interface MARProps {
  medications: BaseMedication[];
  clientMedications: ClientMedication[];
  clientId: string;
  onAdminister: (administration: Partial<MedicationAdministration>) => void;
  onUpdateHistory?: (administrationId: string, updates: Partial<MedicationAdministration>) => void;
}

const MAR: React.FC<MARProps> = ({
  medications = [],
  clientMedications = [],
  clientId,
  onAdminister,
  onUpdateHistory,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMedication, setSelectedMedication] = useState<{
    base: BaseMedication;
    client: ClientMedication;
  } | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedAdministration, setSelectedAdministration] = useState<MedicationAdministration | null>(null);

  const handleAdminister = (data: Partial<MedicationAdministration>) => {
    onAdminister({
      ...data,
      clientId,
      medicationId: selectedMedication?.base.id,
      administeredTime: new Date().toISOString(),
    });
    setShowAdminModal(false);
    setSelectedAdministration(null);
  };

  const handleEditAdministration = (administration: MedicationAdministration) => {
    const clientMed = clientMedications.find(cm => cm.medicationId === administration.medicationId);
    const baseMed = medications.find(m => m.id === administration.medicationId);
    
    if (clientMed && baseMed) {
      setSelectedMedication({ base: baseMed, client: clientMed });
      setSelectedAdministration(administration);
      setShowAdminModal(true);
    }
  };

  const handleExport = () => {
    if (!isValid(selectedDate)) {
      console.error('Invalid date selected');
      return;
    }

    const report = generateMARReport({
      medications,
      administrations: clientMedications.flatMap(cm => cm.administrationLog || []),
      startDate: selectedDate,
      endDate: selectedDate,
    });
    report.save(`MAR_Report_${format(selectedDate, 'yyyy-MM-dd')}.pdf`);
  };

  const filteredClientMedications = clientMedications.filter(cm => cm.clientId === clientId);
  const allAdministrations = filteredClientMedications.flatMap(cm => cm.administrationLog || []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              const date = parseISO(e.target.value);
              if (isValid(date)) {
                setSelectedDate(date);
              }
            }}
            className="rounded-lg border-border bg-surface text-text"
          />
        </div>
        <button
          onClick={handleExport}
          className="btn btn-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export MAR
        </button>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        <MedicationList
          medications={medications}
          clientMedications={filteredClientMedications}
          selectedMedication={selectedMedication}
          onSelect={setSelectedMedication}
          onAdminister={(base, client) => {
            setSelectedMedication({ base, client });
            setShowAdminModal(true);
          }}
        />

        <AdministrationHistory
          administrations={allAdministrations}
          medications={medications}
          onEdit={handleEditAdministration}
          isAdmin={isAdmin}
        />
      </div>

      {showAdminModal && selectedMedication && (
        <AdministrationModal
          medication={selectedMedication.base}
          clientMedication={selectedMedication.client}
          onSubmit={handleAdminister}
          onClose={() => {
            setShowAdminModal(false);
            setSelectedAdministration(null);
          }}
          existingRecord={selectedAdministration}
        />
      )}
    </div>
  );
};

export default MAR;