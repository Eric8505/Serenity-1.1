import React from 'react';
import { FileText, Download, PenTool, Calendar, Clock } from 'lucide-react';
import { Document } from '../../types';
import { format } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDownload: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onView,
  onEdit,
  onDownload,
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'treatment':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'discharge':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-surface rounded-lg border border-border hover:shadow-sm transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getDocumentIcon(document.type)}
                <div>
                  <h3 className="text-sm font-medium text-text">{document.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <p className="text-xs text-text-secondary">
                      Created: {format(new Date(document.createdAt), 'MMM d, yyyy')}
                    </p>
                    {document.signedAt && (
                      <>
                        <span className="text-xs text-text-secondary">•</span>
                        <p className="text-xs text-text-secondary">
                          Signed: {format(new Date(document.signedAt), 'MMM d, yyyy')}
                        </p>
                      </>
                    )}
                  </div>
                  {document.description && (
                    <p className="text-sm text-text-secondary mt-2">
                      {document.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <button
                  onClick={() => onView(document)}
                  className="btn btn-secondary btn-sm w-full sm:w-auto"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(document)}
                  className="btn btn-secondary btn-sm w-full sm:w-auto"
                >
                  <PenTool className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDownload(document)}
                  className="btn btn-secondary btn-sm w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-1">No documents found</h3>
          <p className="text-sm text-text-secondary">
            Click the "Add Document" button to create a new document
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;