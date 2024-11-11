import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StaffNotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
}

const StaffNotesSection: React.FC<StaffNotesSectionProps> = ({
  notes,
  onChange,
}) => {
  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <AlertCircle className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-medium text-text">Staff Notes</h3>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-text-secondary">
          These notes are for staff reference only and will not be included in the client's record.
        </p>
        
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded-lg border-border bg-surface text-text"
          placeholder="Enter any additional notes, observations, or concerns for staff reference..."
        />

        <div className="text-xs text-text-secondary">
          <p>Note: This section is intended for:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Internal staff communications</li>
            <li>Supervision discussion points</li>
            <li>Follow-up reminders</li>
            <li>Case coordination notes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffNotesSection;