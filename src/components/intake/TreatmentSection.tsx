import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, PenTool, Check } from 'lucide-react';
import { TreatmentPlan, TreatmentGoal } from '../../types/treatment';

interface TreatmentSectionProps {
  clientId: string;
  onComplete: (plan: TreatmentPlan) => void;
  initialData?: Partial<TreatmentPlan>;
}

const TreatmentSection: React.FC<TreatmentSectionProps> = ({
  clientId,
  onComplete,
  initialData,
}) => {
  const [plan, setPlan] = useState<Partial<TreatmentPlan>>({
    clientId,
    startDate: new Date().toISOString().split('T')[0],
    reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    diagnosis: [],
    presentingProblems: [''],
    strengths: [''],
    barriers: [''],
    goals: [],
    recommendations: [''],
    medications: [],
    status: 'draft',
    signatures: [],
    ...initialData,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Check initial state
  useEffect(() => {
    if (initialData?.signatures?.length > 0) {
      setIsSigned(true);
      setIsSaved(true);
    } else if (initialData?.status === 'active') {
      setIsSaved(true);
    }
  }, [initialData]);

  const handleSave = () => {
    if (plan.clientId && plan.startDate && plan.goals?.length) {
      const updatedPlan: TreatmentPlan = {
        ...plan,
        id: plan.id || crypto.randomUUID(),
        status: 'active',
        createdAt: plan.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: plan.createdBy || 'Current User', // In a real app, get from auth context
        updatedBy: 'Current User', // In a real app, get from auth context
      } as TreatmentPlan;

      setIsSaved(true);
      setPlan(updatedPlan);
      onComplete(updatedPlan);
    }
  };

  const handleSign = () => {
    if (isSaved && !isSigned) {
      const signedPlan: TreatmentPlan = {
        ...plan,
        signatures: [
          ...(plan.signatures || []),
          {
            role: 'clinician',
            name: 'Current User', // In a real app, get from auth context
            signature: 'Electronic Signature',
            date: new Date().toISOString(),
          },
        ],
        status: 'active',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Current User', // In a real app, get from auth context
      } as TreatmentPlan;

      setIsSigned(true);
      setPlan(signedPlan);
      onComplete(signedPlan);
    }
  };

  const addArrayItem = (field: keyof TreatmentPlan, value: any = '') => {
    if (!isSigned) {
      setPlan(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value],
      }));
    }
  };

  const removeArrayItem = (field: keyof TreatmentPlan, index: number) => {
    if (!isSigned) {
      setPlan(prev => ({
        ...prev,
        [field]: prev[field]?.filter((_, i) => i !== index),
      }));
    }
  };

  const updateArrayItem = (field: keyof TreatmentPlan, index: number, value: any) => {
    if (!isSigned) {
      setPlan(prev => ({
        ...prev,
        [field]: prev[field]?.map((item, i) => (i === index ? value : item)),
      }));
    }
  };

  const addGoal = () => {
    if (!isSigned) {
      const newGoal: TreatmentGoal = {
        id: crypto.randomUUID(),
        description: '',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'not_started',
        progress: 0,
        objectives: [],
        notes: '',
      };
      setPlan(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal],
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Treatment Plan</h2>
        <div className="flex items-center space-x-3">
          {!isSigned && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Plan
            </button>
          )}
          {isSaved && !isSigned && (
            <button
              type="button"
              onClick={handleSign}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PenTool className="h-4 w-4 mr-2" />
              Sign Plan
            </button>
          )}
          {isSigned && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Check className="h-4 w-4 mr-1" />
              Signed
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={plan.startDate}
            onChange={e => !isSigned && setPlan({ ...plan, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isSigned}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Review Date</label>
          <input
            type="date"
            value={plan.reviewDate}
            onChange={e => !isSigned && setPlan({ ...plan, reviewDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isSigned}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-900">Treatment Goals</h3>
          {!isSigned && (
            <button
              type="button"
              onClick={addGoal}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </button>
          )}
        </div>

        <div className="space-y-4">
          {plan.goals?.map((goal, index) => (
            <div key={goal.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-900">Goal {index + 1}</h4>
                {!isSigned && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('goals', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={goal.description}
                  onChange={e => updateArrayItem('goals', index, { ...goal, description: e.target.value })}
                  rows={2}
                  disabled={isSigned}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={e => updateArrayItem('goals', index, { ...goal, targetDate: e.target.value })}
                    disabled={isSigned}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={goal.status}
                    onChange={e => updateArrayItem('goals', index, { ...goal, status: e.target.value as TreatmentGoal['status'] })}
                    disabled={isSigned}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="achieved">Achieved</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreatmentSection;