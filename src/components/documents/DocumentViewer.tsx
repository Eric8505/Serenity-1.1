import React from 'react';
import { X, Download } from 'lucide-react';
import { Document } from '../../types';
import { format } from 'date-fns';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-medium text-text">{document.title}</h2>
            <p className="text-sm text-text-secondary">
              Created: {format(new Date(document.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(document)}
              className="btn btn-secondary btn-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            {document.content}
          </div>
          
          {document.signatures?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-text mb-4">Signatures</h3>
              <div className="space-y-4">
                {document.signatures.map((signature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div>
                      <p className="text-sm font-medium text-text">{signature.name}</p>
                      <p className="text-sm text-text-secondary">{signature.role}</p>
                      <p className="text-sm text-text-secondary">
                        {format(new Date(signature.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {signature.signature && (
                      <div className="flex-shrink-0">
                        <img
                          src={signature.signature}
                          alt="Signature"
                          className="h-12"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;