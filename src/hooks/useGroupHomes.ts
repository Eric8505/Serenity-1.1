import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupHome, GroupHomeFilters, GroupHomeAssignment } from '../types/groupHome';
import { useClients } from './useClients';

// Mock data for development
const MOCK_GROUP_HOMES: GroupHome[] = [
  {
    id: '1',
    name: 'Sunrise Haven',
    location: '123 Main St, Phoenix, AZ',
    capacity: 12,
    activeClients: ['1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Peaceful Pines',
    location: '456 Oak Ave, Phoenix, AZ',
    capacity: 8,
    activeClients: ['2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useGroupHomes = (filters: GroupHomeFilters = {}) => {
  const { clients } = useClients();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['groupHomes', filters],
    queryFn: async () => {
      // In development, return mock data with client information
      const homesWithClients = MOCK_GROUP_HOMES.map(home => ({
        ...home,
        activeClients: home.activeClients.filter(clientId => 
          clients.some(client => client.id === clientId && client.groupHomeId === home.id)
        ),
      }));
      return homesWithClients;
    },
  });
};

export const useGroupHome = (id: string) => {
  const { clients } = useClients();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['groupHome', id],
    queryFn: async () => {
      // Return mock data for development
      const home = MOCK_GROUP_HOMES.find(home => home.id === id);
      if (home) {
        return {
          ...home,
          activeClients: home.activeClients.filter(clientId => 
            clients.some(client => client.id === clientId && client.groupHomeId === home.id)
          ),
        };
      }
      return null;
    },
    enabled: !!id,
  });
};

export const useCreateGroupHome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newHome: Omit<GroupHome, 'id' | 'createdAt' | 'updatedAt'>) => {
      // In development, create a new mock home
      const home: GroupHome = {
        ...newHome,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activeClients: [],
      };
      MOCK_GROUP_HOMES.push(home);
      return home;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupHomes'] });
    },
  });
};

export const useUpdateGroupHome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GroupHome> & { id: string }) => {
      // Update mock data
      const index = MOCK_GROUP_HOMES.findIndex(home => home.id === id);
      if (index !== -1) {
        MOCK_GROUP_HOMES[index] = {
          ...MOCK_GROUP_HOMES[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return MOCK_GROUP_HOMES[index];
      }
      throw new Error('Group home not found');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groupHomes'] });
      queryClient.invalidateQueries({ queryKey: ['groupHome', data.id] });
    },
  });
};

export const useDeleteGroupHome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Remove from mock data
      const index = MOCK_GROUP_HOMES.findIndex(home => home.id === id);
      if (index !== -1) {
        MOCK_GROUP_HOMES.splice(index, 1);
        return id;
      }
      throw new Error('Group home not found');
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['groupHomes'] });
      queryClient.removeQueries({ queryKey: ['groupHome', id] });
    },
  });
};

export const useAssignClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: GroupHomeAssignment) => {
      // Update mock data
      const home = MOCK_GROUP_HOMES.find(h => h.id === assignment.groupHomeId);
      if (home) {
        // Remove client from previous group home
        MOCK_GROUP_HOMES.forEach(h => {
          h.activeClients = h.activeClients.filter(id => id !== assignment.clientId);
        });
        
        // Add client to new group home
        if (!home.activeClients.includes(assignment.clientId)) {
          home.activeClients.push(assignment.clientId);
        }
        
        return {
          ...assignment,
          assignedAt: new Date().toISOString(),
        };
      }
      throw new Error('Group home not found');
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['groupHomes'] });
      queryClient.invalidateQueries({ queryKey: ['groupHome', data.groupHomeId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      // If we know the previous group home ID, invalidate that as well
      if (data.fromGroupHomeId) {
        queryClient.invalidateQueries({ queryKey: ['groupHome', data.fromGroupHomeId] });
      }
    },
  });
};