import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Loader } from 'lucide-react';

interface DocumentationHelperProps {
  content: string;
  onUpdate: (improvedContent: string) => void;
  type: 'progress-note' | 'treatment-plan' | 'assessment';
}

const DocumentationHelper: React.FC<DocumentationHelperProps> = ({
  content,
  onUpdate,
  type,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // In a real app, this would make API calls to your AI service
  const improveDocumentation = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Example improvements based on type
      if (type === 'progress-note') {
        setSuggestions([
          'Consider using more objective behavioral observations',
          'Add specific examples of interventions used',
          'Quantify progress towards treatment goals',
        ]);
      } else if (type === 'treatment-plan') {
        setSuggestions([
          'Make goals more specific and measurable',
          'Include timeframes for objectives',
          'Add evidence-based interventions',
        ]);
      }

      // Example clinical improvements
      const improvedContent = content
        .replace(/feels sad/g, 'presents with depressed mood')
        .replace(/angry/g, 'exhibits irritability')
        .replace(/worried/g, 'demonstrates anxiety')
        .replace(/thinks/g, 'reports')
        .replace(/says/g, 'states');

      onUpdate(improvedContent);
    } catch (error) {
      setErrors(['Failed to process documentation']);
    } finally {
      setIsLoading(false);
    }
  };

  const checkGrammar = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example grammar checks
      const errors = [];
      if (content.includes('their is')) errors.push('Use "there is" instead of "their is"');
      if (content.includes('patient say')) errors.push('Subject-verb agreement: use "patient says"');
      
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={improveDocumentation}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Improve Documentation
        </button>
        
        <button
          onClick={checkGrammar}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <Check className="h-4 w-4 mr-2" />
          Check Grammar
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Suggestions</h3>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Issues Found</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationHelper;