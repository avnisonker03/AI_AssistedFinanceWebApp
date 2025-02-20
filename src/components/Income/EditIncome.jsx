import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, IndianRupee } from 'lucide-react';
import API_ENDPOINTS from '../../../env';

export default function EditIncome({ isOpen, onClose, onSuccess, incomeId, initialData }) {
  const [updatedIncomeData, setUpdatedIncomeData] = useState({
    updatedSourceIncome: "",
    updatedMonthlyAmount: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setUpdatedIncomeData({
        updatedSourceIncome: initialData.sourceName || "",
        updatedMonthlyAmount: initialData.monthlyAmount || "",
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedIncomeData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const updateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("data to be send", updatedIncomeData);
      const accessToken = localStorage.getItem('accessToken');
      const updateIncomeResponse = await axios.put(
        API_ENDPOINTS.editIncome(incomeId),
        updatedIncomeData,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log("update income", updateIncomeResponse);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("Error updating income", err);
      setError(err.response?.data?.message || 'Failed to update income source');
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

        <h2 className="text-2xl font-semibold text-blue-400 mb-6">Edit Income Source</h2>

        <form onSubmit={updateIncome} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source Name
            </label>
            <input
              type="text"
              name="updatedSourceIncome"
              value={updatedIncomeData.updatedSourceIncome}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter income source name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monthly Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="updatedMonthlyAmount"
                value={updatedIncomeData.updatedMonthlyAmount}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter monthly amount"
                min="0"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}