import React, { useState } from 'react';
import { Search, MoreVertical, Shield, ShieldOff, UserPlus, X } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { User } from '../../types';
import { Role } from '../../types/auth';

interface UserManagementProps {
  users: User[];
  roles: Role[];
  onStatusChange: (userId: string, newStatus: 'active' | 'suspended') => void;
  onRoleChange: (userId: string, newRole: string) => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  roles,
  onStatusChange,
  onRoleChange,
  onAddUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'staff',
    domain: '',
    status: 'active' as const,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(newUser);
    setShowAddUser(false);
    setNewUser({
      name: '',
      email: '',
      role: 'staff',
      domain: '',
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full rounded-lg border-border bg-surface text-text"
          />
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="btn btn-primary"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-surface shadow-sm rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-background/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Domain
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-text">
                          {user.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => onRoleChange(user.id, e.target.value)}
                      className="text-sm rounded-md border-border bg-surface text-text"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={user.status === 'active'}
                      onCheckedChange={(checked) => 
                        onStatusChange(user.id, checked ? 'active' : 'suspended')
                      }
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {user.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      className="text-text-secondary hover:text-text"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {selectedUser === user.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface border border-border">
                        <div className="py-1">
                          <button
                            onClick={() => onStatusChange(
                              user.id,
                              user.status === 'active' ? 'suspended' : 'active'
                            )}
                            className="w-full text-left px-4 py-2 text-sm text-text hover:bg-background"
                          >
                            {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-text">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-text-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={newUser.domain}
                  onChange={e => setNewUser({ ...newUser, domain: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;