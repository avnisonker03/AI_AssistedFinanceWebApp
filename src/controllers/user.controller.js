import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import bcrypt from "bcrypt";
import { Income } from "../models/income.model.js";
import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { Budget } from "../models/budget.model.js";
import getFinancialAdvice from "../utils/getFinancialAdvice.js";

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


const formatDashboardResponse = async(data) => {
  // Helper function to validate number fields
  const validateNumber = (value) => {
      return typeof value === 'number' && !isNaN(value) ? value : 0;
  };
  
  // Helper function to validate arrays
  const validateArray = (arr) => {
      return Array.isArray(arr) ? arr : [];
  };
  
  // Helper function to validate objects
  const validateObject = (obj) => {
      return obj && typeof obj === 'object' ? obj : {};
  };
  
  // Extract total monthly income
  const monthlyIncome = validateObject(data.totalMonthlyIncome[0] || {});
  const totalMonthlyIncome = validateNumber(monthlyIncome.totalMonthlyIncome);
  
  // Extract total monthly expenses
  const monthlyExpenses = validateObject(data.totalMonthlyExpenses[0] || {});
  const totalMonthlyExpenses = validateNumber(monthlyExpenses.totalMonthlyExpense); // Note: changed from totalMonthlyExpenses
  
  // Extract highest expense data
  const highestExpense = validateObject(data.highestExpenseAmountAndPaymentMethod[0] || {});
  
  // Extract budget and expense totals correctly
  const totalBudgetAmount = validateNumber(data.totalBudgetAmount[0]?.totalBudgetAmount || 0);
  const totalExpenseAmount = validateNumber(data.totalExpenseAmount[0]?.totalExpenseAmount || 0);
  
  // Format the dashboard response
  const dashboardResponse = {
      income: {
          totalMonthlyIncome,
          formattedIncome: new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
          }).format(totalMonthlyIncome)
      },
      expenses: {
          totalMonthlyExpenses,
          formattedExpenses: new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
          }).format(totalMonthlyExpenses),
          highestExpense: {
              amount: validateNumber(highestExpense.highestMonthlyExpense), // Changed from maxAmount
              paymentMethod: highestExpense.highestPaymentMethodUsed || 'N/A', // Changed from paymentMethod
              formattedAmount: new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
              }).format(validateNumber(highestExpense.highestMonthlyExpense))
          }
      },
      budgets: {
          totalBudgetAmount,
          totalExpenseAmount,
          activeBudgets: validateArray(data.activeBudgets[0]?.budgetDetails || []).map(budget => ({
              ...budget,
              budgetAmount: validateNumber(budget.budgetAmount),
              formattedAmount: new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
              }).format(validateNumber(budget.budgetAmount))
          }))
      },
      trends: {
          incomeVsExpense: validateArray(data.IncomeVsExpense).map(item => ({
              ...item,
              income: validateNumber(item.income),
              expenses: validateNumber(item.expenses)
          })),
          dailyExpenses: validateArray(data.dailyExpenses).map(expense => ({
              ...expense,
              totalExpense: validateNumber(expense.totalExpense),
              paymentMethods: validateArray(expense.paymentMethods).map(payment => ({
                  ...payment,
                  amount: validateNumber(payment.amount)
              }))
          }))
      },
      summary: {
          savingsRate: totalMonthlyIncome > 0 
              ? ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome * 100).toFixed(2)
              : 0,
          budgetUtilization: totalBudgetAmount > 0
              ? ((totalExpenseAmount / totalBudgetAmount) * 100).toFixed(2)
              : 0
      }
  };
  
  return dashboardResponse;
};


export const registeration = (async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Incomplete fields Kindly provide all the required fields"
            })
        }

        const createdUser = await User.findOne({
            email: email
        })
        if (createdUser) {
            return res.status(403).json({
                message: "User with this email already exists"
            })
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: email,
            password: encryptedPassword,
            fullName: fullName
        })

        if (!user) {
            return res.status(500).json({
                message: "Error creating user please try again..."
            })
        }

        return res.status(201).json({
            message: "user created successfully"
        })
    } catch (error) {
        console.log("error registering user", error)
    }

})

export const login = (async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                message: "Provide all the credentials"
            })
        }

        const user = await User.findOne({ email: email }).lean();
        if (!user?.password) {
            return res.status(404).json({ message: "user with this email or password doesn't exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(404).json({ message: "invalid credentials" });
        }

        const accessToken = generateAccessToken(user._id, user.email);
        const refreshToken = generateRefreshToken(user._id, user.email);

        const userDetails = {
            fullName: user.fullName,
            email: user.email,
            incomes: user.incomes || [],
            budget: user.budgets || [],
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        return res.status(200).json({
            message: "User logged in successfully",
            userDetails
        })
    } catch (error) {
        console.log("error logging in user", error)
    }

})

