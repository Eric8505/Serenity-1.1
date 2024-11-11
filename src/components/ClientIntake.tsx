import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';
import { Client } from '../types';
import { GroupHome } from '../types/notes';
import { DischargeRecord } from '../types/intake';
import ConsentFormList from './ConsentFormList';
import MedicationInput from './MedicationInput';
import TreatmentSection from './intake/TreatmentSection';
import AssessmentSection from './intake/AssessmentSection';
import DischargeSection from './intake/DischargeSection';

interface ClientIntakeProps {
  onSubmit: (data: Partial<Client>) => void;
  initialData?: Partial<Client>;
  clientId?: string;
  groupHomes: GroupHome[];
  onFinalDischarge?: (discharge: DischargeRecord) => void;
}

const sections = [
  {
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: false },
      { id: 'phone', label: 'Phone', type: 'tel', required: false },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { id: 'address', label: 'Address', type: 'text', required: false },
    ],
  },
  {
    id: 'location',
    title: 'Group Home Assignment',
    fields: [
      { 
        id: 'groupHomeId', 
        label: 'Assigned Group Home', 
        type: 'select',
        required: true 
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance Information',
    fields: [
      { id: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: true },
      { id: 'insuranceNumber', label: 'Insurance/Client ID', type: 'text', required: true },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency Contact',
    fields: [
      { id: 'emergencyName', label: 'Contact Name', type: 'text', required: true },
      { id: 'emergencyPhone', label: 'Contact Phone', type: 'tel', required: true },
      {
        id: 'emergencyRelationship',
        label: 'Relationship',
        type: 'select',
        options: ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'],
        required: true,
      },
    ],
  },
  {
    id: 'medical',
    title: 'Medical History',
    fields: [
      {
        id: 'conditions',
        label: 'Current Medical Conditions',
        type: 'textarea',
      },
      {
        id: 'medications',
        label: 'Current Medications',
        type: 'medications',
      },
      { id: 'allergies', label: 'Allergies', type: 'textarea' },
      {
        id: 'previousTreatments',
        label: 'Previous Treatments',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'biography',
    title: 'Biography',
    fields: [
      {
        id: 'familyHistory',
        label: 'Family History',
        type: 'textarea',
      },
      {
        id: 'socialHistory',
        label: 'Social History',
        type: 'textarea',
      },
      {
        id: 'educationHistory',
        label: 'Education History',
        type: 'textarea',
      },
      {
        id: 'employmentHistory',
        label: 'Employment History',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Initial Assessment',
    component: AssessmentSection,
  },
  {
    id: 'treatment',
    title: 'Treatment Plan',
    component: TreatmentSection,
  },
  {
    id: 'discharge',
    title: 'Initial Discharge Planning',
    component: DischargeSection,
  },
  {
    id: 'consent',
    title: 'Required Consent Forms',
    component: ConsentFormList,
  },
];

const ClientIntake: React.FC<ClientIntakeProps> = ({
  onSubmit,
  initialData = {},
  clientId,
  groupHomes,
  onFinalDischarge,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal']);
  const [formData, setFormData] = useState<Partial<Client>>(initialData || {});
  const [showFinalDischarge, setShowFinalDischarge] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInitialDischargeComplete = () => {
    setShowFinalDischarge(true);
  };

  const handleFinalDischargeComplete = (discharge: DischargeRecord) => {
    if (onFinalDischarge) {
      onFinalDischarge(discharge);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900">
              {section.title}
            </h3>
            {expandedSections.includes(section.id) ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections.includes(section.id) && (
            <div className="px-6 py-4">
              {section.component ? (
                <section.component
                  clientId={clientId || crypto.randomUUID()}
                  onComplete={(data) => {
                    if (section.id === 'discharge' && showFinalDischarge) {
                      handleFinalDischargeComplete(data as DischargeRecord);
                    } else if (section.id === 'discharge') {
                      handleInitialDischargeComplete();
                    } else {
                      handleChange(section.id, data);
                    }
                  }}
                  isFinalDischarge={section.id === 'discharge' && showFinalDischarge}
                />
              ) : (
                <div className="space-y-6">
                  {section.fields?.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.type === 'medications' ? (
                        <MedicationInput
                          medications={formData.medications || []}
                          onChange={(medications) =>
                            handleChange('medications', medications)
                          }
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.id}
                          value={formData[field.id as keyof typeof formData] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          required={field.required}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">Select...</option>
                          {field.id === 'groupHomeId' ? (
                            groupHomes.map(home => (
                              <option key={home.id} value={home.id}>
                                {home.name} ({home.activeClients.length}/{home.capacity} clients)
                              </option>
                            ))
                          ) : (
                            field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))
                          )}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          value={formData[field.id as keyof typeof formData] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          required={field.required}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={field.id}
                          value={formData[field.id as keyof typeof formData] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          required={field.required}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Client Information
        </button>
      </div>
    </form>
  );
};

export default ClientIntake;