import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Intervention {
  type: string;
  description: string;
  response: string;
  responseNotes: string;
}

interface InterventionsSectionProps {
  interventions: Intervention[];
  onChange: (interventions: Intervention[]) => void;
}

const INTERVENTION_TYPES = [
  'Cognitive Behavioral Therapy',
  'Motivational Interviewing',
  'Crisis Intervention',
  'Skills Training',
  'Group Therapy',
  'Family Therapy',
  'Supportive Counseling',
  'Psychoeducation',
  'Behavioral Activation',
  'Other',
];

const RESPONSE_OPTIONS = [
  'Engaged',
  'Resistant',
  'Neutral',
  'Receptive',
  'Distracted',
  'Emotional',
  'Cooperative',
  'Withdrawn',
];

const InterventionsSection: React.FC<InterventionsSectionProps> = ({
  interventions,
  onChange,
}) => {
  const addIntervention = () => {
    onChange([
      ...interventions,
      { type: '', description: '', response: '', responseNotes: '' },
    ]);
  };

  const removeIntervention = (index: number) => {
    onChange(interventions.filter((_, i) => i !== index));
  };

  const updateIntervention = (index: number, field: keyof Intervention, value: string) => {
    onChange(
      interventions.map((intervention, i) =>
        i === index ? { ...intervention, [field]: value } : intervention
      )
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text">Therapeutic Interventions</h3>
        <button
          type="button"
          onClick={addIntervention}
          className="btn btn-secondary btn-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Intervention
        </button>
      </div>

      <div className="space-y-4">
        {interventions.map((intervention, index) => (
          <div
            key={index}
            className="p-4 bg-background rounded-lg border border-border"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-medium text-text">
                Intervention {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeIntervention(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Type
                </label>
                <select
                  value={intervention.type}
                  onChange={(e) => updateIntervention(index, 'type', e.target.value)}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                >
                  <option value="">Select intervention type</option>
                  {INTERVENTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Client Response
                </label>
                <select
                  value={intervention.response}
                  onChange={(e) => updateIntervention(index, 'response', e.target.value)}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                >
                  <option value="">Select client response</option>
                  {RESPONSE_OPTIONS.map((response) => (
                    <option key={response} value={response}>
                      {response}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Description
              </label>
              <textarea
                value={intervention.description}
                onChange={(e) => updateIntervention(index, 'description', e.target.value)}
                rows={2}
                className="w-full rounded-lg border-border bg-surface text-text"
                placeholder="Describe the intervention used..."
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Response Notes
              </label>
              <textarea
                value={intervention.responseNotes}
                onChange={(e) => updateIntervention(index, 'responseNotes', e.target.value)}
                rows={2}
                className="w-full rounded-lg border-border bg-surface text-text"
                placeholder="Describe the client's response and engagement..."
                required
              />
            </div>
          </div>
        ))}

        {interventions.length === 0 && (
          <div className="text-center py-6 text-text-secondary">
            No interventions added. Click "Add Intervention" to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionsSection;