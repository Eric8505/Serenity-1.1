import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import ComplianceDashboard from '../components/admin/ComplianceDashboard';
import SystemMonitor from '../components/admin/SystemMonitor';
import UserManagement from '../components/admin/UserManagement';
import RoleManagement from '../components/admin/RoleManagement';
import AuditLog from '../components/admin/AuditLog';
import AlertCenter from '../components/admin/AlertCenter';
import { Shield, Users, FileText, AlertTriangle, Activity, Settings } from 'lucide-react';
import { User } from '../types';
import { Role, Permission } from '../types/auth';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitor');
  
  // Initialize default permissions
  const [permissions] = useState<Permission[]>([
    {
      id: 'clients.view',
      name: 'View Clients',
      description: 'View client information',
      category: 'clients'
    },
    {
      id: 'clients.edit',
      name: 'Edit Clients',
      description: 'Create and modify client information',
      category: 'clients'
    },
    {
      id: 'documents.view',
      name: 'View Documents',
      description: 'View client documents',
      category: 'documents'
    },
    {
      id: 'documents.edit',
      name: 'Edit Documents',
      description: 'Create and modify documents',
      category: 'documents'
    },
    {
      id: 'admin.users',
      name: 'Manage Users',
      description: 'Create and manage user accounts',
      category: 'admin'
    },
    {
      id: 'admin.roles',
      name: 'Manage Roles',
      description: 'Create and manage roles',
      category: 'admin'
    },
    {
      id: 'settings.view',
      name: 'View Settings',
      description: 'View system settings',
      category: 'settings'
    },
    {
      id: 'settings.edit',
      name: 'Edit Settings',
      description: 'Modify system settings',
      category: 'settings'
    }
  ]);

  // Initialize default roles
  const [roles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and control',
      permissions: ['*'],
      isSystem: true
    },
    {
      id: 'staff',
      name: 'Staff Member',
      description: 'Regular staff access',
      permissions: ['clients.view', 'clients.edit', 'documents.view'],
      isSystem: true
    },
    {
      id: 'client',
      name: 'Client',
      description: 'Limited client access',
      permissions: ['documents.view'],
      isSystem: true
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      domain: 'example.com',
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...newUser, id: crypto.randomUUID() }]);
  };

  const handleCreateRole = (role: Omit<Role, 'id'>) => {
    // In a real app, this would make an API call
    console.log('Create role:', role);
  };

  const handleUpdateRole = (id: string, role: Partial<Role>) => {
    // In a real app, this would make an API call
    console.log('Update role:', id, role);
  };

  const handleDeleteRole = (id: string) => {
    // In a real app, this would make an API call
    console.log('Delete role:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Monitor system health, compliance, and security
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monitor">
            <Activity className="h-4 w-4 mr-2" />
            System Monitor
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Settings className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="audit">
            <FileText className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <SystemMonitor />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={users}
            roles={roles}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onAddUser={handleAddUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement
            roles={roles}
            permissions={permissions}
            onCreateRole={handleCreateRole}
            onUpdateRole={handleUpdateRole}
            onDeleteRole={handleDeleteRole}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;