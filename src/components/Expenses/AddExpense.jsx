import React, { useState } from 'react';
import axios from 'axios';
import { X, IndianRupee } from 'lucide-react';
import API_ENDPOINTS from '../../../env';

export default function AddExpense({ isOpen, onClose, onSuccess, budgetId }) {
  console.log("budget id",budgetId)
  const [formData, setFormData] = useState({
    expenseName: "",
    expenseAmount: "",
    paymentMethod: "cash"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const createNewExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const newExpense=await axios.post(
        API_ENDPOINTS.createExpense(budgetId),
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log("expense",newExpense)
      
      onSuccess?.();
      onClose();
      setFormData({ expenseName: "", expenseAmount: "", paymentMethod: "cash" });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
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

        <h2 className="text-2xl font-semibold text-red-400 mb-6">Add New Expense</h2>

        <form onSubmit={createNewExpense} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expense Name
            </label>
            <input
              type="text"
              name="expenseName"
              value={formData.expenseName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter expense name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expense Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="expenseAmount"
                value={formData.expenseAmount}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter amount"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="other">Other</option>
            </select>
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
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}