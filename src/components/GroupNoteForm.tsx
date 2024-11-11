import React, { useState } from 'react';
import { GroupNote, AbsenceReason, ABSENCE_REASONS } from '../types/notes';
import { Client } from '../types';
import { Clock, Users, Check, X } from 'lucide-react';

interface GroupNoteFormProps {
  groupHomeId: string;
  clients: Client[];
  onSubmit: (note: Omit<GroupNote, 'id'>) => void;
}

const GroupNoteForm: React.FC<GroupNoteFormProps> = ({
  groupHomeId,
  clients,
  onSubmit,
}) => {
  const [note, setNote] = useState<Omit<GroupNote, 'id'>>({
    groupHomeId,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'morning',
    facilitator: '',
    topic: '',
    content: '',
    attendance: clients.map(client => ({
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      participated: false,
      absent: false,
    })),
    summary: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(note);
  };

  const toggleAttendance = (clientId: string, type: 'participated' | 'absent') => {
    setNote(prev => ({
      ...prev,
      attendance: prev.attendance.map(a =>
        a.clientId === clientId
          ? {
              ...a,
              [type]: !a[type],
              ...(type === 'participated' && { absent: false, absenceReason: undefined, absenceDetails: undefined }),
              ...(type === 'absent' && { participated: false }),
            }
          : a
      ),
    }));
  };

  const updateAbsenceReason = (clientId: string, reason: AbsenceReason, details?: string) => {
    setNote(prev => ({
      ...prev,
      attendance: prev.attendance.map(a =>
        a.clientId === clientId
          ? {
              ...a,
              absenceReason: reason,
              absenceDetails: details,
            }
          : a
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
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
              onChange={e => setNote({ ...note, timeOfDay: e.target.value as 'morning' | 'afternoon' | 'evening' })}
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

        <div className="mt-6">
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

        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text">Attendance</h3>
          </div>

          <div className="space-y-4">
            {note.attendance.map((attendance) => (
              <div
                key={attendance.clientId}
                className="p-4 bg-background rounded-lg border border-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-text">
                      {attendance.clientName}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(attendance.clientId, 'participated')}
                      className={`btn ${
                        attendance.participated ? 'btn-primary' : 'btn-secondary'
                      } btn-sm`}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAttendance(attendance.clientId, 'absent')}
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
                        onChange={e => updateAbsenceReason(
                          attendance.clientId,
                          e.target.value as AbsenceReason,
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
                          onChange={e => updateAbsenceReason(
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

        <div className="mt-6">
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

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Group Note
          </button>
        </div>
      </div>
    </form>
  );
};

export default GroupNoteForm;