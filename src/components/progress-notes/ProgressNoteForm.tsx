import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { ProgressNoteFormProps, ProgressNoteData } from './types';
import ClientInfoSection from './ClientInfoSection';
import RiskAssessmentSection from './RiskAssessmentSection';
import InterventionsSection from './InterventionsSection';
import GoalsSection from './GoalsSection';
import NextSessionSection from './NextSessionSection';
import StaffNotesSection from './StaffNotesSection';
import SignatureSection from './SignatureSection';

const ProgressNoteForm: React.FC<ProgressNoteFormProps> = ({
  client,
  onSubmit,
  onSaveDraft,
  initialData,
  period: initialPeriod = 'day',
}) => {
  const [formData, setFormData] = useState<ProgressNoteData>({
    clientId: client.id,
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    period: initialPeriod,
    startTime: initialPeriod === 'day' ? '07:00' : '19:00',
    endTime: initialPeriod === 'day' ? '19:00' : '07:00',
    sessionType: 'individual',
    location: 'office',
    interventions: [{
      type: '',
      description: '',
      response: '',
      responseNotes: ''
    }],
    goals: [{
      description: '',
      rating: 3,
      notes: ''
    }],
    nextSessionPlans: ['Continue current interventions'],
    nextSessionNotes: '',
    staffNotes: '',
    riskAssessment: {
      suicidalIdeation: false,
      homicidalIdeation: false,
      substanceUse: false,
      notes: ''
    },
    signatures: [],
    status: 'draft',
    ...initialData
  });

  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (autosaveEnabled && hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        handleSaveDraft();
      }, 30000); // Autosave every 30 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [formData, autosaveEnabled, hasUnsavedChanges]);

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (updates: Partial<ProgressNoteData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSign = (signature: {
    name: string;
    role: string;
    signature: string;
    date: string;
    credentials?: string;
  }) => {
    const updatedSignatures = [...(formData.signatures || []), signature];
    updateFormData({
      signatures: updatedSignatures,
      status: updatedSignatures.length > 0 ? 'signed' : 'draft'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientInfoSection
        client={client}
        sessionDate={formData.sessionDate}
        period={formData.period}
        startTime={formData.startTime}
        endTime={formData.endTime}
        sessionType={formData.sessionType}
        onDateChange={(date) => updateFormData({ sessionDate: date })}
        onPeriodChange={(period) => updateFormData({ period })}
        onStartTimeChange={(time) => updateFormData({ startTime: time })}
        onEndTimeChange={(time) => updateFormData({ endTime: time })}
        onSessionTypeChange={(type) => updateFormData({ sessionType: type as any })}
        autosaveEnabled={autosaveEnabled}
        onAutosaveChange={setAutosaveEnabled}
        lastSaved={lastSaved}
      />

      <RiskAssessmentSection
        riskAssessment={formData.riskAssessment}
        onChange={(riskAssessment) => updateFormData({ riskAssessment })}
      />

      <InterventionsSection
        interventions={formData.interventions}
        onChange={(interventions) => updateFormData({ interventions })}
      />

      <GoalsSection
        goals={formData.goals}
        onChange={(goals) => updateFormData({ goals })}
      />

      <NextSessionSection
        plans={formData.nextSessionPlans}
        notes={formData.nextSessionNotes}
        onPlansChange={(plans) => updateFormData({ nextSessionPlans: plans })}
        onNotesChange={(notes) => updateFormData({ nextSessionNotes: notes })}
      />

      <StaffNotesSection
        notes={formData.staffNotes}
        onChange={(notes) => updateFormData({ staffNotes: notes })}
      />

      <SignatureSection
        signatures={formData.signatures}
        onSign={handleSign}
        status={formData.status}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="btn btn-secondary"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Submit Progress Note
        </button>
      </div>
    </form>
  );
};

export default ProgressNoteForm;