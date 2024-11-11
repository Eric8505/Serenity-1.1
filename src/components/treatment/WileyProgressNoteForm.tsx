import React, { useState } from 'react';
import { WileyProgressNote } from '../../types/treatment';
import { Plus, Trash2, Save } from 'lucide-react';

interface WileyProgressNoteFormProps {
  clientId: string;
  initialData?: Partial<WileyProgressNote>;
  onSubmit: (note: Omit<WileyProgressNote, 'id'>) => void;
}

const WileyProgressNoteForm: React.FC<WileyProgressNoteFormProps> = ({
  clientId,
  initialData,
  onSubmit,
}) => {
  const [note, setNote] = useState<Partial<WileyProgressNote>>({
    clientId,
    sessionDate: new Date().toISOString().split('T')[0],
    duration: 60,
    sessionType: 'individual',
    location: '',
    presentingIssues: [''],
    mentalStatus: {
      appearance: [],
      behavior: [],
      mood: [],
      affect: [],
      speech: [],
      thoughtProcess: [],
      thoughtContent: [],
      cognition: [],
      insight: [],
      judgment: [],
      risk: {
        suicidal: {
          present: false,
          ideation: false,
          plan: false,
          intent: false,
          means: false,
          history: false,
        },
        homicidal: {
          present: false,
          ideation: false,
          plan: false,
          intent: false,
          means: false,
          history: false,
        },
      },
    },
    interventions: [],
    progress: [],
    planUpdate: {
      modifications: [],
      newInterventions: [],
      referrals: [],
    },
    nextSession: {
      scheduled: '',
      focus: [],
    },
    billableTime: 60,
    ...initialData,
  });

  const addArrayItem = (field: string, value: any = '') => {
    setNote(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setNote(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setNote(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.clientId && note.sessionDate) {
      onSubmit(note as WileyProgressNote);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Progress Note</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Date</label>
            <input
              type="date"
              value={note.sessionDate}
              onChange={e => setNote({ ...note, sessionDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Session Type</label>
            <select
              value={note.sessionType}
              onChange={e => setNote({ ...note, sessionType: e.target.value as WileyProgressNote['sessionType'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="family">Family</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              value={note.duration}
              onChange={e => setNote({ ...note, duration: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={note.location}
              onChange={e => setNote({ ...note, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Presenting Issues */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Presenting Issues</label>
            <button
              type="button"
              onClick={() => addArrayItem('presentingIssues')}
              className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Issue
            </button>
          </div>
          {note.presentingIssues?.map((issue, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={issue}
                onChange={e => updateArrayItem('presentingIssues', index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('presentingIssues', index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Mental Status */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Mental Status Examination</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(note.mentalStatus || {}).map(([category, values]) => {
              if (category === 'risk') return null;
              return (
                <div key={category} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </label>
                  <select
                    multiple
                    value={values as string[]}
                    onChange={e => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setNote(prev => ({
                        ...prev,
                        mentalStatus: {
                          ...prev.mentalStatus,
                          [category]: selectedOptions,
                        },
                      }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {getMentalStatusOptions(category).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Risk Assessment */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Risk Assessment</h4>
            
            <div className="grid grid-cols-2 gap-6">
              {['suicidal', 'homicidal'].map(riskType => (
                <div key={riskType} className="space-y-4">
                  <h5 className="text-sm font-medium text-gray-900 capitalize">{riskType} Risk</h5>
                  
                  {Object.entries(note.mentalStatus?.risk[riskType] || {}).map(([field, value]) => (
                    <div key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${riskType}-${field}`}
                        checked={value as boolean}
                        onChange={e => {
                          setNote(prev => ({
                            ...prev,
                            mentalStatus: {
                              ...prev.mentalStatus,
                              risk: {
                                ...prev.mentalStatus?.risk,
                                [riskType]: {
                                  ...prev.mentalStatus?.risk[riskType],
                                  [field]: e.target.checked,
                                },
                              },
                            },
                          }));
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`${riskType}-${field}`}
                        className="ml-2 block text-sm text-gray-900 capitalize"
                      >
                        {field.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                  
                  {note.mentalStatus?.risk[riskType].present && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Details</label>
                      <textarea
                        value={note.mentalStatus?.risk[riskType].details || ''}
                        onChange={e => {
                          setNote(prev => ({
                            ...prev,
                            mentalStatus: {
                              ...prev.mentalStatus,
                              risk: {
                                ...prev.mentalStatus?.risk,
                                [riskType]: {
                                  ...prev.mentalStatus?.risk[riskType],
                                  details: e.target.value,
                                },
                              },
                            },
                          }));
                        }}
                        rows={3}
                        className="mt-1 block w full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interventions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900">Interventions</h3>
            <button
              type="button"
              onClick={() => addArrayItem('interventions', { type: '', description: '', response: '' })}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Intervention
            </button>
          </div>

          <div className="space-y-4">
            {note.interventions?.map((intervention, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Intervention {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('interventions', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                      type="text"
                      value={intervention.type}
                      onChange={e => updateArrayItem('interventions', index, { ...intervention, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={intervention.description}
                      onChange={e => updateArrayItem('interventions', index, { ...intervention, description: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Response</label>
                    <textarea
                      value={intervention.response}
                      onChange={e => updateArrayItem('interventions', index, { ...intervention, response: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress on Goals */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900">Progress on Goals</h3>
            <button
              type="button"
              onClick={() => addArrayItem('progress', { goalId: '', status: 'no_change', notes: '' })}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Goal Progress
            </button>
          </div>

          <div className="space-y-4">
            {note.progress?.map((progress, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Goal Progress {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('progress', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Goal ID</label>
                    <input
                      type="text"
                      value={progress.goalId}
                      onChange={e => updateArrayItem('progress', index, { ...progress, goalId: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={progress.status}
                      onChange={e => updateArrayItem('progress', index, { ...progress, status: e.target.value as 'no_change' | 'improved' | 'declined' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="no_change">No Change</option>
                      <option value="improved">Improved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={progress.notes}
                      onChange={e => updateArrayItem('progress', index, { ...progress, notes: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Update */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Plan Update</h3>
          
          <div className="space-y-6">
            {['modifications', 'newInterventions', 'referrals'].map(field => (
              <div key={field}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNote(prev => ({
                        ...prev,
                        planUpdate: {
                          ...prev.planUpdate,
                          [field]: [...(prev.planUpdate?.[field] || []), ''],
                        },
                      }));
                    }}
                    className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>

                {note.planUpdate?.[field]?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        setNote(prev => ({
                          ...prev,
                          planUpdate: {
                            ...prev.planUpdate,
                            [field]: prev.planUpdate[field].map((i, idx) =>
                              idx === index ? e.target.value : i
                            ),
                          },
                        }));
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNote(prev => ({
                          ...prev,
                          planUpdate: {
                            ...prev.planUpdate,
                            [field]: prev.planUpdate[field].filter((_, idx) => idx !== index),
                          },
                        }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Next Session */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Next Session</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
              <input
                type="date"
                value={note.nextSession?.scheduled}
                onChange={e => setNote(prev => ({
                  ...prev,
                  nextSession: {
                    ...prev.nextSession,
                    scheduled: e.target.value,
                  },
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Focus Areas</label>
              <button
                type="button"
                onClick={() => {
                  setNote(prev => ({
                    ...prev,
                    nextSession: {
                      ...prev.nextSession,
                      focus: [...(prev.nextSession?.focus || []), ''],
                    },
                  }));
                }}
                className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Focus Area
              </button>
            </div>

            {note.nextSession?.focus.map((focus, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={focus}
                  onChange={e => {
                    setNote(prev => ({
                      ...prev,
                      nextSession: {
                        ...prev.nextSession,
                        focus: prev.nextSession.focus.map((f, idx) =>
                          idx === index ? e.target.value : f
                        ),
                      },
                    }));
                  }}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNote(prev => ({
                      ...prev,
                      nextSession: {
                        ...prev.nextSession,
                        focus: prev.nextSession.focus.filter((_, idx) => idx !== index),
                      },
                    }));
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress Note
          </button>
        </div>
      </div>
    </form>
  );
};

const getMentalStatusOptions = (category: string): string[] => {
  const options = {
    appearance: [
      'Well-groomed',
      'Casual',
      'Disheveled',
      'Inappropriate dress',
      'Poor hygiene',
    ],
    behavior: [
      'Calm',
      'Cooperative',
      'Agitated',
      'Restless',
      'Withdrawn',
      'Hostile',
    ],
    mood: [
      'Euthymic',
      'Depressed',
      'Anxious',
      'Irritable',
      'Elevated',
      'Labile',
    ],
    affect: [
      'Full range',
      'Restricted',
      'Blunted',
      'Flat',
      'Inappropriate',
      'Congruent',
    ],
    speech: [
      'Normal rate/tone',
      'Pressured',
      'Slow',
      'Loud',
      'Soft',
      'Monotone',
    ],
    thoughtProcess: [
      'Logical',
      'Coherent',
      'Circumstantial',
      'Tangential',
      'Flight of ideas',
      'Loose associations',
    ],
    thoughtContent: [
      'Normal',
      'Paranoid',
      'Delusional',
      'Obsessive',
      'Phobic',
      'Suicidal ideation',
    ],
    cognition: [
      'Alert',
      'Oriented x3',
      'Confused',
      'Distractible',
      'Poor concentration',
      'Memory impaired',
    ],
    insight: [
      'Good',
      'Fair',
      'Limited',
      'Poor',
      'Absent',
    ],
    judgment: [
      'Good',
      'Fair',
      'Limited',
      'Poor',
      'Impaired',
    ],
  };

  return options[category] || [];
};

export default WileyProgressNoteForm;