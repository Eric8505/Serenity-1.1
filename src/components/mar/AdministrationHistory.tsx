import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Edit } from 'lucide-react';
import { MedicationAdministration } from '../../types/mar';
import { Medication } from '../../types/medication';

interface AdministrationHistoryProps {
  administrations: MedicationAdministration[];
  medications: Medication[];
  onEdit: (administration: MedicationAdministration) => void;
  isAdmin: boolean;
}

const AdministrationHistory: React.FC<AdministrationHistoryProps> = ({
  administrations = [],
  medications,
  onEdit,
  isAdmin,
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid Date';
    } catch {
      return 'Invalid Date';
    }
  };

  const sortedAdministrations = [...administrations].sort((a, b) => {
    const dateA = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
    const dateB = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 bg-background border-b border-border">
        <h3 className="font-medium text-text">Administration History</h3>
      </div>
      <div className="overflow-x-auto">
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
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {sortedAdministrations.map((admin) => {
              if (!admin || !admin.medicationId) return null;
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
                      {formatDate(admin.scheduledTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.status === 'administered'
                        ? 'bg-green-100 text-green-800'
                        : admin.status === 'missed'
                        ? 'bg-red-100 text-red-800'
                        : admin.status === 'refused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {admin.administeredBy || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text">
                    {admin.notes || '-'}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      <button
                        onClick={() => onEdit(admin)}
                        className="text-accent hover:text-accent/80"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {!sortedAdministrations.length && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center text-text-secondary">
                  No administration records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministrationHistory;