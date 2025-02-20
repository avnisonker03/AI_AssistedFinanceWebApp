import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, CreditCard, AlertTriangle, Search, Filter } from 'lucide-react';
import API_ENDPOINTS from '../../../env';

export default function ExpenseListUnderAbudget({ isOpen, onClose, budgetId, budgetName }) {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isOpen && budgetId) {
      fetchExpenseData();
    }
  }, [isOpen, budgetId]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        API_ENDPOINTS.expenseListUnderAbudget(budgetId),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Process the expense data with formatted values
      const processedData = response.data.expenseList.map(expense => ({
        ...expense,
        formattedAmount: `₹${expense.expenseAmount.toLocaleString()}`,
        formattedDate: new Date(expense.expenseDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));

      setExpenseData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expense data:', err);
      setError('Failed to load expense data');
      setLoading(false);
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sortedData = [...expenseData];
    
    switch (sortType) {
      case 'newest':
        sortedData.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
        break;
      case 'oldest':
        sortedData.sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate));
        break;
      case 'highest':
        sortedData.sort((a, b) => b.expenseAmount - a.expenseAmount);
        break;
      case 'lowest':
        sortedData.sort((a, b) => a.expenseAmount - b.expenseAmount);
        break;
      default:
        break;
    }
    
    setExpenseData(sortedData);
  };

  const filteredExpenses = expenseData.filter(expense => 
    expense.expenseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-blue-400">Expenses List</h2>
              <p className="text-gray-400">
                All expenses for budget: <span className="font-medium text-white">{budgetName}</span>
              </p>
            </div>
            <button 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 bg-gray-850 border-b border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expense List */}
          <div className="flex-grow overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </motion.div>
              </div>
            ) : error ? (
              <div className="bg-gray-750 p-8 rounded-xl text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Error Loading Data</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={fetchExpenseData}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="bg-gray-750 p-8 rounded-xl text-center">
                <div className="mx-auto bg-blue-500/20 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Expenses Found</h3>
                <p className="text-gray-400">
                  {searchTerm ? "No expenses match your search criteria" : "This budget doesn't have any expenses yet"}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredExpenses.map((expense, index) => (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    className="bg-gray-750 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <DollarSign className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{expense.expenseName}</h3>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {expense.formattedDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 md:mt-0 space-x-6">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm capitalize">{expense.paymentMethod}</span>
                        </div>
                        <div className="font-semibold text-lg text-blue-400">
                          {expense.formattedAmount}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer with Summary */}
          {!loading && !error && filteredExpenses.length > 0 && (
            <div className="bg-gray-850 px-6 py-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Total:</span>
                  <span className="font-semibold text-blue-400">
                    ₹{filteredExpenses.reduce((total, expense) => total + expense.expenseAmount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}