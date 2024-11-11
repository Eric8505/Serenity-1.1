import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { DischargeRecord } from '../types/intake';
import { TreatmentPlan } from '../types/treatment';

interface DischargeFormProps {
  clientId: string;
  intakeId: string;
  treatmentPlan?: TreatmentPlan;
  onComplete: (discharge: DischargeRecord) => void;
  isInitialIntake?: boolean;
  isStandalone?: boolean;
}

const DischargeForm: React.FC<DischargeFormProps> = ({
  clientId,
  intakeId,
  treatmentPlan,
  onComplete,
  isInitialIntake = true,
  isStandalone = false,
}) => {
  const [discharge, setDischarge] = useState<Partial<DischargeRecord>>({
    id: crypto.randomUUID(),
    clientId,
    intakeId,
    date: new Date().toISOString().split('T')[0],
    type: 'planned',
    reason: '',
    status: {
      goals: treatmentPlan?.goals.map(goal => ({
        goalId: goal.id,
        status: 'partially_achieved',
        notes: '',
      })) || [],
      symptoms: '',
      functioning: '',
    },
    aftercare: {
      referrals: [],
      medications: [],
      recommendations: [],
    },
    followUp: {
      plan: '',
      appointments: [],
    },
    crisis: {
      plan: '',
      contacts: [],
      resources: [],
    },
    signatures: {
      clinician: {
        name: '',
        credentials: '',
        date: new Date().toISOString().split('T')[0],
        signature: '',
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (discharge.date && discharge.reason) {
      onComplete(discharge as DischargeRecord);
    }
  };

  const FormWrapper = isStandalone ? 'form' : 'div';

  const formContent = (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Discharge Date</label>
          <input
            type="date"
            value={discharge.date}
            onChange={e => setDischarge({ ...discharge, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discharge Type</label>
          <select
            value={discharge.type}
            onChange={e => setDischarge({ ...discharge, type: e.target.value as DischargeRecord['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="planned">Planned</option>
            <option value="unplanned">Unplanned</option>
            <option value="administrative">Administrative</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Reason for Discharge</label>
        <textarea
          value={discharge.reason}
          onChange={e => setDischarge({ ...discharge, reason: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type={isStandalone ? 'submit' : 'button'}
          onClick={isStandalone ? undefined : () => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          className="btn btn-primary"
        >
          Complete Initial Planning
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </>
  );

  return isStandalone ? (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formContent}
    </form>
  ) : (
    <div className="space-y-6">
      {formContent}
    </div>
  );
};

export default DischargeForm;