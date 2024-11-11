import React, { useState } from 'react';
import { MedicationSupply } from '../types/mar';
import { Medication } from '../types';

interface MedicationSupplyTrackerProps {
  medication: Medication;
  supply: MedicationSupply;
  onUpdateSupply: (supply: MedicationSupply) => void;
}

const MedicationSupplyTracker: React.FC<MedicationSupplyTrackerProps> = ({
  medication,
  supply,
  onUpdateSupply,
}) => {
  const [refillAmount, setRefillAmount] = useState<number>(0);

  const handleRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (refillAmount > 0) {
      const newSupply = {
        ...supply,
        currentQuantity: supply.currentQuantity + refillAmount,
        lastRefillDate: new Date().toISOString(),
        nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };
      onUpdateSupply(newSupply);
      setRefillAmount(0);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Supply Tracking - {medication.name}
        </h3>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Current Supply</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {supply.currentQuantity} {supply.unit}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Refill Threshold</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {supply.refillThreshold} {supply.unit}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleRefill} className="space-y-4">
            <div>
              <label htmlFor="refillAmount" className="block text-sm font-medium text-gray-700">
                Refill Amount
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="refillAmount"
                  min="1"
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(Number(e.target.value))}
                  className="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  {supply.unit}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={refillAmount <= 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
            >
              Record Refill
            </button>
          </form>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Refill Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supply.lastRefillDate
                  ? new Date(supply.lastRefillDate).toLocaleDateString()
                  : 'No refills recorded'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Next Refill Due</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supply.nextRefillDate
                  ? new Date(supply.nextRefillDate).toLocaleDateString()
                  : 'Not scheduled'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MedicationSupplyTracker;