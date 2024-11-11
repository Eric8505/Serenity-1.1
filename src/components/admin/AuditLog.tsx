import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Filter, Download } from 'lucide-react';
import { AuditResult } from '../../types/audit';
import { runSecurityAudit } from '../../utils/security';

const AuditLog: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: format(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditResults = async () => {
      try {
        const results = await runSecurityAudit();
        setAuditResults([results]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditResults();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAuditResults, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = auditResults.filter(log => {
    const logDate = new Date(log.timestamp);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    return (
      logDate >= startDate &&
      logDate <= endDate &&
      (filter === 'all' || log.type === filter)
    );
  });

  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      type: log.type,
      severity: log.severity,
      findings: log.findings.map(f => ({
        category: f.category,
        description: f.description,
        recommendation: f.recommendation,
      })),
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-4 text-text">Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-text-secondary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="data">Data Access</option>
              <option value="system">System</option>
              <option value="security">Security</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 border-b border-border last:border-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {log.severity}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                </div>
                
                <div className="mt-2 space-y-2">
                  {log.findings.map((finding, index) => (
                    <div key={index} className="ml-4">
                      <p className="text-sm font-medium text-text">{finding.category}</p>
                      <p className="text-sm text-text-secondary">{finding.description}</p>
                      <p className="text-sm text-text-secondary mt-1">
                        Recommendation: {finding.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-text-secondary">
            No audit logs found for the selected criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;