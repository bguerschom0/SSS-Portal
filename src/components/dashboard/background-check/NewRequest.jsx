// NewRequest.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Save, RefreshCw, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Constants
const steps = [
  { id: 1, title: 'Basic Information', description: 'Personal details' },
  { id: 2, title: 'Department & Role', description: 'Position information' },
  { id: 3, title: 'Additional Details', description: 'Role-specific information' },
  { id: 4, title: 'Review', description: 'Verify information' }
];

const departmentOptions = ['Department 1', 'Department 2', 'Department 3', 'Others'];
const roleOptions = ['Staff', 'Contractor', 'Expert', 'Apprentice'];
const statusOptions = ['Pending', 'Closed'];

const NewRequest = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullNames: '',
    citizenship: '',
    idPassportNumber: '',
    department: '',
    otherDepartment: '',
    roleType: '',
    submittedDate: '',
    status: 'Pending',
    feedbackDate: '',
    requestedBy: '',
    fromCompany: '',
    duration: '',
    operatingCountry: ''
  });
  const [errors, setErrors] = useState({});
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'department') {
      setShowOtherDepartment(value === 'Others');
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.fullNames) stepErrors.fullNames = 'Full names are required';
        if (!formData.citizenship) stepErrors.citizenship = 'Citizenship is required';
        if (!formData.idPassportNumber) stepErrors.idPassportNumber = 'ID/Passport number is required';
        break;
      case 2:
        if (!formData.department) stepErrors.department = 'Department is required';
        if (formData.department === 'Others' && !formData.otherDepartment) {
          stepErrors.otherDepartment = 'Please specify department';
        }
        if (!formData.roleType) stepErrors.roleType = 'Role type is required';
        break;
      case 3:
        if (!formData.submittedDate) stepErrors.submittedDate = 'Submitted date is required';
        if (!formData.requestedBy) stepErrors.requestedBy = 'Requester name is required';
        
        if (['Contractor', 'Expert'].includes(formData.roleType)) {
          if (!formData.fromCompany) stepErrors.fromCompany = 'Company name is required';
          if (formData.roleType === 'Contractor') {
            if (!formData.duration) stepErrors.duration = 'Duration is required';
            if (!formData.operatingCountry) stepErrors.operatingCountry = 'Operating country is required';
          }
        }
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'background_checks'), {
        ...formData,
        department: formData.department === 'Others' ? formData.otherDepartment : formData.department,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        updatedAt: new Date().toISOString()
      });

      setMessage({
        type: 'success',
        text: 'Background check request submitted successfully!'
      });
      
      handleReset();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error submitting request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullNames: '',
      citizenship: '',
      idPassportNumber: '',
      department: '',
      otherDepartment: '',
      roleType: '',
      submittedDate: '',
      status: 'Pending',
      feedbackDate: '',
      requestedBy: '',
      fromCompany: '',
      duration: '',
      operatingCountry: ''
    });
    setShowOtherDepartment(false);
    setErrors({});
    setMessage({ type: '', text: '' });
    setCurrentStep(1);
  };

  // Form rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Basic Information Fields */}
            <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-sm font-medium text-gray-700">Full Names *</label>
              <input
                type="text"
                name="fullNames"
                value={formData.fullNames}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${errors.fullNames ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.fullNames && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                  {errors.fullNames}
                </motion.p>
              )}
            </motion.div>

            {/* Similar fields for citizenship and idPassportNumber */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Department & Role Fields */}
            <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-sm font-medium text-gray-700">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${errors.department ? 'border-red-300' : 'border-gray-200'}`}
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </motion.div>

            {/* Similar fields for roleType and conditional fields */}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Additional Details Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submitted Date, Status, Feedback Date, etc. */}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Review Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display all form data for review */}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-sm text-gray-500">
            {steps[currentStep - 1].description}
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Form Actions */}
            <div className="flex justify-between mt-8">
              {/* Previous/Next/Submit buttons */}
            </div>
          </form>
        </div>
      </div>

      {/* Messages and Loading States */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              message.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
            }`}
          >
            {/* Message content */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewRequest;
