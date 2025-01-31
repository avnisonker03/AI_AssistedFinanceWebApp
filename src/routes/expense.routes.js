import { Router } from "express";
import { createExpense, deleteExpense, getExpenseById, getExpenseList } from "../controllers/expense.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const expenseRouter=Router();

expenseRouter.post("/create-expense/:budgetId",authenticateToken,createExpense)
expenseRouter.delete("/delete-expense/:budgetId/:expenseId",authenticateToken,deleteExpense)
expenseRouter.get("/get-expense-by-id/:expenseId",authenticateToken,getExpenseById)
expenseRouter.get("/get-expense-lists",authenticateToken,getExpenseList)



export default expenseRouter