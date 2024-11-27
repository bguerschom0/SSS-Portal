// UpdateRequest.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Save, Loader, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Constants
const statusOptions = ['Pending', 'Closed'];
const departmentOptions = ['Department 1', 'Department 2', 'Department 3', 'Others'];
const roleOptions = ['Staff', 'Contractor', 'Expert', 'Apprentice'];

const UpdateRequest = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({/* Initial form state */});

  // Search functionality
  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'background_checks'),
        where('idPassportNumber', '>=', searchTerm),
        where('idPassportNumber', '<=', searchTerm + '\uf8ff')
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
      setLoading(false);
    }
  };

  // Update functionality
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, 'background_checks', selectedRequest.id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Request updated successfully' });
      handleSearch();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Search input and button */}
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
            {/* Update form fields */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
    </div>
  );
};

export default UpdateRequest;
