import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, UserCheck } from 'lucide-react';
import { AuditResult } from '../../types/audit';
import { runSecurityAudit } from '../../utils/security';

const SecurityDashboard: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditResults = async () => {
      const results = await runSecurityAudit();
      setAuditResults(results);
      setLoading(false);
    };

    fetchAuditResults();
  }, []);

  if (loading) {
    return <div>Loading security audit results...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Security Score */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Security Score
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    85/100
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Critical Issues
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {auditResults?.findings.filter(f => f.severity === 'critical').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    24
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Failed Logins */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Failed Logins (24h)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    12
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Findings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Security Findings</h3>
          <div className="mt-4 space-y-4">
            {auditResults?.findings.map((finding, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  finding.severity === 'critical'
                    ? 'bg-red-50'
                    : finding.severity === 'high'
                    ? 'bg-orange-50'
                    : finding.severity === 'medium'
                    ? 'bg-yellow-50'
                    : 'bg-blue-50'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      finding.severity === 'critical'
                        ? 'text-red-400'
                        : finding.severity === 'high'
                        ? 'text-orange-400'
                        : finding.severity === 'medium'
                        ? 'text-yellow-400'
                        : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      finding.severity === 'critical'
                        ? 'text-red-800'
                        : finding.severity === 'high'
                        ? 'text-orange-800'
                        : finding.severity === 'medium'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {finding.category}
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className="text-gray-700">{finding.description}</p>
                      <p className="mt-1 font-medium">Recommendation:</p>
                      <p className="text-gray-700">{finding.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Security Recommendations</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    HIPAA Compliance
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Implement automatic session timeouts</li>
                      <li>Enable audit logging for all PHI access</li>
                      <li>Encrypt data at rest and in transit</li>
                      <li>Regular security training for all staff</li>
                      <li>Implement role-based access control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Authentication & Access Control
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Enforce strong password requirements</li>
                      <li>Implement multi-factor authentication</li>
                      <li>Regular access reviews</li>
                      <li>Monitor failed login attempts</li>
                      <li>Implement IP-based access controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Data Protection
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Regular data backups</li>
                      <li>Data retention policies</li>
                      <li>Secure data disposal procedures</li>
                      <li>Data classification system</li>
                      <li>Data access monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;