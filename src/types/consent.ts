export interface ConsentForm {
  id: string;
  clientId: string;
  intakeId?: string;
  type: 'treatment' | 'release_of_information' | 'hipaa' | 'financial' | 'medication' | 'emergency';
  title: string;
  content: string;
  signatures: {
    role: 'client' | 'guardian' | 'staff' | 'witness';
    name: string;
    signature: string;
    date: string;
    relationship?: string;
  }[];
  status: 'pending' | 'signed' | 'expired';
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export const REQUIRED_CONSENT_FORMS = [
  {
    type: 'treatment',
    title: 'Consent for Treatment',
    content: `I hereby consent to receive treatment services from [Organization Name]. I understand:
    - The benefits and potential risks of treatment
    - My right to refuse treatment
    - The limits of confidentiality
    - My financial obligations
    - The program rules and expectations`
  },
  {
    type: 'hipaa',
    title: 'HIPAA Privacy Notice & Consent',
    content: `I acknowledge receipt of the HIPAA Notice of Privacy Practices and consent to the use and disclosure of my protected health information for treatment, payment, and healthcare operations.`
  },
  {
    type: 'release_of_information',
    title: 'Release of Information Authorization',
    content: `I authorize [Organization Name] to release and/or obtain information about my treatment to/from specified individuals or organizations for the purpose of coordinating my care.`
  },
  {
    type: 'financial',
    title: 'Financial Agreement & Insurance Authorization',
    content: `I understand and agree to the financial policies, including:
    - Payment responsibilities
    - Insurance billing authorization
    - Cancellation policy
    - Payment methods and terms`
  },
  {
    type: 'emergency',
    title: 'Emergency Contact & Medical Authorization',
    content: `I authorize [Organization Name] to:
    - Contact my designated emergency contacts
    - Obtain emergency medical care if needed
    - Share necessary information with emergency responders`
  }
];