export interface AuditResult {
  id: string;
  timestamp: string;
  type: 'documentation' | 'compliance' | 'security' | 'billing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  findings: {
    category: string;
    description: string;
    recommendation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    relatedRules: string[];
  }[];
  status: 'open' | 'in_review' | 'resolved';
  assignedTo?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface ComplianceRule {
  id: string;
  category: string;
  title: string;
  description: string;
  requirements: string[];
  references: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceReport {
  id: string;
  timestamp: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalRules: number;
    compliant: number;
    nonCompliant: number;
    inProgress: number;
  };
  findings: {
    ruleId: string;
    status: 'compliant' | 'non_compliant' | 'in_progress';
    evidence: string[];
    notes?: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    description: string;
    timeline: string;
    resources: string[];
  }[];
}