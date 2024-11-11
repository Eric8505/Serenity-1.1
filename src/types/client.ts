export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  status: 'active' | 'inactive' | 'discharged';
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  groupHomeId?: string;
  transferHistory?: {
    fromGroupHomeId?: string;
    toGroupHomeId: string;
    date: string;
    reason: string;
  }[];
  medicalHistory?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    previousTreatments: string[];
    familyHistory: string[];
  };
  biography?: {
    familyHistory: string;
    socialHistory: string;
    educationHistory: string;
    employmentHistory: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilters {
  status?: 'active' | 'inactive' | 'discharged';
  searchTerm?: string;
  sortBy?: 'name' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  groupHomeId?: string;
}