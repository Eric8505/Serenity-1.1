import React from 'react';
import { format } from 'date-fns';
import { Users, Calendar } from 'lucide-react';
import { GroupNote, ABSENCE_REASONS } from '../../types/notes';

interface AttendanceHistoryProps {
  clientId: string;
  groupNotes: GroupNote[];
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  clientId,
  groupNotes,
}) => {
  const clientAttendance = groupNotes
    .map(note => {
      const attendance = note.attendance.find(a => a.clientId === clientId);
      if (!attendance) return null;
      return {
        date: note.date,
        timeOfDay: note.timeOfDay,
        topic: note.topic,
        participated: attendance.participated,
        absent: attendance.absent,
        absenceReason: attendance.absenceReason,
        absenceDetails: attendance.absenceDetails,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());

  const calculateStats = () => {
    const total = clientAttendance.length;
    const present = clientAttendance.filter(a => a?.participated).length;
    const absent = clientAttendance.filter(a => a?.absent).length;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;

    const absenceReasons = clientAttendance.reduce((acc, record) => {
      if (record?.absenceReason) {
        acc[record.absenceReason] = (acc[record.absenceReason] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return { total, present, absent, attendanceRate, absenceReasons };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Attendance Rate</p>
              <p className="text-2xl font-semibold text-text">
                {stats.attendanceRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Total Sessions</p>
              <p className="text-2xl font-semibold text-text">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Present</p>
              <p className="text-2xl font-semibold text-text">
                {stats.present}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Absent</p>
              <p className="text-2xl font-semibold text-text">
                {stats.absent}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-4 py-3 bg-background border-b border-border">
          <h3 className="font-medium text-text">Attendance History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {clientAttendance.map((record, index) => record && (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">
                    {record.timeOfDay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {record.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.participated
                        ? 'bg-green-100 text-green-800'
                        : record.absent
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.participated ? 'Present' : record.absent ? 'Absent' : 'Not Recorded'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {record.absenceReason ? (
                      <>
                        {ABSENCE_REASONS[record.absenceReason]}
                        {record.absenceReason === 'other' && record.absenceDetails && (
                          <span className="ml-1">- {record.absenceDetails}</span>
                        )}
                      </>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Object.keys(stats.absenceReasons).length > 0 && (
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="px-4 py-3 bg-background border-b border-border">
            <h3 className="font-medium text-text">Absence Summary</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.absenceReasons).map(([reason, count]) => (
                <div key={reason} className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="text-sm font-medium text-text">
                    {ABSENCE_REASONS[reason as keyof typeof ABSENCE_REASONS]}
                  </h4>
                  <p className="mt-1 text-2xl font-semibold text-text">
                    {count} {count === 1 ? 'time' : 'times'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;