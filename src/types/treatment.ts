import { Client } from './index';

export interface TreatmentGoal {
  id: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'discontinued';
  progress: number; // 0-100
  objectives: {
    id: string;
    description: string;
    interventions: string[];
    measurableOutcome: string;
    targetDate: string;
    status: 'not_started' | 'in_progress' | 'achieved' | 'discontinued';
    progress: number;
  }[];
  notes: string;
}

export interface TreatmentPlan {
  id: string;
  clientId: string;
  startDate: string;
  reviewDate: string;
  diagnosis: {
    code: string;
    description: string;
    type: 'primary' | 'secondary';
  }[];
  presentingProblems: string[];
  strengths: string[];
  barriers: string[];
  goals: TreatmentGoal[];
  recommendations: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
    endDate?: string;
  }[];
  status: 'draft' | 'active' | 'completed' | 'discontinued';
  signatures: {
    role: 'clinician' | 'supervisor' | 'client' | 'guardian';
    name: string;
    signature: string;
    date: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface WileyProgressNote {
  id: string;
  clientId: string;
  sessionDate: string;
  duration: number; // in minutes
  sessionType: 'individual' | 'group' | 'family' | 'other';
  location: string;
  presentingIssues: string[];
  mentalStatus: {
    appearance: string[];
    behavior: string[];
    mood: string[];
    affect: string[];
    speech: string[];
    thoughtProcess: string[];
    thoughtContent: string[];
    cognition: string[];
    insight: string[];
    judgment: string[];
    risk: {
      suicidal: {
        present: boolean;
        ideation: boolean;
        plan: boolean;
        intent: boolean;
        means: boolean;
        history: boolean;
        details?: string;
      };
      homicidal: {
        present: boolean;
        ideation: boolean;
        plan: boolean;
        intent: boolean;
        means: boolean;
        history: boolean;
        details?: string;
      };
    };
  };
  interventions: {
    type: string;
    description: string;
    response: string;
  }[];
  progress: {
    goalId: string;
    status: 'no_change' | 'improved' | 'declined';
    notes: string;
  }[];
  planUpdate: {
    modifications: string[];
    newInterventions: string[];
    referrals: string[];
  };
  nextSession: {
    scheduled: string;
    focus: string[];
  };
  billableTime: number;
  signatures: {
    clinician: {
      name: string;
      signature: string;
      date: string;
      credentials: string;
    };
    supervisor?: {
      name: string;
      signature: string;
      date: string;
      credentials: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}