import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import AssessmentSection from './AssessmentSection';
import TreatmentSection from './TreatmentSection';
import DischargeSection from './DischargeSection';
import { IntakeAssessment, DischargeRecord } from '../../types/intake';
import { TreatmentPlan } from '../../types/treatment';

interface DocumentsSectionProps {
  clientId: string;
  intakeId: string;
  onUpdateAssessment: (assessment: IntakeAssessment) => void;
  onUpdateTreatmentPlan: (plan: TreatmentPlan) => void;
  onUpdateDischarge: (discharge: DischargeRecord) => void;
  initialAssessment?: IntakeAssessment;
  initialTreatmentPlan?: TreatmentPlan;
  initialDischarge?: DischargeRecord;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  clientId,
  intakeId,
  onUpdateAssessment,
  onUpdateTreatmentPlan,
  onUpdateDischarge,
  initialAssessment,
  initialTreatmentPlan,
  initialDischarge,
}) => {
  const [activeTab, setActiveTab] = useState('assessment');
  const [isInitialDischarge, setIsInitialDischarge] = useState(true);
  const [completedSteps, setCompletedSteps] = useState({
    assessment: !!initialAssessment,
    treatment: !!initialTreatmentPlan,
    discharge: !!initialDischarge,
  });

  const handleAssessmentComplete = (assessment: IntakeAssessment) => {
    setCompletedSteps(prev => ({ ...prev, assessment: true }));
    onUpdateAssessment(assessment);
    setActiveTab('treatment');
  };

  const handleTreatmentComplete = (plan: TreatmentPlan) => {
    setCompletedSteps(prev => ({ ...prev, treatment: true }));
    onUpdateTreatmentPlan(plan);
    setActiveTab('discharge');
  };

  const handleDischargeComplete = (discharge: DischargeRecord) => {
    setCompletedSteps(prev => ({ ...prev, discharge: true }));
    onUpdateDischarge(discharge);
    if (isInitialDischarge) {
      setIsInitialDischarge(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assessment">
            Assessment {completedSteps.assessment && '✓'}
          </TabsTrigger>
          <TabsTrigger 
            value="treatment" 
            disabled={!completedSteps.assessment}
          >
            Treatment Plan {completedSteps.treatment && '✓'}
          </TabsTrigger>
          <TabsTrigger 
            value="discharge"
            disabled={!completedSteps.treatment}
          >
            {isInitialDischarge ? 'Initial Discharge Plan' : 'Final Discharge'}
            {completedSteps.discharge && '✓'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <AssessmentSection
            clientId={clientId}
            intakeId={intakeId}
            onComplete={handleAssessmentComplete}
          />
        </TabsContent>

        <TabsContent value="treatment">
          <TreatmentSection
            clientId={clientId}
            onComplete={handleTreatmentComplete}
          />
        </TabsContent>

        <TabsContent value="discharge">
          <DischargeSection
            clientId={clientId}
            intakeId={intakeId}
            treatmentPlan={initialTreatmentPlan}
            onComplete={handleDischargeComplete}
            isInitialIntake={isInitialDischarge}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          {completedSteps.assessment && completedSteps.treatment && completedSteps.discharge
            ? 'All steps completed'
            : 'Complete all steps to finish intake process'}
        </div>
        <div className="flex space-x-3">
          {activeTab !== 'assessment' && (
            <button
              type="button"
              onClick={() => {
                const prevTab = activeTab === 'discharge' ? 'treatment' : 'assessment';
                setActiveTab(prevTab);
              }}
              className="btn btn-secondary"
            >
              Previous
            </button>
          )}
          {activeTab !== 'discharge' && completedSteps[activeTab] && (
            <button
              type="button"
              onClick={() => {
                const nextTab = activeTab === 'assessment' ? 'treatment' : 'discharge';
                setActiveTab(nextTab);
              }}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;