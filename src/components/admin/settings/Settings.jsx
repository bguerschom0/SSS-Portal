import React, { useState } from 'react';
import { Settings as SettingsIcon, Mail, Shield, Bell, Globe, Database, Server } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import EmailSettings from './EmailSettings';

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState(null);

  const settingTypes = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic system configuration and preferences',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Security configurations and policies',
      icon: Shield,
      color: 'emerald'
    },
    {
      id: 'email',
      title: 'Email Settings',
      description: 'Email server and notification settings',
      icon: Mail,
      color: 'purple'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'System notifications and alerts',
      icon: Bell,
      color: 'yellow'
    },
    {
      id: 'database',
      title: 'Database Settings',
      description: 'Database configuration and maintenance',
      icon: Database,
      color: 'indigo'
    },
    {
      id: 'system',
      title: 'System Settings',
      description: 'Advanced system configurations',
      icon: Server,
      color: 'red'
    }
  ];

  const renderSettingContent = () => {
    switch (selectedSetting) {
      case 'general':
        return <GeneralSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'email':
        return <EmailSettings />;
      default:
        return (
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Setting Category</h3>
            <p className="text-gray-500">Choose a category to modify settings</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {!selectedSetting ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingTypes.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <button
                key={setting.id}
                onClick={() => setSelectedSetting(setting.id)}
                className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 bg-${setting.color}-50 rounded-lg`}>
                    <IconComponent className={`h-6 w-6 text-${setting.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{setting.title}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {settingTypes.find(s => s.id === selectedSetting)?.title}
            </h2>
            <button
              onClick={() => setSelectedSetting(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Back to Settings
            </button>
          </div>
          {renderSettingContent()}
        </div>
      )}
    </div>
  );
};

export default Settings;
