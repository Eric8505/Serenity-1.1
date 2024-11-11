import React from 'react';
import { Users, Home, AlertTriangle } from 'lucide-react';
import { GroupHome } from '../../types/notes';

interface GroupHomeCapacityReportProps {
  groupHomes: GroupHome[];
}

const GroupHomeCapacityReport: React.FC<GroupHomeCapacityReportProps> = ({
  groupHomes
}) => {
  const totalCapacity = groupHomes.reduce((sum, home) => sum + home.capacity, 0);
  const totalOccupied = groupHomes.reduce((sum, home) => sum + home.activeClients.length, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const occupancyRate = (totalOccupied / totalCapacity) * 100;

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-500';
    if (rate >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Home className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Total Capacity</p>
              <p className="text-2xl font-semibold text-text">{totalCapacity}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Current Occupancy</p>
              <p className="text-2xl font-semibold text-text">{totalOccupied}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Home className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Available Beds</p>
              <p className="text-2xl font-semibold text-text">{totalAvailable}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <AlertTriangle className={`h-6 w-6 ${getOccupancyColor(occupancyRate)}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text-secondary">Occupancy Rate</p>
              <p className={`text-2xl font-semibold ${getOccupancyColor(occupancyRate)}`}>
                {occupancyRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-4 py-3 bg-background border-b border-border">
          <h3 className="font-medium text-text">Detailed Capacity Report</h3>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-text-secondary">
                <th className="text-left font-medium py-2">Group Home</th>
                <th className="text-center font-medium py-2">Capacity</th>
                <th className="text-center font-medium py-2">Occupied</th>
                <th className="text-center font-medium py-2">Available</th>
                <th className="text-right font-medium py-2">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groupHomes.map(home => {
                const occupied = home.activeClients.length;
                const available = home.capacity - occupied;
                const rate = (occupied / home.capacity) * 100;

                return (
                  <tr key={home.id}>
                    <td className="py-3 text-sm text-text">
                      <div>
                        <p className="font-medium">{home.name}</p>
                        <p className="text-text-secondary text-xs">{home.location}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-text text-center">
                      {home.capacity}
                    </td>
                    <td className="py-3 text-sm text-text text-center">
                      {occupied}
                    </td>
                    <td className="py-3 text-sm text-text text-center">
                      {available}
                    </td>
                    <td className="py-3 text-sm text-right">
                      <span className={`font-medium ${getOccupancyColor(rate)}`}>
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-border">
              <tr>
                <td className="py-3 text-sm font-medium text-text">Total</td>
                <td className="py-3 text-sm font-medium text-text text-center">
                  {totalCapacity}
                </td>
                <td className="py-3 text-sm font-medium text-text text-center">
                  {totalOccupied}
                </td>
                <td className="py-3 text-sm font-medium text-text text-center">
                  {totalAvailable}
                </td>
                <td className="py-3 text-sm font-medium text-right">
                  <span className={getOccupancyColor(occupancyRate)}>
                    {occupancyRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupHomeCapacityReport;