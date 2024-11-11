import React from 'react';
import { PenTool, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Signature } from './types';
import SignatureComponent, { SignatureRole } from '../signature/SignatureComponent';

interface SignatureSectionProps {
  signatures?: Signature[];
  onSign: (signatureData: {
    name: string;
    role: SignatureRole;
    signature: string;
    date: string;
    credentials?: string;
  }) => void;
  status: 'draft' | 'signed';
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  signatures = [],
  onSign,
  status,
}) => {
  const [showSignDialog, setShowSignDialog] = React.useState(false);

  const handleSign = (signatureData: {
    name: string;
    role: SignatureRole;
    relationship?: string;
    signatureData: string;
    signatureType: 'draw' | 'type' | 'upload';
    date: string;
  }) => {
    onSign({
      name: signatureData.name,
      role: signatureData.role,
      signature: signatureData.signatureData,
      date: signatureData.date,
      credentials: signatureData.relationship,
    });
    setShowSignDialog(false);
  };

  const allowedRoles: SignatureRole[] = ['clinician', 'supervisor'];

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text">Signatures</h3>
        {status !== 'signed' && (
          <button
            type="button"
            onClick={() => setShowSignDialog(true)}
            className="btn btn-primary btn-sm"
          >
            <PenTool className="h-4 w-4 mr-2" />
            Sign Note
          </button>
        )}
      </div>

      {signatures.length > 0 ? (
        <div className="space-y-4">
          {signatures.map((signature, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-background rounded-lg border border-border"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text">
                    {signature.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    ({signature.role})
                  </span>
                  {signature.credentials && (
                    <span className="text-xs text-text-secondary">
                      - {signature.credentials}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {format(new Date(signature.date), 'MMM d, yyyy h:mm a')}
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
      ) : (
        <div className="text-center py-6 text-text-secondary">
          {status === 'signed' ? (
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Note has been signed</span>
            </div>
          ) : (
            'No signatures yet'
          )}
        </div>
      )}

      {showSignDialog && (
        <SignatureComponent
          onSign={handleSign}
          onCancel={() => setShowSignDialog(false)}
          allowedRoles={allowedRoles}
          title="Sign Progress Note"
          isNested={true}
        />
      )}
    </div>
  );
};

export default SignatureSection;