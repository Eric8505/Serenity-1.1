import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { ComplianceReport, AuditResult } from '../../types/audit';
import { generateComplianceReport } from '../../utils/aiAudit';

const ComplianceDashboard: React.FC = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [recentAudits, setRecentAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const newReport = await generateComplianceReport(
        startDate.toISOString(),
        new Date().toISOString()
      );
      
      setReport(newReport);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !report) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Compliant Rules
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {report.summary.compliant} / {report.summary.totalRules}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Non-Compliant Rules
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {report.summary.nonCompliant}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {report.summary.inProgress}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Rules
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {report.summary.totalRules}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Compliance Findings</h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rule
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.findings.map((finding) => (
                      <tr key={finding.ruleId}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {finding.ruleId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            finding.status === 'compliant'
                              ? 'bg-green-100 text-green-800'
                              : finding.status === 'non_compliant'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {finding.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {finding.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          <div className="mt-4 space-y-4">
            {report.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  rec.priority === 'high'
                    ? 'bg-red-50'
                    : rec.priority === 'medium'
                    ? 'bg-yellow-50'
                    : 'bg-blue-50'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      rec.priority === 'high'
                        ? 'text-red-400'
                        : rec.priority === 'medium'
                        ? 'text-yellow-400'
                        : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      rec.priority === 'high'
                        ? 'text-red-800'
                        : rec.priority === 'medium'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {rec.description}
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className={
                        rec.priority === 'high'
                          ? 'text-red-700'
                          : rec.priority === 'medium'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }>
                        Timeline: {rec.timeline}
                      </p>
                      <ul className="mt-1 list-disc list-inside">
                        {rec.resources.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;