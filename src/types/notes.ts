export interface GroupNote {
  id: string;
  groupHomeId: string;
  date: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  facilitator: string;
  topic: string;
  content: string;
  attendance: {
    clientId: string;
    clientName: string;
    participated: boolean;
    absent?: boolean;
    absenceReason?: AbsenceReason;
    absenceDetails?: string;
  }[];
  summary: string;
  groceryInventoryId?: string;
}

export interface GroupHome {
  id: string;
  name: string;
  location: string;
  capacity: number;
  activeClients: string[];
  groceryInventoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export type AbsenceReason = 
  | 'appointment'
  | 'family_visit'
  | 'illness'
  | 'therapy'
  | 'medical'
  | 'other';

export const ABSENCE_REASONS: Record<AbsenceReason, string> = {
  appointment: 'Appointment',
  family_visit: 'Family Visit',
  illness: 'Illness',
  therapy: 'Therapy Session',
  medical: 'Medical Appointment',
  other: 'Other'
};