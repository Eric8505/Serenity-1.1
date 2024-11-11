import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { TreatmentPlan, TreatmentGoal } from '../../types/treatment';
import SignatureComponent, { SignatureRole } from '../signature/SignatureComponent';

interface TreatmentPlanFormProps {
  clientId: string;
  initialData?: Partial<TreatmentPlan>;
  onSubmit: (plan: TreatmentPlan) => void;
}

const TreatmentPlanForm: React.FC<TreatmentPlanFormProps> = ({
  clientId,
  initialData,
  onSubmit,
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

  const [showSignDialog, setShowSignDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.clientId && plan.startDate && plan.goals?.length) {
      const updatedPlan = {
        ...plan,
        id: plan.id || crypto.randomUUID(),
        status: 'active',
        createdAt: plan.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as TreatmentPlan;

      setPlan(updatedPlan);
      setIsSaved(true);
      onSubmit(updatedPlan);
    }
  };

  const handleSign = (signatureData: {
    name: string;
    role: SignatureRole;
    relationship?: string;
    signatureData: string;
    signatureType: 'draw' | 'type' | 'upload';
    date: string;
  }) => {
    const updatedPlan = {
      ...plan,
      signatures: [
        ...(plan.signatures || []),
        {
          name: signatureData.name,
          role: signatureData.role,
          relationship: signatureData.relationship,
          signature: signatureData.signatureData,
          date: signatureData.date,
        },
      ],
      status: 'signed',
      updatedAt: new Date().toISOString(),
    } as TreatmentPlan;

    setPlan(updatedPlan);
    setShowSignDialog(false);
    onSubmit(updatedPlan);
  };

  // ... rest of the existing form code ...

  const allowedRoles: SignatureRole[] = ['client', 'clinician', 'supervisor'];

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* ... existing form JSX ... */}

      <div className="flex justify-end space-x-3">
        {!plan.signatures?.length && (
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Treatment Plan
          </button>
        )}
        {isSaved && !plan.signatures?.length && (
          <button
            type="button"
            onClick={() => setShowSignDialog(true)}
            className="btn btn-primary"
          >
            Sign Plan
          </button>
        )}
      </div>

      {showSignDialog && (
        <SignatureComponent
          onSign={handleSign}
          onCancel={() => setShowSignDialog(false)}
          allowedRoles={allowedRoles}
          title="Sign Treatment Plan"
        />
      )}
    </form>
  );
};

export default TreatmentPlanForm;