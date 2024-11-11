import React, { useState } from 'react';
import { Plus, Search, FileText, Calendar, ClipboardList, X } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import ClientIntake from '../components/ClientIntake';
import ClientProfile from '../components/ClientProfile';
import { Client } from '../types';
import { UserRole } from '../types/auth';

interface ClientsProps {
  userRole: UserRole;
}

const Clients: React.FC<ClientsProps> = ({ userRole }) => {
  const { clients, isLoading, addClient, updateClient } = useClients();
  const [showIntake, setShowIntake] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Check if user can add clients based on role
  const canAddClients = ['admin', 'staff'].includes(userRole);

  const handleAddClient = (data: Partial<Client>) => {
    if (!data.insuranceNumber) {
      alert('Insurance/Client ID is required');
      return;
    }

    if (clients.some(client => client.id === data.insuranceNumber)) {
      alert('A client with this Insurance/Client ID already exists');
      return;
    }

    addClient(data as Omit<Client, 'id'>, {
      onSuccess: () => {
        setShowIntake(false);
      },
    });
  };

  const handleUpdateClient = (updatedClient: Client) => {
    updateClient(updatedClient, {
      onSuccess: () => {
        setSelectedClient(updatedClient);
      },
    });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading clients...</div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedClient(null)}
            className="text-text-secondary hover:text-text flex items-center"
          >
            <X className="h-5 w-5 mr-2" />
            Back to Clients
          </button>
        </div>

        <ClientProfile
          client={selectedClient}
          onUpdate={handleUpdateClient}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">Client Records</h2>
        {canAddClients && (
          <button
            onClick={() => setShowIntake(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </button>
        )}
      </div>

      {!showIntake ? (
        <>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-secondary" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or insurance ID..."
                className="block w-full rounded-lg border-border bg-surface text-text pl-10 pr-3 py-2"
              />
            </div>
          </div>

          <div className="bg-surface shadow-sm rounded-lg border border-border overflow-hidden">
            <ul className="divide-y divide-border">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="hover:bg-background/50 cursor-pointer transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-accent truncate">
                          {client.firstName} {client.lastName}
                        </p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center">
                          <div className="flex items-center text-sm text-text-secondary">
                            <p>ID: {client.id}</p>
                            <span className="mx-2">•</span>
                            <p>{client.email}</p>
                            <span className="mx-2">•</span>
                            <p>{client.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex items-center text-sm text-text-secondary">
                          <FileText className="h-5 w-5 mr-1" />
                          <span>{client.documents.length}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-secondary">
                          <Calendar className="h-5 w-5 mr-1" />
                          <span>{client.appointments.length}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-secondary">
                          <ClipboardList className="h-5 w-5 mr-1" />
                          <span>{client.notes.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {filteredClients.length === 0 && (
                <li className="px-4 py-6 text-center text-text-secondary">
                  No clients found
                </li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className="bg-surface rounded-lg shadow-sm border border-border">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-text">
                New Client Intake
              </h3>
              <button
                onClick={() => setShowIntake(false)}
                className="text-text-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ClientIntake onSubmit={handleAddClient} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;