import { Expense } from "../models/expense.model.js"
import { Budget } from "../models/budget.model.js"


export const createExpense = (async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to create expense"
            })
        }
        const { budgetId } = req.params
        if (!budgetId) {
            return res.status(404).json({
                message: "pls provide budget id also"
            })
        }

        const { expenseName, expenseAmount, paymentMethod } = req.body
        if (!expenseName || !expenseAmount || !paymentMethod) {
            return res.status(403).json({
                message: "pls provide all the required information"
            })
        }

        const isBudgetExist = await Budget.findById(budgetId);
        if (!isBudgetExist) {
            return res.status(400).json({
                message: "budget with the provided id not found"
            })
        }
        const expense = await Expense.create(
            {
                userId:userId,
                budgetId: budgetId,
                expenseName: expenseName,
                expenseAmount: expenseAmount,
                paymentMethod: paymentMethod
            }
        )

        if (!expense) {
            return res.status(500).json({
                message: "error creating expense"
            })
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            { $push: { expenses: expense._id } }
        )

        if (!updatedBudget) {
            return res.status(500).json({
                message: "error updating expense in budget"
            })
        }

        return res.status(201).json({
            message: "expense created successfully",
            expense
        })
    } catch (error) {
        console.log("error creating expense", error)
        return res.status(500).json({
            message: "error creating expense"
        })
    }

})

export const deleteExpense = (async (req, res) => {
   try {
     const userId = req.userId
     if (!userId) {
         return res.status(404).json({
             message: "you are not authorised to create expense"
         })
     }
     const { budgetId } = req.params
     if (!budgetId) {
         return res.status(404).json({
             message: "pls provide budget id also"
         })
     }
     const { expenseId } = req.params
     if (!expenseId) {
         return res.status(404).json({
             message: "pls provide expense id also"
         })
     }
     const isExpenseExist = await Expense.findById(expenseId);
     if (!isExpenseExist) {
         return res.status(400).json({
             message: "expense with the provided id not found"
         })
     }
 
     await Expense.findByIdAndDelete(expenseId);
     await Budget.findByIdAndUpdate(
         budgetId,
         { $pull: { expenses: expenseId } }
     )
 
     return res.status(200).json({
         message:"expense deleted successfully"
     })
   } catch (error) {
    console.log("error deleting expense",error)
   }
})

export const getExpenseById = (async(req,res) => {
  try {
     const userId=req.userId;
     if(!userId){
      return res.status(404).json({
          message:"you are not authorised to view this expense"
      })
     }
     const {expenseId}=req.params
     if(!expenseId){
      return res.status(404).json({
          message:"kindly provide expense id"
      })
     }

     console.log("expense id",expenseId)
     const expense=await Expense.findOne({
      _id: expenseId,
      userId: userId
     }).select("-createdAt -updatedAt");
  
     console.log("expense",expense)
     if(!expense){
      return res.status(500).json({
          message:"error fetching expense with the given id"
      })
     }
  
     return res.status(200).json({
       message:"expense fetched successfully",
       expense
     })
  } catch (error) {
    console.log("error fetching expense");
    return res.status(500).json({
        message:"error fetching expense with the given id"
    })
  }
})

export const getExpenseList = (async(req,res) => {
 try {
       const userId=req.userId
       if(!userId){
           return res.status(404).json({
               message:"you are not authorised to view the expense list"
           })
       }
       const {page=1,limit=10,sortBy,sortType}=req.params
       const pageNumber=parseInt(page)
       const limitNumber=parseInt(limit)
       const skip=(pageNumber-1)*limitNumber
   
       let sort={}
       if(sortBy){
           sort[sortBy]=sortType==='desc'? -1:1
       }
   
       const expenseList=await Expense.find({userId}).sort(sort).limit(limit).skip(skip)
   
       if(!expenseList){
           return res.status(500).json({
               message:"error fetching expense list"
           })
       }
   
       return res.status(200).json({
           message:"expense list fetched successfully",
           expenseList
       })
 } catch (error) {
    console.log("error fetching expense list",error)
    return res.status(500).json({
        message:"error fetching expense list"
    })
 }

})
