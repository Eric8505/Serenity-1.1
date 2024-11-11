import React, { useState } from 'react';
import { IntakeAssessment } from '../../types/intake';

interface AssessmentSectionProps {
  clientId: string;
  intakeId: string;
  onComplete: (assessment: IntakeAssessment) => void;
}

const getMentalStatusOptions = (category: string): string[] => {
  const options: Record<string, string[]> = {
    appearance: [
      'Well-groomed',
      'Casual',
      'Disheveled',
      'Inappropriate dress',
      'Poor hygiene'
    ],
    behavior: [
      'Calm',
      'Cooperative',
      'Agitated',
      'Restless',
      'Withdrawn',
      'Hostile'
    ],
    mood: [
      'Euthymic',
      'Depressed',
      'Anxious',
      'Irritable',
      'Elevated',
      'Labile'
    ],
    affect: [
      'Full range',
      'Restricted',
      'Blunted',
      'Flat',
      'Inappropriate',
      'Congruent'
    ],
    thoughtProcess: [
      'Logical',
      'Coherent',
      'Circumstantial',
      'Tangential',
      'Flight of ideas',
      'Loose associations'
    ],
    thoughtContent: [
      'Normal',
      'Paranoid',
      'Delusional',
      'Obsessive',
      'Phobic',
      'Suicidal ideation'
    ],
    orientation: [
      'Oriented x3',
      'Oriented x2',
      'Oriented x1',
      'Disoriented'
    ],
    memory: [
      'Intact',
      'Mildly impaired',
      'Moderately impaired',
      'Severely impaired'
    ],
    attention: [
      'Normal',
      'Distractible',
      'Poor concentration',
      'Unable to focus'
    ],
    insight: [
      'Good',
      'Fair',
      'Limited',
      'Poor',
      'None'
    ],
    judgment: [
      'Good',
      'Fair',
      'Limited',
      'Poor',
      'Impaired'
    ]
  };
  return options[category] || [];
};

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  clientId,
  intakeId,
  onComplete
}) => {
  const [assessment, setAssessment] = useState<Partial<IntakeAssessment>>({
    clientId,
    intakeId,
    date: new Date().toISOString().split('T')[0],
    assessor: '',
    presentingProblems: [],
    mentalStatus: {
      appearance: '',
      behavior: '',
      mood: '',
      affect: '',
      thoughtProcess: '',
      thoughtContent: '',
      orientation: '',
      memory: '',
      attention: '',
      insight: '',
      judgment: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assessment.assessor && assessment.presentingProblems) {
      onComplete(assessment as IntakeAssessment);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900">Initial Assessment</h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assessment Date
          </label>
          <input
            type="date"
            value={assessment.date}
            onChange={e => setAssessment({ ...assessment, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assessor Name
          </label>
          <input
            type="text"
            value={assessment.assessor}
            onChange={e => setAssessment({ ...assessment, assessor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Presenting Problems
          </label>
          <textarea
            value={assessment.presentingProblems?.join('\n')}
            onChange={e => setAssessment({
              ...assessment,
              presentingProblems: e.target.value.split('\n').filter(Boolean)
            })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter each problem on a new line"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mental Status Examination</h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(assessment.mentalStatus || {}).map(([category, value]) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <select
                  value={value as string}
                  onChange={e => {
                    setAssessment(prev => ({
                      ...prev,
                      mentalStatus: {
                        ...prev.mentalStatus,
                        [category]: e.target.value
                      }
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select {category.replace(/([A-Z])/g, ' $1').toLowerCase()}</option>
                  {getMentalStatusOptions(category).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Complete Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSection;