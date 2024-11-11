import { AuditResult } from '../types/audit';

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  preventReuse: 5 // number of previous passwords to check
};

// Session management
export const SESSION_CONFIG = {
  maxAge: 30 * 60 * 1000, // 30 minutes
  renewalThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxConcurrentSessions: 3,
  idleTimeout: 15 * 60 * 1000 // 15 minutes
};

// Rate limiting
export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
  passwordReset: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 attempts per hour
  api: { windowMs: 60 * 1000, max: 100 } // 100 requests per minute
};

// Security headers
export const SECURITY_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://api.example.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Sensitive data patterns
export const SENSITIVE_DATA_PATTERNS = {
  ssn: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g,
  creditCard: /\b\d{4}[-. ]?\d{4}[-. ]?\d{4}[-. ]?\d{4}\b/g,
  phoneNumber: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
};

// Security audit checks
export const runSecurityAudit = async (): Promise<AuditResult> => {
  const findings = [];

  // Check password policy compliance
  findings.push({
    category: 'Authentication',
    description: 'Verify password policy enforcement',
    recommendation: 'Ensure all passwords meet complexity requirements',
    severity: 'high',
    relatedRules: ['auth-1']
  });

  // Check session management
  findings.push({
    category: 'Session Management',
    description: 'Review session timeout settings',
    recommendation: 'Implement automatic session termination after inactivity',
    severity: 'medium',
    relatedRules: ['session-1']
  });

  // Check data encryption
  findings.push({
    category: 'Data Protection',
    description: 'Verify encryption of sensitive data',
    recommendation: 'Use strong encryption for all PHI/PII',
    severity: 'critical',
    relatedRules: ['data-1']
  });

  // Check access controls
  findings.push({
    category: 'Access Control',
    description: 'Review role-based access controls',
    recommendation: 'Implement principle of least privilege',
    severity: 'high',
    relatedRules: ['access-1']
  });

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: 'security',
    severity: 'high',
    findings,
    status: 'open'
  };
};

// Data sanitization
export const sanitizeData = (data: string): string => {
  // Remove any potential XSS
  data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove potential SQL injection patterns
  data = data.replace(/(\b(select|insert|update|delete|drop|union|exec)\b)/gi, '');
  
  // Mask sensitive data
  Object.values(SENSITIVE_DATA_PATTERNS).forEach(pattern => {
    data = data.replace(pattern, '***');
  });
  
  return data;
};

// Input validation
export const validateInput = (input: string, type: 'text' | 'email' | 'phone' | 'date'): boolean => {
  const patterns = {
    text: /^[a-zA-Z0-9\s.,!?-]{1,500}$/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    phone: /^\+?1?\d{9,15}$/,
    date: /^\d{4}-\d{2}-\d{2}$/
  };

  return patterns[type].test(input);
};

// HIPAA compliance checks
export const checkHIPAACompliance = (data: any): boolean => {
  // Check for minimum necessary information
  if (!data.purpose || !data.recipient) {
    return false;
  }

  // Check for authorization
  if (data.type === 'phi' && !data.authorization) {
    return false;
  }

  // Check for audit trail
  if (!data.accessLog) {
    return false;
  }

  return true;
};

// Encryption helpers
export const encryption = {
  // In a real app, use a proper encryption library
  encrypt: (data: string): string => {
    return btoa(data); // This is just for demonstration
  },
  
  decrypt: (data: string): string => {
    return atob(data); // This is just for demonstration
  }
};

// Access control helper
export const checkAccess = (userId: string, resource: string, action: string): boolean => {
  // In a real app, implement proper RBAC checks
  const userRoles = ['staff']; // Get from user service
  const rolePermissions = {
    admin: ['read', 'write', 'delete'],
    staff: ['read', 'write'],
    client: ['read']
  };

  return userRoles.some(role => 
    rolePermissions[role as keyof typeof rolePermissions]?.includes(action)
  );
};