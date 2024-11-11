import React from 'react';
import { Bell, Shield, Eye, Moon, Globe, Key } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import AccessibilitySettings from '../components/settings/AccessibilitySettings';
import LanguageSettings from '../components/settings/LanguageSettings';
import PasswordChange from '../components/settings/PasswordChange';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate an API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.currentPassword === 'admin123') {
          resolve(true);
          // Update stored password if using demo auth
          const authUser = localStorage.getItem('authUser');
          if (authUser) {
            const user = JSON.parse(authUser);
            user.password = data.newPassword;
            localStorage.setItem('authUser', JSON.stringify(user));
          }
        } else {
          reject(new Error('Current password is incorrect'));
        }
      }, 1000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Moon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text">Appearance</h3>
                  <p className="text-sm text-text-secondary">
                    Customize the application theme
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text">Language & Region</h3>
                <p className="text-sm text-text-secondary">
                  Set your preferred language and regional settings
                </p>
              </div>
            </div>
            <LanguageSettings />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text">Notifications</h3>
                <p className="text-sm text-text-secondary">
                  Configure your notification preferences
                </p>
              </div>
            </div>
            <NotificationSettings />
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text">Security</h3>
                <p className="text-sm text-text-secondary">
                  Manage your security preferences
                </p>
              </div>
            </div>
            <SecuritySettings />
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text">Accessibility</h3>
                <p className="text-sm text-text-secondary">
                  Customize accessibility options
                </p>
              </div>
            </div>
            <AccessibilitySettings />
          </div>
        </div>

        {/* Password Change */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Key className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text">Password</h3>
                  <p className="text-sm text-text-secondary">
                    Change your account password
                  </p>
                </div>
              </div>
              <PasswordChange onSubmit={handlePasswordChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;