import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface NextSessionSectionProps {
  plans: string[];
  notes: string;
  onPlansChange: (plans: string[]) => void;
  onNotesChange: (notes: string) => void;
}

const COMMON_PLANS = [
  'Continue current interventions',
  'Review progress on goals',
  'Introduce new coping strategies',
  'Process recent events/challenges',
  'Skills practice and reinforcement',
  'Family involvement/education',
  'Crisis planning/safety review',
];

const NextSessionSection: React.FC<NextSessionSectionProps> = ({
  plans,
  notes,
  onPlansChange,
  onNotesChange,
}) => {
  const addPlan = () => {
    onPlansChange([...plans, '']);
  };

  const removePlan = (index: number) => {
    onPlansChange(plans.filter((_, i) => i !== index));
  };

  const updatePlan = (index: number, value: string) => {
    onPlansChange(plans.map((plan, i) => (i === index ? value : plan)));
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text">Next Session Planning</h3>
        <button
          type="button"
          onClick={addPlan}
          className="btn btn-secondary btn-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </button>
      </div>

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <div key={index} className="flex items-center space-x-2">
            <select
              value={plan}
              onChange={(e) => updatePlan(index, e.target.value)}
              className="flex-1 rounded-lg border-border bg-surface text-text"
              required
            >
              <option value="">Select or type a plan...</option>
              {COMMON_PLANS.map((commonPlan) => (
                <option key={commonPlan} value={commonPlan}>
                  {commonPlan}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removePlan(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-border bg-surface text-text"
            placeholder="Add any additional notes or specific details for the next session..."
          />
        </div>
      </div>
    </div>
  );
};

export default NextSessionSection;