import React, { useState } from 'react';
import { ProgressNote } from '../types/notes';
import { Plus, Trash2 } from 'lucide-react';

interface ProgressNoteFormProps {
  clientId: string;
  onSubmit: (note: Omit<ProgressNote, 'id'>) => void;
}

const ProgressNoteForm: React.FC<ProgressNoteFormProps> = ({ clientId, onSubmit }) => {
  const [note, setNote] = useState<Omit<ProgressNote, 'id'>>({
    clientId,
    date: new Date().toISOString().split('T')[0],
    author: '',
    content: '',
    goals: [''],
    interventions: [''],
    response: '',
    plan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...note,
      goals: note.goals.filter(Boolean),
      interventions: note.interventions.filter(Boolean),
    });
  };

  const addField = (field: 'goals' | 'interventions') => {
    setNote(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'goals' | 'interventions', index: number) => {
    setNote(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: 'goals' | 'interventions', index: number, value: string) => {
    setNote(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={note.date}
              onChange={e => setNote({ ...note, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={note.author}
              onChange={e => setNote({ ...note, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={note.content}
            onChange={e => setNote({ ...note, content: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Goals</label>
            <button
              type="button"
              onClick={() => addField('goals')}
              className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </button>
          </div>
          {note.goals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={goal}
                onChange={e => updateField('goals', index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeField('goals', index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Interventions</label>
            <button
              type="button"
              onClick={() => addField('interventions')}
              className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Intervention
            </button>
          </div>
          {note.interventions.map((intervention, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={intervention}
                onChange={e => updateField('interventions', index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeField('interventions', index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Client Response</label>
          <textarea
            value={note.response}
            onChange={e => setNote({ ...note, response: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Plan</label>
          <textarea
            value={note.plan}
            onChange={e => setNote({ ...note, plan: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Progress Note
        </button>
      </div>
    </form>
  );
};

export default ProgressNoteForm;