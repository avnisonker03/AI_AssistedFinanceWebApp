import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { createBudget, deleteBudget, getAllBudgetLists, getBudgetById, getExpenseListUnderAbudget, updateBudget } from "../controllers/budget.controller.js";

const budgetRouter =Router()

budgetRouter.post("/create-budget",authenticateToken,createBudget)
budgetRouter.put("/update-budget/:budgetId",authenticateToken,updateBudget)
budgetRouter.delete("/delete-budget/:budgetId",authenticateToken,deleteBudget)
budgetRouter.get("/get-budget-by-id/:budgetId",authenticateToken,getBudgetById)
budgetRouter.get("/get-all-budget-lists",authenticateToken,getAllBudgetLists)
budgetRouter.get("/get-all-expense-lists-under-budget/:budgetId",authenticateToken,getExpenseListUnderAbudget)

export default budgetRouter