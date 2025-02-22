import { Budget } from "../models/budget.model.js";
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";

export const createBudget = (async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                message: "you are not authorised to create budget"
            })
        }
        const { budgetName, budgetAmount } = req.body;
        if (!budgetName || !budgetAmount) {
            return res.status(400).json({
                message: "All the important fields are missing"
            })
        }
        const newBudget = await Budget.create({
            budgetName: budgetName,
            budgetAmount: budgetAmount,
            // endDate: endDate,
            userId: userId
        })

        if (!newBudget) {
            return res.status(500).json(
                {
                    message: "error creating new budget"
                }
            )
        }

        await User.findByIdAndUpdate(
            userId,
            { $push: { budgets: newBudget._id } }
        )

        return res.status(201).json({
            message: "budget created successfully",
            newBudget: newBudget
        })
    } catch (error) {
        console.log("Error creating budget", error)
        return res.status(500).json(
            {
                message: "error creating new budget"
            }
        )
    }

})

export const updateBudget = (async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                message: "you are not authorised to update budget"
            })
        }

        const { budgetId } = req.params;
        if (!budgetId) {
            return res.status(401).json({
                message: "kindly provide budget id"
            })
        }

        const { updateBudgetName, updateBudgetAmount } = req.body;
        if (!updateBudgetAmount || !updateBudgetName) {
            return res.status(404).json({
                message: "pls provide all the essentials updated details"
            })
        }

        const budget = await Budget.findOne({ _id: budgetId, userId: userId });

        if (!budget) {
            return res.status(404).json({
                message: "budget with this budgetID doesn't exists or you are not authorised to update this budget"
            })
        }

        const updatedData = {
            budgetName: updateBudgetName,
            budgetAmount: updateBudgetAmount,
            // endDate: updatedBudgetEndDate
        }
        const options = {
            new: true,         // Return updated document
            runValidators: true // Run schema validators
        };

        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            updatedData,
            options
        )

        if (!updatedBudget) {
            return res.status(500).json({
                message: "error updating budget"
            })
        }

        return res.status(200).json({
            message: "budget updated successfully",
            updatedBudget
        });
    } catch (error) {
        console.log("error updating budget", error)
        return res.status(500).json({
            message: "error updating budget"
        })
    }
})

export const deleteBudget = (async (req, res) => {
    try {
        const userId = req.userId;
        const { budgetId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to delte the budget"
            })
        }
        if (!budgetId) {
            return res.status(404).json({
                message: "budget id is required"
            }
            )
        }
        const isBudgetExists = await Budget.findOne({
            _id: budgetId,
            userId: userId
        });

        if (!isBudgetExists) {
            return res.status(404).json({
                message: "Budget source not found or you're not authorized to delete it"
            });
        }

        await Budget.findByIdAndDelete(budgetId);
        await User.findByIdAndUpdate(
            userId,
            { $pull: { budget: budgetId } }  // Remove income ID from array
        );

        return res.status(200).json({
            message: "budget source deleted successfully",
        });
    } catch (error) {
        console.log("error deleting budget", error)
        return res.status(404).json({
            message: "Budget source not found or you're not authorized to delete it"
        });
    }

})

export const getBudgetById = (async (req, res) => {
    try {
        const userId = req.userId;
        console.log("user id", userId)
        const { budgetId } = req.params;
        console.log("budget id", budgetId)
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to view the budget"
            })
        }
        if (!budgetId) {
            return res.status(404).json({
                message: "budget id is required"
            }
            )
        }
        const budget = await Budget.findOne({
            _id: budgetId,
            userId: userId
        })

        if (!budget) {
            return res.status(404).json({
                message: "Budget source not found or you're not authorized to view it"
            });
        }

        return res.status(200).json({
            message: "budget fetched successfully",
            budget
        })
    } catch (error) {
        console.log("error fetching budget", error)
        return res.status(404).json({
            message: "Budget source not found or you're not authorized to view it"
        });
    }
})


export const getAllBudgetLists = (async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to view the budget"
            })
        }
        const { page = 1, limit = 10, sortBy, sortType } = req.query
        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        let sort = {}
        if (sortBy) {
            sort[sortBy] = sortType === 'desc' ? -1 : 1
        }

        const budgetList = await Budget.find({ userId })
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)

        const totalBudgetEntries = await Budget.countDocuments({ userId });

        // if (!budgetList) {
            
        //     return res.status(500).json({
        //         message: "error fetching budget list"
        //     })
        // }
        // console.log("budget list",budgetList)
        // if (!totalBudgetEntries) {
        //     console.log("budget entry",totalBudgetEntries)
        //     return res.status(500).json({
        //         message: "error fetching budget count"
        //     })
        // }

        // return res.status(200).json({
        //     message: "budget lists fetched successfully",
        //     budgetList,
        //     totalBudgetEntries
        // })

        return res.status(200).json({
            message: totalBudgetEntries === 0 ? "No budgets found" : "Budget lists fetched successfully",
            budgetList,
            totalBudgetEntries
        });


    } catch (error) {
        console.log("Error fetching budget lists", error)
        return res.status(500).json({
            message: "error fetching budget list"
        })
    }
})

export const getExpenseListUnderAbudget = (async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to view expense lists"
            })
        }
        const { budgetId } = req.params
        if (!budgetId) {
            return res.status(404).json({
                message: "kindly provide budget id"
            })
        }

        const { page = 1, limit = 10, sortBy, sortType } = req.params
        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        let sort = {}
        if (sortBy) {
            sort[sortBy] = sortType === 'desc' ? -1 : 1
        }

        const expenseList = await Expense.find({ budgetId }).sort(sort).limit(limit).skip(skip).select("-createdAt -updatedAt")

        if (!expenseList) {
            return res.status(500).json({
                message: "error fetching expense list"
            })
        }

        return res.status(200).json({
            message: "expense list fetched successfully",
            expenseList
        })
    } catch (error) {
        console.log("error fetching expense list",error);
        return res.status(500).json({
            message: "error fetching expense list"
        })
    }
})