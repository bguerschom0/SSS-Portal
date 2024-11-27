import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Save, RefreshCw, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, Search, Loader
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Sidebar from '../shared/Sidebar';

const steps = [
  { id: 1, title: 'Basic Information', description: 'Reference and date details' },
  { id: 2, title: 'Request Details', description: 'Sender and subject information' },
  { id: 3, title: 'Description', description: 'Detailed request information' },
  { id: 4, title: 'Response', description: 'Status and response details' }
];

const senderOptions = ["NPPA", "RIB", "MPG", "Private Advocate", "Other"];
const subjectOptions = [
  "Account Unblock", "MoMo Transaction", "Call History", "Reversal",
  "MoMo Transaction & Call History", "Account Information", "Account Status",
  "Balance", "Other"
];
const statusOptions = ["Pending", "Answered"];
const answeredByOptions = ["bigirig", "isimbie", "niragit", "nkomatm", "tuyisec"];

const StakeholderForm = ({ onNavigate, subItem }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dateReceived: '',
    referenceNumber: '',
    sender: '',
    otherSender: '',
    subject: '',
    otherSubject: '',
    status: 'Pending',
    responseDate: '',
    answeredBy: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showOtherSender, setShowOtherSender] = useState(false);
  const [showOtherSubject, setShowOtherSubject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  useEffect(() => {
    if (subItem === 'Pending') {
      fetchPendingRequests();
    }
  }, [subItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'sender') {
      setShowOtherSender(value === 'Other');
    }
    if (name === 'subject') {
      setShowOtherSubject(value === 'Other');
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.dateReceived) stepErrors.dateReceived = 'Date is required';
        if (!formData.referenceNumber) stepErrors.referenceNumber = 'Reference number is required';
        break;
      case 2:
        if (!formData.sender) stepErrors.sender = 'Sender is required';
        if (formData.sender === 'Other' && !formData.otherSender) {
          stepErrors.otherSender = 'Please specify other sender';
        }
        if (!formData.subject) stepErrors.subject = 'Subject is required';
        if (formData.subject === 'Other' && !formData.otherSubject) {
          stepErrors.otherSubject = 'Please specify other subject';
        }
        break;
      case 3:
        if (!formData.description || formData.description.length < 10) {
          stepErrors.description = 'Description must be at least 10 characters';
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

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'stakeholder_requests'), {
        ...formData,
        sender: formData.sender === 'Other' ? formData.otherSender : formData.sender,
        subject: formData.subject === 'Other' ? formData.otherSubject : formData.subject,
        createdAt: new Date()
      });

      setMessage({
        type: 'success',
        text: 'Request saved successfully!'
      });
      
      handleReset();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error saving request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setShowResults(true);

    try {
      const q = query(
        collection(db, 'stakeholder_requests'),
        where('referenceNumber', '>=', searchTerm),
        where('referenceNumber', '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      setSearchResults(results);
      if (results.length === 0) {
        setMessage({ type: 'info', text: 'No requests found' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error searching requests' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    setIsLoadingPending(true);
    try {
      const q = query(
        collection(db, 'stakeholder_requests'),
        where('status', '==', 'Pending')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
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
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'stakeholder_requests', selectedRequest.id);
      await updateDoc(docRef, formData);
      
      setMessage({ type: 'success', text: 'Request updated successfully' });
      if (subItem === 'Pending') {
        fetchPendingRequests();
      } else {
        handleSearch();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating request' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      dateReceived: '',
      referenceNumber: '',
      sender: '',
      otherSender: '',
      subject: '',
      otherSubject: '',
      status: 'Pending',
      responseDate: '',
      answeredBy: '',
      description: ''
    });
    setShowOtherSender(false);
    setShowOtherSubject(false);
    setErrors({});
    setMessage({ type: '', text: '' });
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-sm font-medium text-gray-700">Date Received *</label>
              <div className="relative">
                <input
                  type="date"
                  name="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                            ${errors.dateReceived ? 'border-red-300' : 'border-gray-200'}`}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.dateReceived && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                  {errors.dateReceived}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">Reference Number *</label>
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.referenceNumber ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.referenceNumber && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                  {errors.referenceNumber}
                </motion.p>
              )}
            </motion.div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Sender Fields */}
            <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-sm font-medium text-gray-700">Sender/Sources *</label>
              <select
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.sender ? 'border-red-300' : 'border-gray-200'}`}
                required
              >
                <option value="">Select Sender/Sources</option>
                {senderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.sender && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                  {errors.sender}
                </motion.p>
              )}
            </motion.div>

            {/* Other Sender Field */}
            <AnimatePresence>
              {showOtherSender && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">Specify Other Sender *</label>
                  <input
                    type="text"
                    name="otherSender"
                    value={formData.otherSender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                              ${errors.otherSender ? 'border-red-300' : 'border-gray-200'}`}
                    required={showOtherSender}
                  />
                  {errors.otherSender && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                      {errors.otherSender}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subject Fields */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">Subject/Topic *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.subject ? 'border-red-300' : 'border-gray-200'}`}
                required
              >
                <option value="">Select Subject/Topic</option>
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.subject && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
                  {errors.subject}
                </motion.p>
              )}
            </motion.div>

            {/* Other Subject Field */}
            <AnimatePresence>
              {showOtherSubject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">Specify Other Subject *</label>
                  <input
                    type="text"
                    name="otherSubject"
                    value={formData.otherSubject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                      ${errors.otherSubject ? 'border-red-300' : 'border-gray-200'}`}
            required={showOtherSubject}
          />
          {errors.otherSubject && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
              {errors.otherSubject}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

case 3:
return (
  <div className="space-y-6">
    <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <label className="block text-sm font-medium text-gray-700">Description *</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={6}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                  ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
        required
      />
      {errors.description && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-1">
          {errors.description}
        </motion.p>
      )}
    </motion.div>
  </div>
);

case 4:
return (
  <div className="space-y-6">
    <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <label className="block text-sm font-medium text-gray-700">Response Date</label>
      <div className="relative">
        <input
          type="date"
          name="responseDate"
          value={formData.responseDate}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </motion.div>

    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block text-sm font-medium text-gray-700">Status *</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
      >
        {statusOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </motion.div>

    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <label className="block text-sm font-medium text-gray-700">Answered By</label>
      <select
        name="answeredBy"
        value={formData.answeredBy}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">Select Person</option>
        {answeredByOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </motion.div>
  </div>
);

default:
return null;
}
};

const renderMainContent = () => {
switch (subItem) {
case 'Update':
return renderUpdateForm();
case 'Pending':
return renderPendingRequests();
default:
return renderNewRequestForm();
}
};

const renderNewRequestForm = () => (
<>
<div className="mb-8">
<div className="flex items-center justify-between max-w-3xl mx-auto">
  {steps.map((step, index) => (
    <div key={step.id} className="flex items-center">
      <div className={`flex flex-col items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full 
          ${currentStep >= step.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}
          transition-colors duration-200`}>
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
        <div className={`w-full h-1 mx-4 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'}`} />
      )}
    </div>
  ))}
