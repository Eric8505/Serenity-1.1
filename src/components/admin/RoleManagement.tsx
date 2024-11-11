import React, { useState } from 'react';
import { Plus, Trash2, X, Check, Shield } from 'lucide-react';
import { Role, Permission } from '../../types/auth';
import { Switch } from '../ui/Switch';

interface RoleManagementProps {
  roles: Role[];
  permissions: Permission[];
  onCreateRole: (role: Omit<Role, 'id'>) => void;
  onUpdateRole: (id: string, role: Partial<Role>) => void;
  onDeleteRole: (id: string) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  permissions,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({
    name: '',
    description: '',
    permissions: [],
  });

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRole(newRole);
    setShowCreateModal(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handleTogglePermission = (roleId: string, permissionId: string, currentPermissions: string[]) => {
    const updatedPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];
    
    onUpdateRole(roleId, { permissions: updatedPermissions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-text">Role Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
      </div>

      <div className="grid gap-6">
        {roles.map(role => (
          <div
            key={role.id}
            className="bg-surface rounded-lg border border-border p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-text flex items-center">
                  {role.isSystem && <Shield className="h-4 w-4 mr-2 text-accent" />}
                  {role.name}
                </h3>
                <p className="text-sm text-text-secondary mt-1">{role.description}</p>
              </div>
              {!role.isSystem && (
                <button
                  onClick={() => onDeleteRole(role.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-text mb-4">Permissions</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(
                  permissions.reduce((acc, permission) => {
                    if (!acc[permission.category]) {
                      acc[permission.category] = [];
                    }
                    acc[permission.category].push(permission);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-sm font-medium text-text-secondary capitalize">
                      {category}
                    </h5>
                    {categoryPermissions.map(permission => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="text-sm text-text">{permission.name}</p>
                          <p className="text-xs text-text-secondary">
                            {permission.description}
                          </p>
                        </div>
                        <Switch
                          checked={role.permissions.includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(
                            role.id,
                            permission.id,
                            role.permissions
                          )}
                          disabled={role.isSystem}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-text">Create New Role</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full rounded-lg border-border bg-surface text-text"
                  rows={3}
                  required
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-text mb-4">Permissions</h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  {Object.entries(
                    permissions.reduce((acc, permission) => {
                      if (!acc[permission.category]) {
                        acc[permission.category] = [];
                      }
                      acc[permission.category].push(permission);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                  ).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="text-sm font-medium text-text-secondary capitalize">
                        {category}
                      </h5>
                      {categoryPermissions.map(permission => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="text-sm text-text">{permission.name}</p>
                            <p className="text-xs text-text-secondary">
                              {permission.description}
                            </p>
                          </div>
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              setNewRole(prev => ({
                                ...prev,
                                permissions: checked
                                  ? [...prev.permissions, permission.id]
                                  : prev.permissions.filter(id => id !== permission.id)
                              }));
                            }}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;