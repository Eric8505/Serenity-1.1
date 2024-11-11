import { BaseMedication, ClientMedication, MedicationLookupResult } from '../types/medication';

export const findIdenticalMedication = (
  medications: BaseMedication[],
  newMedication: Partial<BaseMedication>
): MedicationLookupResult => {
  const match = medications.find(med => 
    med.name.toLowerCase() === newMedication.name?.toLowerCase() &&
    med.dosage === newMedication.dosage &&
    med.frequency === newMedication.frequency &&
    med.route === newMedication.route
  );

  return {
    found: !!match,
    medication: match
  };
};

export const createBaseMedication = (data: Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>): BaseMedication => {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createClientMedication = (
  medicationId: string,
  clientId: string,
  data: Partial<ClientMedication>
): ClientMedication => {
  return {
    id: crypto.randomUUID(),
    medicationId,
    clientId,
    startDate: new Date().toISOString(),
    status: 'active',
    administrationLog: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
};

export const getMedicationDisplayName = (
  baseMedication: BaseMedication,
  clientMedication?: ClientMedication
): string => {
  const parts = [
    baseMedication.name,
    baseMedication.dosage,
    `(${baseMedication.frequency})`,
  ];

  if (clientMedication?.specialInstructions) {
    parts.push(`- ${clientMedication.specialInstructions}`);
  }

  return parts.join(' ');
};