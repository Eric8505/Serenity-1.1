import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useGroupHomes } from '../hooks/useGroupHomes';
import GroupHomeList from '../components/groupHomes/GroupHomeList';
import AddGroupHomeForm from '../components/forms/AddGroupHomeForm';
import GroceryInventory from '../components/inventory/GroceryInventory';

const GroupHomes: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGroupHomeId, setSelectedGroupHomeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: groupHomes = [], isLoading, error } = useGroupHomes();

  const filteredGroupHomes = groupHomes?.filter(home =>
    home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    home.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewInventory = (groupHomeId: string) => {
    setSelectedGroupHomeId(groupHomeId);
  };

  if (selectedGroupHomeId) {
    const selectedHome = groupHomes?.find(home => home.id === selectedGroupHomeId);
    if (!selectedHome) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedGroupHomeId(null)}
            className="text-text-secondary hover:text-text"
          >
            ← Back to Group Homes
          </button>
        </div>

        <GroceryInventory
          groupHomeId={selectedGroupHomeId}
          onClose={() => setSelectedGroupHomeId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">Group Homes</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Group Home
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search group homes..."
            className="block w-full rounded-lg border-border bg-surface text-text pl-10 pr-3 py-2"
          />
        </div>
      </div>

      <GroupHomeList
        groupHomes={filteredGroupHomes}
        onViewInventory={handleViewInventory}
        isLoading={isLoading}
        error={error as Error}
      />

      {showAddForm && (
        <AddGroupHomeForm
          onSubmit={() => {
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default GroupHomes;