import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { ConsentForm } from '../types/consent';
import { format } from 'date-fns';
import SignatureComponent, { SignatureRole } from './signature/SignatureComponent';

interface ConsentFormViewerProps {
  form: ConsentForm;
  onClose: () => void;
  onDownload: (form: ConsentForm) => void;
  onSign: (signature: {
    name: string;
    role: SignatureRole;
    relationship?: string;
    signatureData: string;
    signatureType: 'draw' | 'type' | 'upload';
    date: string;
  }) => void;
}

const ConsentFormViewer: React.FC<ConsentFormViewerProps> = ({
  form,
  onClose,
  onDownload,
  onSign,
}) => {
  const [showSignDialog, setShowSignDialog] = useState(false);

  const allowedRoles: SignatureRole[] = ['client', 'guardian', 'staff', 'witness'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-medium text-text">{form.title}</h2>
            <p className="text-sm text-text-secondary">
              Created: {format(new Date(form.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {form.status === 'pending' && (
              <button
                onClick={() => setShowSignDialog(true)}
                className="btn btn-primary btn-sm"
              >
                Sign Form
              </button>
            )}
            <button
              onClick={() => onDownload(form)}
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
            {form.content}
          </div>
          
          {form.signatures?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-text mb-4">Signatures</h3>
              <div className="space-y-4">
                {form.signatures.map((signature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div>
                      <p className="text-sm font-medium text-text">{signature.name}</p>
                      <p className="text-sm text-text-secondary">{signature.role}</p>
                      {signature.relationship && (
                        <p className="text-sm text-text-secondary">
                          Relationship: {signature.relationship}
                        </p>
                      )}
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

      {showSignDialog && (
        <SignatureComponent
          onSign={onSign}
          onCancel={() => setShowSignDialog(false)}
          allowedRoles={allowedRoles}
          requireRelationship={true}
          title="Sign Consent Form"
        />
      )}
    </div>
  );
};

export default ConsentFormViewer;