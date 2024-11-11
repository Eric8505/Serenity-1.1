import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import ClientIntake from './ClientIntake';
import AssessmentForm from './AssessmentForm';
import TreatmentPlanForm from './treatment/TreatmentPlanForm';
import DischargeForm from './DischargeForm';
import { IntakeStatus, IntakeAssessment, DischargeRecord } from '../types/intake';
import { TreatmentPlan } from '../types/treatment';
import { Client } from '../types';

interface IntakeProcessProps {
  client: Client;
  currentIntake?: IntakeStatus;
  onComplete: (intake: IntakeStatus) => void;
}

const IntakeProcess: React.FC<IntakeProcessProps> = ({
  client,
  currentIntake,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState('intake');
  const [intakeData, setIntakeData] = useState<Partial<IntakeStatus>>({
    id: crypto.randomUUID(),
    clientId: client.id,
    startDate: new Date().toISOString(),
    status: 'active',
    documents: [],
    ...currentIntake,
  });

  const handleAssessmentComplete = (assessment: IntakeAssessment) => {
    setIntakeData(prev => ({
      ...prev,
      assessment,
    }));
    setActiveTab('treatment');
  };

  const handleTreatmentPlanComplete = (plan: TreatmentPlan) => {
    setIntakeData(prev => ({
      ...prev,
      treatmentPlan: plan,
    }));
    onComplete(intakeData as IntakeStatus);
  };

  const handleDischarge = (discharge: DischargeRecord) => {
    const completedIntake: IntakeStatus = {
      ...intakeData,
      status: 'discharged',
      endDate: discharge.date,
      discharge,
    } as IntakeStatus;
    
    onComplete(completedIntake);
  };

  const canAccessTab = (tab: string): boolean => {
    switch (tab) {
      case 'intake':
        return true;
      case 'assessment':
        return !!intakeData.id;
      case 'treatment':
        return !!intakeData.assessment;
      case 'discharge':
        return !!intakeData.treatmentPlan;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="intake" disabled={!canAccessTab('intake')}>
            Intake
          </TabsTrigger>
          <TabsTrigger value="assessment" disabled={!canAccessTab('assessment')}>
            Assessment
          </TabsTrigger>
          <TabsTrigger value="treatment" disabled={!canAccessTab('treatment')}>
            Treatment Plan
          </TabsTrigger>
          {intakeData.status === 'active' && (
            <TabsTrigger value="discharge" disabled={!canAccessTab('discharge')}>
              Discharge
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="intake">
          <ClientIntake
            clientId={client.id}
            initialData={client}
            onSubmit={(data) => {
              setIntakeData(prev => ({
                ...prev,
                startDate: new Date().toISOString(),
              }));
              setActiveTab('assessment');
            }}
          />
        </TabsContent>

        <TabsContent value="assessment">
          <AssessmentForm
            clientId={client.id}
            intakeId={intakeData.id!}
            initialData={intakeData.assessment}
            onSubmit={handleAssessmentComplete}
          />
        </TabsContent>

        <TabsContent value="treatment">
          <TreatmentPlanForm
            clientId={client.id}
            initialData={intakeData.treatmentPlan}
            onSubmit={handleTreatmentPlanComplete}
          />
        </TabsContent>

        <TabsContent value="discharge">
          <DischargeForm
            clientId={client.id}
            intakeId={intakeData.id!}
            treatmentPlan={intakeData.treatmentPlan!}
            onSubmit={handleDischarge}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntakeProcess;