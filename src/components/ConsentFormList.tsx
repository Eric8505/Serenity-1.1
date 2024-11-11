import React from 'react';
import { ConsentForm, REQUIRED_CONSENT_FORMS } from '../types/consent';
import ConsentFormViewer from './ConsentFormViewer';

interface ConsentFormListProps {
  clientId: string;
  onSignForm: (formId: string, signature: { 
    name: string; 
    role: string; 
    relationship?: string;
    signatureData?: string;
    signatureType: 'draw' | 'type' | 'upload';
  }) => void;
}

const ConsentFormList: React.FC<ConsentFormListProps> = ({ clientId, onSignForm }) => {
  // Create initial consent forms from required templates
  const consentForms = REQUIRED_CONSENT_FORMS.map((template, index) => ({
    id: `${clientId}-${template.type}-${index}`,
    clientId,
    type: template.type,
    title: template.title,
    content: template.content,
    signatures: [],
    status: 'pending' as const,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Valid for 1 year
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  const handleSignForm = (formId: string, signature: { 
    name: string; 
    role: string; 
    relationship?: string;
    signatureData?: string;
    signatureType: 'draw' | 'type' | 'upload';
  }) => {
    // Add signature to form
    const signedForm = consentForms.find(form => form.id === formId);
    if (signedForm) {
      signedForm.signatures.push({
        role: signature.role as ConsentForm['signatures'][0]['role'],
        name: signature.name,
        signature: signature.signatureData || '',
        date: new Date().toISOString(),
        relationship: signature.relationship
      });
      signedForm.status = 'signed';
      signedForm.updatedAt = new Date().toISOString();
    }

    onSignForm(formId, signature);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-text">Required Consent Forms</h3>
      <div className="space-y-4">
        {consentForms.map((form) => (
          <ConsentFormViewer
            key={form.id}
            form={form}
            onSign={(signature) => handleSignForm(form.id, signature)}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsentFormList;