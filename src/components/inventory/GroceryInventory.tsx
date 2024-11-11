import React, { useState } from 'react';
import { useGroceryInventory } from '../../hooks/useGroceryInventory';
import { Plus, X } from 'lucide-react';
import UpdateInventoryForm from './UpdateInventoryForm';
import { GroceryCategory } from '../../types/inventory';

interface GroceryInventoryProps {
  groupHomeId: string;
  onClose: () => void;
}

const GroceryInventory: React.FC<GroceryInventoryProps> = ({ groupHomeId, onClose }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { data: inventory, isLoading, error } = useGroceryInventory(groupHomeId);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-text-secondary">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading inventory: {error.message}
      </div>
    );
  }

  if (!inventory?.items) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No inventory found for this group home.
      </div>
    );
  }

  const groupedItems = groupByCategory(inventory.items);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">Grocery Inventory</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUpdateForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Update Inventory
          </button>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Display inventory items grouped by category */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div
            key={category}
            className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden"
          >
            <div className="px-4 py-3 bg-background border-b border-border">
              <h3 className="font-medium text-text capitalize">
                {category.replace('_', ' ')}
              </h3>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-text-secondary">
                    <th className="text-left font-medium">Item</th>
                    <th className="text-right font-medium">Current</th>
                    <th className="text-right font-medium">Needed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="py-2 text-sm text-text">
                        {item.name}
                      </td>
                      <td className="py-2">
                        <span className={`text-sm text-right block ${
                          item.currentAmount < item.neededAmount
                            ? 'text-red-500'
                            : 'text-text'
                        }`}>
                          {item.currentAmount}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="text-sm text-text-secondary text-right block">
                          {item.neededAmount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {showUpdateForm && (
        <UpdateInventoryForm
          inventory={inventory}
          onClose={() => setShowUpdateForm(false)}
        />
      )}
    </div>
  );
};

const groupByCategory = (items: any[] = []) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<GroceryCategory, any[]>);
};

export default GroceryInventory;