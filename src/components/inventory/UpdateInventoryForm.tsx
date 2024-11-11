import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { GroceryInventory, GroceryItem, GroceryCategory } from '../../types/inventory';
import { useUpdateInventory } from '../../hooks/useGroceryInventory';

interface UpdateInventoryFormProps {
  inventory: GroceryInventory;
  onClose: () => void;
}

const CATEGORIES: Record<GroceryCategory, string> = {
  dairy: 'Dairy',
  frozen_meals: 'Frozen Meals',
  snacks: 'Snacks',
  supplies: 'Supplies',
  grains: 'Grains',
  meats: 'Meats',
  veggies: 'Veggies',
  fresh_fruit: 'Fresh Fruit',
  spices: 'Spices',
  drinks: 'Drinks',
  cleaning: 'Cleaning',
  condiments: 'Condiments',
  canned_goods: 'Canned Goods',
};

const UpdateInventoryForm: React.FC<UpdateInventoryFormProps> = ({
  inventory,
  onClose,
}) => {
  const [items, setItems] = useState<GroceryItem[]>(inventory.items);
  const updateMutation = useUpdateInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        groupHomeId: inventory.groupHomeId,
        items,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const addItem = () => {
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name: '',
      category: 'dairy',
      currentAmount: 0,
      neededAmount: 0,
      lastUpdated: new Date().toISOString(),
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<GroceryItem>) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-text">Update Inventory</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 bg-background rounded-lg border border-border"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value as GroceryCategory })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                  >
                    {Object.entries(CATEGORIES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.currentAmount}
                    onChange={(e) => updateItem(item.id, { currentAmount: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-border bg-surface text-text"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Needed Amount
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={item.neededAmount}
                      onChange={(e) => updateItem(item.id, { neededAmount: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border-border bg-surface text-text"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-border rounded-lg text-text-secondary hover:text-text hover:border-accent transition-colors"
            >
              <Plus className="h-5 w-5 mx-auto" />
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventoryForm;