import { Router } from "express";
import { deleteUser,  getUserDashboard, login, registeration, verifyToken } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import passport from 'passport';
import { googleAuthCallback } from "../controllers/user.controller.js";
import {sendOtp,verifyOtp} from "../controllers/otp.controller.js"


const userRouter=Router();


// Add these new routes alongside existing ones
userRouter.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

userRouter.get('/auth/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/auth/google/failure'
    }),
    googleAuthCallback
);

userRouter.get('/auth/google/failure', (req, res) => {
    res.status(401).json({
        message: "Google authentication failed"
    });
});

userRouter.post('/send-otp',sendOtp);
userRouter.post('/verify-otp',verifyOtp)
userRouter.get('/verify-token',authenticateToken,verifyToken)

userRouter.post("/register-user",registeration);
userRouter.post("/login-user",login);
userRouter.delete("/delete-user",authenticateToken,deleteUser);
userRouter.get("/user-dashboard",authenticateToken,getUserDashboard);

export default userRouter;