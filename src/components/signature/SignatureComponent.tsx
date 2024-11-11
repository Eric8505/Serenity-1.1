import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import SignaturePad from 'react-signature-canvas';

export type SignatureRole = 'client' | 'guardian' | 'staff' | 'clinician' | 'supervisor' | 'witness';

interface SignatureComponentProps {
  onSign: (data: {
    name: string;
    role: SignatureRole;
    relationship?: string;
    signatureData: string;
    signatureType: 'draw' | 'type' | 'upload';
    date: string;
  }) => void;
  onCancel: () => void;
  allowedRoles: SignatureRole[];
  requireRelationship?: boolean;
  title?: string;
  isNested?: boolean;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({
  onSign,
  onCancel,
  allowedRoles,
  requireRelationship = false,
  title = 'Sign Document',
  isNested = false,
}) => {
  const [signatureData, setSignatureData] = useState({
    name: '',
    role: allowedRoles[0],
    relationship: '',
    signatureType: 'draw' as const,
    signatureContent: '',
  });
  const [typedSignature, setTypedSignature] = useState('');
  const signaturePadRef = useRef<SignaturePad>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    let finalSignatureData = '';
    switch (signatureData.signatureType) {
      case 'draw':
        finalSignatureData = signaturePadRef.current?.toDataURL() || '';
        break;
      case 'type':
        finalSignatureData = typedSignature;
        break;
      case 'upload':
        finalSignatureData = signatureData.signatureContent;
        break;
    }

    if (finalSignatureData && signatureData.name && signatureData.role) {
      onSign({
        name: signatureData.name,
        role: signatureData.role,
        relationship: signatureData.relationship,
        signatureData: finalSignatureData,
        signatureType: signatureData.signatureType,
        date: new Date().toISOString(),
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignatureData(prev => ({
          ...prev,
          signatureType: 'upload',
          signatureContent: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    if (signatureData.signatureType === 'draw') {
      signaturePadRef.current?.clear();
    } else if (signatureData.signatureType === 'type') {
      setTypedSignature('');
    } else {
      setSignatureData(prev => ({ ...prev, signatureContent: '' }));
    }
  };

  const content = (
    <>
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium text-text">{title}</h3>
        <button
          onClick={onCancel}
          className="text-text-secondary hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={signatureData.name}
            onChange={(e) => setSignatureData({ ...signatureData, name: e.target.value })}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Role
          </label>
          <select
            value={signatureData.role}
            onChange={(e) => setSignatureData({ ...signatureData, role: e.target.value as SignatureRole })}
            className="w-full rounded-lg border-border bg-surface text-text"
            required
          >
            {allowedRoles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {(requireRelationship || signatureData.role === 'guardian') && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Relationship to Client
            </label>
            <input
              type="text"
              value={signatureData.relationship}
              onChange={(e) => setSignatureData({ ...signatureData, relationship: e.target.value })}
              className="w-full rounded-lg border-border bg-surface text-text"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Signature Method
          </label>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setSignatureData({ ...signatureData, signatureType: 'draw' })}
              className={`px-4 py-2 rounded-lg border ${
                signatureData.signatureType === 'draw'
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'border-border text-text-secondary hover:bg-background'
              }`}
            >
              Draw
            </button>
            <button
              type="button"
              onClick={() => setSignatureData({ ...signatureData, signatureType: 'type' })}
              className={`px-4 py-2 rounded-lg border ${
                signatureData.signatureType === 'type'
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'border-border text-text-secondary hover:bg-background'
              }`}
            >
              Type
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded-lg border ${
                signatureData.signatureType === 'upload'
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'border-border text-text-secondary hover:bg-background'
              }`}
            >
              Upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="border rounded-lg p-4 bg-background">
            {signatureData.signatureType === 'draw' && (
              <div className="border rounded-lg bg-surface h-48">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: 'w-full h-full'
                  }}
                />
              </div>
            )}

            {signatureData.signatureType === 'type' && (
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="w-full p-4 font-signature text-2xl border-b-2 border-border focus:border-accent focus:outline-none bg-surface text-text"
                placeholder="Type your signature..."
              />
            )}

            {signatureData.signatureType === 'upload' && signatureData.signatureContent && (
              <div className="relative">
                <img
                  src={signatureData.signatureContent}
                  alt="Uploaded signature"
                  className="max-h-48 mx-auto"
                />
                <button
                  onClick={() => setSignatureData({ ...signatureData, signatureContent: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={clearSignature}
              className="text-sm text-text-secondary hover:text-text"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="btn btn-primary"
          >
            Sign Document
          </button>
        </div>
      </div>
    </>
  );

  if (isNested) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-lg shadow-lg max-w-lg w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          {content}
        </form>
      </div>
    </div>
  );
};

export default SignatureComponent;