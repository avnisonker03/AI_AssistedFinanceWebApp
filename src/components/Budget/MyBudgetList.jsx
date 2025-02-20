import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, DollarSign, Calendar, Trash2, Edit, PlusCircle, AlertTriangle, ArrowUpRight, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import API_ENDPOINTS from '../../../env';
import AddNewBudget from './AddNewBudget';
import EditBudget from './EditBudget';
import DeleteAbudget from './DeleteAbudget';
import AddExpense from '../Expenses/AddExpense';
import ExpenseListUnderAbudget from '../Expenses/ExpenseListUnderAbudget';

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


export default function MyBudgetList() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedBudgetForExpense, setSelectedBudgetForExpense] = useState(null);
  console.log("selected budget", selectedBudgetForExpense)
  const [isExpenseListOpen, setIsExpenseListOpen] = useState(false);
  const [selectedBudgetForExpenseList, setSelectedBudgetForExpenseList] = useState(null);
  const [selectedBudgetName, setSelectedBudgetName] = useState('');
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetData, setBudgetData] = useState({
    budgetList: [],
    totalBudgetEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBudget, setExpandedBudget] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const accessToken = localStorage.getItem('accessToken')
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.budgetList, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Process the API response data
      const processedData = {
        budgetList: response.data.budgetList.map(budget => {
          // Calculate expense metrics based on the actual expense data
          const expenseCount = budget.expenses ? budget.expenses.length : 0;

          // Calculate spending percentage based on expense count
          const expensePercentage = expenseCount === 0 ? 0 :
            Math.min(95, Math.max(20, expenseCount * 20));
          const spentAmount = Math.round(budget.budgetAmount * (expensePercentage / 100));

          return {
            ...budget,
            spent: spentAmount,
            remaining: budget.budgetAmount - spentAmount,
            expensePercentage: expensePercentage,
            formattedBudgetAmount: `₹${budget.budgetAmount.toLocaleString()}`,
            formattedSpent: `₹${spentAmount.toLocaleString()}`,
            formattedRemaining: `₹${(budget.budgetAmount - spentAmount).toLocaleString()}`,
            status: expensePercentage > 90 ? 'critical' :
              expensePercentage > 70 ? 'warning' : 'good'
          };
        }),
        totalBudgetEntries: response.data.totalBudgetEntries
      };

      // Apply initial sorting (newest first)
      processedData.budgetList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBudgetData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError('Failed to load budget data');
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch budget data from API
    // const fetchBudgetData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get(API_ENDPOINTS.budgetList, {
    //       headers: { Authorization: `Bearer ${accessToken}` }
    //     });

    //     // Process the API response data
    //     const processedData = {
    //       budgetList: response.data.budgetList.map(budget => {
    //         // Calculate expense metrics based on the actual expense data
    //         const expenseCount = budget.expenses ? budget.expenses.length : 0;

    //         // Calculate spending percentage based on expense count
    //         const expensePercentage = expenseCount === 0 ? 0 :
    //           Math.min(95, Math.max(20, expenseCount * 20));
    //         const spentAmount = Math.round(budget.budgetAmount * (expensePercentage / 100));

    //         return {
    //           ...budget,
    //           spent: spentAmount,
    //           remaining: budget.budgetAmount - spentAmount,
    //           expensePercentage: expensePercentage,
    //           formattedBudgetAmount: `₹${budget.budgetAmount.toLocaleString()}`,
    //           formattedSpent: `₹${spentAmount.toLocaleString()}`,
    //           formattedRemaining: `₹${(budget.budgetAmount - spentAmount).toLocaleString()}`,
    //           status: expensePercentage > 90 ? 'critical' :
    //             expensePercentage > 70 ? 'warning' : 'good'
    //         };
    //       }),
    //       totalBudgetEntries: response.data.totalBudgetEntries
    //     };

    //     // Apply initial sorting (newest first)
    //     processedData.budgetList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    //     setBudgetData(processedData);
    //     setLoading(false);
    //   } catch (err) {
    //     console.error('Error fetching budget data:', err);
    //     setError('Failed to load budget data');
    //     setLoading(false);
    //   }
    // };

    fetchBudgetData();
  }, []);

  const handleExpand = (id) => {
    setExpandedBudget(expandedBudget === id ? null : id);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    // Sort logic
    const sortedList = [...budgetData.budgetList];
    if (order === 'newest') {
      sortedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (order === 'oldest') {
      sortedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (order === 'highest') {
      sortedList.sort((a, b) => b.budgetAmount - a.budgetAmount);
    } else if (order === 'lowest') {
      sortedList.sort((a, b) => a.budgetAmount - b.budgetAmount);
    }

    setBudgetData({
      ...budgetData,
      budgetList: sortedList
    });
  };

  // Generate budget utilization chart data
  const getBudgetChartData = (budget) => {
    return [
      { name: "Spent", value: budget.spent },
      { name: "Remaining", value: budget.remaining }
    ];
  };

  // Helper function to get color based on budget status
  const getBudgetStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return 'green';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <PieChart className="w-12 h-12 text-blue-400" />
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
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
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
        <h1 className="text-3xl font-semibold text-blue-400">My Budget List</h1>
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
            onClick={() => setIsAddBudgetOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Budget
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
        {/* Total Budget Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Budget Amount</p>
              <h2 className="text-3xl font-semibold text-blue-400">
                ₹{budgetData.budgetList.reduce((total, budget) => total + budget.budgetAmount, 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">Across {budgetData.totalBudgetEntries} active budgets</span>
          </div>
        </motion.div>

        {/* Total Spent Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Spent</p>
              <h2 className="text-3xl font-semibold text-red-400">
                ₹{budgetData.budgetList.reduce((total, budget) => total + budget.spent, 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">
              {Math.round(budgetData.budgetList.reduce((total, budget) => total + budget.spent, 0) /
                budgetData.budgetList.reduce((total, budget) => total + budget.budgetAmount, 0) * 100)}% of total budget
            </span>
          </div>
        </motion.div>

        {/* Remaining Card */}
        <motion.div
          variants={itemVariant}
          className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Remaining</p>
              <h2 className="text-3xl font-semibold text-green-400">
                ₹{budgetData.budgetList.reduce((total, budget) => total + budget.remaining, 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <PieChart className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">Available to spend</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Budget List */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        {budgetData.budgetList.length === 0 ? (
          <motion.div
            variants={itemVariant}
            className="bg-gray-800/50 rounded-xl p-12 text-center"
          >
            <div className="mx-auto bg-blue-500/20 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-400 mb-2">No Budgets Found</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first budget to track your expenses</p>
            <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Budget
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {budgetData.budgetList.map((budget, index) => (
              <motion.div
                key={budget._id}
                variants={itemVariant}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Budget Header */}
                <div
                  className="p-4 cursor-pointer"
                // onClick={() => handleExpand(budget._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-${getBudgetStatusColor(budget.status)}-500/20 rounded-lg`}>
                        <PieChart className={`w-6 h-6 text-${getBudgetStatusColor(budget.status)}-400`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{budget.budgetName}</h3>
                        <p className="text-gray-400 text-sm">
                          Created {new Date(budget.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-6">
                      <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="font-semibold">{budget.formattedBudgetAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Spent</p>
                        <p className={`font-semibold text-${getBudgetStatusColor(budget.status)}-400`}>
                          {budget.formattedSpent}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Remaining</p>
                        <p className="font-semibold text-green-400">{budget.formattedRemaining}</p>
                      </div>
                      <div className="flex items-center" onClick={() => handleExpand(budget._id)}>
                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedBudget === budget._id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                    <div
                      className={`h-2.5 rounded-full bg-${getBudgetStatusColor(budget.status)}-500`}
                      style={{ width: `${budget.expensePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">{budget.expensePercentage}% used</span>
                    <span className="text-gray-400 text-lg hover:text-white"
                      onClick={(e) => {
                        console.log("Opening expense list for budget:", budget._id, budget.budgetName);
                        e.stopPropagation();
                        setSelectedBudgetForExpenseList(budget._id);
                        setSelectedBudgetName(budget.budgetName);
                        setIsExpenseListOpen(true);
                      }}
                    >
                      {budget.expenses ? budget.expenses.length : 0} expenses
                    </span>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedBudget === budget._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-750 border-t border-gray-700 p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Chart */}
                      <div className="bg-gray-800 p-4 rounded-xl">
                        <h4 className="text-lg font-medium mb-4">Budget Utilization</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={getBudgetChartData(budget)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell fill="#ef4444" /> {/* Spent */}
                                <Cell fill="#10b981" /> {/* Remaining */}
                              </Pie>
                              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center space-x-8 mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm">Spent</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Remaining</span>
                          </div>
                        </div>
                      </div>

                      {/* Budget Details */}
                      <div className="bg-gray-800 p-4 rounded-xl">
                        <h4 className="text-lg font-medium mb-4">Budget Details</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Budget Name</span>
                            <span className="font-medium">{budget.budgetName}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Start Date</span>
                            <span className="font-medium">
                              {new Date(budget.startDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Total Expenses</span>
                            <span className="font-medium">
                              {budget.expenses ? budget.expenses.length : 0}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Last Updated</span>
                            <span className="font-medium">
                              {new Date(budget.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Status</span>
                            <span className={`font-medium text-${getBudgetStatusColor(budget.status)}-400`}>
                              {budget.status === 'critical' ? 'Critical' :
                                budget.status === 'warning' ? 'Warning' : 'Good'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-6">
                          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the click from triggering the collapsible panel
                              setSelectedBudgetForExpense(budget._id);
                              setIsAddExpenseOpen(true);
                            }}
                          >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Expense
                          </button>
                          <div className="flex space-x-2">
                            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                              onClick={() => {
                                setSelectedBudget(budget);
                                setIsEditBudgetOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-gray-300" />
                            </button>
                            <button className="p-2 bg-red-900/30 rounded-lg hover:bg-red-900/50 transition-colors"
                              onClick={() => {
                                setBudgetToDelete(budget);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <AddNewBudget
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
        onSuccess={() => {
          // Refresh your budget list here
          fetchBudgetData();
        }}
      />
      <ExpenseListUnderAbudget
        isOpen={isExpenseListOpen}
        onClose={() => setIsExpenseListOpen(false)}
        budgetId={selectedBudgetForExpenseList}
        budgetName={selectedBudgetName}
      />
      <AddExpense
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setSelectedBudgetForExpense(null);
        }}
        onSuccess={() => {
          // Refresh your budget list after adding an expense
          fetchBudgetData();
        }}
        budgetId={selectedBudgetForExpense}
      />

      <EditBudget
        isOpen={isEditBudgetOpen}
        onClose={() => {
          setIsEditBudgetOpen(false);
          setSelectedBudget(null);
        }}
        onSuccess={() => {
          // Refresh your budget list
          fetchBudgetData();
        }}
        budgetId={selectedBudget?._id}
        initialData={selectedBudget}
      />

      <DeleteAbudget
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBudgetToDelete(null);
        }}
        onSuccess={() => {
          // Refresh your budget list
          fetchBudgetData();
        }}
        budgetId={budgetToDelete?._id}
        budgetName={budgetToDelete?.budgetName}
      />

      {/* Add Budget FAB for mobile */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 md:hidden bg-blue-600 p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}