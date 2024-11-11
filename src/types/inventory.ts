export type GroceryCategory = 
  | 'dairy'
  | 'frozen_meals'
  | 'snacks'
  | 'supplies'
  | 'grains'
  | 'meats'
  | 'veggies'
  | 'fresh_fruit'
  | 'spices'
  | 'drinks'
  | 'cleaning'
  | 'condiments'
  | 'canned_goods';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  currentAmount: number;
  neededAmount: number;
  unit?: string;
  notes?: string;
  lastUpdated: string;
}

export interface GroceryInventory {
  id: string;
  groupHomeId: string;
  items: GroceryItem[];
  lastUpdated: string;
}

export interface GroceryOrder {
  id: string;
  groupHomeId: string;
  items: {
    itemId: string;
    amount: number;
  }[];
  status: 'pending' | 'ordered' | 'received';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}