export const deleteUser = (async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId = req.params.id;

        // Validate if userId exists
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Perform the deletion
        const deletedUser = await User.findByIdAndDelete(userId);

        // Return success response
        if (!deletedUser) {
            return res.status(500).json({
                message: "Error deleting user"
            })
        }
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteUser controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
})

export const getUserDashboard = (async (req, res) => {
   try {
     const userId = req.userId;
     if (!userId) {
         return res.status(401).json({
             message: "you are not authorised to view this"
         })
     }
     const totalMonthlyIncome = await Income.aggregate([
         {
             $match: {
                 userId: new mongoose.Types.ObjectId(userId),
                 createdAt: {
                     $gte: startOfMonth,
                     $lte: endOfMonth
                 }
             }
         },
         {
             $group: {
                 _id: "$userId", totalMonthlyIncome: { $sum: "$monthlyAmount" }
             }
         }
     ])
     console.log("total monthly income", totalMonthlyIncome)
 
     const totalMonthlyExpenses = await Expense.aggregate([
         {
             $match: {
                 userId: new mongoose.Types.ObjectId(userId),
                 createdAt: {
                     $gte: startOfMonth,
                     $lte: endOfMonth
                 }
             }
         },
         {
             $group: {
                 _id: "$userId", totalMonthlyExpense: { $sum: "$expenseAmount" }
             }
         }
     ])
 
     console.log("total monthly expense", totalMonthlyExpenses)
 
     const highestExpenseAmountAndPaymentMethod = await Expense.aggregate([
         {
             $match: {
                 userId: new mongoose.Types.ObjectId(userId),
                 createdAt: {
                     $gte: startOfMonth,
                     $lte: endOfMonth
                 }
             },
         },
         {
             $group: {
                 _id: "$userId",
                 highestMonthlyExpense: { $max: "$expenseAmount" },
                 highestPaymentMethodUsed: { $max: "$paymentMethod" }
             }
         }
     ])
 
     console.log("highest expense amt", highestExpenseAmountAndPaymentMethod)
 
     const totalBudgetAmount = await Budget.aggregate([
         {
             $match: {
                 userId: new mongoose.Types.ObjectId(userId),
             }
         },
         {
             $group: {
                 _id: "$userId",
                 totalBudgetAmount: { $sum: "$budgetAmount" }
             }
         }
     ])
     console.log("total budget utilisation", totalBudgetAmount)
 
     const totalExpenseAmount=await Expense.aggregate([
         {
            $match:{
              userId:new mongoose.Types.ObjectId(userId)
            }
         },
         {
            $group:{
             _id:"$userId",
             totalExpenseAmount:{$sum:"$expenseAmount"}
            }
         }
     ])
     console.log("total Expense Amount",totalExpenseAmount)
 
     const totalBudgetUtilisation = totalExpenseAmount[0]?.totalExpenseAmount / totalBudgetAmount[0]?.totalBudgetAmount * 100;
     let roundedValue = parseFloat(totalBudgetUtilisation.toFixed(2));
     
     console.log("total budget utilisation",totalBudgetUtilisation)
     console.log(roundedValue)
    
     const activeBudgets=await Budget.aggregate([
         {
             $match:{
                 userId: new mongoose.Types.ObjectId(userId)
             }
         },
         {
             $lookup:{
                 from:"expenses",
                 localField:"expenses",
                 foreignField:"_id",
                 as: 'associatedExpenses'
             }
         },
         {
             $addFields: {
                 totalExpenses: {
                   $sum: '$associatedExpenses.expenseAmount'
                 }
             }
         },
         {
             $match: {
                 $expr: {
                   $lt: ['$totalExpenses', '$budgetAmount']
                 }
             }
         },
     {    
         $facet: {
             // Details of active budgets
             budgetDetails: [
                 {
                     $project: {
                         budgetName: 1,
                         budgetAmount: 1,
                         totalExpenses: 1,
                         remainingBudget: {
                             $subtract: ['$budgetAmount', '$totalExpenses']
                         },
                     }
                 }
             ],
             // Count of active budgets
             budgetCount: [
                 {
                     $count: 'activeBudgetsCount'
                 }
             ]
         }}
     ])
     const budgetDetails = activeBudgets[0].budgetDetails;
     const budgetCount = activeBudgets[0].budgetCount[0]?.activeBudgetsCount || 0;
     
     console.log("Active Budget Details:", budgetDetails);
     console.log("Active Budgets Count:", budgetCount);
      
     const monthlyIncome=await Income.aggregate([
         {
             $match: {
               userId: new mongoose.Types.ObjectId(userId),
               createdAt: { 
                 $gte: startOfMonth,
                 $lte: endOfMonth
               }
             }
           },
           {
             $group: {
               _id: {
                 year: { $year: "$createdAt" },
                 month: { $month: "$createdAt" }
               },
               // Sum all income entries for each month
               totalIncome: { $sum: "$monthlyAmount" },
               // Optional: Count number of income entries
               incomeEntries: { $sum: 1 }
             }
           }
     ])
     
 
     const monthlyExpenses = await Expense.aggregate([
         {
           $match: {
             userId: new mongoose.Types.ObjectId(userId),
             expenseDate: {
               $gte: startOfMonth,
               $lte: endOfMonth
             }
           }
         },
         {
           $group: {
             _id: {
               year: { $year: "$expenseDate" },
               month: { $month: "$expenseDate" }
             },
             totalExpenses: { $sum: "$expenseAmount" },
             // Optional: Count number of expenses
             expenseEntries: { $sum: 1 }
           }
         }
       ]);
 
       const months = {};
   
   // Process income data
   monthlyIncome.forEach(item => {
     const date = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
     if (!months[date]) {
       months[date] = {
         income: 0,
         expenses: 0,
         incomeEntries: 0,
         expenseEntries: 0
       };
     }
     months[date].income = item.totalIncome;
     months[date].incomeEntries = item.incomeEntries;
   });
 
   // Process expense data
   monthlyExpenses.forEach(item => {
     const date = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
     if (!months[date]) {
       months[date] = {
         income: 0,
         expenses: 0,
         incomeEntries: 0,
         expenseEntries: 0
       };
     }
     months[date].expenses = item.totalExpenses;
     months[date].expenseEntries = item.expenseEntries;
   });
 
   // Convert to array and sort by date
   const IncomeVsExpense = Object.entries(months).map(([date, values]) => ({
     date,
     income: values.income,
     expenses: values.expenses,
     savings: values.income - values.expenses,
     incomeEntries: values.incomeEntries,
     expenseEntries: values.expenseEntries
   })).sort((a, b) => a.date.localeCompare(b.date));
 
   const dailyExpenses = await Expense.aggregate([
     {
       $match: {
         userId: new mongoose.Types.ObjectId(userId),
         expenseDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
         }
       }
     },
     {
       $group: {
         _id: {
           // Group by date
           date: { $dateToString: { format: "%Y-%m-%d", date: "$expenseDate" } },
           // Group by payment method
           paymentMethod: "$paymentMethod"
         },
         // Sum of expenses for each date and payment method
         totalAmount: { $sum: "$expenseAmount" },
         // Count of expenses (one way to get number of transactions)
         count: { $sum: 1 }
       }
     },
     {
       // Reshape data to group by date
       $group: {
         _id: "$_id.date",
         totalExpense: { $sum: "$totalAmount" },
         paymentMethods: {
           $push: {
             method: "$_id.paymentMethod",
             amount: "$totalAmount",
             count: "$count"
           }
         }
       }
     },
     {
       $project: {
         _id: 0,
         date: "$_id",
         totalExpense: { $round: ["$totalExpense", 2] },
         paymentMethods: 1
       }
     },
     {
       $sort: { date: 1 }
     }
   ]);
 
   const dashboardData={
     totalMonthlyIncome,
     totalMonthlyExpenses,
     highestExpenseAmountAndPaymentMethod,
     totalBudgetAmount,
     totalExpenseAmount,
     activeBudgets,
     IncomeVsExpense,
     dailyExpenses
   }
 
   const response = await formatDashboardResponse(dashboardData);
   console.log("data in ai",response)
   const advice=await getFinancialAdvice(response?.income?.totalMonthlyIncome,response?.budgets?.totalBudgetAmount,response?.expenses?.totalMonthlyExpenses);
   if(!advice){
    advice="Please wait to get advice"
   }
   return res.status(200).json({
     success: true,
     message: "Dashboard data retrieved successfully",
     data: response,
     advice
   });
   } catch (error) {
    console.error("Dashboard data formatting error:", error);
  return res.status(500).json({
    success: false,
    message: "Error formatting dashboard data",
    error: error.message
  });
   }

})

export const googleAuthCallback = async (req, res) => {
    try {
      const user = req.user;
      const accessToken = generateAccessToken(user._id, user.email);
      const refreshToken = generateRefreshToken(user._id, user.email);
      
      const userDetails = {
        fullName: user.fullName,
        email: user.email,
        incomes: user.incomes || [],
        budgets: user.budgets || [],
        accessToken,
        refreshToken
      };
  
      // Redirect to frontend with encoded data
      const encodedData = encodeURIComponent(JSON.stringify(userDetails));
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?data=${encodedData}`);
      
    } catch (error) {
      console.log("Google auth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/error`);
    }
  };



export const verifyToken=async(req,res)=>{
     try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data
    return res.status(200).json({ 
      success: true,
      user 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}