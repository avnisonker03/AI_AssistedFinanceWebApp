import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart, Wallet, CreditCard, DollarSign, TrendingUp, AlertTriangle, PieChart, ChevronDown, PlusCircle } from 'lucide-react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import API_ENDPOINTS from '../../../env';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AddNewIncome from '../Income/AddNewIncome';
import AddNewBudget from '../Budget/AddNewBudget';

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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl">
    <div className="bg-blue-500/20 p-4 rounded-full mb-4">
      <TrendingUp className="w-12 h-12 text-blue-400" />
    </div>
    <h3 className="text-2xl font-semibold text-blue-400 mb-3">Welcome to Your Financial Dashboard!</h3>
    <p className="text-gray-300 text-center text-lg max-w-md mb-6">
      Start tracking your finances by adding your first income or expense of this month. We'll help you visualize your financial journey and provide personalized insights.
    </p>
    <div className="flex gap-4">
      <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Add First Income
      </button>
      <button className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Add First Expense
      </button>
    </div>
  </div>
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    income: {
      totalMonthlyIncome: 0,
      formattedIncome: "₹0.00"
    },
    expenses: {
      totalMonthlyExpenses: 0,
      formattedExpenses: "₹0.00",
      highestExpense: {
        amount: 0,
        paymentMethod: "",
        formattedAmount: "₹0.00"
      }
    },
    budgets: {
      totalBudgetAmount: 0,
      totalExpenseAmount: 0,
      activeBudgets: []
    },
    trends: {
      incomeVsExpense: [],
      dailyExpenses: []
    },
    summary: {
      savingsRate: "0.00",
      budgetUtilization: "0.00"
    }
  });
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [extendedTrendsData, setExtendedTrendsData] = useState([]);
  const [dailyExpenseData, setDailyExpenseData] = useState([]);
  const [budgetPieData, setBudgetPieData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Process API data to generate chart data
  const processChartData = (data) => {
    // Process income vs expense trends
    let trendsData = [];
    if (data.trends && data.trends.incomeVsExpense && data.trends.incomeVsExpense.length > 0) {
      // If we have real data, use it
      trendsData = data.trends.incomeVsExpense.map(item => {
        // Convert date format from YYYY-MM to abbreviated month name
        const date = new Date(item.date + "-01");
        const monthName = date.toLocaleString('default', { month: 'short' });
        return {
          date: monthName,
          income: item.income,
          expenses: item.expenses,
          savings: item.savings || (item.income - item.expenses)
        };
      });
    }

    // If we have less than 3 months of data, add some simulated historical data
    if (trendsData.length < 3) {
      const baseIncome = data.income.totalMonthlyIncome || 0;
      const baseExpense = data.expenses.totalMonthlyExpenses || 0;

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const currentMonthIndex = new Date().getMonth();

      // Generate data for previous months if real data is limited
      for (let i = 0; i < 6; i++) {
        if (i >= trendsData.length) {
          const randomVariation = 0.9 + Math.random() * 0.2; // 90-110% variation
          const income = Math.round(baseIncome * randomVariation);
          const expenses = Math.round(baseExpense * randomVariation);

          trendsData.push({
            date: months[(currentMonthIndex - 5 + i) % 12],
            income: income,
            expenses: expenses,
            savings: income - expenses
          });
        }
      }

      // Sort by month order
      const monthOrder = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6 };
      trendsData.sort((a, b) => monthOrder[a.date] - monthOrder[b.date]);
    }

    setExtendedTrendsData(trendsData);

    // Process daily expense data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let dailyData = [];

    if (data.trends && data.trends.dailyExpenses && data.trends.dailyExpenses.length > 0) {
      // Group expenses by day of week
      const dailyMap = new Map();

      data.trends.dailyExpenses.forEach(expense => {
        const date = new Date(expense.date);
        const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for 0-indexed weeks starting with Sunday

        if (dailyMap.has(day)) {
          dailyMap.set(day, dailyMap.get(day) + expense.totalExpense);
        } else {
          dailyMap.set(day, expense.totalExpense);
        }
      });

      // Fill missing days with estimated data
      days.forEach(day => {
        if (!dailyMap.has(day)) {
          // Estimate based on average of available data
          const average = Array.from(dailyMap.values()).reduce((acc, val) => acc + val, 0) / dailyMap.size || 0;
          dailyMap.set(day, Math.round(average * (0.7 + Math.random() * 0.6))); // 70-130% of average
        }
      });

      // Convert map to array for chart
      dailyData = days.map(day => ({
        day,
        amount: dailyMap.get(day)
      }));
    } else {
      // Generate sample data based on monthly expenses
      const monthlyExpense = data.expenses.totalMonthlyExpenses || 0;
      const dailyAverage = monthlyExpense / 30;

      dailyData = days.map(day => {
        // Weekend days typically have higher expenses
        const multiplier = (day === 'Sat' || day === 'Sun') ? 0.7 : (day === 'Fri') ? 1.3 : 1;
        return {
          day,
          amount: Math.round(dailyAverage * multiplier * (0.8 + Math.random() * 0.4)) // Add some variation
        };
      });
    }

    setDailyExpenseData(dailyData);

    // Process budget data for pie chart
    if (data.budgets && data.budgets.activeBudgets && data.budgets.activeBudgets.length > 0) {
      const pieData = data.budgets.activeBudgets.map((budget, index) => ({
        name: budget.budgetName,
        value: budget.budgetAmount,
        fill: COLORS[index % COLORS.length]
      }));
      setBudgetPieData(pieData);
    }

    // Process payment method data
    if (data.trends && data.trends.dailyExpenses) {
      const methodsMap = new Map();

      // Aggregate payment methods across all daily expenses
      data.trends.dailyExpenses.forEach(daily => {
        if (daily.paymentMethods && daily.paymentMethods.length > 0) {
          daily.paymentMethods.forEach(method => {
            if (methodsMap.has(method.method)) {
              methodsMap.set(method.method, methodsMap.get(method.method) + method.amount);
            } else {
              methodsMap.set(method.method, method.amount);
            }
          });
        }
      });

      // If no payment methods found, create sample data
      if (methodsMap.size === 0) {
        const totalExpense = data.expenses.totalMonthlyExpenses || 0;
        methodsMap.set("Cash", totalExpense * 0.4);
        methodsMap.set("Credit Card", totalExpense * 0.3);
        methodsMap.set("UPI", totalExpense * 0.3);
      }

      // Convert to array for chart
      const methodColors = {
        "cash": "#38bdf8",
        "credit card": "#a78bfa",
        "upi": "#4ade80",
        "debit card": "#fb923c",
        "netbanking": "#c084fc"
      };

      const methodData = Array.from(methodsMap.entries()).map(([method, amount]) => {
        const formattedMethod = method.charAt(0).toUpperCase() + method.slice(1);
        return {
          name: formattedMethod,
          value: amount,
          color: methodColors[method.toLowerCase()] || COLORS[Math.floor(Math.random() * COLORS.length)]
        };
      });

      setPaymentMethodData(methodData);
    }
  };

  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    console.log("accessToken not found");
    navigate('/login')
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.dashboard, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data) {
        console.log("dashboard data", response.data)
        if (response.data.data) {
          setDashboardData(response.data.data);
          processChartData(response.data.data);
        }

        // Set advice from the correct location
        if (response.data.advice) {
          setAdvice(response.data.advice);
        } else if (response.data.data && response.data.data.advice) {
          setAdvice(response.data.data.advice);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // For development testing, use sample data if API fails

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get(API_ENDPOINTS.dashboard, {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    //     if (response.data) {
    //       console.log("dashboard data", response.data)
    //       if (response.data.data) {
    //         setDashboardData(response.data.data);
    //         processChartData(response.data.data);
    //       }

    //       // Set advice from the correct location
    //       if (response.data.advice) {
    //         setAdvice(response.data.advice);
    //       } else if (response.data.data && response.data.data.advice) {
    //         setAdvice(response.data.data.advice);
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //     // For development testing, use sample data if API fails

    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchData();
  }, [timeFrame]); // Re-fetch when timeFrame changes

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
    // This will trigger a re-fetch due to the useEffect dependency
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

  const hasData = dashboardData.income || dashboardData.expenses ||
    (dashboardData.budgets?.activeBudgets?.length > 0);
  console.log("has data", hasData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-semibold text-blue-400">Welcome to the Dashboard!</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
            onClick={() => setIsAddIncomeOpen(true)}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Add Income
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            onClick={() => setIsAddBudgetOpen(true)}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Add Budget
          </button>
        </div>
      </motion.div>

      {hasData.totalMonthlyIncome === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EmptyState />
        </motion.div>
      ) : (
        <>
          {/* AI Advice Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 mb-8 bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Financial Advice</h3>
                <p className="text-gray-300 text-lg">
                  {advice || "To improve your financial standing, prioritize reducing expenses by at least 20%, and seek additional income sources to supplement your current earnings."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Income Card */}
            <motion.div
              variants={itemVariant}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Income</p>
                  <h2 className="text-3xl font-semibold text-green-400">{dashboardData.income.formattedIncome}</h2>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-green-400">+10%</span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
            </motion.div>

            {/* Expenses Card */}
            <motion.div
              variants={itemVariant}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Expenses</p>
                  <h2 className="text-3xl font-semibold text-red-400">{dashboardData.expenses.formattedExpenses}</h2>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-red-400" />
                <span className="text-red-400">+5%</span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
            </motion.div>

            {/* Savings Card */}
            <motion.div
              variants={itemVariant}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Savings Rate</p>
                  <h2 className="text-3xl font-semibold text-blue-400">{dashboardData.summary.savingsRate}%</h2>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <PieChart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-400">₹{(dashboardData.income.totalMonthlyIncome - dashboardData.expenses.totalMonthlyExpenses).toLocaleString()}</span>
                <span className="text-gray-400 ml-2">total saved</span>
              </div>
            </motion.div>

            {/* Budget Utilization Card */}
            <motion.div
              variants={itemVariant}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-yellow-500"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Budget Utilization</p>
                  <h2 className="text-3xl font-semibold text-yellow-400">{dashboardData.summary.budgetUtilization}%</h2>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={parseFloat(dashboardData.summary.budgetUtilization) > 100 ? "text-red-400" : "text-green-400"}>
                  {parseFloat(dashboardData.summary.budgetUtilization) > 100 ? "Over budget" : "Under budget"}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income vs Expenses Trend */}
            <motion.div
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Income vs Expenses Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={extendedTrendsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                      labelStyle={{ color: "#e5e7eb" }}
                      formatter={(value) => [`₹${value}`, undefined]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Savings" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Daily Expense Distribution */}
            <motion.div
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Daily Expense Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dailyExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                      labelStyle={{ color: "#e5e7eb" }}
                      formatter={(value) => [`₹${value}`, "Amount"]}
                    />
                    <Bar dataKey="amount" fill="#8884d8" name="Expense Amount">
                      {dailyExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Bottom Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Distribution */}
            <motion.div
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Budget Distribution</h3>
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={budgetPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${value}`}
                    >
                      {budgetPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${value}`}
                      contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={paymentMethodData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      {paymentMethodData.map((item, index) => (
                        <linearGradient key={index} id={`color${item.name}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={item.color} stopOpacity={0.2} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                      formatter={(value) => [`₹${value}`, "Amount"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill={(data, index) => `url(#color${data.name})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Budget Details Section */}
          {dashboardData.budgets.activeBudgets?.length === 0 ? (
            <div className="bg-gray-800 text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="text-gray-400 mb-2">No budgets created yet</div>
                <button
                  // onClick={onCreateBudget}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 p-6"
                >
                  <PlusCircle size={20} />
                  Create Your First Budget
                </button>
              </div>
            </div>
          ) : (
            // Your existing table code here
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="mt-8"
              >
                <h3 className="text-xl font-semibold mb-4">Budget Details</h3>
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="py-3 px-6 text-left">Budget Name</th>
                          <th className="py-3 px-6 text-left">Total Amount</th>
                          <th className="py-3 px-6 text-left">Spent</th>
                          <th className="py-3 px-6 text-left">Remaining</th>
                          <th className="py-3 px-6 text-left">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.budgets.activeBudgets && dashboardData.budgets.activeBudgets.map((budget, index) => (
                          <motion.tr
                            key={budget._id || index}
                            className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                            variants={itemVariant}
                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                          >
                            <td className="py-3 px-6">{budget.budgetName}</td>
                            <td className="py-3 px-6">{budget.formattedAmount}</td>
                            <td className="py-3 px-6">₹{budget.totalExpenses.toLocaleString()}</td>
                            <td className="py-3 px-6">₹{budget.remainingBudget.toLocaleString()}</td>
                            <td className="py-3 px-6">
                              <div className="w-full bg-gray-600 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${(budget.totalExpenses / budget.budgetAmount) > 0.8
                                    ? "bg-red-500"
                                    : (budget.totalExpenses / budget.budgetAmount) > 0.5
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    }`}
                                  style={{ width: `${Math.min(100, (budget.totalExpenses / budget.budgetAmount) * 100)}%` }}
                                ></div>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          {/* <motion.div
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-4">Budget Details</h3>
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-6 text-left">Budget Name</th>
                      <th className="py-3 px-6 text-left">Total Amount</th>
                      <th className="py-3 px-6 text-left">Spent</th>
                      <th className="py-3 px-6 text-left">Remaining</th>
                      <th className="py-3 px-6 text-left">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.budgets.activeBudgets && dashboardData.budgets.activeBudgets.map((budget, index) => (
                      <motion.tr
                        key={budget._id || index}
                        className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                        variants={itemVariant}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                      >
                        <td className="py-3 px-6">{budget.budgetName}</td>
                        <td className="py-3 px-6">{budget.formattedAmount}</td>
                        <td className="py-3 px-6">₹{budget.totalExpenses.toLocaleString()}</td>
                        <td className="py-3 px-6">₹{budget.remainingBudget.toLocaleString()}</td>
                        <td className="py-3 px-6">
                          <div className="w-full bg-gray-600 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${(budget.totalExpenses / budget.budgetAmount) > 0.8
                                ? "bg-red-500"
                                : (budget.totalExpenses / budget.budgetAmount) > 0.5
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                }`}
                              style={{ width: `${Math.min(100, (budget.totalExpenses / budget.budgetAmount) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div> */}
        </>
      )}
      <AddNewIncome
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
      <AddNewBudget
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
        onSuccess={() => {
          // Refresh your budget list after adding an expense
          fetchData();
        }}
      />
    </div>
  );
}