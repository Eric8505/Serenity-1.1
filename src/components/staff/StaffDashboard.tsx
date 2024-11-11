import React from 'react';
import { StaffMember, SupervisionLog } from '../../types/staff';
import { PerformanceMetric } from '../../types/quality';
import { Users, Award, Clock, Calendar } from 'lucide-react';

interface StaffDashboardProps {
  staff: StaffMember;
  supervisionLogs: SupervisionLog[];
  performance: PerformanceMetric;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staff,
  supervisionLogs,
  performance,
}) => {
  const upcomingTraining = staff.training.filter(
    t => t.status === 'pending' || t.status === 'expired'
  );

  const recentSupervision = supervisionLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Caseload
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {staff.caseload} clients
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
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Notes Completion
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {staff.performance.notesCompletionRate}%
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
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {staff.performance.avgResponseTime} hrs
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
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Training
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {upcomingTraining.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Supervision</h3>
            <div className="mt-4 flow-root">
              <ul className="divide-y divide-gray-200">
                {recentSupervision.map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {log.type} supervision - {log.duration} minutes
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Performance Goals</h3>
            <div className="mt-4 flow-root">
              <ul className="divide-y divide-gray-200">
                {performance.goals.map((goal, index) => (
                  <li key={index} className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {goal.description}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          goal.status === 'on_track'
                            ? 'bg-green-100 text-green-800'
                            : goal.status === 'at_risk'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {goal.current} / {goal.target} - Due {new Date(goal.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;