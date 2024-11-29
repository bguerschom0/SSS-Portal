import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SecuritySettings = () => {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handlePasswordPolicyChange = (field, value) => {
    setPasswordPolicy({
      ...passwordPolicy,
      [field]: value
    });
  };

  const handleTwoFactorAuthToggle = () => {
    setTwoFactorAuth(!twoFactorAuth);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Password Policy</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <label htmlFor="min-length" className="flex-1">Minimum Length:</label>
                <input
                  type="number"
                  id="min-length"
                  min="6"
                  value={passwordPolicy.minLength}
                  onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                  className="w-16 p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="require-uppercase" className="flex-1">Require Uppercase:</label>
                <input
                  type="checkbox"
                  id="require-uppercase"
                  checked={passwordPolicy.requireUppercase}
                  onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                  className="mr-2"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="require-lowercase" className="flex-1">Require Lowercase:</label>
                <input
                  type="checkbox"
                  id="require-lowercase"
                  checked={passwordPolicy.requireLowercase}
                  onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                  className="mr-2"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="require-number" className="flex-1">Require Number:</label>
                <input
                  type="checkbox"
                  id="require-number"
                  checked={passwordPolicy.requireNumber}
                  onChange={(e) => handlePasswordPolicyChange('requireNumber', e.target.checked)}
                  className="mr-2"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="require-special-char" className="flex-1">Require Special Character:</label>
                <input
                  type="checkbox"
                  id="require-special-char"
                  checked={passwordPolicy.requireSpecialChar}
                  onChange={(e) => handlePasswordPolicyChange('requireSpecialChar', e.target.checked)}
                  className="mr-2"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
            <div className="flex items-center">
              <label htmlFor="two-factor-auth" className="flex-1">Enable Two-Factor Authentication:</label>
              <input
                type="checkbox"
                id="two-factor-auth"
                checked={twoFactorAuth}
                onChange={handleTwoFactorAuthToggle}
                className="mr-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;
