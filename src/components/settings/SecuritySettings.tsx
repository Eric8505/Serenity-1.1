import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/Switch';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('securitySettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      twoFactor: false,
      sessionTimeout: true,
      loginNotifications: true,
      deviceHistory: true,
      sessionTimeoutDuration: 30, // minutes
    };
  });

  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(settings));

    // Apply session timeout
    if (settings.sessionTimeout) {
      let timeoutId: number;
      const resetTimeout = () => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          // Handle session timeout
          localStorage.removeItem('authUser');
          window.location.reload();
        }, settings.sessionTimeoutDuration * 60 * 1000);
      };

      // Reset timeout on user activity
      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keypress', resetTimeout);
      resetTimeout();

      return () => {
        window.clearTimeout(timeoutId);
        window.removeEventListener('mousemove', resetTimeout);
        window.removeEventListener('keypress', resetTimeout);
      };
    }
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Two-Factor Authentication</p>
            <p className="text-xs text-text-secondary">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={settings.twoFactor}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactor: checked }))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text">Auto Session Timeout</p>
              <p className="text-xs text-text-secondary">
                Automatically log out after period of inactivity
              </p>
            </div>
            <Switch
              checked={settings.sessionTimeout}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sessionTimeout: checked }))}
            />
          </div>
          {settings.sessionTimeout && (
            <div className="flex items-center space-x-2 pl-6">
              <input
                type="number"
                min="1"
                max="120"
                value={settings.sessionTimeoutDuration}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  sessionTimeoutDuration: parseInt(e.target.value) || 30
                }))}
                className="w-20 text-sm rounded-md"
              />
              <span className="text-sm text-text-secondary">minutes</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Login Notifications</p>
            <p className="text-xs text-text-secondary">
              Get notified of new login attempts
            </p>
          </div>
          <Switch
            checked={settings.loginNotifications}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, loginNotifications: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Device History</p>
            <p className="text-xs text-text-secondary">
              Keep track of devices used to access your account
            </p>
          </div>
          <Switch
            checked={settings.deviceHistory}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deviceHistory: checked }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;