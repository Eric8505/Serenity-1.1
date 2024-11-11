import React, { useState } from 'react';
import { FileText, Download, Plus, X as CloseIcon } from 'lucide-react';
import { Document } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import DocumentList from '../components/documents/DocumentList';
import DocumentViewer from '../components/documents/DocumentViewer';
import AssessmentSection from '../components/intake/AssessmentSection';
import TreatmentSection from '../components/intake/TreatmentSection';
import DischargeSection from '../components/intake/DischargeSection';

const Documents: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [showAddDocument, setShowAddDocument] = useState(false);

  const handleExportDocument = (document: Document) => {
    const pdf = generatePDF({ ...document });
    pdf.save(`${document.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewMode('view');
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewMode('edit');
  };

  const handleCloseDocument = () => {
    setSelectedDocument(null);
    setViewMode('view');
  };

  const filterDocuments = (type: string) => {
    // In a real app, this would filter documents from your state/backend
    return [];
  };

  const renderTabContent = (type: string) => (
    <DocumentList
      documents={filterDocuments(type)}
      onView={handleViewDocument}
      onEdit={handleEditDocument}
      onDownload={handleExportDocument}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Documents</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage client documents, assessments, and records
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddDocument(true)}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </button>
          <button
            onClick={() => selectedDocument && handleExportDocument(selectedDocument)}
            className="btn btn-secondary flex-1 sm:flex-none"
            disabled={!selectedDocument}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'all'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                All Documents
              </div>
            </button>
            {['assessments', 'treatment', 'discharge', 'consent', 'progress'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {renderTabContent(activeTab)}
        </div>
      </div>

      {selectedDocument && viewMode === 'view' && (
        <DocumentViewer
          document={selectedDocument}
          onClose={handleCloseDocument}
          onDownload={handleExportDocument}
        />
      )}

      {selectedDocument && viewMode === 'edit' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-medium text-text">Edit Document</h2>
              <button
                onClick={handleCloseDocument}
                className="text-text-secondary hover:text-text"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {selectedDocument.type === 'assessment' && (
                <AssessmentSection
                  clientId={selectedDocument.clientId}
                  intakeId={selectedDocument.intakeId!}
                  onComplete={() => handleCloseDocument()}
                />
              )}
              {selectedDocument.type === 'treatment' && (
                <TreatmentSection
                  clientId={selectedDocument.clientId}
                  onComplete={() => handleCloseDocument()}
                />
              )}
              {selectedDocument.type === 'discharge' && (
                <DischargeSection
                  clientId={selectedDocument.clientId}
                  intakeId={selectedDocument.intakeId!}
                  onComplete={() => handleCloseDocument()}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showAddDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-medium text-text">Add New Document</h2>
              <button
                onClick={() => setShowAddDocument(false)}
                className="text-text-secondary hover:text-text"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: 'assessments', title: 'Assessment', desc: 'Create a new client assessment' },
                  { type: 'treatment', title: 'Treatment Plan', desc: 'Create a new treatment plan' },
                  { type: 'discharge', title: 'Discharge Record', desc: 'Create a new discharge record' },
                  { type: 'progress', title: 'Progress Note', desc: 'Create a new progress note' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setShowAddDocument(false);
                      setActiveTab(item.type);
                    }}
                    className="p-4 border border-border rounded-lg hover:bg-background/50 transition-colors text-left"
                  >
                    <h3 className="font-medium text-text">{item.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;