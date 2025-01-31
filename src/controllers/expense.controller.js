import { Expense } from "../models/expense.model.js"
import { Budget } from "../models/budget.model.js"


export const createExpense=(async(req,res)=>{
   try {
    const userId=req.userId
    if(!userId){
     return res.status(404).json({
         message:"you are not authorised to create expense"
     })
    }
    const {budgetId} = req.params
    if(!budgetId){
     return res.status(404).json({
         message:"pls provide budget id also"
     })
    }
    
    const {expenseName,expenseAmount,paymentMethod}=req.body
    if(!expenseName || !expenseAmount || !paymentMethod){
     return res.status(403).json({
         message:"pls provide all the required information"
     })
    }
    
    const isBudgetExist=await Budget.findById(budgetId);
    if(!isBudgetExist){
     return res.status(400).json({
         message:"budget with the provided id not found"
     })
    }
    const expense=await Expense.create(
     {
     budgetId:budgetId,
     expenseName:expenseName,
     expenseAmount:expenseAmount,
     paymentMethod:paymentMethod
     }
    )
 
    if(!expense){
     return res.status(500).json({
         message:"error creating expense"
     })
    }
    
    const updatedBudget=await Budget.findByIdAndUpdate(
     userId,
     {$push:{expenses:expense._id}}
    )
 
    if(!updatedBudget){
     return res.status(500).json({
         message:"error updating budget"
     })
    }
 
    return res.status(201).json({
     message:"expense created successfully",
     expense
    })
   } catch (error) {
    console.log("error creating expense",error)
    return res.status(500).json({
        message:"error creating expense"
    })
   }

})

export const deleteExpense=(()=>{
    
})

export const getExpenseById=(()=>{

})

export const getExpenseList=(()=>{

})