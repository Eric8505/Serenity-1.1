import React, { useState } from 'react';
import { Plus, X, Clock, Trash2 } from 'lucide-react';
import { BaseMedication, ClientMedication } from '../types/medication';

interface MedicationFormProps {
  onSubmit: (data: {
    medication: Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>;
    clientSpecificData: Partial<ClientMedication>;
  }) => void;
  onCancel: () => void;
}

interface ScheduledTime {
  time: string;
  days?: string[];
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onSubmit, onCancel }) => {
  const [medication, setMedication] = useState<Omit<BaseMedication, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    dosage: '',
    frequency: '',
    route: 'oral',
    instructions: '',
    sideEffects: [],
    interactions: [],
    requiresAuthorization: false,
  });

  const [clientSpecificData, setClientSpecificData] = useState<Partial<ClientMedication>>({
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    supply: 30,
    refillsRemaining: 3,
    specialInstructions: '',
  });

  const [scheduledTimes, setScheduledTimes] = useState<ScheduledTime[]>([]);
  const [showScheduler, setShowScheduler] = useState(false);

  const commonMedications = [
    'Acetaminophen',
    'Amoxicillin',
    'Aspirin',
    'Atorvastatin',
    'Ibuprofen',
    'Lisinopril',
    'Metformin',
    'Omeprazole',
    'Sertraline',
    'Simvastatin',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format scheduled times into instructions if they exist
    let finalInstructions = medication.instructions;
    if (scheduledTimes.length > 0) {
      const timeInstructions = scheduledTimes.map(st => {
        if (st.days && st.days.length > 0) {
          return `Take at ${st.time} on ${st.days.join(', ')}`;
        }
        return `Take at ${st.time}`;
      }).join('; ');
      
      finalInstructions = finalInstructions 
        ? `${finalInstructions}. ${timeInstructions}`
        : timeInstructions;
    }

    onSubmit({
      medication: {
        ...medication,
        instructions: finalInstructions,
      },
      clientSpecificData,
    });
  };

  const addScheduledTime = () => {
    setScheduledTimes([...scheduledTimes, { time: '12:00' }]);
  };

  const removeScheduledTime = (index: number) => {
    setScheduledTimes(scheduledTimes.filter((_, i) => i !== index));
  };

  const updateScheduledTime = (index: number, time: string) => {
    const newTimes = [...scheduledTimes];
    newTimes[index] = { ...newTimes[index], time };
    setScheduledTimes(newTimes);
  };

  const toggleDay = (timeIndex: number, day: string) => {
    const newTimes = [...scheduledTimes];
    const currentTime = newTimes[timeIndex];
    const days = currentTime.days || [];
    
    if (days.includes(day)) {
      currentTime.days = days.filter(d => d !== day);
    } else {
      currentTime.days = [...days, day];
    }
    
    setScheduledTimes(newTimes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-text">Add Medication</h3>
          <button
            onClick={onCancel}
            className="text-text-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Medication Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={medication.name}
                    onChange={e => setMedication({ ...medication, name: e.target.value })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                    list="common-medications"
                    placeholder="Enter medication name or select from common medications"
                  />
                  <datalist id="common-medications">
                    {commonMedications.map(med => (
                      <option key={med} value={med} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={medication.dosage}
                  onChange={e => setMedication({ ...medication, dosage: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                  placeholder="e.g., 50mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Frequency
                </label>
                <select
                  value={medication.frequency}
                  onChange={e => {
                    setMedication({ ...medication, frequency: e.target.value });
                    setShowScheduler(e.target.value.includes('daily') || e.target.value === 'Weekly');
                  }}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every morning">Every morning</option>
                  <option value="Every evening">Every evening</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Route
                </label>
                <select
                  value={medication.route}
                  onChange={e => setMedication({ ...medication, route: e.target.value as BaseMedication['route'] })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                >
                  <option value="oral">Oral</option>
                  <option value="injection">Injection</option>
                  <option value="intravenous">Intravenous</option>
                  <option value="intramuscular">Intramuscular</option>
                  <option value="subcutaneous">Subcutaneous</option>
                  <option value="topical">Topical</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {showScheduler && (
              <div className="border rounded-lg p-4 bg-background/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-text">Schedule Times</h4>
                  <button
                    type="button"
                    onClick={addScheduledTime}
                    className="btn btn-secondary btn-sm"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Add Time
                  </button>
                </div>

                <div className="space-y-4">
                  {scheduledTimes.map((st, index) => (
                    <div key={index} className="flex flex-col space-y-2 p-4 border rounded-lg bg-surface">
                      <div className="flex items-center justify-between">
                        <input
                          type="time"
                          value={st.time}
                          onChange={(e) => updateScheduledTime(index, e.target.value)}
                          className="rounded-lg border-border bg-surface text-text"
                        />
                        <button
                          type="button"
                          onClick={() => removeScheduledTime(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {medication.frequency === 'Weekly' && (
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDay(index, day)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                st.days?.includes(day)
                                  ? 'bg-accent text-white'
                                  : 'bg-background text-text-secondary'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Instructions
              </label>
              <textarea
                value={medication.instructions}
                onChange={e => setMedication({ ...medication, instructions: e.target.value })}
                className="w-full rounded-lg border-border bg-surface text-text"
                rows={3}
                placeholder="Enter any specific instructions for administering this medication"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Supply (days)
                </label>
                <input
                  type="number"
                  value={clientSpecificData.supply}
                  onChange={e => setClientSpecificData({ ...clientSpecificData, supply: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Refills Remaining
                </label>
                <input
                  type="number"
                  value={clientSpecificData.refillsRemaining}
                  onChange={e => setClientSpecificData({ ...clientSpecificData, refillsRemaining: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={clientSpecificData.startDate}
                  onChange={e => setClientSpecificData({ ...clientSpecificData, startDate: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Authorization Required
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={medication.requiresAuthorization}
                      onChange={e => setMedication({ ...medication, requiresAuthorization: e.target.checked })}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="ml-2 text-sm text-text-secondary">
                      This medication requires prior authorization
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Special Instructions
              </label>
              <textarea
                value={clientSpecificData.specialInstructions}
                onChange={e => setClientSpecificData({ ...clientSpecificData, specialInstructions: e.target.value })}
                className="w-full rounded-lg border-border bg-surface text-text"
                rows={2}
                placeholder="Enter any client-specific instructions or notes"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;