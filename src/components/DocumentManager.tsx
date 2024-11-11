import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, PenTool, Check, X } from 'lucide-react';
import { Document } from '../types/intake';

interface DocumentManagerProps {
  clientId: string;
  intakeId?: string;
  documents: Document[];
  onUploadDocument: (file: File) => Promise<void>;
  onSignDocument: (documentId: string) => Promise<void>;
  onDownloadDocument: (documentId: string) => void;
  onExportAll: () => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onUploadDocument,
  onSignDocument,
  onDownloadDocument,
  onExportAll,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onUploadDocument(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onUploadDocument(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </button>
          <button
            onClick={onExportAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop files here, or click upload button above
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doc.status === 'signed' 
                        ? 'bg-green-100 text-green-800'
                        : doc.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <p>Added {new Date(doc.createdAt).toLocaleDateString()}</p>
                    <span className="mx-2">•</span>
                    <p>Type: {doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.requiresSignature && doc.status === 'pending' && (
                    <button
                      onClick={() => onSignDocument(doc.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <PenTool className="h-4 w-4 mr-1" />
                      Sign
                    </button>
                  )}
                  <button
                    onClick={() => onDownloadDocument(doc.id)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </li>
          ))}
          {documents.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No documents found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DocumentManager;