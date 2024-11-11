import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroceryInventory, GroceryItem, GroceryCategory } from '../types/inventory';

// Mock data for development
const MOCK_INVENTORY: Record<string, GroceryInventory> = {
  '1': {
    id: '1',
    groupHomeId: '1',
    items: [
      {
        id: '1',
        name: 'Milk',
        category: 'dairy',
        currentAmount: 2,
        neededAmount: 4,
        unit: 'gallons',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Bread',
        category: 'grains',
        currentAmount: 3,
        neededAmount: 5,
        unit: 'loaves',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Apples',
        category: 'fresh_fruit',
        currentAmount: 12,
        neededAmount: 20,
        unit: 'pieces',
        lastUpdated: new Date().toISOString(),
      }
    ],
    lastUpdated: new Date().toISOString(),
  },
  '2': {
    id: '2',
    groupHomeId: '2',
    items: [
      {
        id: '4',
        name: 'Chicken',
        category: 'meats',
        currentAmount: 5,
        neededAmount: 8,
        unit: 'lbs',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Rice',
        category: 'grains',
        currentAmount: 10,
        neededAmount: 15,
        unit: 'lbs',
        lastUpdated: new Date().toISOString(),
      }
    ],
    lastUpdated: new Date().toISOString(),
  }
};

export const useGroceryInventory = (groupHomeId: string) => {
  return useQuery({
    queryKey: ['inventory', groupHomeId],
    queryFn: async () => {
      // In development, return mock data
      return MOCK_INVENTORY[groupHomeId] || {
        id: groupHomeId,
        groupHomeId,
        items: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    enabled: !!groupHomeId,
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupHomeId, items }: { groupHomeId: string; items: GroceryItem[] }) => {
      // Update mock data
      const inventory = MOCK_INVENTORY[groupHomeId] || {
        id: groupHomeId,
        groupHomeId,
        items: [],
        lastUpdated: new Date().toISOString(),
      };

      inventory.items = items;
      inventory.lastUpdated = new Date().toISOString();
      MOCK_INVENTORY[groupHomeId] = inventory;

      return inventory;
    },
    onSuccess: (_, { groupHomeId }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', groupHomeId] });
    },
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupHomeId, item }: { groupHomeId: string; item: Omit<GroceryItem, 'id'> }) => {
      const inventory = MOCK_INVENTORY[groupHomeId];
      if (!inventory) {
        throw new Error('Inventory not found');
      }

      const newItem: GroceryItem = {
        ...item,
        id: crypto.randomUUID(),
        lastUpdated: new Date().toISOString(),
      };

      inventory.items.push(newItem);
      inventory.lastUpdated = new Date().toISOString();

      return newItem;
    },
    onSuccess: (_, { groupHomeId }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', groupHomeId] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupHomeId, itemId }: { groupHomeId: string; itemId: string }) => {
      const inventory = MOCK_INVENTORY[groupHomeId];
      if (!inventory) {
        throw new Error('Inventory not found');
      }

      inventory.items = inventory.items.filter(item => item.id !== itemId);
      inventory.lastUpdated = new Date().toISOString();

      return { groupHomeId, itemId };
    },
    onSuccess: ({ groupHomeId }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', groupHomeId] });
    },
  });
};