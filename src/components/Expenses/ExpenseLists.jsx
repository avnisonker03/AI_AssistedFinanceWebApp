import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, ChevronDown, AlertTriangle, PieChart, ArrowUpRight, Trash2, PlusCircle } from 'lucide-react';
import API_ENDPOINTS from '../../../env';
import axios from 'axios';
import DeleteExpense from './DeleteExpense';
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

export default function ExpenseLists() {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        // Simulating API fetch - replace with your actual API call
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_ENDPOINTS.expenseList, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setExpenseData(response.data.expenseList);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching expense data:', err);
                setError('Failed to load expense data');
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleDelete = (expense) => {
        setExpenseToDelete(expense);
        setDeleteModalOpen(true);
    };

    const handleSort = (order) => {
        setSortOrder(order);
        const sortedList = [...expenseData];
        if (order === 'newest') {
            sortedList.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
        } else if (order === 'oldest') {
            sortedList.sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate));
        } else if (order === 'highest') {
            sortedList.sort((a, b) => b.expenseAmount - a.expenseAmount);
        } else if (order === 'lowest') {
            sortedList.sort((a, b) => a.expenseAmount - b.expenseAmount);
        }
        setExpenseData(sortedList);
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

    const totalExpenseAmount = expenseData.reduce((total, expense) => total + expense.expenseAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-center mb-8"
            >
                <h1 className="text-3xl font-semibold text-blue-400">My Expenses</h1>
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
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                {/* Total Expenses Card */}
                <motion.div
                    variants={itemVariant}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Total Expenses</p>
                            <h2 className="text-3xl font-semibold text-blue-400">
                                ₹{totalExpenseAmount.toLocaleString()}
                            </h2>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-400">Across {expenseData.length} expenses</span>
                    </div>
                </motion.div>

                {/* Average Expense Card */}
                <motion.div
                    variants={itemVariant}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Average Expense</p>
                            <h2 className="text-3xl font-semibold text-purple-400">
                                ₹{(totalExpenseAmount / expenseData.length || 0).toLocaleString()}
                            </h2>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <ArrowUpRight className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-400">Per transaction</span>
                    </div>
                </motion.div>

                {/* Latest Expense Card */}
                <motion.div
                    variants={itemVariant}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Latest Expense</p>
                            <h2 className="text-3xl font-semibold text-green-400">
                                ₹{(expenseData[0]?.expenseAmount || 0).toLocaleString()}
                            </h2>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-400">
                            {expenseData[0] ? new Date(expenseData[0].expenseDate).toLocaleDateString() : 'No expenses yet'}
                        </span>
                    </div>
                </motion.div>
            </motion.div>


            {expenseData.length === 0 ? (
                <motion.div
                    variants={itemVariant}
                    className="bg-gray-800/50 rounded-xl p-12 text-center"
                >
                    <div className="mx-auto bg-blue-500/20 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-blue-400 mb-2">No Expenses Found</h3>
                    <p className="text-gray-400 mb-6">Get started by creating your first expense to track your spending</p>
                    <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create New Expense
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariant}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {expenseData.map((expense) => (
                        <motion.div
                            key={expense._id}
                            variants={itemVariant}
                            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{expense.expenseName}</h3>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(expense.expenseDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-4 md:mt-0 space-x-6">
                                        <div>
                                            <p className="text-sm text-gray-400">Amount</p>
                                            <p className="font-semibold">₹{expense.expenseAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Payment Method</p>
                                            <p className="font-semibold capitalize">{expense.paymentMethod}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(expense)}
                                            className="p-2 hover:bg-red-900/30 rounded-full transition-colors"
                                            aria-label="Delete expense"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            {/* Expense List - Simplified without expansion */}
            {/* <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {expenseData.map((expense) => (
                    <motion.div
                        key={expense._id}
                        variants={itemVariant}
                        className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{expense.expenseName}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(expense.expenseDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center mt-4 md:mt-0 space-x-6">
                                    <div>
                                        <p className="text-sm text-gray-400">Amount</p>
                                        <p className="font-semibold">₹{expense.expenseAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Payment Method</p>
                                        <p className="font-semibold capitalize">{expense.paymentMethod}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(expense)}
                                        className="p-2 hover:bg-red-900/30 rounded-full transition-colors"
                                        aria-label="Delete expense"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div> */}
            {/* Delete Confirmation Modal */}
            <DeleteExpense
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onSuccess={() => {
                    // This will run after successful deletion
                    setExpenseData(expenseData.filter(expense => expense._id !== expenseToDelete._id));
                }}
                budgetId={expenseToDelete?.budgetId}
                expenseId={expenseToDelete?._id}
                expenseName={expenseToDelete?.expenseName}
                expenseAmount={expenseToDelete?.expenseAmount}
            />
        </div>
    );
}