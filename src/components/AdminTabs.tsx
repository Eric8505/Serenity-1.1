import React from 'react';
import { Users, Globe } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'domains', label: 'Domain Control', icon: Globe },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon
                className={`-ml-0.5 mr-2 h-5 w-5 ${
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminTabs;