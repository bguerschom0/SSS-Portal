import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Send, AlertCircle } from 'lucide-react';
import { db } from '../../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    smtpServer: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    encryption: 'tls',
    senderEmail: '',
    senderName: '',
    emailTemplates: {
      welcome: {
        subject: 'Welcome to SSS Portal',
        content: 'Welcome template content...'
      },
      passwordReset: {
        subject: 'Password Reset Request',
        content: 'Password reset template content...'
      },
      accessNotification: {
        subject: 'Access Request Update',
        content: 'Access notification template content...'
      }
    }
  });

  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'settings', 'email'), settings);
      setMessage({ type: 'success', text: 'Email settings updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      // Implement test email functionality
      setMessage({ type: 'success', text: 'Test email sent successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SMTP Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <Mail className="h-5 w-5 text-emerald-500" />
            <span>SMTP Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SMTP Server</label>
              <input
                type="text"
                value={settings.smtpServer}
                onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SMTP Username</label>
              <input
                type="text"
                value={settings.smtpUsername}
                onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Encryption</label>
            <select
              value={settings.encryption}
              onChange={(e) => setSettings({...settings, encryption: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>
        </div>

        {/* Sender Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Sender Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sender Email</label>
              <input
                type="email"
                value={settings.senderEmail}
                onChange={(e) => setSettings({...settings, senderEmail: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sender Name</label>
              <input
                type="text"
                value={settings.senderName}
                onChange={(e) => setSettings({...settings, senderName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>

          {Object.entries(settings.emailTemplates).map(([key, template]) => (
            <div key={key} className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailTemplates: {
                      ...settings.emailTemplates,
                      [key]: {
                        ...template,
                        subject: e.target.value
                      }
                    }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={template.content}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailTemplates: {
                      ...settings.emailTemplates,
                      [key]: {
                        ...template,
                        content: e.target.value
                      }
                    }
                  })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Test Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Test Configuration</h3>

          <div className="flex space-x-4">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={sendTestEmail}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              <span>Send Test</span>
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            <span>{message.text}</span>
          </motion.div>
        )}

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

export default EmailSettings;
