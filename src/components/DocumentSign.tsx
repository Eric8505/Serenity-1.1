import React, { useState } from 'react';
import { FileText, Check, X } from 'lucide-react';
import { Document } from '../types';

interface DocumentSignProps {
  document: Document;
  onSign: (documentId: string) => void;
  onReject: (documentId: string) => void;
}

const DocumentSign: React.FC<DocumentSignProps> = ({
  document,
  onSign,
  onReject,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
            <p className="text-sm text-gray-500">
              Status: {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </p>
          </div>
        </div>
        
        {document.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Check className="h-4 w-4 mr-2" />
              Sign
            </button>
            <button
              onClick={() => onReject(document.id)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Signature</h3>
            <p className="text-gray-500 mb-6">
              By clicking confirm, you agree to electronically sign this document.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSign(document.id);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSign;