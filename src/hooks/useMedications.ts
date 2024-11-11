import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseMedication, ClientMedication, MedicationAdministration } from '../types/medication';
import { findIdenticalMedication, createBaseMedication, createClientMedication } from '../utils/medicationUtils';

// In a real app, these would be API calls
const mockMedications: BaseMedication[] = [];
const mockClientMedications: ClientMedication[] = [];

export const useMedications = () => {
  const queryClient = useQueryClient();

  const { data: medications = [] } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => mockMedications,
  });

  const { data: clientMedications = [] } = useQuery({
    queryKey: ['clientMedications'],
    queryFn: async () => mockClientMedications,
  });

  const addMedicationMutation = useMutation({
    mutationFn: async ({
      medication,
      clientId,
      clientSpecificData
    }: {
      medication: Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>;
      clientId: string;
      clientSpecificData: Partial<ClientMedication>;
    }) => {
      // Check for identical medication
      const lookupResult = findIdenticalMedication(medications, medication);
      
      let baseMedication: BaseMedication;
      
      if (lookupResult.found && lookupResult.medication) {
        baseMedication = lookupResult.medication;
      } else {
        // Create new base medication
        baseMedication = createBaseMedication(medication);
        mockMedications.push(baseMedication);
      }

      // Create client-specific medication link
      const clientMedication = createClientMedication(
        baseMedication.id,
        clientId,
        clientSpecificData
      );
      
      mockClientMedications.push(clientMedication);
      
      return {
        baseMedication,
        clientMedication,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['clientMedications'] });
    },
  });

  const recordAdministrationMutation = useMutation({
    mutationFn: async (administration: Partial<MedicationAdministration>) => {
      const clientMedication = mockClientMedications.find(
        cm => cm.medicationId === administration.medicationId && cm.clientId === administration.clientId
      );

      if (!clientMedication) {
        throw new Error('Client medication not found');
      }

      const newAdministration: MedicationAdministration = {
        id: crypto.randomUUID(),
        medicationId: administration.medicationId!,
        clientId: administration.clientId!,
        administeredTime: administration.administeredTime || new Date().toISOString(),
        administeredBy: administration.administeredBy || '',
        status: administration.status || 'administered',
        notes: administration.notes,
        createdAt: new Date().toISOString(),
      };

      // Update client medication
      clientMedication.administrationLog = [
        ...(clientMedication.administrationLog || []),
        newAdministration
      ];

      // Update supply if administered
      if (newAdministration.status === 'administered' && clientMedication.supply) {
        clientMedication.supply--;
      }

      clientMedication.updatedAt = new Date().toISOString();

      return newAdministration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientMedications'] });
    },
  });

  return {
    medications,
    clientMedications,
    addMedication: addMedicationMutation.mutate,
    recordAdministration: recordAdministrationMutation.mutate,
    isLoading: addMedicationMutation.isPending || recordAdministrationMutation.isPending,
  };
};