</div>
</div>

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
          disabled={isLoading}
          className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                    transition-colors flex items-center space-x-2 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {currentStep === steps.length ? (
            <>
              <Save className="h-5 w-5" />
              <span>{isLoading ? 'Saving...' : 'Submit'}</span>
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
);

const renderUpdateForm = () => (
<div className="space-y-6">
<div className="bg-white rounded-xl shadow-sm p-6">
<h2 className="text-lg font-semibold text-gray-800 mb-4">Search Request</h2>
<div className="flex space-x-4">
  <div className="flex-1 relative">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Enter Reference Number"
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    {isLoading && (
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
    <span>Check</span>
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
                  <p className="font-medium text-gray-800">{result.referenceNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.dateReceived).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-emerald-600">
                  {result.sender}
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

<AnimatePresence>
{selectedRequest && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Request</h2>
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form fields from renderStepContent() */}
        {renderStepContent()}
      </div>

      <div className="flex justify-end space-x-3">
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
          <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingPending ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <Loader className="h-5 w-5 text-emerald-500 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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
                      {request.referenceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.dateReceived).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {request.description}
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage="stakeholder" onNavigate={onNavigate} />
      
    <div className="flex-1 ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {subItem ? `${subItem} Stakeholder Request` : 'New Stakeholder Request'}
          </h1>
        </div>



          {renderMainContent()}

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-lg p-8">
                  <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
