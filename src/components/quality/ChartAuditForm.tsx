import React, { useState } from 'react';
import { ChartAudit } from '../../types/quality';
import { Plus, Trash2 } from 'lucide-react';

interface ChartAuditFormProps {
  clientId: string;
  auditorId: string;
  onSubmit: (audit: Omit<ChartAudit, 'id'>) => void;
}

const ChartAuditForm: React.FC<ChartAuditFormProps> = ({
  clientId,
  auditorId,
  onSubmit,
}) => {
  const [audit, setAudit] = useState<Omit<ChartAudit, 'id'>>({
    clientId,
    auditorId,
    date: new Date().toISOString().split('T')[0],
    items: [],
    totalScore: 0,
    recommendations: [],
    status: 'pending',
    reviewDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const addAuditItem = () => {
    setAudit(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          category: '',
          item: '',
          score: 0,
          comments: '',
        },
      ],
    }));
  };

  const removeAuditItem = (index: number) => {
    setAudit(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateAuditItem = (index: number, field: keyof ChartAudit['items'][0], value: string | number) => {
    setAudit(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addRecommendation = () => {
    setAudit(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, ''],
    }));
  };

  const removeRecommendation = (index: number) => {
    setAudit(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }));
  };

  const updateRecommendation = (index: number, value: string) => {
    setAudit(prev => ({
      ...prev,
      recommendations: prev.recommendations.map((rec, i) =>
        i === index ? value : rec
      ),
    }));
  };

  const calculateTotalScore = () => {
    const total = audit.items.reduce((sum, item) => sum + item.score, 0);
    setAudit(prev => ({
      ...prev,
      totalScore: total,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateTotalScore();
    onSubmit(audit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Audit Date</label>
            <input
              type="date"
              value={audit.date}
              onChange={e => setAudit({ ...audit, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Review Due Date</label>
            <input
              type="date"
              value={audit.reviewDueDate}
              onChange={e => setAudit({ ...audit, reviewDueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Audit Items</h3>
            <button
              type="button"
              onClick={addAuditItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {audit.items.map((item, index) => (
              <div key={index} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={e => updateAuditItem(index, 'category', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAuditItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Description</label>
                  <input
                    type="text"
                    value={item.item}
                    onChange={e => updateAuditItem(index, 'item', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Score (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={item.score}
                      onChange={e => updateAuditItem(index, 'score', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Comments</label>
                  <textarea
                    value={item.comments}
                    onChange={e => updateAuditItem(index, 'comments', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
            <button
              type="button"
              onClick={addRecommendation}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Recommendation
            </button>
          </div>

          <div className="space-y-4">
            {audit.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={recommendation}
                  onChange={e => updateRecommendation(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter recommendation"
                />
                <button
                  type="button"
                  onClick={() => removeRecommendation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit Audit
        </button>
      </div>
    </form>
  );
};

export default ChartAuditForm;