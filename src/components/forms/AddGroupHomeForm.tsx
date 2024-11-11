import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GroupHome } from '../../types/notes';

interface AddGroupHomeFormProps {
  onSubmit: (groupHome: Omit<GroupHome, 'id' | 'activeClients' | 'groceryInventory'>) => void;
  onCancel: () => void;
}

const AddGroupHomeForm: React.FC<AddGroupHomeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-text">Add New Group Home</h3>
          <button
            onClick={onCancel}
            className="text-text-secondary hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
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
              Add Group Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupHomeForm;