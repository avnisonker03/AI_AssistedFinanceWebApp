import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({linit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

import userRouter from "./routes/user.routes.js";
import incomeRouter from "./routes/income.routes.js";
import budgetRouter from "./routes/budget.routes.js";

app.use("/user",userRouter);
app.use("/user/income",incomeRouter);
app.use("/user/budget",budgetRouter);

export {app}

