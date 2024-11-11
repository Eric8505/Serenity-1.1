import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IntakeAssessment } from '../types/intake';

interface AssessmentFormProps {
  clientId: string;
  intakeId: string;
  initialData?: Partial<IntakeAssessment>;
  onSubmit: (assessment: IntakeAssessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  clientId,
  intakeId,
  initialData,
  onSubmit,
}) => {
  const [assessment, setAssessment] = useState<Partial<IntakeAssessment>>({
    id: crypto.randomUUID(),
    clientId,
    intakeId,
    date: new Date().toISOString().split('T')[0],
    assessor: '',
    presentingProblems: [''],
    mentalStatus: {
      appearance: [],
      behavior: [],
      mood: [],
      affect: [],
      thoughtProcess: [],
      orientation: [],
      memory: [],
      attention: [],
      insight: [],
      judgment: [],
    },
    substanceUse: {
      current: [],
      history: '',
      treatment: '',
    },
    psychiatricHistory: {
      previousTreatment: '',
      hospitalizations: [],
      medications: [],
    },
    medicalHistory: {
      conditions: [],
      medications: [],
      allergies: [],
      primaryCare: '',
    },
    familyHistory: {
      mentalHealth: '',
      substanceUse: '',
      medical: '',
    },
    socialHistory: {
      education: '',
      employment: '',
      relationships: '',
      legalHistory: '',
      housing: '',
      support: '',
    },
    riskAssessment: {
      suicide: {
        ideation: false,
        plan: false,
        intent: false,
        history: '',
      },
      homicide: {
        ideation: false,
        plan: false,
        intent: false,
        history: '',
      },
      abuse: {
        current: false,
        history: '',
        type: [],
      },
    },
    diagnosis: {
      primary: {
        code: '',
        description: '',
      },
      secondary: [],
    },
    recommendations: [],
    signatures: {
      assessor: {
        name: '',
        credentials: '',
        date: new Date().toISOString().split('T')[0],
        signature: '',
      },
    },
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assessment.assessor && assessment.presentingProblems.length > 0) {
      onSubmit(assessment as IntakeAssessment);
    }
  };

  const addArrayItem = (field: string, value: any = '') => {
    setAssessment(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setAssessment(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Assessment Date</label>
          <input
            type="date"
            value={assessment.date}
            onChange={e => setAssessment({ ...assessment, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assessor Name</label>
          <input
            type="text"
            value={assessment.assessor}
            onChange={e => setAssessment({ ...assessment, assessor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      {/* Presenting Problems */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Presenting Problems</label>
          <button
            type="button"
            onClick={() => addArrayItem('presentingProblems')}
            className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Problem
          </button>
        </div>
        {assessment.presentingProblems?.map((problem, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={problem}
              onChange={e => updateArrayItem('presentingProblems', index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('presentingProblems', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Mental Status */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mental Status Examination</h3>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(assessment.mentalStatus || {}).map(([category, items]) => (
            <div key={category}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <select
                multiple
                value={items}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setAssessment(prev => ({
                    ...prev,
                    mentalStatus: {
                      ...prev.mentalStatus,
                      [category]: selected,
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
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Suicide Risk */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Suicide Risk</h4>
            <div className="space-y-2">
              {Object.entries(assessment.riskAssessment.suicide).map(([key, value]) => (
                key !== 'history' && (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={e => setAssessment(prev => ({
                        ...prev,
                        riskAssessment: {
                          ...prev.riskAssessment,
                          suicide: {
                            ...prev.riskAssessment.suicide,
                            [key]: e.target.checked,
                          },
                        },
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                  </div>
                )
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">History</label>
                <textarea
                  value={assessment.riskAssessment.suicide.history}
                  onChange={e => setAssessment(prev => ({
                    ...prev,
                    riskAssessment: {
                      ...prev.riskAssessment,
                      suicide: {
                        ...prev.riskAssessment.suicide,
                        history: e.target.value,
                      },
                    },
                  }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Homicide Risk */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Homicide Risk</h4>
            <div className="space-y-2">
              {Object.entries(assessment.riskAssessment.homicide).map(([key, value]) => (
                key !== 'history' && (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={e => setAssessment(prev => ({
                        ...prev,
                        riskAssessment: {
                          ...prev.riskAssessment,
                          homicide: {
                            ...prev.riskAssessment.homicide,
                            [key]: e.target.checked,
                          },
                        },
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                  </div>
                )
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">History</label>
                <textarea
                  value={assessment.riskAssessment.homicide.history}
                  onChange={e => setAssessment(prev => ({
                    ...prev,
                    riskAssessment: {
                      ...prev.riskAssessment,
                      homicide: {
                        ...prev.riskAssessment.homicide,
                        history: e.target.value,
                      },
                    },
                  }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Diagnosis</h3>
        <div className="space-y-6">
          {/* Primary Diagnosis */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Primary Diagnosis</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  value={assessment.diagnosis.primary.code}
                  onChange={e => setAssessment(prev => ({
                    ...prev,
                    diagnosis: {
                      ...prev.diagnosis,
                      primary: {
                        ...prev.diagnosis.primary,
                        code: e.target.value,
                      },
                    },
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={assessment.diagnosis.primary.description}
                  onChange={e => setAssessment(prev => ({
                    ...prev,
                    diagnosis: {
                      ...prev.diagnosis,
                      primary: {
                        ...prev.diagnosis.primary,
                        description: e.target.value,
                      },
                    },
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Secondary Diagnoses */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-900">Secondary Diagnoses</h4>
              <button
                type="button"
                onClick={() => {
                  setAssessment(prev => ({
                    ...prev,
                    diagnosis: {
                      ...prev.diagnosis,
                      secondary: [
                        ...prev.diagnosis.secondary,
                        { code: '', description: '' },
                      ],
                    },
                  }));
                }}
                className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Diagnosis
              </button>
            </div>
            {assessment.diagnosis.secondary.map((diagnosis, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <div>
                  <input
                    type="text"
                    value={diagnosis.code}
                    onChange={e => {
                      const newSecondary = [...assessment.diagnosis.secondary];
                      newSecondary[index] = {
                        ...newSecondary[index],
                        code: e.target.value,
                      };
                      setAssessment(prev => ({
                        ...prev,
                        diagnosis: {
                          ...prev.diagnosis,
                          secondary: newSecondary,
                        },
                      }));
                    }}
                    placeholder="Code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={diagnosis.description}
                    onChange={e => {
                      const newSecondary = [...assessment.diagnosis.secondary];
                      newSecondary[index] = {
                        ...newSecondary[index],
                        description: e.target.value,
                      };
                      setAssessment(prev => ({
                        ...prev,
                        diagnosis: {
                          ...prev.diagnosis,
                          secondary: newSecondary,
                        },
                      }));
                    }}
                    placeholder="Description"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAssessment(prev => ({
                        ...prev,
                        diagnosis: {
                          ...prev.diagnosis,
                          secondary: prev.diagnosis.secondary.filter((_, i) => i !== index),
                        },
                      }));
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Recommendations</label>
          <button
            type="button"
            onClick={() => addArrayItem('recommendations')}
            className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Recommendation
          </button>
        </div>
        {assessment.recommendations?.map((recommendation, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={recommendation}
              onChange={e => updateArrayItem('recommendations', index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('recommendations', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Complete Assessment
        </button>
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
    thoughtProcess: [
      'Logical',
      'Coherent',
      'Circumstantial',
      'Tangential',
      'Flight of ideas',
      'Loose associations',
    ],
    orientation: [
      'Person',
      'Place',
      'Time',
      'Situation',
    ],
    memory: [
      'Intact',
      'Impaired recent',
      'Impaired remote',
      'Impaired immediate',
    ],
    attention: [
      'Normal',
      'Distractible',
      'Poor concentration',
      'Hypervigilant',
    ],
    insight: [
      'Good',
      'Fair',
      'Poor',
      'Absent',
    ],
    judgment: [
      'Good',
      'Fair',
      'Poor',
      'Impaired',
    ],
  };

  return options[category] || [];
};

export default AssessmentForm;