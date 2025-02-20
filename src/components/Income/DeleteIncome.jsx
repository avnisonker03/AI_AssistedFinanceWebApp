import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertTriangle } from 'lucide-react';
import API_ENDPOINTS from '../../../env';

export default function DeleteIncome({ isOpen, onClose, onSuccess, incomeId, sourceName }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("income id and income name",incomeId,sourceName)

  const handleDeleteIncome = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const deleteAction=await axios.delete(
        API_ENDPOINTS.deleteIncome(incomeId),
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log("delete action",deleteAction)
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("Error deleting income source", err);
      setError(err.response?.data?.message || 'Failed to delete income source');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-red-400 mb-2">Delete Income Source</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete income source "{sourceName}"? This action cannot be undone.
          </p>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg w-full mb-6">
              {error}
            </div>
          )}

          <div className="flex space-x-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteIncome}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}