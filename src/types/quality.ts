export interface ChartAudit {
  id: string;
  clientId: string;
  auditorId: string;
  date: string;
  items: {
    category: string;
    item: string;
    score: number; // 0-5
    comments: string;
  }[];
  totalScore: number;
  recommendations: string[];
  status: 'pending' | 'completed' | 'needs_review';
  reviewDueDate: string;
}

export interface IncidentReport {
  id: string;
  date: string;
  reporterId: string;
  clientsInvolved: string[];
  staffInvolved: string[];
  type: 'behavioral' | 'medical' | 'safety' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  immediateActions: string[];
  witnesses: string[];
  location: string;
  notificationsRequired: {
    type: string;
    required: boolean;
    completed: boolean;
    completedDate?: string;
  }[];
  followUpActions: {
    action: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'completed';
    completedDate?: string;
  }[];
  status: 'open' | 'under_review' | 'closed';
  resolution?: string;
}

export interface PerformanceMetric {
  id: string;
  staffId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    category: string;
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  goals: {
    description: string;
    target: number;
    current: number;
    dueDate: string;
    status: 'on_track' | 'at_risk' | 'behind';
  }[];
  feedback: {
    from: string;
    date: string;
    content: string;
    type: 'positive' | 'constructive' | 'general';
  }[];
}