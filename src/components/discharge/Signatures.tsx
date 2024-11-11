import React from 'react';

interface SignaturesProps {
  signatures: {
    clinician: {
      name: string;
      credentials: string;
      date: string;
      signature: string;
    };
  };
  onChange: (signatures: any) => void;
}

const Signatures: React.FC<SignaturesProps> = ({ signatures, onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Signatures</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Clinician Name</label>
          <input
            type="text"
            value={signatures.clinician.name}
            onChange={e => onChange({
              ...signatures,
              clinician: { ...signatures.clinician, name: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credentials</label>
          <input
            type="text"
            value={signatures.clinician.credentials}
            onChange={e => onChange({
              ...signatures,
              clinician: { ...signatures.clinician, credentials: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Signatures;