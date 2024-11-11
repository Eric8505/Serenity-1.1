export type StaffRole = 'admin' | 'clinician' | 'nurse' | 'support';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  credentials: {
    type: string;
    number: string;
    expiryDate: string;
    verificationStatus: 'pending' | 'verified' | 'expired';
  }[];
  schedule: {
    workDays: number[]; // 0-6 for Sunday-Saturday
    workHours: {
      start: string; // HH:mm format
      end: string;
    };
  };
  supervisorId?: string;
  status: 'active' | 'inactive' | 'on_leave';
  specialties: string[];
  caseload: number;
  performance: {
    notesCompletionRate: number;
    avgResponseTime: number;
    clientSatisfaction: number;
  };
  training: {
    id: string;
    name: string;
    completedDate: string;
    expiryDate?: string;
    status: 'completed' | 'pending' | 'expired';
  }[];
}

export interface SupervisionLog {
  id: string;
  supervisorId: string;
  superviseeId: string;
  date: string;
  duration: number; // minutes
  type: 'individual' | 'group';
  topics: string[];
  notes: string;
  goals: string[];
  followUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}