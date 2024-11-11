import React, { useState } from 'react';
import { FileText, Download, Calendar, ClipboardList, Activity, Video, Plus, ChevronDown, ChevronUp, Sun, Moon, Home, ArrowRight } from 'lucide-react';
import { Client } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import DocumentManager from './DocumentManager';
import MAR from './mar/MAR';
import { ProgressNoteData } from './progress-notes/types';
import ProgressNoteForm from './progress-notes/ProgressNoteForm';
import AppointmentCalendar from './AppointmentCalendar';
import { MedicationAdministration } from '../types/mar';
import { BaseMedication, ClientMedication } from '../types/medication';
import { useMedications } from '../hooks/useMedications';
import MedicationList from './MedicationList';
import { GroupHome } from '../types/notes';
import { useGroupHomes } from '../hooks/useGroupHomes';

interface ClientProfileProps {
  client: Client;
  onUpdate: (client: Client) => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ client, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProgressNote, setShowNewProgressNote] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'night'>('day');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const { medications, clientMedications, addMedication, recordAdministration } = useMedications();
  const { data: groupHomes = [] } = useGroupHomes();

  const handleExportDocuments = () => {
    const pdf = generatePDF(client);
    pdf.save(`${client.firstName}-${client.lastName}-documents.pdf`);
  };

  const handleAddMedication = (data: {
    medication: Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>;
    clientSpecificData: Partial<ClientMedication>;
  }) => {
    addMedication({
      ...data,
      clientId: client.id,
    });
  };

  const handleAdministerMedication = (administration: Partial<MedicationAdministration>) => {
    recordAdministration({
      ...administration,
      clientId: client.id,
      administeredTime: new Date().toISOString(),
    });
  };

  const handleAddProgressNote = (note: ProgressNoteData) => {
    const updatedClient = {
      ...client,
      notes: [...client.notes, note],
    };
    onUpdate(updatedClient);
    setShowNewProgressNote(false);
  };

  const handleTransferGroupHome = (newGroupHomeId: string) => {
    const updatedClient = {
      ...client,
      groupHomeId: newGroupHomeId,
      transferHistory: [
        ...(client.transferHistory || []),
        {
          fromGroupHomeId: client.groupHomeId,
          toGroupHomeId: newGroupHomeId,
          date: new Date().toISOString(),
          reason: '',
        },
      ],
    };
    onUpdate(updatedClient);
    setShowTransferModal(false);
  };

  const currentGroupHome = groupHomes.find(gh => gh.id === client.groupHomeId);

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Personal Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Date of Birth:</span>{' '}
                  {client.dateOfBirth}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Address:</span>{' '}
                  {client.address}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{' '}
                  {client.phone}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  {client.email}
                </p>
              </div>
            </div>

            {client.emergencyContact && (
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">
                  Emergency Contact
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{' '}
                    {client.emergencyContact.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{' '}
                    {client.emergencyContact.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Relationship:</span>{' '}
                    {client.emergencyContact.relationship}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">
              Group Home Assignment
            </h4>
            <div className="bg-background rounded-lg border border-border p-4">
              {currentGroupHome ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-text">{currentGroupHome.name}</p>
                    <p className="text-sm text-text-secondary">{currentGroupHome.location}</p>
                  </div>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Transfer
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Home className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary">No group home assigned</p>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    Assign Group Home
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">
              Biography
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-text">Medical History</h5>
                <ul className="mt-1 list-disc list-inside text-sm text-text-secondary">
                  {client.medicalHistory?.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-text">Allergies</h5>
                <ul className="mt-1 list-disc list-inside text-sm text-text-secondary">
                  {client.medicalHistory?.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-text">Previous Treatments</h5>
                <ul className="mt-1 list-disc list-inside text-sm text-text-secondary">
                  {client.medicalHistory?.previousTreatments.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-text">Family History</h5>
                <ul className="mt-1 list-disc list-inside text-sm text-text-secondary">
                  {client.medicalHistory?.familyHistory.map((history, index) => (
                    <li key={index}>{history}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <MedicationList
            medications={medications}
            clientMedications={clientMedications}
            clientId={client.id}
            onAddMedication={handleAddMedication}
          />
        </div>
      ),
    },
    {
      id: 'mar',
      title: 'Medication Administration',
      icon: Activity,
      content: (
        <MAR
          medications={medications}
          clientMedications={clientMedications.filter(cm => cm.clientId === client.id)}
          clientId={client.id}
          onAdminister={handleAdministerMedication}
        />
      ),
    },
    {
      id: 'progress-notes',
      title: 'Progress Notes',
      icon: ClipboardList,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPeriod('day')}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    selectedPeriod === 'day'
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'border-border text-text-secondary hover:bg-background'
                  }`}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Day
                </button>
                <button
                  onClick={() => setSelectedPeriod('night')}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    selectedPeriod === 'night'
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'border-border text-text-secondary hover:bg-background'
                  }`}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Night
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowNewProgressNote(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Progress Note
            </button>
          </div>

          {showNewProgressNote && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <ProgressNoteForm
                client={client}
                onSubmit={handleAddProgressNote}
                period={selectedPeriod}
              />
            </div>
          )}

          <div className="space-y-4">
            {client.notes
              .filter(note => note.period === selectedPeriod)
              .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
              .map((note, index) => (
                <div
                  key={index}
                  className="bg-surface rounded-lg border border-border p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-text">
                        {note.sessionDate} - {note.sessionType}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">
                        {note.startTime} - {note.endTime}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        note.status === 'signed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {note.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ),
    },
    {
      id: 'appointments',
      title: 'Appointments',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-text">Appointments</h3>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </button>
          </div>

          <AppointmentCalendar
            appointments={client.appointments}
            onAddAppointment={(appointment) => {
              onUpdate({
                ...client,
                appointments: [...client.appointments, appointment],
              });
              setShowNewAppointment(false);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-text-secondary mt-1">
              ID: {client.id}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportDocuments}
              className="btn btn-secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {sections.map(section => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-text-secondary" />
                  <h3 className="text-lg font-medium text-text">{section.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-text-secondary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-text-secondary" />
                )}
              </button>
              
              {isExpanded && (
                <div className="p-6 border-t border-border">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Group Home Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-text mb-4">
              {currentGroupHome ? 'Transfer Client' : 'Assign Group Home'}
            </h3>
            
            <div className="space-y-4">
              {currentGroupHome && (
                <div>
                  <p className="text-sm text-text-secondary">Current Group Home:</p>
                  <p className="font-medium text-text">{currentGroupHome.name}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Select Group Home
                </label>
                <select
                  onChange={(e) => handleTransferGroupHome(e.target.value)}
                  className="w-full rounded-lg border-border bg-surface text-text"
                >
                  <option value="">Select a group home...</option>
                  {groupHomes
                    .filter(gh => gh.id !== client.groupHomeId)
                    .map(gh => (
                      <option key={gh.id} value={gh.id}>
                        {gh.name} ({gh.activeClients.length}/{gh.capacity} clients)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTransferGroupHome(client.groupHomeId)}
                  className="btn btn-primary"
                >
                  {currentGroupHome ? 'Transfer Client' : 'Assign Group Home'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;