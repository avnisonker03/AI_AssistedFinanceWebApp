import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './utils/passport.config.js';
import userRouter from "./routes/user.routes.js";
import incomeRouter from "./routes/income.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import expenseRouter from "./routes/expense.routes.js";
const app=express();

// app.use(cors({
//     origin:process.env.CORS,
//     credentials:true
// }))
const allowedOrigins = [
  "http://localhost:5173",             // Your local frontend
  process.env.FRONTEND_URL              // Your Firebase URL from .env
];

// --- 2. ROBUST CORS CONFIG ---
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // ✅ CRITICAL: Must be true for cookies/OTP to work
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle Preflight for all routes

app.options("*", cors());
app.use((req, res, next) => {
    console.log(`>>> Incoming: ${req.method} ${req.path}`);
    console.log(`>>> From Origin: ${req.headers.origin}`);
    next();
});


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(passport.initialize());
initializePassport();


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.use("/user",userRouter);
app.use("/user/income",incomeRouter);
app.use("/user/budget",budgetRouter);
app.use("/user/expense",expenseRouter)

export {app}

