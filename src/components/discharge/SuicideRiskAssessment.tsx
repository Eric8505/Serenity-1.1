import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SuicideRiskAssessmentProps {
  risk: {
    currentRisk: string;
    previousAttempts: boolean;
    safetyPlan: string;
    crisisResources: boolean;
  };
  onChange: (risk: any) => void;
}

const SuicideRiskAssessment: React.FC<SuicideRiskAssessmentProps> = ({ risk, onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Suicide Risk Assessment</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Risk Level</label>
          <select
            value={risk.currentRisk}
            onChange={e => onChange({ ...risk, currentRisk: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={risk.previousAttempts}
            onChange={e => onChange({ ...risk, previousAttempts: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            History of Previous Attempts
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Safety Plan</label>
          <textarea
            value={risk.safetyPlan}
            onChange={e => onChange({ ...risk, safetyPlan: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Crisis Resources (24/7):
                <br />
                National Suicide Prevention Lifeline: 988
                <br />
                Arizona Crisis Line: 1-844-534-4673
                <br />
                Crisis Text Line: Text HOME to 741741
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuicideRiskAssessment;