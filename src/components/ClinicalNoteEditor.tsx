import React, { useState } from 'react';
import { ClinicalNote } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface ClinicalNoteEditorProps {
  onSave: (note: Partial<ClinicalNote>) => void;
  initialData?: Partial<ClinicalNote>;
}

const ClinicalNoteEditor: React.FC<ClinicalNoteEditorProps> = ({
  onSave,
  initialData = {},
}) => {
  const [note, setNote] = useState<Partial<ClinicalNote>>({
    type: 'progress',
    private: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...note,
      date: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <select
            value={note.type}
            onChange={(e) =>
              setNote({ ...note, type: e.target.value as ClinicalNote['type'] })
            }
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="intake">Intake Note</option>
            <option value="progress">Progress Note</option>
            <option value="assessment">Assessment Note</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => setNote({ ...note, private: !note.private })}
          className={`inline-flex items-center px-3 py-2 border ${
            note.private
              ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          } rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {note.private ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Private
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Public
            </>
          )}
        </button>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Note Content
        </label>
        <textarea
          id="content"
          rows={8}
          value={note.content || ''}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your clinical note here..."
        />
      </div>

      <div>
        <label
          htmlFor="diagnosis"
          className="block text-sm font-medium text-gray-700"
        >
          Diagnosis
        </label>
        <input
          type="text"
          id="diagnosis"
          value={note.diagnosis?.join(', ') || ''}
          onChange={(e) =>
            setNote({
              ...note,
              diagnosis: e.target.value.split(',').map((d) => d.trim()),
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter diagnoses separated by commas"
        />
      </div>

      <div>
        <label
          htmlFor="treatmentPlan"
          className="block text-sm font-medium text-gray-700"
        >
          Treatment Plan
        </label>
        <textarea
          id="treatmentPlan"
          rows={4}
          value={note.treatmentPlan || ''}
          onChange={(e) => setNote({ ...note, treatmentPlan: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Outline the treatment plan..."
        />
      </div>

      <div>
        <label
          htmlFor="nextSteps"
          className="block text-sm font-medium text-gray-700"
        >
          Next Steps
        </label>
        <textarea
          id="nextSteps"
          rows={3}
          value={note.nextSteps || ''}
          onChange={(e) => setNote({ ...note, nextSteps: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Outline the next steps..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save as Template
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Note
        </button>
      </div>
    </form>
  );
};

export default ClinicalNoteEditor;