import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Save, RefreshCw, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, Search, Loader, Globe,
  Building, Calendar, FileText, Clock, Filter, Download,
  ChevronDown
} from 'lucide-react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../shared/Sidebar';

// Step definitions
const steps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Personal details'
  },
  {
    id: 2,
    title: 'Department & Role',
    description: 'Position information'
  },
  {
    id: 3,
    title: 'Additional Details',
    description: 'Role-specific information'
  },
  {
    id: 4,
    title: 'Review',
    description: 'Verify information'
  }
];

// Options
const departmentOptions = ['Department 1', 'Department 2', 'Department 3', 'Others'];
const roleOptions = ['Staff', 'Contractor', 'Expert', 'Apprentice'];
const statusOptions = ['Pending', 'Closed'];

const BackgroundCheck = ({ onNavigate, subItem }) => {
  // States for form data and UI
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

  // States for UI control
  const [errors, setErrors] = useState({});
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [successTimeout, setSuccessTimeout] = useState(null);

  useEffect(() => {
    if (subItem === 'Pending') {
      fetchPendingRequests();
    }
    // Cleanup timeout on unmount
    return () => {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
    };
  }, [subItem]);

  // Clear form when switching sections
  useEffect(() => {
    handleReset();
  }, [subItem]);
  // Form Handlers
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
      status: 'Pending', // Default status
      updatedAt: new Date().toISOString()
    });

      setMessage({
        type: 'success',
        text: 'Background check request submitted successfully!'
      });
      
    handleReset();
  } catch (error) {
    console.error('Error submitting request:', error);
    setMessage({
      type: 'error',
      text: 'Error submitting request. Please try again.'
    });
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    setShowResults(true);

    try {
      const q = query(
        collection(db, 'background_checks'),
        where('idPassportNumber', '>=', searchTerm),
        where('idPassportNumber', '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
      results.push({ 
        id: doc.id, 
        ...doc.data(),
        submittedDate: doc.data().submittedDate,
        feedbackDate: doc.data().feedbackDate || '' 
      });
    });
      
      setSearchResults(results);
      if (results.length === 0) {
        setMessage({ type: 'info', text: 'No requests found' });
      }
  } catch (error) {
    console.error('Error searching:', error);
    setMessage({ type: 'error', text: 'Error searching requests' });
  } finally {
    setLoading(false);
  }
};

  const fetchPendingRequests = async () => {
    setIsLoadingPending(true);
    try {
      const q = query(
        collection(db, 'background_checks'),
        where('status', '==', 'Pending')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
      requests.push({ 
        id: doc.id, 
        ...doc.data(),
        submittedDate: doc.data().submittedDate,
        feedbackDate: doc.data().feedbackDate || '' 
      });
    });
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setMessage({ type: 'error', text: 'Error loading pending requests' });
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setFormData(request);
    if (request.department === 'Others') {
      setShowOtherDepartment(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'background_checks', selectedRequest.id);
      await updateDoc(docRef, {
        ...formData,
      updatedAt: new Date().toISOString(),
      department: formData.department === 'Others' ? formData.otherDepartment : formData.department
    });
    
    setMessage({ 
      type: 'success', 
      text: 'Background check request updated successfully!' 
    });

      // Clear any existing timeout
      if (successTimeout) {
        clearTimeout(successTimeout);
      }

      // Set new timeout for message and cleanup
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
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
        setMessage({ type: '', text: '' });
        handleReset();
        setSelectedRequest(null);
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
        setSelectedRequest(null);
      }, 5000);

      setSuccessTimeout(timeout);
      
      if (subItem === 'Pending') {
        fetchPendingRequests();
      }

  } catch (error) {
    console.error('Error updating:', error);
    setMessage({
      type: 'error',
      text: 'Error updating request. Please try again.'
    });
  } finally {
    setIsUpdating(false);
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
  // Render Form Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Full Names */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Full Names *
              </label>
              <input
                type="text"
                name="fullNames"
                value={formData.fullNames}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.fullNames ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.fullNames && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.fullNames}
                </motion.p>
              )}
            </motion.div>

            {/* Citizenship */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Citizenship *
              </label>
              <input
                type="text"
                name="citizenship"
                value={formData.citizenship}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.citizenship ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.citizenship && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.citizenship}
                </motion.p>
              )}
            </motion.div>

            {/* ID/Passport Number */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                ID/Passport Number *
              </label>
              <input
                type="text"
                name="idPassportNumber"
                value={formData.idPassportNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.idPassportNumber ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.idPassportNumber && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.idPassportNumber}
                </motion.p>
              )}
            </motion.div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Department */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.department ? 'border-red-300' : 'border-gray-200'}`}
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.department && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.department}
                </motion.p>
              )}
            </motion.div>

            {/* Other Department */}
            <AnimatePresence>
              {showOtherDepartment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Specify Department *
                  </label>
                  <input
                    type="text"
                    name="otherDepartment"
                    value={formData.otherDepartment}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                              ${errors.otherDepartment ? 'border-red-300' : 'border-gray-200'}`}
                    required={showOtherDepartment}
                  />
                  {errors.otherDepartment && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-500 mt-1"
                    >
                      {errors.otherDepartment}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Type */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Role/Project Type *
              </label>
              <select
                name="roleType"
                value={formData.roleType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.roleType ? 'border-red-300' : 'border-gray-200'}`}
                required
              >
                <option value="">Select Role Type</option>
                {roleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.roleType && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.roleType}
                </motion.p>
              )}
            </motion.div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submitted Date */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Submitted Date *
                </label>
                <input
                  type="date"
                  name="submittedDate"
                  value={formData.submittedDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                            ${errors.submittedDate ? 'border-red-300' : 'border-gray-200'}`}
                  required
                />
                {errors.submittedDate && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.submittedDate}
                  </motion.p>
                )}
              </motion.div>

              {/* Status */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </motion.div>

              {/* Feedback Date (if status is Closed) */}
              {formData.status === 'Closed' && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Feedback Date
                  </label>
                  <input
                    type="date"
                    name="feedbackDate"
                    value={formData.feedbackDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </motion.div>
              )}

              {/* Requested By */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Requested By *
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                            ${errors.requestedBy ? 'border-red-300' : 'border-gray-200'}`}
                  required
                />
                {errors.requestedBy && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.requestedBy}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Conditional Fields based on Role Type */}
            {['Contractor', 'Expert'].includes(formData.roleType) && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Company */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      From Company *
                    </label>
                    <input
                      type="text"
                      name="fromCompany"
                      value={formData.fromCompany}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                ${errors.fromCompany ? 'border-red-300' : 'border-gray-200'}`}
                      required
                    />
                    {errors.fromCompany && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-500 mt-1"
                      >
                        {errors.fromCompany}
                      </motion.p>
                    )}
                  </div>

                  {formData.roleType === 'Contractor' && (
                    <>
                      {/* Duration */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 6 months"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                    ${errors.duration ? 'border-red-300' : 'border-gray-200'}`}
                          required
                        />
                        {errors.duration && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-500 mt-1"
                          >
                            {errors.duration}
                          </motion.p>
                        )}
                      </div>

                      {/* Operating Country */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Operating Country *
                        </label>
                        <input
                          type="text"
                          name="operatingCountry"
                          value={formData.operatingCountry}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                    ${errors.operatingCountry ? 'border-red-300' : 'border-gray-200'}`}
                          required
                        />
                        {errors.operatingCountry && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-500 mt-1"
                          >
                            {errors.operatingCountry}
                          </motion.p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        );
        case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Names</p>
                  <p className="mt-1 text-gray-900">{formData.fullNames}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Citizenship</p>
                  <p className="mt-1 text-gray-900">{formData.citizenship}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ID/Passport Number</p>
                  <p className="mt-1 text-gray-900">{formData.idPassportNumber}</p>
                </div>

                {/* Department & Role */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="mt-1 text-gray-900">
                    {formData.department === 'Others' ? formData.otherDepartment : formData.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role Type</p>
                  <p className="mt-1 text-gray-900">{formData.roleType}</p>
                </div>

                {/* Status and Dates */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-gray-900">{formData.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                  <p className="mt-1 text-gray-900">{formData.submittedDate}</p>
                </div>
                {formData.status === 'Closed' && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Feedback Date</p>
                    <p className="mt-1 text-gray-900">{formData.feedbackDate}</p>
                  </div>
                )}

                {/* Requested By */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Requested By</p>
                  <p className="mt-1 text-gray-900">{formData.requestedBy}</p>
                </div>

                {/* Conditional Fields */}
                {['Contractor', 'Expert'].includes(formData.roleType) && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">From Company</p>
                      <p className="mt-1 text-gray-900">{formData.fromCompany}</p>
                    </div>
                    {formData.roleType === 'Contractor' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="mt-1 text-gray-900">{formData.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Operating Country</p>
                          <p className="mt-1 text-gray-900">{formData.operatingCountry}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderUpdateForm = () => (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Search Request</h2>
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setShowResults(false);
              setSelectedRequest(null);
              setMessage({ type: '', text: '' });
            }}
            className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 
                     rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter ID/Passport Number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {loading && (
              <motion.div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="h-5 w-5 text-emerald-500" />
              </motion.div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                     transition-colors flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRequest?.id === result.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => handleSelectRequest(result)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{result.fullNames}</p>
                          <p className="text-sm text-gray-500">
                            ID/Passport: {result.idPassportNumber}
                          </p>
                        </div>
                        <div className="text-sm text-emerald-600">
                          {result.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : message.text && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-4"
                >
                  {message.text}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Update Form */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Update Request</h2>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  handleReset();
                }}
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 
                         rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Clear Form</span>
              </button>
            </div>

                     <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Names *
                </label>
                <input
                  type="text"
                  name="fullNames"
                  value={formData.fullNames}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Citizenship *
                </label>
                <input
                  type="text"
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ID/Passport Number *
                </label>
                <input
                  type="text"
                  name="idPassportNumber"
                  value={formData.idPassportNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Department & Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role Type *
                </label>
                <select
                  name="roleType"
                  value={formData.roleType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Role Type</option>
                  {roleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Status and Dates */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Submitted Date *
                </label>
                <input
                  type="date"
                  name="submittedDate"
                  value={formData.submittedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {formData.status === 'Closed' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Feedback Date
                  </label>
                  <input
                    type="date"
                    name="feedbackDate"
                    value={formData.feedbackDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Requested By *
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Conditional Fields based on Role Type */}
              {['Contractor', 'Expert'].includes(formData.roleType) && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      From Company *
                    </label>
                    <input
                      type="text"
                      name="fromCompany"
                      value={formData.fromCompany}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {formData.roleType === 'Contractor' && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 6 months"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Operating Country *
                        </label>
                        <input
                          type="text"
                          name="operatingCountry"
                          value={formData.operatingCountry}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                type="submit"
                disabled={isUpdating}
                className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                          transition-colors flex items-center space-x-2 ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                whileHover={!isUpdating ? { scale: 1.02 } : {}}
                whileTap={!isUpdating ? { scale: 0.98 } : {}}
              >
                <Save className="h-5 w-5" />
                <span>{isUpdating ? 'Updating...' : 'Update Request'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

  const renderPendingRequests = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Pending Background Checks</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Names
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID/Passport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingPending ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <Loader className="h-5 w-5 text-emerald-500 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No pending requests found
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request, index) => (
                  <motion.tr 
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.fullNames}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.idPassportNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.roleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {request.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

// Main render method
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      <Sidebar activePage="background-check" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {subItem ? `${subItem} Background Check Request` : 'New Background Check Request'}
            </h1>
          </div>

          {/* Main Content */}
          {subItem === 'Update' ? (
            renderUpdateForm()
          ) : subItem === 'Pending' ? (
            renderPendingRequests()
          ) : (
            <>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex flex-col items-center ${
                        index !== steps.length - 1 ? 'w-full' : ''
                      }`}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                          ${currentStep >= step.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}
                          transition-colors duration-200`}
                        >
                          {currentStep > step.id ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span>{step.id}</span>
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-sm font-medium text-gray-900">{step.title}</div>
                          <div className="text-xs text-gray-500">{step.description}</div>
                        </div>
                      </div>
                      {index !== steps.length - 1 && (
                        <div className={`w-full h-1 mx-4 ${
                          currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm"
              >
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

                    {/* Messages */}
                    <AnimatePresence>
                      {message.text && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-4 rounded-lg flex items-center space-x-2 mt-6 ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          <AlertCircle className="h-5 w-5" />
                          <span>{message.text}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form Actions */}
                    <div className="flex justify-between mt-8">
                      <motion.button
                        type="button"
                        onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                        className={`px-6 py-2 flex items-center space-x-2 rounded-lg transition-colors ${
                          currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        disabled={currentStep === 1}
                        whileHover={currentStep !== 1 ? { scale: 1.02 } : {}}
                        whileTap={currentStep !== 1 ? { scale: 0.98 } : {}}
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span>Previous</span>
                      </motion.button>

                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={handleReset}
                          className="px-6 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 
                                   rounded-lg transition-colors flex items-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RefreshCw className="h-5 w-5" />
                          <span>Reset</span>
                        </motion.button>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                                    transition-colors flex items-center space-x-2 ${
                                      loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                          whileHover={!loading ? { scale: 1.02 } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                          {currentStep === steps.length ? (
                            <>
                              <Save className="h-5 w-5" />
                              <span>{loading ? 'Submitting...' : 'Submit'}</span>
                            </>
                          ) : (
                            <>
                              <span>Next</span>
                              <ChevronRight className="h-5 w-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}

          {/* Loading Overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4"
                >
                  <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
                  <p className="text-gray-600">Processing request...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success/Error Messages Toast */}
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
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`h-5 w-5 ${
                    message.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                  }`} />
                  <span className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
                    {message.text}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BackgroundCheck;
