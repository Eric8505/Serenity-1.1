import React from 'react';

interface BasicInfoProps {
  date: string;
  levelOfCare: string;
  onDateChange: (date: string) => void;
  onLevelChange: (level: string) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  date,
  levelOfCare,
  onDateChange,
  onLevelChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700">Discharge Date</label>
        <input
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Level of Care</label>
        <select
          value={levelOfCare}
          onChange={e => onLevelChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="outpatient">Outpatient</option>
          <option value="intensive-outpatient">Intensive Outpatient</option>
          <option value="partial-hospitalization">Partial Hospitalization</option>
          <option value="residential">Residential</option>
          <option value="inpatient">Inpatient</option>
        </select>
      </div>
    </div>
  );
};

export default BasicInfo;