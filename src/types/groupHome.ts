export interface GroupHome {
  id: string;
  name: string;
  location: string;
  capacity: number;
  activeClients: string[];
  groceryInventoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupHomeFilters {
  search?: string;
  hasCapacity?: boolean;
  location?: string;
}

export interface GroupHomeAssignment {
  groupHomeId: string;
  clientId: string;
  assignedAt: string;
  assignedBy: string;
  reason?: string;
  status: 'active' | 'discharged';
}