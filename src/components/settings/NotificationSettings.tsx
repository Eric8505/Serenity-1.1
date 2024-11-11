import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/Switch';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      email: {
        appointments: true,
        documents: true,
        reminders: true,
        updates: false,
      },
      push: {
        appointments: true,
        documents: false,
        reminders: true,
        updates: true,
      },
      sound: true,
      desktop: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));

    // Request notification permissions if desktop notifications are enabled
    if (settings.desktop && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [settings]);

  const updateSetting = (type: 'email' | 'push', key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-text mb-4">Email Notifications</h4>
        <div className="space-y-4">
          {Object.entries(settings.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting('email', key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text mb-4">Push Notifications</h4>
        <div className="space-y-4">
          {Object.entries(settings.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting('push', key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text mb-4">General Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Sound Notifications
            </span>
            <Switch
              checked={settings.sound}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Desktop Notifications
            </span>
            <Switch
              checked={settings.desktop}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, desktop: checked }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;