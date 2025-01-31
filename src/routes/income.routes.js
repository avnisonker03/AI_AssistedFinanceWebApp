import { Router } from "express";
import { createIncomeSource, deleteIncomeSource, getAllIncomeLists, getIncomeById, updateIncomeSource } from "../controllers/income.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const incomeRouter=Router();

incomeRouter.post("/create-income-source",authenticateToken,createIncomeSource);
incomeRouter.put("/update-income-source/:incomeId",authenticateToken,updateIncomeSource);
incomeRouter.delete("/delete-income-source/:incomeId",authenticateToken,deleteIncomeSource);
incomeRouter.get("/get-income-by-id/:incomeId",authenticateToken,getIncomeById);
incomeRouter.get("/get-income-lists",authenticateToken,getAllIncomeLists);

export default incomeRouter