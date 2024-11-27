import React from 'react';
import { motion } from 'framer-motion';

const EmailSettings = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Email Settings</h2>
        <p className="text-gray-600 mb-6">
          Configure email settings for your application.
        </p>
        <form className="space-y-4 text-left">
          <div>
            <label htmlFor="smtp-host" className="block text-sm font-medium">
              SMTP Host
            </label>
            <input
              type="text"
              id="smtp-host"
              className="w-full p-2 border rounded"
              placeholder="Enter SMTP host"
            />
          </div>
          <div>
            <label htmlFor="smtp-port" className="block text-sm font-medium">
              SMTP Port
            </label>
            <input
              type="number"
              id="smtp-port"
              className="w-full p-2 border rounded"
              placeholder="Enter SMTP port"
            />
          </div>
          <div>
            <label htmlFor="smtp-username" className="block text-sm font-medium">
              SMTP Username
            </label>
            <input
              type="text"
              id="smtp-username"
              className="w-full p-2 border rounded"
              placeholder="Enter SMTP username"
            />
          </div>
          <div>
            <label htmlFor="smtp-password" className="block text-sm font-medium">
              SMTP Password
            </label>
            <input
              type="password"
              id="smtp-password"
              className="w-full p-2 border rounded"
              placeholder="Enter SMTP password"
            />
          </div>
          <div>
            <label htmlFor="sender-email" className="block text-sm font-medium">
              Sender Email
            </label>
            <input
              type="email"
              id="sender-email"
              className="w-full p-2 border rounded"
              placeholder="Enter sender email"
            />
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

export default EmailSettings;
