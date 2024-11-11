export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: MedicalHistory;
  documents: Document[];
  appointments: Appointment[];
  notes: ClinicalNote[];
  medications: Medication[];
  createdAt: string;
}

export interface MedicalHistory {
  conditions: string[];
  medications: Medication[];
  allergies: string[];
  previousTreatments: string[];
  familyHistory: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  administrationLog?: MedicationLog[];
  refillReminder?: boolean;
  supplyDays?: number;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  administeredAt: string;
  administeredBy: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  time: string;
  duration: number;
  type: 'initial' | 'follow-up' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  reminderSent?: boolean;
}

export interface ClinicalNote {
  id: string;
  clientId: string;
  date: string;
  type: 'intake' | 'progress' | 'group';
  content: string;
  diagnosis?: string[];
  treatmentPlan?: string;
  nextSteps?: string;
  createdBy: string;
  groupHome?: string;
  attendees?: string[];
  private: boolean;
}

export interface Document {
  id: string;
  clientId: string;
  title: string;
  type: 'consent' | 'assessment' | 'insurance' | 'other';
  status: 'pending' | 'signed' | 'rejected';
  content: string;
  signedAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'suspended';
  specialties?: string[];
  licenseNumber?: string;
  groupHome?: string;
  domain: string;
  createdAt: string;
}