export interface IntakeAssessment {
  id: string;
  intakeId: string;
  clientId: string;
  date: string;
  assessor: string;
  presentingProblems: string[];
  mentalStatus: {
    appearance: string[];
    behavior: string[];
    mood: string[];
    affect: string[];
    thoughtProcess: string[];
    orientation: string[];
    memory: string[];
    attention: string[];
    insight: string[];
    judgment: string[];
  };
  substanceUse: {
    current: {
      substance: string;
      frequency: string;
      lastUse: string;
      duration: string;
    }[];
    history: string;
    treatment: string;
  };
  psychiatricHistory: {
    previousTreatment: string;
    hospitalizations: {
      date: string;
      reason: string;
      facility: string;
      duration: string;
    }[];
    medications: {
      name: string;
      dosage: string;
      prescriber: string;
      startDate: string;
      endDate?: string;
      reason: string;
    }[];
  };
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    primaryCare: string;
  };
  familyHistory: {
    mentalHealth: string;
    substanceUse: string;
    medical: string;
  };
  socialHistory: {
    education: string;
    employment: string;
    relationships: string;
    legalHistory: string;
    housing: string;
    support: string;
  };
  riskAssessment: {
    suicide: {
      ideation: boolean;
      plan: boolean;
      intent: boolean;
      history: string;
    };
    homicide: {
      ideation: boolean;
      plan: boolean;
      intent: boolean;
      history: string;
    };
    abuse: {
      current: boolean;
      history: string;
      type: string[];
    };
  };
  diagnosis: {
    primary: {
      code: string;
      description: string;
    };
    secondary: {
      code: string;
      description: string;
    }[];
  };
  recommendations: string[];
  signatures: {
    assessor: {
      name: string;
      credentials: string;
      date: string;
      signature: string;
    };
    supervisor?: {
      name: string;
      credentials: string;
      date: string;
      signature: string;
    };
  };
}

export interface DischargeRecord {
  id: string;
  intakeId: string;
  clientId: string;
  date: string;
  type: 'planned' | 'unplanned' | 'administrative';
  reason: string;
  status: {
    goals: {
      goalId: string;
      status: 'achieved' | 'partially_achieved' | 'not_achieved';
      notes: string;
    }[];
    symptoms: string;
    functioning: string;
  };
  aftercare: {
    referrals: {
      provider: string;
      service: string;
      contact: string;
      appointmentDate?: string;
    }[];
    medications: {
      name: string;
      dosage: string;
      prescriber: string;
      refills: number;
    }[];
    recommendations: string[];
  };
  followUp: {
    plan: string;
    appointments: {
      provider: string;
      date: string;
      purpose: string;
    }[];
  };
  crisis: {
    plan: string;
    contacts: {
      name: string;
      relationship: string;
      phone: string;
    }[];
    resources: string[];
  };
  signatures: {
    clinician: {
      name: string;
      credentials: string;
      date: string;
      signature: string;
    };
    supervisor?: {
      name: string;
      credentials: string;
      date: string;
      signature: string;
    };
    client?: {
      name: string;
      date: string;
      signature: string;
    };
  };
}

export interface IntakeStatus {
  id: string;
  clientId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'discharged';
  assessment?: IntakeAssessment;
  treatmentPlan?: TreatmentPlan;
  discharge?: DischargeRecord;
  documents: Document[];
}</content>