import React, { useState } from 'react';
import { FileText, Download, Calendar, ClipboardList, Activity, Video, Plus, ChevronDown, ChevronUp, Sun, Moon, Home, ArrowRight } from 'lucide-react';
import { Client } from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';
import DocumentManager from '../DocumentManager';
import MAR from '../mar/MAR';
import { ProgressNoteData } from '../progress-notes/types';
import ProgressNoteForm from '../progress-notes/ProgressNoteForm';
import AppointmentCalendar from '../AppointmentCalendar';
import { MedicationAdministration } from '../../types/mar';
import { BaseMedication, ClientMedication } from '../../types/medication';
import { useMedications } from '../../hooks/useMedications';
import MedicationList from '../MedicationList';
import { useGroupHomes } from '../../hooks/useGroupHomes';
import { useAuth } from '../../context/AuthContext';
import { useAssignClient } from '../../hooks/useGroupHomes';

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
  const assignToGroupHome = useAssignClient();
  const { user } = useAuth();

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

  const handleTransferGroupHome = async (newGroupHomeId: string) => {
    try {
      await assignToGroupHome.mutateAsync({
        groupHomeId: newGroupHomeId,
        clientId: client.id,
        assignedAt: new Date().toISOString(),
        assignedBy: user?.name || 'Unknown',
        status: 'active',
        reason: 'Client transfer request',
        fromGroupHomeId: client.groupHomeId,
      });

      const updatedClient = {
        ...client,
        groupHomeId: newGroupHomeId,
        transferHistory: [
          ...(client.transferHistory || []),
          {
            fromGroupHomeId: client.groupHomeId,
            toGroupHomeId: newGroupHomeId,
            date: new Date().toISOString(),
            reason: 'Client transfer request',
          },
        ],
      };
      onUpdate(updatedClient);
      setShowTransferModal(false);
    } catch (error) {
      console.error('Failed to transfer client:', error);
    }
  };

  const currentGroupHome = groupHomes.find(gh => gh.id === client.groupHomeId);
  const availableGroupHomes = groupHomes.filter(gh => {
    const currentOccupancy = gh.activeClients.length;
    return gh.id !== client.groupHomeId && currentOccupancy < gh.capacity;
  });

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
        {/* Overview Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'overview' ? null : 'overview')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-text-secondary" />
              <h3 className="text-lg font-medium text-text">Overview</h3>
            </div>
            {expandedSection === 'overview' ? (
              <ChevronUp className="h-5 w-5 text-text-secondary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-text-secondary" />
            )}
          </button>
          
          {expandedSection === 'overview' && (
            <div className="p-6 border-t border-border">
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

              <div className="mt-6">
                <h4 className="text-sm font-medium text-text-secondary mb-2">
                  Group Home Assignment
                </h4>
                <div className="bg-background rounded-lg border border-border p-4">
                  {currentGroupHome ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-text">{currentGroupHome.name}</p>
                        <p className="text-sm text-text-secondary">{currentGroupHome.location}</p>
                        <p className="text-sm text-text-secondary mt-1">
                          Occupancy: {currentGroupHome.activeClients.length} / {currentGroupHome.capacity}
                        </p>
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

              {/* Rest of the overview content */}
            </div>
          )}
        </div>

        {/* Other sections remain the same */}
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
                  <p className="text-sm text-text-secondary mt-1">
                    {currentGroupHome.location}
                  </p>
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
                  {availableGroupHomes.map(gh => (
                    <option key={gh.id} value={gh.id}>
                      {gh.name} ({gh.activeClients.length}/{gh.capacity} clients) - {gh.location}
                    </option>
                  ))}
                </select>
              </div>

              {availableGroupHomes.length === 0 && (
                <p className="text-sm text-red-500">
                  No available group homes found. All homes are either full or this client is already assigned to them.
                </p>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
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