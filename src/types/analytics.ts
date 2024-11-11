export interface ClientOutcome {
  clientId: string;
  period: {
    start: string;
    end: string;
  };
  measures: {
    type: string;
    scores: {
      date: string;
      value: number;
    }[];
    trend: 'improving' | 'declining' | 'stable';
  }[];
  goals: {
    description: string;
    progress: number;
    status: 'achieved' | 'in_progress' | 'not_started';
  }[];
}

export interface FinancialMetric {
  period: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    byService: {
      service: string;
      amount: number;
    }[];
    trend: number; // percentage change
  };
  expenses: {
    total: number;
    byCategory: {
      category: string;
      amount: number;
    }[];
    trend: number;
  };
  insurance: {
    claims: number;
    pending: number;
    denied: number;
    averageReimbursement: number;
  };
}

export interface UtilizationReport {
  period: {
    start: string;
    end: string;
  };
  services: {
    type: string;
    sessions: number;
    uniqueClients: number;
    hours: number;
    utilizationRate: number;
  }[];
  staff: {
    id: string;
    name: string;
    caseload: number;
    directHours: number;
    indirectHours: number;
    utilizationRate: number;
  }[];
  facilities: {
    location: string;
    roomUtilization: number;
    peakHours: string[];
    averageOccupancy: number;
  }[];
}