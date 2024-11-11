export interface MedicationAdministration {
  id: string;
  medicationId: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredBy: string;
  status: 'scheduled' | 'administered' | 'missed' | 'refused';
  notes?: string;
}

export interface MedicationSupply {
  medicationId: string;
  currentQuantity: number;
  unit: string;
  refillThreshold: number;
  lastRefillDate: string;
  nextRefillDate: string;
}

export interface MarSchedule {
  id: string;
  medicationId: string;
  times: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  startDate: string;
  endDate?: string;
}