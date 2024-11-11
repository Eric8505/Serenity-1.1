import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Goal {
  description: string;
  rating: number;
  notes: string;
}

interface GoalsSectionProps {
  goals: Goal[];
  onChange: (goals: Goal[]) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onChange }) => {
  const addGoal = () => {
    onChange([...goals, { description: '', rating: 3, notes: '' }]);
  };

  const removeGoal = (index: number) => {
    onChange(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | number) => {
    onChange(
      goals.map((goal, i) =>
        i === index ? { ...goal, [field]: value } : goal
      )
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text">Treatment Goals Progress</h3>
        <button
          type="button"
          onClick={addGoal}
          className="btn btn-secondary btn-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="p-4 bg-background rounded-lg border border-border"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-medium text-text">Goal {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Goal Description
                </label>
                <textarea
                  value={goal.description}
                  onChange={(e) => updateGoal(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  placeholder="Describe the treatment goal..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Progress Rating (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={goal.rating}
                    onChange={(e) => updateGoal(index, 'rating', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-text-secondary w-8 text-center">
                    {goal.rating}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>No Progress</span>
                  <span>Significant Progress</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Progress Notes
                </label>
                <textarea
                  value={goal.notes}
                  onChange={(e) => updateGoal(index, 'notes', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  placeholder="Describe progress made towards this goal..."
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="text-center py-6 text-text-secondary">
            No goals added. Click "Add Goal" to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSection;