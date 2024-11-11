import React, { useState } from 'react';
import { format, addDays, subDays, isAfter, differenceInHours, isBefore, parseISO } from 'date-fns';
import { Check, X, AlertCircle, Clock, Plus, Pill, Download, Calendar, Edit } from 'lucide-react';
import { MedicationAdministration, MedicationSupply, MarSchedule } from '../types/mar';
import { Medication } from '../types';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

interface MARProps {
  medications?: Medication[];
  schedule?: MarSchedule;
  supply?: MedicationSupply;
  administrations?: MedicationAdministration[];
  onAdminister: (administration: Partial<MedicationAdministration>) => void;
  onUpdateSupply: (supply: MedicationSupply) => void;
  onUpdateHistory?: (administrationId: string, updates: Partial<MedicationAdministration>) => void;
}

const MAR: React.FC<MARProps> = ({
  medications = [],
  schedule,
  supply,
  administrations = [],
  onAdminister,
  onUpdateSupply,
  onUpdateHistory,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showRefillAlert, setShowRefillAlert] = useState(false);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBackdateModal, setShowBackdateModal] = useState(false);
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [selectedAdministration, setSelectedAdministration] = useState<MedicationAdministration | null>(null);
  const [refillAmount, setRefillAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [backdateDate, setBackdateDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [backdateTime, setBackdateTime] = useState('12:00');

  // ... (keep existing status and handler functions)

  const exportMAR = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add header
    doc.setFontSize(16);
    doc.text('Medication Administration Record', 20, yPos);
    yPos += 15;

    // Add medications table
    doc.setFontSize(12);
    doc.text('Prescribed Medications:', 20, yPos);
    yPos += 10;

    // Table headers
    const headers = ['Medication', 'Dosage', 'Frequency', 'Purpose', 'Start Date'];
    const colWidths = [50, 30, 35, 40, 25];
    let xPos = 20;

    headers.forEach((header, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    yPos += 7;

    // Table rows
    medications.forEach(med => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      xPos = 20;
      doc.setFont('helvetica', 'normal');
      doc.text(med.name, xPos, yPos);
      xPos += colWidths[0];
      doc.text(med.dosage, xPos, yPos);
      xPos += colWidths[1];
      doc.text(med.frequency, xPos, yPos);
      xPos += colWidths[2];
      doc.text(med.purpose || 'N/A', xPos, yPos);
      xPos += colWidths[3];
      doc.text(format(new Date(med.startDate), 'MM/dd/yyyy'), xPos, yPos);
      yPos += 7;
    });

    yPos += 10;

    // Add administration history
    doc.setFontSize(14);
    doc.text('Administration History:', 20, yPos);
    yPos += 10;

    // Sort administrations by date
    const sortedAdministrations = [...administrations].sort((a, b) => 
      new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    );

    sortedAdministrations.forEach(admin => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const med = medications.find(m => m.id === admin.medicationId);
      if (!med) return;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(med.name, 20, yPos);
      yPos += 7;

      doc.setFont('helvetica', 'normal');
      doc.text(`Scheduled: ${format(parseISO(admin.scheduledTime), 'MM/dd/yyyy hh:mm a')}`, 25, yPos);
      yPos += 7;
      doc.text(`Status: ${admin.status}`, 25, yPos);
      yPos += 7;
      doc.text(`Administrator: ${admin.administeredBy}`, 25, yPos);
      yPos += 7;
      if (admin.notes) {
        doc.text(`Notes: ${admin.notes}`, 25, yPos);
        yPos += 7;
      }
      yPos += 5;
    });

    doc.save(`MAR_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Medications List */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 bg-background border-b border-border">
          <h3 className="font-medium text-text">Prescribed Medications</h3>
        </div>
        <div className="divide-y divide-border">
          {medications.map((med) => (
            <div 
              key={med.id} 
              className={`p-4 cursor-pointer hover:bg-background/50 ${
                selectedMedication?.id === med.id ? 'bg-background/50' : ''
              }`}
              onClick={() => setSelectedMedication(med)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-text">{med.name}</h4>
                  <p className="text-sm text-text-secondary">{med.dosage} - {med.frequency}</p>
                  {med.purpose && (
                    <p className="text-sm text-text-secondary mt-1">Purpose: {med.purpose}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMedication(med);
                    setShowAdminModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Administer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Administration Schedule */}
      {selectedMedication && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                className="rounded-lg border-border bg-surface text-text"
              />
              {isAdmin && (
                <button
                  onClick={() => setShowBackdateModal(true)}
                  className="btn btn-secondary"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Backdate Entry
                </button>
              )}
            </div>
            <button
              onClick={exportMAR}
              className="btn btn-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export MAR
            </button>
          </div>

          {/* Keep existing schedule display code */}
        </div>
      )}

      {/* Administration History */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-text">Administration History</h3>
          {isAdmin && (
            <button
              onClick={() => setShowEditHistoryModal(true)}
              className="btn btn-secondary btn-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit History
            </button>
          )}
        </div>
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {administrations
                .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime())
                .map((admin) => {
                  const med = medications.find(m => m.id === admin.medicationId);
                  if (!med) return null;

                  return (
                    <tr key={admin.id} className="hover:bg-background/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text">{med.name}</div>
                        <div className="text-sm text-text-secondary">{med.dosage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text">
                          {format(parseISO(admin.scheduledTime), 'MMM d, yyyy h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.status === 'administered'
                            ? 'bg-green-100 text-green-800'
                            : admin.status === 'missed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {admin.administeredBy}
                      </td>
                      <td className="px-6 py-4 text-sm text-text">
                        {admin.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keep existing modals (Admin Modal, Backdate Modal) */}

      {/* Edit History Modal */}
      {showEditHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-lg font-medium text-text">Edit Administration History</h3>
              <button
                onClick={() => setShowEditHistoryModal(false)}
                className="text-text-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                      Administrator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {administrations.map((admin) => {
                    const med = medications.find(m => m.id === admin.medicationId);
                    if (!med) return null;

                    return (
                      <tr key={admin.id}>
                        <td className="px-6 py-4">
                          {format(parseISO(admin.scheduledTime), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4">{med.name}</td>
                        <td className="px-6 py-4">
                          <select
                            value={admin.status}
                            onChange={(e) => onUpdateHistory?.(admin.id, {
                              status: e.target.value as MedicationAdministration['status']
                            })}
                            className="rounded-lg border-border bg-surface text-text"
                          >
                            <option value="administered">Administered</option>
                            <option value="missed">Missed</option>
                            <option value="refused">Refused</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={admin.administeredBy}
                            onChange={(e) => onUpdateHistory?.(admin.id, {
                              administeredBy: e.target.value
                            })}
                            className="rounded-lg border-border bg-surface text-text"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedAdministration(admin);
                              setShowAdminModal(true);
                            }}
                            className="text-accent hover:text-accent/80"
                          >
                            Edit Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MAR;