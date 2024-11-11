import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="space-y-4">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps & { value?: string; onValueChange?: (value: string) => void }> = ({
  value,
  children,
  onValueChange,
}) => {
  const isSelected = value === onValueChange;
  
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={`
        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
        ${isSelected
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps & { value?: string }> = ({
  value: tabValue,
  value: currentValue,
  children,
}) => {
  if (tabValue !== currentValue) return null;
  return <div className="py-4">{children}</div>;
};