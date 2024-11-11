export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  pharmacy?: {
    name: string;
    phone: string;
    address: string;
  };
  purpose?: string;
  sideEffects?: string[];
  interactions?: string[];
  supply?: number;
  refillsRemaining?: number;
  lastRefillDate?: string;
  requiresAuthorization?: boolean;
  notes?: string;
  instructions?: string;
  status: 'active' | 'discontinued';
  administrationLog?: {
    id: string;
    medicationId: string;
    administeredAt: string;
    administeredBy: string;
    notes?: string;
  }[];
}

export type NewMedication = Omit<Medication, 'id'> & { id?: string };