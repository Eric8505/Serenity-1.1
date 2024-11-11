import React, { useState } from 'react';
import { useGroupHomes } from '../hooks/useGroupHomes';
import { useClients } from '../hooks/useClients';
import { GroupNote, ABSENCE_REASONS } from '../types/notes';
import { Users, Home, Check, X, Plus, Calendar } from 'lucide-react';

const GroupNotes: React.FC = () => {
  const { data: groupHomes = [], isLoading: loadingHomes } = useGroupHomes();
  const { clients, isLoading: loadingClients } = useClients();
  const [selectedGroupHome, setSelectedGroupHome] = useState<string | null>(null);
  const [note, setNote] = useState<Partial<GroupNote>>({
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'morning',
    facilitator: '',
    topic: '',
    content: '',
    attendance: [],
    summary: '',
  });

  const selectedHome = groupHomes.find(home => home.id === selectedGroupHome);
  const groupClients = clients.filter(client => 
    selectedHome?.activeClients.includes(client.id)
  );

  const handleSelectGroupHome = (homeId: string) => {
    setSelectedGroupHome(homeId);
    setNote(prev => ({
      ...prev,
      groupHomeId: homeId,
      attendance: groupClients.map(client => ({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        participated: false,
        absent: false,
      })),
    }));
  };

  const handleAttendanceChange = (clientId: string, status: 'present' | 'absent') => {
    setNote(prev => ({
      ...prev,
      attendance: prev.attendance?.map(a =>
        a.clientId === clientId
          ? {
              ...a,
              participated: status === 'present',
              absent: status === 'absent',
              absenceReason: status === 'absent' ? a.absenceReason : undefined,
              absenceDetails: status === 'absent' ? a.absenceDetails : undefined,
            }
          : a
      ) || [],
    }));
  };

  const handleAbsenceReason = (clientId: string, reason: string, details?: string) => {
    setNote(prev => ({
      ...prev,
      attendance: prev.attendance?.map(a =>
        a.clientId === clientId
          ? {
              ...a,
              absenceReason: reason as any,
              absenceDetails: details,
            }
          : a
      ) || [],
    }));
  };

  if (loadingHomes || loadingClients) {
    return (
      <div className="text-center py-8 text-text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!selectedGroupHome ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-text">Select Group Home</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Choose a group home to create or view group notes
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groupHomes.map(home => (
              <div
                key={home.id}
                onClick={() => handleSelectGroupHome(home.id)}
                className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="px-4 py-3 bg-background border-b border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-text">{home.name}</h3>
                      <p className="text-sm text-text-secondary">{home.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-text-secondary" />
                      <span className="text-sm text-text-secondary">
                        {home.activeClients.length} / {home.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-text">Group Note</h2>
              <p className="mt-1 text-sm text-text-secondary">{selectedHome?.name}</p>
            </div>
            <button
              onClick={() => setSelectedGroupHome(null)}
              className="btn btn-secondary"
            >
              Change Group Home
            </button>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={note.date}
                    onChange={e => setNote({ ...note, date: e.target.value })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Time of Day
                  </label>
                  <select
                    value={note.timeOfDay}
                    onChange={e => setNote({ ...note, timeOfDay: e.target.value as any })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Facilitator
                  </label>
                  <input
                    type="text"
                    value={note.facilitator}
                    onChange={e => setNote({ ...note, facilitator: e.target.value })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={note.topic}
                    onChange={e => setNote({ ...note, topic: e.target.value })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Content
                </label>
                <textarea
                  value={note.content}
                  onChange={e => setNote({ ...note, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-text-secondary" />
                  <h3 className="text-lg font-medium text-text">Attendance</h3>
                </div>

                <div className="space-y-4">
                  {note.attendance?.map((attendance) => (
                    <div
                      key={attendance.clientId}
                      className="p-4 bg-background rounded-lg border border-border"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-text">
                            {attendance.clientName}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              attendance.participated
                                ? 'bg-green-100 text-green-800'
                                : attendance.absent
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {attendance.participated ? 'Present' : attendance.absent ? 'Absent' : 'Not Recorded'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(attendance.clientId, 'present')}
                            className={`btn ${
                              attendance.participated ? 'btn-primary' : 'btn-secondary'
                            } btn-sm`}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(attendance.clientId, 'absent')}
                            className={`btn ${
                              attendance.absent ? 'btn-primary' : 'btn-secondary'
                            } btn-sm`}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Absent
                          </button>
                        </div>
                      </div>

                      {attendance.absent && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Reason for Absence
                            </label>
                            <select
                              value={attendance.absenceReason || ''}
                              onChange={e => handleAbsenceReason(
                                attendance.clientId,
                                e.target.value,
                                attendance.absenceDetails
                              )}
                              className="w-full rounded-lg border-border bg-surface text-text"
                              required
                            >
                              <option value="">Select reason...</option>
                              {Object.entries(ABSENCE_REASONS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {attendance.absenceReason === 'other' && (
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">
                                Details
                              </label>
                              <input
                                type="text"
                                value={attendance.absenceDetails || ''}
                                onChange={e => handleAbsenceReason(
                                  attendance.clientId,
                                  'other',
                                  e.target.value
                                )}
                                className="w-full rounded-lg border-border bg-surface text-text"
                                placeholder="Please specify..."
                                required
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Summary
                </label>
                <textarea
                  value={note.summary}
                  onChange={e => setNote({ ...note, summary: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Save Group Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupNotes;