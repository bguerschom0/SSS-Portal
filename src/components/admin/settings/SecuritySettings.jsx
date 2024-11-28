import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Key } from 'lucide-react';
import { db } from '../../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
      passwordExpiry: 90
    },
    twoFactorAuth: {
      enabled: false,
      requiredForAdmins: true,
      method: 'email'
    },
    ipWhitelist: {
      enabled: false,
      addresses: []
    },
    auditLog: {
      enabled: true,
      retentionDays: 30
    }
  });

  const [newIpAddress, setNewIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'settings', 'security'), settings);
      setMessage({ type: 'success', text: 'Security settings updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addIpAddress = () => {
    if (newIpAddress && !settings.ipWhitelist.addresses.includes(newIpAddress)) {
      setSettings({
        ...settings,
        ipWhitelist: {
          ...settings.ipWhitelist,
          addresses: [...settings.ipWhitelist.addresses, newIpAddress]
        }
      });
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (ip) => {
    setSettings({
      ...settings,
      ipWhitelist: {
        ...settings.ipWhitelist,
        addresses: settings.ipWhitelist.addresses.filter(addr => addr !== ip)
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Password Policy */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <Key className="h-5 w-5 text-emerald-500" />
            <span>Password Policy</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Length
              </label>
              <input
                type="number"
                min="8"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={settings.passwordPolicy.passwordExpiry}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    passwordExpiry: parseInt(e.target.value)
                  }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['requireNumbers', 'requireSpecialChars', 'requireUppercase'].map((requirement) => (
              <div key={requirement} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy[requirement]}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      [requirement]: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  {requirement.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <span>Two-Factor Authentication</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  twoFactorAuth: {
                    ...settings.twoFactorAuth,
                    enabled: e.target.checked
                  }
                })}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Enable Two-Factor Authentication</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth.requiredForAdmins}
                onChange={(e) => setSettings({
                  ...settings,
                  twoFactorAuth: {
                    ...settings.twoFactorAuth,
                    requiredForAdmins: e.target.checked
                  }
                })}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Required for Administrators</label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">2FA Method</label>
              <select
                value={settings.twoFactorAuth.method}
                onChange={(e) => setSettings({
                  ...settings,
                  twoFactorAuth: {
                    ...settings.twoFactorAuth,
                    method: e.target.value
                  }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="email">Email</option>
                <option value="authenticator">Authenticator App</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">IP Whitelist</h3>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={settings.ipWhitelist.enabled}
              onChange={(e) => setSettings({
                ...settings,
                ipWhitelist: {
                  ...settings.ipWhitelist,
                  enabled: e.target.checked
                }
              })}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Enable IP Whitelist</label>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newIpAddress}
              onChange={(e) => setNewIpAddress(e.target.value)}
              placeholder="Enter IP address"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={addIpAddress}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Add IP
            </button>
          </div>

          <div className="space-y-2">
            {settings.ipWhitelist.addresses.map((ip) => (
              <div key={ip} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">{ip}</span>
                <button
                  type="button"
                  onClick={() => removeIpAddress(ip)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Audit Log</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.auditLog.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  auditLog: {
                    ...settings.auditLog,
                    enabled: e.target.checked
                  }
                })}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Enable Audit Logging</label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Log Retention (days)
              </label>
              <input
                type="number"
                value={settings.auditLog.retentionDays}
                onChange={(e) => setSettings({
                  ...settings,
                  auditLog: {
                    ...settings.auditLog,
                    retentionDays: parseInt(e.target.value)
                  }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
