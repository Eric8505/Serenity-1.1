import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-3.5 w-3.5',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: 'translate-x-6',
    },
    lg: {
      switch: 'h-7 w-14',
      thumb: 'h-5 w-5',
      translate: 'translate-x-8',
    },
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
        relative inline-flex ${sizes[size].switch} items-center rounded-full 
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? 'bg-accent' : 'bg-border dark:bg-border/30'}
      `}
      disabled={disabled}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`
          ${sizes[size].thumb}
          pointer-events-none inline-block transform rounded-full
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? sizes[size].translate : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default Switch;