import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskAssessmentProps {
  riskAssessment: {
    suicidalIdeation: boolean;
    homicidalIdeation: boolean;
    substanceUse: boolean;
    notes: string;
  };
  onChange: (riskAssessment: any) => void;
}

const RiskAssessmentSection: React.FC<RiskAssessmentProps> = ({
  riskAssessment,
  onChange,
}) => {
  const handleChange = (field: string, value: boolean | string) => {
    onChange({
      ...riskAssessment,
      [field]: value,
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-medium text-text">Risk Assessment</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="suicidalIdeation"
            checked={riskAssessment.suicidalIdeation}
            onChange={(e) => handleChange('suicidalIdeation', e.target.checked)}
            className="h-4 w-4 text-accent rounded border-border focus:ring-accent"
          />
          <label htmlFor="suicidalIdeation" className="text-sm text-text">
            Suicidal Ideation
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="homicidalIdeation"
            checked={riskAssessment.homicidalIdeation}
            onChange={(e) => handleChange('homicidalIdeation', e.target.checked)}
            className="h-4 w-4 text-accent rounded border-border focus:ring-accent"
          />
          <label htmlFor="homicidalIdeation" className="text-sm text-text">
            Homicidal Ideation
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="substanceUse"
            checked={riskAssessment.substanceUse}
            onChange={(e) => handleChange('substanceUse', e.target.checked)}
            className="h-4 w-4 text-accent rounded border-border focus:ring-accent"
          />
          <label htmlFor="substanceUse" className="text-sm text-text">
            Substance Use
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Risk Assessment Notes
        </label>
        <textarea
          value={riskAssessment.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full rounded-lg border-border bg-surface text-text"
          placeholder="Enter any additional risk assessment notes, observations, or concerns..."
        />
      </div>

      {(riskAssessment.suicidalIdeation || riskAssessment.homicidalIdeation) && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Immediate Action Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Contact supervisor immediately and follow crisis protocol.</p>
                <p className="mt-1">Emergency Resources:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Crisis Line: 988</li>
                  <li>Emergency Services: 911</li>
                  <li>Supervisor On-Call: (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentSection;