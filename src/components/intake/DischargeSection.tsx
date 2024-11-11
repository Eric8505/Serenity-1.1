import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { DischargeRecord } from '../../types/intake';
import { TreatmentPlan } from '../../types/treatment';
import DischargeForm from '../DischargeForm';

interface DischargeSectionProps {
  clientId: string;
  intakeId: string;
  treatmentPlan?: TreatmentPlan;
  onComplete: (discharge: DischargeRecord) => void;
  isInitialIntake?: boolean;
}

const DischargeSection: React.FC<DischargeSectionProps> = ({
  clientId,
  intakeId,
  treatmentPlan,
  onComplete,
  isInitialIntake = true,
}) => {
  const [showFinalDischarge, setShowFinalDischarge] = useState(!isInitialIntake);

  const handleSubmit = (discharge: DischargeRecord) => {
    onComplete(discharge);
  };

  const handleToggleDischarge = () => {
    setShowFinalDischarge(!showFinalDischarge);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-text">
          {showFinalDischarge ? 'Final Discharge Summary' : 'Initial Discharge Planning'}
        </h3>
        
        {treatmentPlan && (
          <button
            type="button"
            onClick={handleToggleDischarge}
            className="btn btn-secondary"
          >
            Switch to {showFinalDischarge ? 'Initial' : 'Final'} Discharge
          </button>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
        {showFinalDischarge ? (
          treatmentPlan ? (
            <DischargeForm
              clientId={clientId}
              intakeId={intakeId}
              treatmentPlan={treatmentPlan}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">
                Treatment plan must be completed before final discharge can be processed.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Anticipated Discharge Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border-border bg-surface text-text"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Expected Length of Stay
                </label>
                <select className="w-full rounded-lg border-border bg-surface text-text">
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Initial Discharge Goals
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border-border bg-surface text-text"
                placeholder="Enter initial discharge goals and objectives..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Preliminary Aftercare Plan
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border-border bg-surface text-text"
                placeholder="Outline preliminary aftercare planning..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Support System Assessment
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border-border bg-surface text-text"
                placeholder="Assess available support systems and resources..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleSubmit({
                  id: crypto.randomUUID(),
                  clientId,
                  intakeId,
                  date: new Date().toISOString(),
                  type: 'planned',
                  status: {
                    goals: [],
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
                } as DischargeRecord)}
                className="btn btn-primary"
              >
                Complete Initial Planning
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DischargeSection;