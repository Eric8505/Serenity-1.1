import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { GroupNote, GroupHome } from '../types/notes';
import { BarChart, Users } from 'lucide-react';

interface WeeklyGroupSummaryProps {
  groupHome: GroupHome;
  notes: GroupNote[];
  startDate: Date;
}

const WeeklyGroupSummary: React.FC<WeeklyGroupSummaryProps> = ({
  groupHome,
  notes,
  startDate,
}) => {
  const weekStart = startOfWeek(startDate);
  const weekEnd = endOfWeek(startDate);

  const weeklyStats = useMemo(() => {
    const weekNotes = notes.filter(note => {
      const noteDate = new Date(note.date);
      return noteDate >= weekStart && noteDate <= weekEnd;
    });

    const totalSessions = weekNotes.length;
    const attendanceByClient = new Map<string, number>();
    const participationRate = new Map<string, number>();

    weekNotes.forEach(note => {
      note.attendance.forEach(attendance => {
        if (attendance.participated) {
          attendanceByClient.set(
            attendance.clientId,
            (attendanceByClient.get(attendance.clientId) || 0) + 1
          );
        }
      });
    });

    // Calculate participation rates
    attendanceByClient.forEach((sessions, clientId) => {
      participationRate.set(clientId, (sessions / totalSessions) * 100);
    });

    return {
      totalSessions,
      attendanceByClient,
      participationRate,
      averageAttendance: weekNotes.reduce((acc, note) => 
        acc + note.attendance.filter(a => a.participated).length, 0
      ) / totalSessions,
    };
  }, [notes, weekStart, weekEnd]);

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Weekly Group Summary - {groupHome.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Sessions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {weeklyStats.totalSessions}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Attendance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(weeklyStats.averageAttendance)} clients
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900">Client Participation</h4>
          <div className="mt-4 border rounded-lg divide-y">
            {Array.from(weeklyStats.participationRate.entries()).map(([clientId, rate]) => (
              <div key={clientId} className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {notes.find(n => 
                    n.attendance.find(a => a.clientId === clientId)
                  )?.attendance.find(a => a.clientId === clientId)?.clientName}
                </span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{Math.round(rate)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900">Weekly Overview</h4>
          <div className="mt-4 prose max-w-none">
            <p>
              This week, we conducted {weeklyStats.totalSessions} group sessions with an average
              attendance of {Math.round(weeklyStats.averageAttendance)} clients per session.
              {weeklyStats.averageAttendance > (groupHome.capacity * 0.7)
                ? " Participation was strong this week."
                : " There's room for improved participation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGroupSummary;