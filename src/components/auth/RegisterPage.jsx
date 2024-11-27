import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Building } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        department: formData.department,
        role: 'user',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create default permissions document
      await setDoc(doc(db, 'user_permissions', userCredential.user.uid), {
        userId: userCredential.user.uid,
        permissions: {},
        updatedAt: new Date()
      });

      onRegisterSuccess(userCredential.user);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-10">
            <motion.div 
              className="flex justify-center mb-10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/logo.png"
                alt="Logo"
                className="h-28 w-auto"
              />
            </motion.div>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-500 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Full Name Input */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Full Name"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Email Address"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Department Input */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Department"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Password"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Confirm Password"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-emerald-600 text-white py-4 px-6 rounded-lg
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500 focus:ring-offset-2 
                         transform transition-all duration-200 ease-in-out
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-medium text-lg shadow-lg
                         ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <a href="/login" className="text-emerald-600 hover:text-emerald-700 text-sm">
                  Already have an account? Sign in here
                </a>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
