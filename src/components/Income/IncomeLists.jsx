import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Calendar, Trash2, Edit, PlusCircle, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import API_ENDPOINTS from '../../../env';
import AddNewIncome from './AddNewIncome';
import EditIncome from './EditIncome';
import DeleteIncome from './DeleteIncome';


// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function IncomeLists() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [incomeData, setIncomeData] = useState({
    incomeList: [],
    totalIncomeEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIncome, setExpandedIncome] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const accessToken = localStorage.getItem('accessToken');

  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.incomeList, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Process the API response data
      const processedData = {
        incomeList: response.data.incomeList.map(income => {
          return {
            ...income,
            formattedAmount: `₹${income.monthlyAmount.toLocaleString()}`
          };
        }),
        totalIncomeEntries: response.data.totalIncomeEntries
      };

      // Apply initial sorting (newest first)
      processedData.incomeList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setIncomeData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching income data:', err);
      setError('Failed to load income data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const handleExpand = (id) => {
    setExpandedIncome(expandedIncome === id ? null : id);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    // Sort logic
    const sortedList = [...incomeData.incomeList];
    if (order === 'newest') {
      sortedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (order === 'oldest') {
      sortedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (order === 'highest') {
      sortedList.sort((a, b) => b.monthlyAmount - a.monthlyAmount);
    } else if (order === 'lowest') {
      sortedList.sort((a, b) => a.monthlyAmount - b.monthlyAmount);
    }

    setIncomeData({
      ...incomeData,
      incomeList: sortedList
    });
  };

  // Generate chart data from income list
  const getChartData = () => {
    return incomeData.incomeList.map(income => ({
      name: income.sourceName,
      amount: income.monthlyAmount
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Wallet className="w-12 h-12 text-green-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-semibold text-blue-400">My Income Sources</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
            onClick={() => setIsAddIncomeOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Income
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Monthly Income Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Monthly Income</p>
              <h2 className="text-3xl font-semibold text-green-400">
                ₹{incomeData.incomeList.reduce((total, income) => total + income.monthlyAmount, 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">From {incomeData.totalIncomeEntries} active income sources</span>
          </div>
        </motion.div>

        {/* Average Income Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Average Income Per Source</p>
              <h2 className="text-3xl font-semibold text-purple-400">
                ₹{incomeData.incomeList.length > 0 ?
                  Math.round(incomeData.incomeList.reduce((total, income) => total + income.monthlyAmount, 0) /
                    incomeData.incomeList.length).toLocaleString() : 0}
              </h2>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">Calculated across all sources</span>
          </div>
        </motion.div>

        {/* Annual Projection Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Annual Income Projection</p>
              <h2 className="text-3xl font-semibold text-blue-400">
                ₹{(incomeData.incomeList.reduce((total, income) => total + income.monthlyAmount, 0) * 12).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">Based on current monthly income</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Income List */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        {incomeData.incomeList.length === 0 ? (
          <motion.div
            variants={itemVariant}
            className="bg-gray-800/50 rounded-xl p-12 text-center"
          >
            <div className="mx-auto bg-blue-500/20 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-400 mb-2">No Income Sources Found</h3>
            <p className="text-gray-400 mb-6">Get started by adding your income sources to track your monthly earnings</p>
            <button
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center"
              onClick={() => setIsAddIncomeOpen(true)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Income Source
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Income Chart */}
            <motion.div
              variants={itemVariant}
              className="bg-gray-800 rounded-xl p-6 mb-6"
            >
              <h3 className="text-xl font-semibold mb-4">Income Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="name"
                      stroke="#999"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#999" />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Monthly Amount']}
                      contentStyle={{ backgroundColor: '#333', border: 'none' }}
                    />
                    <Bar dataKey="amount" fill="#007BFF" barSize={40} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {incomeData.incomeList.map((income) => (
              <motion.div
                key={income._id}
                variants={itemVariant}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Income Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleExpand(income._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Wallet className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{income.sourceName}</h3>
                        <p className="text-gray-400 text-sm">
                          Added {new Date(income.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 md:mt-0 space-x-4">
                      <div>
                        <p className="text-sm text-gray-400">Monthly Amount</p>
                        <p className="font-semibold text-green-400">{income.formattedAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Yearly</p>
                        <p className="font-semibold text-blue-400">₹{(income.monthlyAmount * 12).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center">
                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedIncome === income._id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedIncome === income._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-750 border-t border-gray-700 p-6"
                  >
                    <div className="bg-gray-800 p-4 rounded-xl">
                      <h4 className="text-lg font-medium mb-4">Income Details</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-gray-400">Source Name</span>
                          <span className="font-medium">{income.sourceName}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-gray-400">Monthly Amount</span>
                          <span className="font-medium text-green-400">{income.formattedAmount}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-gray-400">Yearly Projection</span>
                          <span className="font-medium text-blue-400">₹{(income.monthlyAmount * 12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-gray-400">Added On</span>
                          <span className="font-medium">
                            {new Date(income.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-gray-400">Last Updated</span>
                          <span className="font-medium">
                            {new Date(income.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end mt-6 space-x-3">
                        <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                          onClick={() => {
                            setSelectedIncome(income);
                            setIsEditIncomeOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-900/30 rounded-lg hover:bg-red-900/50 transition-colors flex items-center"
                          onClick={() => {
                            setIncomeToDelete(income);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AddNewIncome
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={() => {
          fetchIncomeData();
        }}
      />

      <EditIncome
        isOpen={isEditIncomeOpen}
        onClose={() => {
          setIsEditIncomeOpen(false);
          setSelectedIncome(null);
        }}
        onSuccess={() => {
          fetchIncomeData();
        }}
        incomeId={selectedIncome?._id}
        initialData={selectedIncome}
      />

      <DeleteIncome
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIncomeToDelete(null);
        }}
        onSuccess={() => {
          fetchIncomeData();
        }}
        incomeId={incomeToDelete?._id}
        sourceName={incomeToDelete?.sourceName}
      />


      {/* Add Income FAB for mobile */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 md:hidden bg-green-600 p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddIncomeOpen(true)}
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}