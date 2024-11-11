import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock, Filter, Check } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');

  useEffect(() => {
    // Simulate fetching alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'High CPU Usage Detected',
        message: 'System CPU usage has exceeded 90% for the past 5 minutes.',
        type: 'warning',
        timestamp: new Date().toISOString(),
        status: 'new',
      },
      {
        id: '2',
        title: 'Failed Login Attempts',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        type: 'error',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'acknowledged',
      },
    ];

    setAlerts(mockAlerts);

    // Simulate real-time alerts
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: crypto.randomUUID(),
        title: 'System Health Check',
        message: 'Routine system health check completed successfully.',
        type: 'info',
        timestamp: new Date().toISOString(),
        status: 'new',
      };

      setAlerts(prev => [newAlert, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'acknowledged' as const }
          : alert
      )
    );
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved' as const }
          : alert
      )
    );
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getStatusIcon = (status: Alert['status']) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const filteredAlerts = alerts.filter(
    alert => filter === 'all' || alert.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['all', 'new', 'acknowledged', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary hover:bg-background'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-sm text-text-secondary">
          {alerts.filter(a => a.status === 'new').length} new alerts
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-text">
                      {alert.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-xs text-text-secondary">
                      {getStatusIcon(alert.status)}
                      <span>{alert.status}</span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {alert.message}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {alert.status === 'new' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-6 text-text-secondary">
            No alerts found
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;