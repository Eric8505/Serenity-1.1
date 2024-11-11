import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/Switch';
import { useTheme } from '../../context/ThemeContext';
import { Minus, Plus } from 'lucide-react';

const AccessibilitySettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || '16';
  });

  const updateFontSize = (newSize: string) => {
    const size = Math.min(Math.max(parseInt(newSize), 12), 24);
    setFontSize(size.toString());
    document.documentElement.style.setProperty('font-size', `${size}px`);
    localStorage.setItem('fontSize', size.toString());
  };

  const adjustFontSize = (amount: number) => {
    const newSize = Math.min(Math.max(parseInt(fontSize) + amount, 12), 24);
    updateFontSize(newSize.toString());
  };

  useEffect(() => {
    // Apply font size with transition
    document.documentElement.style.setProperty('font-size', `${fontSize}px`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    // Apply reduced motion
    document.documentElement.classList.toggle('motion-reduce', settings.reducedMotion);
    
    // Apply high contrast
    if (settings.highContrast) {
      setTheme('dark');
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Save settings
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings, setTheme]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Reduced Motion</p>
            <p className="text-xs text-text-secondary">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reducedMotion: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">High Contrast</p>
            <p className="text-xs text-text-secondary">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Screen Reader Support</p>
            <p className="text-xs text-text-secondary">
              Optimize for screen readers
            </p>
          </div>
          <Switch
            checked={settings.screenReader}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, screenReader: checked }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-text">
          Text Size Adjustment
        </label>
        
        <div className="p-4 border border-border rounded-lg bg-background/50">
          <p className="text-text mb-4">
            Sample text at current size ({fontSize}px)
          </p>
          <p className="text-text-secondary">
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => adjustFontSize(-1)}
            className="p-2 rounded-lg border border-border hover:bg-surface transition-colors duration-150"
            aria-label="Decrease font size"
          >
            <Minus className="h-4 w-4 text-text" />
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => updateFontSize(e.target.value)}
              className="w-full accent-accent"
              style={{
                height: '6px',
                borderRadius: '9999px',
                WebkitAppearance: 'none',
                background: `linear-gradient(to right, 
                  var(--color-accent) 0%, 
                  var(--color-accent) ${((parseInt(fontSize) - 12) / 12) * 100}%, 
                  var(--color-border) ${((parseInt(fontSize) - 12) / 12) * 100}%, 
                  var(--color-border) 100%)`
              }}
            />
          </div>

          <button
            onClick={() => adjustFontSize(1)}
            className="p-2 rounded-lg border border-border hover:bg-surface transition-colors duration-150"
            aria-label="Increase font size"
          >
            <Plus className="h-4 w-4 text-text" />
          </button>

          <div className="w-16 text-center">
            <input
              type="number"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => updateFontSize(e.target.value)}
              className="w-full text-center rounded-lg border-border bg-surface text-text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;