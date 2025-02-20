import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import API_ENDPOINTS from '../../../env';

export default function DeleteExpense({ 
  isOpen, 
  onClose, 
  onSuccess, 
  budgetId, 
  expenseId, 
  expenseName,
  expenseAmount
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const deleteAction = await axios.delete(
        API_ENDPOINTS.deleteExpense(budgetId, expenseId),
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log("delete action", deleteAction);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || 'Failed to delete expense');
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
          <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-red-400 mb-2">Delete Expense</h2>
          
          <div className="bg-gray-750 p-4 rounded-lg mb-4 w-full">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Expense:</span>
              <span className="font-medium text-white">{expenseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="font-medium text-white">₹{expenseAmount?.toLocaleString()}</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this expense?
            This action cannot be undone.
          </p>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg mb-4 w-full">
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
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete Expense'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}