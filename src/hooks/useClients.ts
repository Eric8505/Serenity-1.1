import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client } from '../types';
import { GroupHomeAssignment } from '../types/groupHome';

// Mock API functions - replace with real API calls
const fetchClients = async (): Promise<Client[]> => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '1990-01-01',
      address: '123 Main St, Phoenix, AZ 85001',
      insuranceProvider: 'Blue Cross',
      insuranceNumber: 'BC123456789',
      groupHomeId: '1',
      transferHistory: [],
      documents: [],
      appointments: [],
      notes: [],
      medications: [],
      createdAt: new Date().toISOString(),
      status: {
        status: 'active',
        lastUpdated: new Date().toISOString(),
      },
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 987-6543',
      dateOfBirth: '1985-06-15',
      address: '456 Oak Ave, Phoenix, AZ 85002',
      insuranceProvider: 'Aetna',
      insuranceNumber: 'AE987654321',
      groupHomeId: '2',
      transferHistory: [],
      documents: [],
      appointments: [],
      notes: [],
      medications: [],
      createdAt: new Date().toISOString(),
      status: {
        status: 'active',
        lastUpdated: new Date().toISOString(),
      },
    },
  ];
};

const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...client,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    documents: [],
    appointments: [],
    notes: [],
    medications: [],
    transferHistory: [],
    status: {
      status: 'active',
      lastUpdated: new Date().toISOString(),
    },
  };
};

const updateClient = async (client: Client): Promise<Client> => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return client;
};

const assignToGroupHome = async (assignment: GroupHomeAssignment): Promise<Client> => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const client = await fetchClients().then(clients => 
    clients.find(c => c.id === assignment.clientId)
  );

  if (!client) {
    throw new Error('Client not found');
  }

  const updatedClient = {
    ...client,
    groupHomeId: assignment.groupHomeId,
    transferHistory: [
      ...(client.transferHistory || []),
      {
        fromGroupHomeId: client.groupHomeId,
        toGroupHomeId: assignment.groupHomeId,
        date: assignment.assignedAt,
        reason: assignment.reason || '',
      },
    ],
  };

  return updateClient(updatedClient);
};

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: (newClient) => {
      queryClient.setQueryData(['clients'], (old: Client[] = []) => [...old, newClient]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(['clients'], (old: Client[] = []) => 
        old.map(client => client.id === updatedClient.id ? updatedClient : client)
      );
    },
  });

  const assignToGroupHomeMutation = useMutation({
    mutationFn: assignToGroupHome,
    onSuccess: (updatedClient) => {
      // Update clients cache
      queryClient.setQueryData(['clients'], (old: Client[] = []) => 
        old.map(client => client.id === updatedClient.id ? updatedClient : client)
      );
      
      // Invalidate group homes query to update client lists
      queryClient.invalidateQueries({ queryKey: ['groupHomes'] });
      
      // Invalidate specific group home queries
      if (updatedClient.groupHomeId) {
        queryClient.invalidateQueries({ queryKey: ['groupHome', updatedClient.groupHomeId] });
      }
    },
  });

  return {
    clients,
    isLoading,
    error,
    addClient: addMutation.mutate,
    updateClient: updateMutation.mutate,
    assignToGroupHome: assignToGroupHomeMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isAssigning: assignToGroupHomeMutation.isPending,
  };
}

export function useClient(clientId: string) {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const client = clients.find(c => c.id === clientId);

  return {
    client,
    isLoading: !client,
  };
}