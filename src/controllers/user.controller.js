import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import bcrypt from "bcrypt";
import { Income } from "../models/income.model.js";
import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { Budget } from "../models/budget.model.js";

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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

        const user = await User.findOne({ email: email });
        if (!user) {
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
            expenses: user.expenses || [],
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
        // {
        //     $project: {
        //         budgetName: 1,
        //         budgetAmount: 1,
        //         totalExpenses: 1,
        //         remainingBudget: {
        //           $subtract: ['$budgetAmount', '$totalExpenses']
        //         }
        //     }
        // },
        // {
        //     $count: 'activeBudgetsCount'
        // }

    ])
    const budgetDetails = activeBudgets[0].budgetDetails;
    const budgetCount = activeBudgets[0].budgetCount[0]?.activeBudgetsCount || 0;
    
    console.log("Active Budget Details:", budgetDetails);
    console.log("Active Budgets Count:", budgetCount);
    
  
})