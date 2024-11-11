import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Activity, Server } from 'lucide-react';
import { runSecurityAudit } from '../../utils/security';
import { runAIAudit } from '../../utils/aiAudit';
import { AuditResult } from '../../types/audit';

interface SystemStatus {
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    responseTime: number;
    activeUsers: number;
  };
  security: {
    failedLogins: number;
    suspiciousActivities: number;
    vulnerabilities: number;
  };
  errors: {
    count: number;
    recent: Array<{
      id: string;
      message: string;
      timestamp: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
}

const SystemMonitor: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    performance: {
      cpuUsage: 0,
      memoryUsage: 0,
      responseTime: 0,
      activeUsers: 0
    },
    security: {
      failedLogins: 0,
      suspiciousActivities: 0,
      vulnerabilities: 0
    },
    errors: {
      count: 0,
      recent: []
    }
  });

  const [auditResults, setAuditResults] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run security audit
        const securityResults = await runSecurityAudit();
        setAuditResults(securityResults);

        // Simulate system monitoring data
        setStatus({
          performance: {
            cpuUsage: Math.random() * 100,
            memoryUsage: Math.random() * 100,
            responseTime: Math.random() * 1000,
            activeUsers: Math.floor(Math.random() * 100)
          },
          security: {
            failedLogins: Math.floor(Math.random() * 10),
            suspiciousActivities: Math.floor(Math.random() * 5),
            vulnerabilities: securityResults.findings.length
          },
          errors: {
            count: Math.floor(Math.random() * 5),
            recent: [
              {
                id: '1',
                message: 'Database connection timeout',
                timestamp: new Date().toISOString(),
                severity: 'high'
              },
              {
                id: '2',
                message: 'API rate limit exceeded',
                timestamp: new Date().toISOString(),
                severity: 'medium'
              }
            ]
          }
        });
      } catch (error) {
        console.error('Error fetching system status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading system status...</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Activity className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">CPU Usage</p>
              <p className="text-lg font-semibold text-text">
                {status.performance.cpuUsage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Server className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Memory Usage</p>
              <p className="text-lg font-semibold text-text">
                {status.performance.memoryUsage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Security Issues</p>
              <p className="text-lg font-semibold text-text">
                {status.security.vulnerabilities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Active Errors</p>
              <p className="text-lg font-semibold text-text">
                {status.errors.count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-lg font-medium text-text mb-4">Security Alerts</h3>
        <div className="space-y-4">
          {auditResults?.findings.map((finding, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityColor(finding.severity)}`}
            >
              <div className="flex items-start">
                <AlertTriangle className={`h-5 w-5 ${
                  finding.severity === 'critical' ? 'text-red-600' :
                  finding.severity === 'high' ? 'text-orange-600' :
                  finding.severity === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                } mt-0.5`} />
                <div className="ml-3">
                  <h4 className="text-sm font-medium">{finding.category}</h4>
                  <p className="mt-1 text-sm">{finding.description}</p>
                  <p className="mt-2 text-sm font-medium">Recommendation:</p>
                  <p className="text-sm">{finding.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-lg font-medium text-text mb-4">Recent Errors</h3>
        <div className="space-y-4">
          {status.errors.recent.map((error) => (
            <div
              key={error.id}
              className={`p-4 rounded-lg border ${getSeverityColor(error.severity)}`}
            >
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium">{error.message}</p>
                  <p className="mt-1 text-sm">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Graph */}
      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-lg font-medium text-text mb-4">System Performance</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">CPU Usage</span>
              <span className="text-sm font-medium text-text">
                {status.performance.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-500"
                style={{ width: `${status.performance.cpuUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Memory Usage</span>
              <span className="text-sm font-medium text-text">
                {status.performance.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-500"
                style={{ width: `${status.performance.memoryUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Response Time</span>
              <span className="text-sm font-medium text-text">
                {status.performance.responseTime.toFixed(0)}ms
              </span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-500"
                style={{ width: `${(status.performance.responseTime / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;