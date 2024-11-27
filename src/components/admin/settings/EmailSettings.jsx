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
        <h2 className="text-2xl font-bold mb-4">Under Construction</h2>
        <p className="text-gray-600 mb-6">
          This page is currently under development. Please check back soon!
        </p>
        <motion.div
          initial
