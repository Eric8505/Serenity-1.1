import React, { useState } from 'react';
import { User } from '../types';
import { Search, MoreVertical, Shield, ShieldOff } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onStatusChange: (userId: string, newStatus: 'active' | 'suspended') => void;
  onRoleChange: (userId: string, newRole: 'admin' | 'user') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onStatusChange,
  onRoleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id} className="relative">
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {user.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <p>{user.email}</p>
                      <span className="mx-2">•</span>
                      <p>{user.domain}</p>
                      <span className="mx-2">•</span>
                      <p>{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {selectedUser === user.id && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() =>
                        onStatusChange(
                          user.id,
                          user.status === 'active' ? 'suspended' : 'active'
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                    </button>
                    <button
                      onClick={() =>
                        onRoleChange(
                          user.id,
                          user.role === 'admin' ? 'user' : 'admin'
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {user.role === 'admin' ? (
                        <span className="flex items-center">
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Remove Admin
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;