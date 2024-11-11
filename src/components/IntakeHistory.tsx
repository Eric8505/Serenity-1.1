import React from 'react';
import { format } from 'date-fns';
import { FileText, Download, Plus, Calendar } from 'lucide-react';
import { IntakeStatus } from '../types/intake';

interface IntakeHistoryProps {
  clientId: string;
  intakes: IntakeStatus[];
  onNewIntake: () => void;
  onViewIntake: (intakeId: string) => void;
  onExportPdf: (intakeId: string) => void;
}

const IntakeHistory: React.FC<IntakeHistoryProps> = ({
  intakes,
  onNewIntake,
  onViewIntake,
  onExportPdf,
}) => {
  const canStartNewIntake = !intakes.some(intake => intake.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Intake History</h2>
        {canStartNewIntake && (
          <button
            onClick={onNewIntake}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Intake
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {intakes.map((intake) => (
            <li key={intake.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1"
                    onClick={() => onViewIntake(intake.id)}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-blue-600">
                        {format(new Date(intake.startDate), 'MMMM d, yyyy')}
                        {intake.endDate && ` - ${format(new Date(intake.endDate), 'MMMM d, yyyy')}`}
                      </p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        intake.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {intake.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1" />
                        <p>{intake.documents.length} documents</p>
                        {intake.assessment && (
                          <>
                            <span className="mx-2">•</span>
                            <p>Assessment completed</p>
                          </>
                        )}
                        {intake.treatmentPlan && (
                          <>
                            <span className="mx-2">•</span>
                            <p>Treatment plan active</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onExportPdf(intake.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {intakes.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No intake records found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IntakeHistory;