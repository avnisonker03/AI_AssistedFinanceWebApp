import { Router } from "express";
import { deleteUser, getUserDashboard, login, registeration } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter=Router();


userRouter.post("/register-user",registeration);
userRouter.post("/login-user",login);
userRouter.delete("/delete-user",authenticateToken,deleteUser);
userRouter.delete("/user-dashboard",authenticateToken,getUserDashboard);

export default userRouter;