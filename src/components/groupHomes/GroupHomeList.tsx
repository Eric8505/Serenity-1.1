import React from 'react';
import { Home, Users, ShoppingCart } from 'lucide-react';
import { GroupHome } from '../../types/groupHome';

interface GroupHomeListProps {
  groupHomes: GroupHome[];
  onViewInventory: (groupHomeId: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const GroupHomeList: React.FC<GroupHomeListProps> = ({
  groupHomes,
  onViewInventory,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-text-secondary">
        Loading group homes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading group homes: {error.message}
      </div>
    );
  }

  if (!groupHomes?.length) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No group homes found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groupHomes.map((home) => (
        <div
          key={home.id}
          className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden"
        >
          <div className="px-4 py-3 bg-background border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-text">{home.name}</h3>
                <p className="text-sm text-text-secondary">{home.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  (home.activeClients.length / home.capacity) >= 0.9
                    ? 'text-red-500'
                    : (home.activeClients.length / home.capacity) >= 0.75
                    ? 'text-yellow-500'
                    : 'text-text-secondary'
                }`}>
                  {home.activeClients.length} / {home.capacity} clients
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-text-secondary">
                  <Home className="h-5 w-5 mr-1" />
                  <span>Capacity: {home.capacity}</span>
                </div>
                <div className="flex items-center text-text-secondary">
                  <Users className="h-5 w-5 mr-1" />
                  <span>Active: {home.activeClients.length}</span>
                </div>
              </div>
              <button
                onClick={() => onViewInventory(home.id)}
                className="btn btn-secondary btn-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Inventory
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupHomeList;