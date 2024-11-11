import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { GroceryOrder, GroceryInventory } from '../../types/inventory';

interface GroceryOrderProps {
  order: GroceryOrder;
  inventory: GroceryInventory;
  onUpdateStatus: (orderId: string, status: GroceryOrder['status']) => void;
  onDelete: (orderId: string) => void;
}

const GroceryOrderComponent: React.FC<GroceryOrderProps> = ({
  order,
  inventory,
  onUpdateStatus,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getItemName = (itemId: string) => {
    return inventory.items.find(item => item.id === itemId)?.name || 'Unknown Item';
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="font-medium text-text">
            Order #{order.id.slice(-6)}
          </h3>
          <p className="text-sm text-text-secondary">
            {format(new Date(order.orderDate), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            order.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : order.status === 'ordered'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          {order.status === 'pending' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-text-secondary">
              <th className="text-left font-medium">Item</th>
              <th className="text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.items.map(item => (
              <tr key={item.itemId}>
                <td className="py-2 text-sm text-text">
                  {getItemName(item.itemId)}
                </td>
                <td className="py-2 text-sm text-text text-right">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {order.notes && (
          <div className="mt-4 text-sm text-text-secondary">
            <p className="font-medium">Notes:</p>
            <p>{order.notes}</p>
          </div>
        )}

        {order.status !== 'received' && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onUpdateStatus(
                order.id,
                order.status === 'pending' ? 'ordered' : 'received'
              )}
              className="btn btn-primary btn-sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as {order.status === 'pending' ? 'Ordered' : 'Received'}
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-text mb-4">
              Delete Order?
            </h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(order.id);
                  setShowConfirm(false);
                }}
                className="btn btn-danger"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryOrderComponent;