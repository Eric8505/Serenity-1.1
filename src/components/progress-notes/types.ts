import { SignatureRole } from '../signature/SignatureComponent';

export interface ClientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface Signature {
  name: string;
  role: SignatureRole;
  signature: string;
  date: string;
  credentials?: string;
}

export interface ProgressNoteData {
  clientId: string;
  sessionDate: string;
  period: 'day' | 'night';
  startTime: string;
  endTime: string;
  sessionType: 'individual' | 'group' | 'family';
  location: string;
  interventions: {
    type: string;
    description: string;
    response: string;
    responseNotes: string;
  }[];
  goals: {
    description: string;
    rating: number;
    notes: string;
  }[];
  nextSessionPlans: string[];
  nextSessionNotes: string;
  staffNotes: string;
  riskAssessment: {
    suicidalIdeation: boolean;
    homicidalIdeation: boolean;
    substanceUse: boolean;
    notes: string;
  };
  signatures?: Signature[];
  status: 'draft' | 'signed';
}

export interface ProgressNoteFormProps {
  client: ClientInfo;
  onSubmit: (data: ProgressNoteData) => void;
  onSaveDraft?: (data: ProgressNoteData) => void;
  initialData?: Partial<ProgressNoteData>;
  period?: 'day' | 'night';
}