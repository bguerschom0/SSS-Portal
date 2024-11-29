import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GeneralSettings = () => {
  const [appName, setAppName] = useState('My Admin Dashboard');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [brandColor, setBrandColor] = useState('#4CAF50');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/dd/yyyy');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the general settings to the database or other storage
    console.log('Saving general settings:', {
      appName,
      logoUrl,
      brandColor,
      timezone,
      dateFormat
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">General Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="app-name" className="block text-sm font-medium">
              App Name
            </label>
            <input
              type="text"
              id="app-name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="logo-url" className="block text-sm font-medium">
              Logo URL
            </label>
            <input
              type="text"
              id="logo-url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="brand-color" className="block text-sm font-medium">
              Brand Color
            </label>
            <input
              type="color"
              id="brand-color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium">
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          <div>
            <label htmlFor="date-format" className="block text-sm font-medium">
              Date Format
            </label>
            <select
              id="date-format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="MM/dd/yyyy">MM/dd/yyyy</option>
              <option value="dd/MM/yyyy">dd/MM/yyyy</option>
              <option value="yyyy-MM-dd">yyyy-MM-dd</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
          >
            Save Settings
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GeneralSettings;
