import { AuditResult, ComplianceRule, ComplianceReport } from '../types/audit';
import { documentationRules } from './documentationRules';
import { clinicalTerminology } from './clinicalTerminology';

const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'doc-1',
    category: 'Documentation',
    title: 'Progress Note Completeness',
    description: 'Progress notes must include all required elements',
    requirements: documentationRules.progressNote.required,
    references: ['HIPAA § 164.526', 'State Guidelines § 2.1'],
    severity: 'high',
  },
  {
    id: 'doc-2',
    category: 'Documentation',
    title: 'Treatment Plan Updates',
    description: 'Treatment plans must be reviewed and updated every 90 days',
    requirements: ['Regular reviews', 'Goal progress tracking', 'Client participation'],
    references: ['State Guidelines § 3.4'],
    severity: 'high',
  },
  // Add more rules as needed
];

export const runAIAudit = async (
  content: string,
  type: 'progress-note' | 'treatment-plan' | 'assessment'
): Promise<AuditResult> => {
  // In a real app, this would call your AI service
  const findings = [];

  // Check documentation completeness
  const rules = documentationRules[type === 'progress-note' ? 'progressNote' : 'treatmentPlan'];
  for (const required of rules.required) {
    if (!content.toLowerCase().includes(required.toLowerCase())) {
      findings.push({
        category: 'Documentation',
        description: `Missing required element: ${required}`,
        recommendation: `Add section for ${required}`,
        severity: 'high',
        relatedRules: ['doc-1'],
      });
    }
  }

  // Check clinical terminology
  Object.entries(clinicalTerminology).forEach(([category, terms]) => {
    Object.entries(terms).forEach(([lay, clinical]) => {
      if (content.toLowerCase().includes(lay.toLowerCase())) {
        findings.push({
          category: 'Clinical Language',
          description: `Non-clinical term used: "${lay}"`,
          recommendation: `Consider using "${clinical}" instead`,
          severity: 'medium',
          relatedRules: ['doc-3'],
        });
      }
    });
  });

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: 'documentation',
    severity: findings.some(f => f.severity === 'critical') ? 'critical' :
             findings.some(f => f.severity === 'high') ? 'high' :
             findings.some(f => f.severity === 'medium') ? 'medium' : 'low',
    findings,
    status: 'open',
  };
};

export const generateComplianceReport = async (
  startDate: string,
  endDate: string
): Promise<ComplianceReport> => {
  // In a real app, this would analyze actual data
  const findings = COMPLIANCE_RULES.map(rule => ({
    ruleId: rule.id,
    status: Math.random() > 0.8 ? 'non_compliant' :
            Math.random() > 0.6 ? 'in_progress' : 'compliant',
    evidence: ['Sample evidence'],
    notes: 'Sample notes',
  }));

  const compliant = findings.filter(f => f.status === 'compliant').length;
  const nonCompliant = findings.filter(f => f.status === 'non_compliant').length;
  const inProgress = findings.filter(f => f.status === 'in_progress').length;

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    period: { start: startDate, end: endDate },
    summary: {
      totalRules: COMPLIANCE_RULES.length,
      compliant,
      nonCompliant,
      inProgress,
    },
    findings,
    recommendations: [
      {
        priority: 'high',
        description: 'Address non-compliant documentation practices',
        timeline: '30 days',
        resources: ['Staff training', 'Documentation templates'],
      },
      // Add more recommendations
    ],
  };
};