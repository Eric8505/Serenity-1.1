import React, { useState } from 'react';
import { DischargeRecord } from '../../types/intake';
import { TreatmentPlan } from '../../types/treatment';
import { Check, PenTool, Save } from 'lucide-react';
import BasicInfo from './BasicInfo';
import NeedsAssessment from './NeedsAssessment';
import SuicideRiskAssessment from './SuicideRiskAssessment';
import PatientParticipation from './PatientParticipation';
import DischargeInstructions from './DischargeInstructions';
import SignatureComponent, { SignatureRole } from '../signature/SignatureComponent';

interface DischargeFormProps {
  clientId: string;
  intakeId: string;
  treatmentPlan?: TreatmentPlan;
  onSubmit: (discharge: DischargeRecord) => void;
  isInitialDischarge?: boolean;
}

const DischargeForm: React.FC<DischargeFormProps> = ({
  clientId,
  intakeId,
  treatmentPlan,
  onSubmit,
  isInitialDischarge = false,
}) => {
  const [discharge, setDischarge] = useState<Partial<DischargeRecord>>({
    id: crypto.randomUUID(),
    clientId,
    intakeId,
    date: new Date().toISOString().split('T')[0],
    type: 'planned',
    levelOfCare: 'outpatient',
    needsAssessment: {
      ongoingTherapy: false,
      supportGroups: false,
      medicalCare: false,
      housingSupport: false,
      substanceAbuse: false,
      notes: '',
    },
    suicideRisk: {
      currentRisk: 'none',
      previousAttempts: false,
      safetyPlan: '',
      crisisResources: true,
    },
    patientParticipation: {
      involved: false,
      understands: false,
      receivedCopy: false,
      notes: '',
    },
    instructions: {
      medications: '',
      activities: '',
      followUpCare: '',
      warning: '',
    },
    signatures: [],
    status: 'draft',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);

  const handleSave = () => {
    if (discharge.date) {
      const updatedDischarge = {
        ...discharge,
        status: 'active',
        updatedAt: new Date().toISOString(),
      };
      setDischarge(updatedDischarge);
      setIsSaved(true);
      onSubmit(updatedDischarge as DischargeRecord);
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
    const updatedDischarge = {
      ...discharge,
      signatures: [
        ...(discharge.signatures || []),
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
    };
    setDischarge(updatedDischarge);
    setShowSignDialog(false);
    onSubmit(updatedDischarge as DischargeRecord);
  };

  const allowedRoles: SignatureRole[] = ['client', 'clinician', 'supervisor'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {isInitialDischarge ? 'Initial Discharge Plan' : 'Final Discharge Summary'}
        </h2>
        <div className="flex items-center space-x-3">
          {!discharge.signatures?.length && (
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Plan
            </button>
          )}
          {isSaved && !discharge.signatures?.length && (
            <button
              type="button"
              onClick={() => setShowSignDialog(true)}
              className="btn btn-primary"
            >
              <PenTool className="h-4 w-4 mr-2" />
              Sign Plan
            </button>
          )}
          {discharge.signatures?.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Check className="h-4 w-4 mr-1" />
              Signed
            </span>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <BasicInfo
          date={discharge.date || ''}
          levelOfCare={discharge.levelOfCare || ''}
          onDateChange={date => !discharge.signatures?.length && setDischarge({ ...discharge, date })}
          onLevelChange={levelOfCare => !discharge.signatures?.length && setDischarge({ ...discharge, levelOfCare })}
        />

        <NeedsAssessment
          needs={discharge.needsAssessment!}
          onChange={needsAssessment => !discharge.signatures?.length && setDischarge({ ...discharge, needsAssessment })}
        />

        <SuicideRiskAssessment
          risk={discharge.suicideRisk!}
          onChange={suicideRisk => !discharge.signatures?.length && setDischarge({ ...discharge, suicideRisk })}
        />

        <PatientParticipation
          participation={discharge.patientParticipation!}
          onChange={patientParticipation => !discharge.signatures?.length && setDischarge({ ...discharge, patientParticipation })}
        />

        <DischargeInstructions
          instructions={discharge.instructions!}
          onChange={instructions => !discharge.signatures?.length && setDischarge({ ...discharge, instructions })}
        />

        {discharge.signatures?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-medium text-text mb-4">Signatures</h3>
            <div className="space-y-4">
              {discharge.signatures.map((signature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div>
                    <p className="text-sm font-medium text-text">{signature.name}</p>
                    <p className="text-sm text-text-secondary">{signature.role}</p>
                    {signature.relationship && (
                      <p className="text-sm text-text-secondary">
                        Relationship: {signature.relationship}
                      </p>
                    )}
                    <p className="text-sm text-text-secondary">
                      {format(new Date(signature.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {signature.signature && (
                    <div className="flex-shrink-0">
                      <img
                        src={signature.signature}
                        alt="Signature"
                        className="h-12"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSignDialog && (
        <SignatureComponent
          onSign={handleSign}
          onCancel={() => setShowSignDialog(false)}
          allowedRoles={allowedRoles}
          title="Sign Discharge Plan"
        />
      )}
    </div>
  );
};

export default DischargeForm;